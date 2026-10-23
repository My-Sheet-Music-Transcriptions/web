import { createHmac } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { parseMeta } from '../../src/content/schema'
import { createOrder, memoryStore, numberOfSession } from '../../src/server/orders.server'
import type { Order } from '../../src/server/shop'
import { orderFromSession, priceCheckout } from '../../src/server/shop.server'
import { customerEmail, teamEmail } from '../../src/server/shop-emails.server'
import { formEncode, verifyStripeSignature } from '../../src/server/stripe.server'
import { formatPrice, priceCart } from '../../src/shop/cart'
import type { Product } from '../../src/shop/catalogue'
import { catalogue } from '../../src/shop/catalogue'
import {
  parseShopConfig,
  type ShippingZone,
  shippingZones,
  shopConfig,
} from '../../src/shop/config'
import { STRIPE_SHIPPING_COUNTRIES } from '../../src/shop/countries'
import { shopWords } from '../../src/shop/words'

// Every locale's content, as a preview build has it (unit tests are an English domain build otherwise).
vi.hoisted(() => {
  ;(import.meta.env as Record<string, string | undefined>).LOCALE_ROUTING = 'path'
})

const locales = fs.readdirSync('content').filter((d) => /^[a-z]{2}$/.test(d))

const product = (sku: string, o: Partial<Product> = {}): Product => ({
  sku,
  name: sku,
  path: `/product/${sku}`,
  price: 3000,
  availability: 'available',
  maxPerOrder: 10,
  image: { sources: {}, img: { src: '/x.png', w: 1, h: 1 } },
  order: 100,
  ...o,
})
const spain: ShippingZone = { id: 'es', label: 'Spain', fee: 490, countries: ['ES'] }

describe('shop settings and words', () => {
  it('sells the Catalan songbook', () => {
    expect(catalogue('ca').map((p) => [p.sku, p.availability, p.price])).toContainEqual([
      'lodvg-songbook',
      'available',
      3000,
    ])
  })
  it.each(locales)(
    '%s: a site with products on sale has its shop.json, valid, and its shop words',
    (locale) => {
      const onSale = catalogue(locale as never).filter((p) => p.availability === 'available')
      const file = path.join('content', locale, 'data', 'shop.json')
      if (fs.existsSync(file)) parseShopConfig(JSON.parse(fs.readFileSync(file, 'utf8')), file)
      if (!onSale.length) return
      expect(shopConfig(locale as never), file).not.toBeNull()
      expect(shopWords(locale as never), `content/${locale}/data/shop.ts`).toBeDefined()
    },
  )
  it('spells the rest of the world out as every country Stripe ships to that no other zone lists', () => {
    const zones = shippingZones(
      parseShopConfig(
        {
          orderPrefix: 'LMP',
          zones: [
            { id: 'es', label: 'Spain', fee: 4.9, countries: ['ES'] },
            { id: 'world', label: 'World', fee: 20, rest: true, freeFrom: 100 },
          ],
        },
        'test',
      ),
    )
    expect(zones[0]).toEqual({ id: 'es', label: 'Spain', fee: 490, countries: ['ES'] })
    expect(zones[1]?.countries).toHaveLength(STRIPE_SHIPPING_COUNTRIES.length - 1)
    expect(zones[1]?.countries).not.toContain('ES')
    expect(zones[1]?.freeFrom).toBe(10000)
  })
  it('refuses a country in two zones, two rests of the world, a zone without countries and unknown countries', () => {
    const bad = (zones: unknown[]) => () => parseShopConfig({ orderPrefix: 'LMP', zones }, 'x')
    expect(
      bad([
        { id: 'a', label: 'A', fee: 1, countries: ['ES'] },
        { id: 'b', label: 'B', fee: 1, countries: ['ES'] },
      ]),
    ).toThrow(/ES is in zones/)
    expect(
      bad([
        { id: 'a', label: 'A', fee: 1, rest: true },
        { id: 'b', label: 'B', fee: 1, rest: true },
      ]),
    ).toThrow(/one zone at most/)
    expect(bad([{ id: 'a', label: 'A', fee: 1 }])).toThrow(/needs countries/)
    expect(bad([{ id: 'a', label: 'A', fee: 1, countries: ['XX'] }])).toThrow()
  })
  it('checks a product’s sale fields: a price to be sold, a link to be sold elsewhere, an offer below the old price', () => {
    const meta = (shop: object) => ({
      title: 'A songbook for the test',
      description: 'A songbook for the test, long enough to pass the description check.',
      translationKey: 'test',
      shop: { sku: 'test', name: 'Test', image: 'cover.jpg', ...shop },
    })
    expect(() => parseMeta('products', meta({ price: 30 }), 'x')).not.toThrow()
    expect(() => parseMeta('products', meta({}), 'x')).toThrow(/needs a price/)
    expect(() => parseMeta('products', meta({ availability: 'soon' }), 'x')).not.toThrow()
    expect(() => parseMeta('products', meta({ availability: 'external', price: 80 }), 'x')).toThrow(
      /externalUrl/,
    )
    expect(() => parseMeta('products', meta({ price: 30, compareAt: 25 }), 'x')).toThrow(/higher/)
  })
})

