import './env.server'
import { localeHref } from '~/i18n/routing'
import type { Locale } from '~/i18n/types'
import { priceCart } from '~/shop/cart'
import { catalogue } from '~/shop/catalogue'
import { shippingZones, shopConfig } from '~/shop/config'
import { LOCALE_ROUTING, SITE_LOCALES } from '~/site'
import {
  applyUpdate,
  createOrder,
  getOrder,
  listOrders,
  numberOfSession,
  orderOfRef,
  orderStore,
} from './orders.server'
import {
  type CheckoutInput,
  checkoutSchema,
  type NewOrder,
  type Order,
  type OrderLine,
  type OrderView,
  orderRef,
  orderUpdateSchema,
  summarize,
} from './shop'
import { customerEmail, sendEmail, teamEmail } from './shop-emails.server'
import {
  type CheckoutSession,
  checkoutLocale,
  StripeError,
  type StripeLineItem,
  stripe,
  verifyStripeSignature,
} from './stripe.server'

/**
 * The shop's server side (the routes under src/routes/api/shop call it): opening a payment for a cart, recording the
 * order when Stripe says it is paid, telling the cart its order number, and the orders panel's list and status
 * changes. Every amount is recomputed here from the catalogue; nothing the browser sends is trusted but codes and
 * quantities. Without STRIPE_SECRET_KEY the shop runs in demo mode: a checkout records its order at once, unpaid and
 * marked demo, so the flow can be tried before the Stripe account is connected.
 */

type Json = Record<string, unknown>
const json = (body: Json, status = 200) => Response.json(body, { status })

/** Where the cart's page is: the request's own site (a preview's origin, the domain in production). */
const originOf = (request: Request) => new URL(request.url).origin

/** The customer's order page: `?order=<ref>` on the homepage of the order's site, where the cart's panel shows it. */
const orderLink = (order: Order, origin: string) =>
  localeHref(LOCALE_ROUTING, order.locale as Locale, `/?order=${orderRef(order)}`, origin)

function siteShop(locale: string) {
  const loc = locale as Locale
  if (!SITE_LOCALES.includes(loc)) return null
  const config = shopConfig(loc)
  return config
    ? { locale: loc, config, zones: shippingZones(config), products: catalogue(loc) }
    : null
}

/** A cart priced for checkout, or what is wrong with it. */
export function priceCheckout(input: CheckoutInput) {
  const shop = siteShop(input.locale)
  if (!shop) return { error: 'no shop on this site' } as const
  const zone = shop.zones.find((z) => z.id === input.zone)
  if (!zone) return { error: `unknown shipping zone ${input.zone}` } as const
  const priced = priceCart(shop.products, input.lines, zone)
  if (priced.problems.length || !priced.lines.length)
    return { error: priced.problems.join('; ') || 'empty cart' } as const
  return { shop, zone, priced } as const
}

