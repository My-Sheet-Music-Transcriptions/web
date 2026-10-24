import type { ReactElement } from 'react'
import type { EmailLogo } from '~/components/email/EmailLayout'
import { NoticeEmail } from '~/components/email/NoticeEmail'
import { type EmailOrderSummary, OrderEmail } from '~/components/email/OrderEmail'
import type { OrderEmails } from '~/content/types'
import { getSiteConfig } from '~/i18n/sites'
import type { Locale } from '~/i18n/types'
import { fill } from '~/lib/strings'
import { EMAIL_LOGO_WIDTH, emailLogoImage } from '~/seo/og/paths'
import { formatPrice } from '~/shop/cart'
import { shopWords } from '~/shop/words'
import { renderEmail, sendMail } from './mailgun.server'
import type { Order, OrderStatus } from './shop'

/**
 * The shop's emails, each as plain text and as HTML (React Email: src/components/email), sent with Mailgun
 * (mailgun.server.ts) as the contact form's are: the customer's in the order's language
 * (content/<locale>/data/shop.ts `orderEmails`), ours in English. Without Mailgun's key and domain they are
 * logged instead, so local and preview builds never send mail.
 */

export interface Email {
  to: string
  subject: string
  text: string
  /** The HTML version, rendered when the email is sent. */
  react?: ReactElement
  replyTo?: string
}

const teamAddress = () =>
  process.env.SHOP_ORDERS_EMAIL ||
  process.env.CONTACT_TO_EMAIL ||
  'info@mysheetmusictranscriptions.com'

/** The site's lockup, served by the site the email links to. */
export function siteLogo(locale: string, origin: string): EmailLogo {
  return {
    src: new URL(emailLogoImage(locale), origin).toString(),
    alt: getSiteConfig(locale as Locale).brand,
    width: EMAIL_LOGO_WIDTH,
    href: origin,
  }
}

function orderSummary(
  order: Order,
  words: OrderEmails['summary'],
  locale: string,
): EmailOrderSummary {
  const price = (cents: number) => formatPrice(cents, locale)
  const a = order.address
  return {
    title: `${words.order} ${order.number}`,
    lines: order.lines.map((l) => ({ label: `${l.quantity} × ${l.name}`, value: price(l.total) })),
    totals: [
      { label: words.subtotal, value: price(order.subtotal) },
      { label: `${words.shipping} (${order.zone.label})`, value: price(order.shipping) },
      { label: words.total, value: price(order.total) },
    ],
    addressTitle: words.address,
    address: [
      order.shipTo ?? order.customer.name,
      a.line1,
      ...(a.line2 ? [a.line2] : []),
      `${a.postalCode} ${a.city}`,
      ...(a.state ? [a.state] : []),
      a.country,
    ],
  }
}

function summaryText(s: EmailOrderSummary): string {
  return [
    s.title,
    '',
    ...s.lines.map((l) => `${l.label}  ${l.value}`),
    '',
    ...s.totals.map((t) => `${t.label}: ${t.value}`),
    '',
    `${s.addressTitle}:`,
    ...s.address,
  ].join('\n')
}

/** A template's words around its `{key}`, without the placeholder and the colon before it. */
const around = (template: string, key: string) =>
  template
    .replace(`{${key}}`, '')
    .trim()
    .replace(/[:：]$/, '')

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
  const subject = fill(message.subject, vars)
  const body = fill(message.body, vars)
  const note = extra.note ? fill(words.note, { note: extra.note }) : undefined
  const summary = orderSummary(order, words.summary, order.locale)
  return {
    to: order.customer.email,
    replyTo: teamAddress(),
    subject,
    text: [
      body,
      ...(tracking ? [fill(words.tracking, { tracking })] : []),
      ...(note ? [note] : []),
      fill(words.link, { link }),
      summaryText(summary),
      words.signature,
    ].join('\n\n'),
    react: (
      <OrderEmail
        lang={order.locale}
        logo={siteLogo(order.locale, new URL(link).origin)}
        title={subject}
        paragraphs={body.split(/\n{2,}/)}
        note={note}
        tracking={tracking ? { href: tracking, label: words.buttons.tracking } : undefined}
        order={{ href: link, intro: around(words.link, 'link'), label: words.buttons.order }}
        summary={summary}
        signature={words.signature}
      />
    ),
  }
}

/** Ours, for each paid order: everything needed to pack it. */
export function teamEmail(order: Order, panelUrl: string): Email {
  const c = order.customer
  const intro = `${c.name} <${c.email}>${c.phone ? `, ${c.phone}` : ''} paid order ${order.number} on the ${order.locale} site.`
  const summary = orderSummary(
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
  )
  const payment = order.stripe?.paymentIntent
    ? `https://dashboard.stripe.com/payments/${order.stripe.paymentIntent}`
    : undefined
  const subject = `${order.demo ? '[DEMO] ' : ''}New order ${order.number}: ${formatPrice(order.total, 'en')} from ${c.name}`
  return {
    to: teamAddress(),
    replyTo: c.email,
    subject,
    text: [
      intro,
      summaryText(summary),
      ...(payment ? [`Payment in Stripe: ${payment}`] : []),
      `Mark it as preparing, shipped… in the orders panel: ${panelUrl}`,
    ].join('\n\n'),
    react: (
      <NoticeEmail
        lang="en"
        logo={siteLogo(order.locale, new URL(panelUrl).origin)}
        title={subject}
        intro={intro}
        summary={summary}
        actions={[
          { href: panelUrl, label: 'Open the orders panel' },
          ...(payment ? [{ href: payment, label: 'Payment in Stripe' }] : []),
        ]}
      />
    ),
  }
}

/** Sends an email from the shop's address, or logs it where Mailgun is not configured. Throws when Mailgun refuses it. */
export async function sendEmail({ react, ...email }: Email): Promise<void> {
  const from =
    process.env.SHOP_FROM_EMAIL ||
    process.env.CONTACT_FROM_EMAIL ||
    'website@mysheetmusictranscriptions.com'
  await sendMail({ from, ...email, html: react && (await renderEmail(react)) }, 'shop')
}