describe('pricing a cart', () => {
  const products = [
    product('a'),
    product('b', { price: 1250, maxPerOrder: 2 }),
    product('soon', { availability: 'soon', price: undefined }),
  ]
  it('merges lines, caps quantities, drops what is not on sale and adds the zone’s fee', () => {
    const p = priceCart(
      products,
      [
        { sku: 'a', quantity: 1 },
        { sku: 'b', quantity: 5 },
        { sku: 'a', quantity: 2 },
        { sku: 'soon', quantity: 1 },
        { sku: 'nope', quantity: 1 },
      ],
      spain,
    )
    expect(p.lines.map((l) => [l.product.sku, l.quantity, l.total])).toEqual([
      ['a', 3, 9000],
      ['b', 2, 2500],
    ])
    expect(p).toMatchObject({ subtotal: 11500, shipping: 490, total: 11990 })
    expect(p.problems).toEqual(['b: 5 asked, 2 allowed', 'soon: not on sale', 'nope: not on sale'])
  })
  it('ships free from the zone’s threshold, and an empty cart costs nothing', () => {
    const free = { ...spain, freeFrom: 6000 }
    expect(priceCart(products, [{ sku: 'a', quantity: 2 }], free).shipping).toBe(0)
    expect(priceCart(products, [{ sku: 'a', quantity: 1 }], free).shipping).toBe(490)
    expect(priceCart(products, [], spain).total).toBe(0)
  })
  it('writes prices as the locale writes euros', () => {
    expect(formatPrice(3000, 'ca').replace(/\s/g, ' ')).toBe('30,00 €')
    expect(formatPrice(490, 'en')).toBe('€4.90')
  })
  it('refuses a checkout with a product not on sale, an unknown zone or too many', () => {
    const lines = (sku: string, quantity = 1) => [{ sku, quantity }]
    const ask = (l: { sku: string; quantity: number }[], zone = 'es') =>
      priceCheckout({ locale: 'ca', lines: l, zone, returnPath: '/shop' })
    expect('error' in ask(lines('canconer-nadal-2026'))).toBe(true)
    expect('error' in ask(lines('lodvg-songbook'), 'mars')).toBe(true)
    expect('error' in ask(lines('lodvg-songbook', 99))).toBe(true)
    const ok = ask(lines('lodvg-songbook', 2), 'eu')
    expect(ok).not.toHaveProperty('error')
    if (!('error' in ok)) expect(ok.priced.total).toBe(2 * 3000 + 1200)
  })
})

