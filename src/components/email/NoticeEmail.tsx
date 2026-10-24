import type { ReactNode } from 'react'
import {
  EmailButton,
  EmailHeading,
  EmailLayout,
  type EmailLogo,
  EmailNote,
  EmailRows,
  EmailText,
} from './EmailLayout'
import { type EmailOrderSummary, OrderSummary } from './OrderEmail'

export interface NoticeEmailProps {
  lang: string
  logo?: EmailLogo
  title: string
  /** The opening line: who, what, where. */
  intro?: string
  /** Fields as label and value (a request's name, email, phone…). */
  rows?: { label: string; value: ReactNode }[]
  /** What the sender wrote, on cream. */
  message?: string
  summary?: EmailOrderSummary
  /** The main action (the orders panel), then any other links. */
  actions?: { href: string; label: string }[]
  /** Small print after everything (an attachment's note). */
  note?: string
}

/** What the site tells the team: a new order, a request from a form. */
export function NoticeEmail({
  lang,
  logo,
  title,
  intro,
  rows,
  message,
  summary,
  actions = [],
  note,
}: NoticeEmailProps) {
  return (
    <EmailLayout lang={lang} title={title} preview={intro ?? title} logo={logo}>
      <EmailHeading>{title}</EmailHeading>
      {intro && <EmailText>{intro}</EmailText>}
      {rows && rows.length > 0 && <EmailRows rows={rows} />}
      {message && <EmailNote>{message}</EmailNote>}
      {summary && <OrderSummary summary={summary} />}
      {actions.map((a, i) => (
        <EmailButton key={a.href} href={a.href} variant={i === 0 ? 'primary' : 'secondary'}>
          {a.label}
        </EmailButton>
      ))}
      {note && <EmailText muted>{note}</EmailText>}
    </EmailLayout>
  )
}
