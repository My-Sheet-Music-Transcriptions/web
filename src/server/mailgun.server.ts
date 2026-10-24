import type { ReactElement } from 'react'

/**
 * The site's outgoing mail (the forms' and the shop's), plain text and HTML, through Mailgun's REST API
 * (https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages), with fetch: no SDK. Needs
 * MAILGUN_API_KEY (a domain sending key), MAILGUN_DOMAIN (the verified sending domain) and MAILGUN_REGION (`eu` for a
 * domain in Mailgun's EU region, else US). Without the key or the domain the message is logged instead, so local and
 * preview builds never send mail. Only ever imported by server code.
 */

export interface MailMessage {
  from: string
  to: string
  subject: string
  text: string
  /** The HTML version (React Email, rendered with renderEmail); `text` stays for clients without HTML. */
  html?: string
  replyTo?: string
  attachments?: { filename: string; content: ArrayBuffer; type?: string }[]
}

/** An email component (src/components/email) as the HTML mail clients take. */
export async function renderEmail(email: ReactElement): Promise<string> {
  const { render } = await import('react-email')
  return render(email)
}

/** The messages endpoint of the domain's region. */
export function mailgunEndpoint(domain: string, region = process.env.MAILGUN_REGION): string {
  const host = region?.toLowerCase() === 'eu' ? 'api.eu.mailgun.net' : 'api.mailgun.net'
  return `https://${host}/v3/${encodeURIComponent(domain)}/messages`
}

/** The multipart body Mailgun takes: `h:Reply-To` for the reply address, one `attachment` part per file. */
export function mailgunForm(message: MailMessage): FormData {
  const form = new FormData()
  form.set('from', message.from)
  form.set('to', message.to)
  form.set('subject', message.subject)
  form.set('text', message.text)
  if (message.html) form.set('html', message.html)
  if (message.replyTo) form.set('h:Reply-To', message.replyTo)
  for (const a of message.attachments ?? [])
    form.append('attachment', new Blob([a.content], { type: a.type }), a.filename)
  return form
}

/** Sends a message, or logs it under `tag` where Mailgun is not configured. Throws when Mailgun refuses it. */
export async function sendMail(message: MailMessage, tag: string): Promise<void> {
  const apiKey = process.env.MAILGUN_API_KEY
  const domain = process.env.MAILGUN_DOMAIN
  if (!apiKey || !domain) {
    console.info(
      `[${tag}] MAILGUN_API_KEY or MAILGUN_DOMAIN not set; email logged only:\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}`,
    )
    return
  }
  const res = await fetch(mailgunEndpoint(domain), {
    method: 'POST',
    headers: { authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}` },
    body: mailgunForm(message),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Email delivery failed: Mailgun ${res.status} ${detail}`.trim())
  }
}
