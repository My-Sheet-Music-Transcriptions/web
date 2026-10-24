import type { OrderEmails } from '~/content/types'
import type { Locale } from '~/i18n/types'
import { fill } from '~/lib/strings'
import { formatPrice } from '~/shop/cart'
import { shopWords } from '~/shop/words'
import { sendMail } from './mailgun.server'
import type { Order, OrderStatus } from './shop'

/**
 * The shop's emails, plain text, sent with Mailgun (mailgun.server.ts) as the contact form's are: the customer's in the order's language
 * (content/<locale>/data/shop.ts `orderEmails`), ours in English. Without Mailgun's key and domain they are
 * logged instead, so local and preview builds never send mail.
 */

export interface Email {
  to: string
  subject: string
  text: string
  replyTo?: string
}

const teamAddress = () =>
  process.env.SHOP_ORDERS_EMAIL ||
  process.env.CONTACT_TO_EMAIL ||
  'info@mysheetmusictranscriptions.com'

function summary(order: Order, words: OrderEmails['summary'], locale: string): string {
  const price = (cents: number) => formatPrice(cents, locale)
  const a = order.address
  return [
    `${words.order} ${order.number}`,
    '',
    ...order.lines.map((l) => `${l.quantity} × ${l.name}  ${price(l.total)}`),
    '',
    `${words.subtotal}: ${price(order.subtotal)}`,
    `${words.shipping} (${order.zone.label}): ${price(order.shipping)}`,
    `${words.total}: ${price(order.total)}`,
    '',
    `${words.address}:`,
    order.shipTo ?? order.customer.name,
    a.line1,
    ...(a.line2 ? [a.line2] : []),
    `${a.postalCode} ${a.city}`,
    ...(a.state ? [a.state] : []),
    a.country,
  ].join('\n')
}

/**
 * What the customer is told about their order reaching `status` (the event's note and tracking link included), with
 * the link to their order page (`link`: its status, the parcel's tracking, the invoice and receipt).
 */
export function customerEmail(
  order: Order,
  status: OrderStatus,
  link: string,
  extra: { note?: string; tracking?: string } = {},
): Email {
  const words = shopWords(order.locale as Locale)?.orderEmails
  if (!words) throw new Error(`content/${order.locale}/data/shop.ts is missing: no order emails`)
  const vars = {
    number: order.number,
    name: order.customer.name.split(' ')[0] ?? order.customer.name,
  }
  const message = words[status]
  const tracking = extra.tracking ?? (status === 'shipped' ? order.tracking : undefined)
  return {
    to: order.customer.email,
    replyTo: teamAddress(),
    subject: fill(message.subject, vars),
    text: [
      fill(message.body, vars),
      ...(tracking ? [fill(words.tracking, { tracking })] : []),
      ...(extra.note ? [fill(words.note, { note: extra.note })] : []),
      fill(words.link, { link }),
      summary(order, words.summary, order.locale),
      words.signature,
    ].join('\n\n'),
  }
}

/** Ours, for each paid order: everything needed to pack it. */
export function teamEmail(order: Order, panelUrl: string): Email {
  const c = order.customer
  return {
    to: teamAddress(),
    replyTo: c.email,
    subject: `${order.demo ? '[DEMO] ' : ''}New order ${order.number}: ${formatPrice(order.total, 'en')} from ${c.name}`,
    text: [
      `${c.name} <${c.email}>${c.phone ? `, ${c.phone}` : ''} paid order ${order.number} on the ${order.locale} site.`,
      summary(
        order,
        {
          order: 'Order',
          quantity: 'Quantity',
          subtotal: 'Subtotal',
          shipping: 'Shipping',
          total: 'Total',
          address: 'Ship to',
        },
        'en',
      ),
      ...(order.stripe?.paymentIntent
        ? [`Payment in Stripe: https://dashboard.stripe.com/payments/${order.stripe.paymentIntent}`]
        : []),
      `Mark it as preparing, shipped… in the orders panel: ${panelUrl}`,
    ].join('\n\n'),
  }
}

/** Sends an email from the shop's address, or logs it where Mailgun is not configured. Throws when Mailgun refuses it. */
export async function sendEmail(email: Email): Promise<void> {
  const from =
    process.env.SHOP_FROM_EMAIL ||
    process.env.CONTACT_FROM_EMAIL ||
    'website@mysheetmusictranscriptions.com'
  await sendMail({ from, ...email }, 'shop')
}
