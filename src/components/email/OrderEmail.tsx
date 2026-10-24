import {
  EmailButton,
  EmailHeading,
  EmailLayout,
  type EmailLogo,
  EmailNote,
  EmailRows,
  EmailRule,
  EmailSubheading,
  EmailText,
} from './EmailLayout'

/** An order as the emails show it: its lines and totals, already priced and worded, and where it goes. */
export interface EmailOrderSummary {
  title: string
  lines: { label: string; value: string }[]
  totals: { label: string; value: string }[]
  /** The last of `totals` is the total, set bold. */
  addressTitle: string
  address: string[]
}

/** The lines, the totals (the last one bold, over a rule) and the address of an order. */
export function OrderSummary({ summary }: { summary: EmailOrderSummary }) {
  const last = summary.totals.length - 1
  return (
    <>
      <EmailSubheading>{summary.title}</EmailSubheading>
      <EmailRows
        rows={[
          ...summary.lines,
          ...summary.totals.map((t, i) => ({
            ...t,
            strong: i === last,
            rule: i === 0 || i === last,
          })),
        ]}
      />
      <EmailSubheading>{summary.addressTitle}</EmailSubheading>
      <EmailText muted>{summary.address.join('\n')}</EmailText>
    </>
  )
}

export interface OrderEmailProps {
  lang: string
  logo?: EmailLogo
  /** The subject, also the email's title. */
  title: string
  /** The message, a paragraph per item (the first is the greeting). */
  paragraphs: string[]
  /** A note from us, already worded ("A note from us: …"). */
  note?: string
  /** The carrier's tracking link and its button's words. */
  tracking?: { href: string; label: string }
  /** Their order page: the line that introduces it and the button's words. */
  order: { href: string; intro: string; label: string }
  summary: EmailOrderSummary
  /** The closing lines and the signature. */
  signature: string
}

/**
 * What a customer gets each time their order moves on (paid, preparing, shipped…): the message, our note, the
 * tracking button, the button to their order page and the order itself.
 */
export function OrderEmail({
  lang,
  logo,
  title,
  paragraphs,
  note,
  tracking,
  order,
  summary,
  signature,
}: OrderEmailProps) {
  return (
    <EmailLayout lang={lang} title={title} preview={paragraphs[1] ?? title} logo={logo}>
      <EmailHeading>{title}</EmailHeading>
      {paragraphs.map((p) => (
        <EmailText key={p}>{p}</EmailText>
      ))}
      {note && <EmailNote>{note}</EmailNote>}
      {tracking && (
        <EmailButton href={tracking.href} variant="secondary">
          {tracking.label}
        </EmailButton>
      )}
      <EmailText>{order.intro}</EmailText>
      <EmailButton href={order.href}>{order.label}</EmailButton>
      <OrderSummary summary={summary} />
      <EmailRule />
      <EmailText muted>{signature}</EmailText>
    </EmailLayout>
  )
}