/** POST /api/shop/checkout: Stripe's payment page for the cart, or (demo mode) the order straight away. */
export async function startCheckout(request: Request): Promise<Response> {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return json({ error: 'invalid cart' }, 400)
  const input = parsed.data
  const result = priceCheckout(input)
  if ('error' in result) return json({ error: result.error }, 422)
  const { shop, zone, priced } = result
  const origin = originOf(request)
  const back = `${origin}${input.returnPath}`

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    if (process.env.SHOP_DEMO === 'off') return json({ error: 'payments are not set up' }, 503)
    const session = `demo-${crypto.randomUUID()}`
    const order = await recordOrder(
      shop.config.orderPrefix,
      session,
      {
        createdAt: new Date().toISOString(),
        locale: shop.locale,
        demo: true,
        status: 'paid',
        customer: {
          name: 'Demo Customer',
          email: process.env.SHOP_DEMO_EMAIL || 'demo@example.com',
        },
        address: {
          line1: 'Carrer de la Demo 1',
          postalCode: '08001',
          city: 'Barcelona',
          country: zone.countries[0] ?? 'ES',
        },
        zone: { id: zone.id, label: zone.label },
        lines: priced.lines.map(
          (l): OrderLine => ({
            sku: l.product.sku,
            name: l.product.name,
            unitPrice: l.product.price as number,
            quantity: l.quantity,
            total: l.total,
          }),
        ),
        subtotal: priced.subtotal,
        shipping: priced.shipping,
        total: priced.total,
        currency: 'eur',
        history: [{ status: 'paid', at: new Date().toISOString(), by: 'demo', emailed: true }],
      },
      origin,
    )
    return json({
      url: `${back}?order=${encodeURIComponent(session)}`,
      demo: true,
      number: order.number,
    })
  }

  try {
    const session = await stripe<{ id: string; url: string }>(key, 'POST', 'checkout/sessions', {
      mode: 'payment',
      locale: checkoutLocale(shop.locale),
      line_items: priced.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: 'eur',
          unit_amount: l.product.price,
          product_data: {
            name: l.product.name,
            images: [new URL(l.product.image.img.src, origin).toString()],
            metadata: { sku: l.product.sku },
          },
        },
      })),
      shipping_address_collection: { allowed_countries: zone.countries },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: zone.label,
            fixed_amount: { amount: priced.shipping, currency: 'eur' },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      invoice_creation: { enabled: true },
      success_url: `${back}?order={CHECKOUT_SESSION_ID}`,
      cancel_url: `${back}?checkout=cancelled`,
      metadata: {
        locale: shop.locale,
        zone: zone.id,
        lines: priced.lines.map((l) => `${l.product.sku}:${l.quantity}`).join(','),
      },
    })
    return json({ url: session.url })
  } catch (err) {
    console.error('[shop] checkout failed', err)
    return json({ error: err instanceof StripeError ? err.message : 'checkout failed' }, 502)
  }
}

/** Files an order and sends its emails: ours (with a link to the panel) and the customer's confirmation. */
async function recordOrder(
  prefix: string,
  session: string,
  order: NewOrder,
  origin: string,
): Promise<Order> {
  const { order: saved, created } = await createOrder(await orderStore(), prefix, session, order)
  if (!created) return saved
  const results = await Promise.allSettled([
    sendEmail(teamEmail(saved, `${origin}/admin/orders/`)),
    sendEmail(customerEmail(saved, 'paid', orderLink(saved, origin))),
  ])
  for (const r of results)
    if (r.status === 'rejected') console.error('[shop] email failed', r.reason)
  return saved
}

/** The order a paid Checkout Session stands for, from the session and its line items. */
export function orderFromSession(
  session: CheckoutSession,
  items: StripeLineItem[],
  zoneLabel: string,
  now = new Date(),
): NewOrder {
  const skus = (session.metadata?.lines ?? '').split(',').map((l) => l.split(':')[0] ?? '')
  const details = session.customer_details ?? {}
  const shipping = session.collected_information?.shipping_details ?? session.shipping_details
  const a = shipping?.address ?? details.address ?? {}
  const name = details.name ?? shipping?.name ?? ''
  const lines = items.map(
    (it, i): OrderLine => ({
      sku: skus[i] ?? '',
      name: it.description ?? '',
      unitPrice: it.price?.unit_amount ?? Math.round(it.amount_total / (it.quantity || 1)),
      quantity: it.quantity ?? 1,
      total: it.amount_total,
    }),
  )
  return {
    createdAt: now.toISOString(),
    locale: session.metadata?.locale ?? 'en',
    demo: false,
    status: 'paid',
    customer: {
      name,
      email: details.email ?? '',
      ...(details.phone && { phone: details.phone }),
    },
    ...(shipping?.name && shipping.name !== name && { shipTo: shipping.name }),
    address: {
      line1: a.line1 ?? '',
      ...(a.line2 && { line2: a.line2 }),
      postalCode: a.postal_code ?? '',
      city: a.city ?? '',
      ...(a.state && { state: a.state }),
      country: a.country ?? '',
    },
    zone: { id: session.metadata?.zone ?? '', label: zoneLabel },
    lines,
    subtotal: session.amount_subtotal ?? lines.reduce((s, l) => s + l.total, 0),
    shipping: session.total_details?.amount_shipping ?? 0,
    total: session.amount_total ?? 0,
    currency: 'eur',
    stripe: {
      session: session.id,
      ...(session.payment_intent && { paymentIntent: session.payment_intent }),
      ...(session.invoice && { invoice: session.invoice }),
    },
    history: [{ status: 'paid', at: now.toISOString(), by: 'stripe', emailed: true }],
  }
}