describe('Stripe', () => {
  it('form-encodes nested params as Stripe reads them', () => {
    expect(
      decodeURIComponent(
        formEncode({
          mode: 'payment',
          line_items: [{ quantity: 2, price_data: { currency: 'eur', unit_amount: 3000 } }],
          phone_number_collection: { enabled: true },
          skipped: undefined,
        }),
      ),
    ).toBe(
      'mode=payment&line_items[0][quantity]=2&line_items[0][price_data][currency]=eur&line_items[0][price_data][unit_amount]=3000&phone_number_collection[enabled]=true',
    )
  })
  it('trusts a webhook only with a recent signature made with the endpoint’s secret', () => {
    const body = '{"type":"checkout.session.completed"}'
    const now = 1_800_000_000_000
    const t = now / 1000
    const sign = (secret: string, time = t) =>
      `t=${time},v1=${createHmac('sha256', secret).update(`${time}.${body}`).digest('hex')}`
    expect(verifyStripeSignature(body, sign('whsec_x'), 'whsec_x', now)).toBe(true)
    expect(verifyStripeSignature(body, sign('whsec_y'), 'whsec_x', now)).toBe(false)
    expect(verifyStripeSignature(body, sign('whsec_x', t - 1000), 'whsec_x', now)).toBe(false)
    expect(verifyStripeSignature(`${body} `, sign('whsec_x'), 'whsec_x', now)).toBe(false)
    expect(verifyStripeSignature(body, null, 'whsec_x', now)).toBe(false)
  })
  it('reads an order from a paid session, shipping details where either API version puts them', () => {
    const session = {
      id: 'cs_test_1',
      payment_status: 'paid' as const,
      amount_subtotal: 6000,
      amount_total: 7200,
      total_details: { amount_shipping: 1200 },
      payment_intent: 'pi_1',
      metadata: { locale: 'ca', zone: 'eu', lines: 'lodvg-songbook:2' },
      customer_details: { name: 'Anna Puig', email: 'anna@example.com', phone: '+33 1' },
      collected_information: {
        shipping_details: {
          name: 'Joan Puig',
          address: { line1: '1 Rue X', postal_code: '75001', city: 'Paris', country: 'FR' },
        },
      },
    }
    const items = [
      { description: 'LODVG', quantity: 2, amount_total: 6000, price: { unit_amount: 3000 } },
    ]
    const order = orderFromSession(session, items, 'Europa', new Date('2026-10-23T10:00:00Z'))
    expect(order).toMatchObject({
      locale: 'ca',
      customer: { name: 'Anna Puig', email: 'anna@example.com', phone: '+33 1' },
      shipTo: 'Joan Puig',
      address: { line1: '1 Rue X', postalCode: '75001', city: 'Paris', country: 'FR' },
      zone: { id: 'eu', label: 'Europa' },
      lines: [{ sku: 'lodvg-songbook', name: 'LODVG', unitPrice: 3000, quantity: 2, total: 6000 }],
      subtotal: 6000,
      shipping: 1200,
      total: 7200,
      stripe: { session: 'cs_test_1', paymentIntent: 'pi_1' },
    })
    const { collected_information: _, ...older } = session
    const legacy = orderFromSession(
      { ...older, shipping_details: session.collected_information.shipping_details },
      items,
      'Europa',
    )
    expect(legacy.address.city).toBe('Paris')
  })
})

describe('orders', () => {
  const base: Omit<Order, 'number'> = {
    createdAt: '2026-10-23T10:00:00.000Z',
    locale: 'ca',
    demo: false,
    status: 'paid',
    customer: { name: 'Anna Puig', email: 'anna@example.com' },
    address: { line1: 'Carrer 1', postalCode: '08001', city: 'Barcelona', country: 'ES' },
    zone: { id: 'es', label: 'Espanya' },
    lines: [{ sku: 'lodvg-songbook', name: 'LODVG', unitPrice: 3000, quantity: 1, total: 3000 }],
    subtotal: 3000,
    shipping: 490,
    total: 3490,
    currency: 'eur',
    history: [],
  }
  it('numbers orders from 1001 up and makes one order of a payment delivered twice', async () => {
    const store = memoryStore()
    const first = await createOrder(store, 'LMP', 'cs_1', base)
    const again = await createOrder(store, 'LMP', 'cs_1', base)
    const second = await createOrder(store, 'LMP', 'cs_2', base)
    expect([first.number, again.number, second.number]).toEqual([
      'LMP-1001',
      'LMP-1001',
      'LMP-1002',
    ])
    expect(await numberOfSession(store, 'cs_2')).toBe('LMP-1002')
    expect(await store.keys('orders/')).toHaveLength(2)
  })
  it('emails the customer in their language, with the tracking link and our note', () => {
    const order: Order = { ...base, number: 'LMP-1001' }
    const email = customerEmail(order, 'shipped', {
      tracking: 'https://t.example/1',
      note: 'Gràcies!',
    })
    expect(email.to).toBe('anna@example.com')
    expect(email.subject).toBe('La comanda LMP-1001 ja és en camí')
    expect(email.text).toContain('Hola Anna,')
    expect(email.text).toContain('https://t.example/1')
    expect(email.text).toContain('Gràcies!')
    expect(email.text).toContain('34,90')
    expect(teamEmail(order, 'https://x/admin/orders/').text).toContain('https://x/admin/orders/')
  })
})