/**
 * Files the order of a paid Checkout Session (once, however often it arrives), or null while it is not paid. The
 * webhook calls it, and so does the buyer's return from Stripe, so a deploy Stripe sends no webhooks to (a deploy
 * preview, a branch deploy) records its paid orders too.
 */
async function recordSession(key: string, session: CheckoutSession, origin: string) {
  if (session.payment_status !== 'paid') return null
  const shop = siteShop(session.metadata?.locale ?? '')
  if (!shop) throw new Error(`no shop for ${session.metadata?.locale}`)
  const items = await stripe<{ data: StripeLineItem[] }>(
    key,
    'GET',
    `checkout/sessions/${session.id}/line_items`,
    { limit: 100 },
  )
  const zone = shop.zones.find((z) => z.id === session.metadata?.zone)
  return recordOrder(
    shop.config.orderPrefix,
    session.id,
    orderFromSession(session, items.data, zone?.label ?? session.metadata?.zone ?? ''),
    origin,
  )
}

/** POST /api/shop/stripe-webhook: Stripe telling us a Checkout Session is paid. Answers 2xx once it is recorded. */
export async function stripeWebhook(request: Request): Promise<Response> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const key = process.env.STRIPE_SECRET_KEY
  if (!secret || !key) return json({ error: 'webhook not set up' }, 503)
  const body = await request.text()
  if (!verifyStripeSignature(body, request.headers.get('stripe-signature'), secret))
    return json({ error: 'bad signature' }, 400)
  const event = JSON.parse(body) as { type: string; data: { object: CheckoutSession } }
  if (
    event.type !== 'checkout.session.completed' &&
    event.type !== 'checkout.session.async_payment_succeeded'
  )
    return json({ received: true })
  const order = await recordSession(key, event.data.object, originOf(request))
  return order
    ? json({ received: true, number: order.number })
    : json({ received: true, pending: true })
}

/** The invoice and receipt Stripe made for an order, when Stripe is set up and has them. */
async function stripeDocuments(order: Order): Promise<Pick<OrderView, 'invoice' | 'receipt'>> {
  const key = process.env.STRIPE_SECRET_KEY
  const ids = order.stripe
  if (!key || !ids) return {}
  const [invoice, intent] = await Promise.all([
    ids.invoice
      ? stripe<{ hosted_invoice_url?: string | null; invoice_pdf?: string | null }>(
          key,
          'GET',
          `invoices/${ids.invoice}`,
        ).catch(() => null)
      : null,
    ids.paymentIntent
      ? stripe<{ latest_charge?: { receipt_url?: string | null } | string | null }>(
          key,
          'GET',
          `payment_intents/${ids.paymentIntent}`,
          { expand: ['latest_charge'] },
        ).catch(() => null)
      : null,
  ])
  const charge = typeof intent?.latest_charge === 'object' ? intent.latest_charge : null
  return {
    ...(invoice?.hosted_invoice_url && {
      invoice: {
        url: invoice.hosted_invoice_url,
        ...(invoice.invoice_pdf && { pdf: invoice.invoice_pdf }),
      },
    }),
    ...(charge?.receipt_url && { receipt: charge.receipt_url }),
  }
}

/** What the customer's order page shows of an order: our notes only when they were emailed to them. */
export function viewOf(
  order: Order,
  documents: Pick<OrderView, 'invoice' | 'receipt'> = {},
): OrderView {
  return {
    number: order.number,
    createdAt: order.createdAt,
    status: order.status,
    demo: order.demo,
    lines: order.lines,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    zone: order.zone.label,
    shipTo: order.shipTo ?? order.customer.name,
    address: order.address,
    ...(order.tracking && { tracking: order.tracking }),
    history: order.history.map((e) => ({
      status: e.status,
      at: e.at,
      ...(e.emailed && e.note && { note: e.note }),
      ...(e.tracking && { tracking: e.tracking }),
    })),
    ...documents,
  }
}

/**
 * GET /api/shop/order, the customer's side: `?session=` the order a payment became (its number and link, for the
 * cart's thank-you; 404 until recorded), `?ref=` the order of a customer's link, for their order page.
 */
export async function customerOrder(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const store = await orderStore()
  const ref = params.get('ref')
  if (ref !== null) {
    const order = await orderOfRef(store, ref)
    return order
      ? json({ order: viewOf(order, await stripeDocuments(order)) })
      : json({ error: 'no such order' }, 404)
  }
  const session = params.get('session') ?? ''
  if (!/^(cs_(test|live)_|demo-)[\w-]+$/.test(session)) return json({ error: 'bad session' }, 400)
  const number = await numberOfSession(store, session)
  let order = number ? await getOrder(store, number) : null
  // not recorded yet: ask Stripe ourselves rather than wait for a webhook that may never come to this deploy
  const key = process.env.STRIPE_SECRET_KEY
  if (!order && key && session.startsWith('cs_')) {
    try {
      order = await recordSession(
        key,
        await stripe<CheckoutSession>(key, 'GET', `checkout/sessions/${session}`),
        originOf(request),
      )
    } catch (err) {
      console.error('[shop] could not confirm', session, err)
    }
  }
  return order
    ? json({ number: order.number, ref: orderRef(order) })
    : json({ error: 'not yet' }, 404)
}

/**
 * Who is asking for the orders panel: the Netlify Identity user of the bearer token (the CMS login), allowed when
 * their roles include `shop` or `admin`, or their email is in SHOP_ADMIN_EMAILS. Locally (vite dev), anyone.
 */
async function staffOf(request: Request): Promise<string | null> {
  if (import.meta.env.DEV) return 'dev'
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const res = await fetch(`${originOf(request)}/.netlify/identity/user`, {
    headers: { authorization: auth },
  }).catch(() => null)
  if (!res?.ok) return null
  const user = (await res.json()) as { email?: string; app_metadata?: { roles?: string[] } }
  const allowed = (process.env.SHOP_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  const roles = user.app_metadata?.roles ?? []
  const email = user.email?.toLowerCase()
  return email && (roles.includes('shop') || roles.includes('admin') || allowed.includes(email))
    ? email
    : null
}

/**
 * /api/shop/orders, the orders panel's: GET lists every order (`?number=` one order in full); POST changes an
 * order's status, emailing the customer unless told not to.
 */
export async function ordersApi(request: Request): Promise<Response> {
  const staff = await staffOf(request)
  if (!staff) return json({ error: 'sign in with a shop account' }, 401)
  const store = await orderStore()
  if (request.method === 'GET') {
    const number = new URL(request.url).searchParams.get('number')
    if (number) {
      const order = await getOrder(store, number)
      return order
        ? json({ order, link: orderLink(order, originOf(request)) })
        : json({ error: 'no such order' }, 404)
    }
    return json({ orders: (await listOrders(store)).map(summarize) })
  }
  const parsed = orderUpdateSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return json({ error: 'invalid change' }, 400)
  const update = parsed.data
  const order = await getOrder(store, update.number)
  if (!order) return json({ error: 'no such order' }, 404)
  const changed = applyUpdate(order, update, staff)
  await store.set(`orders/${order.number}`, changed)
  if (update.email)
    try {
      await sendEmail(
        customerEmail(changed, update.status, orderLink(changed, originOf(request)), update),
      )
    } catch (err) {
      console.error('[shop] status email failed', err)
      return json({ order: changed, warning: 'saved, but the email could not be sent' })
    }
  return json({ order: changed })
}
