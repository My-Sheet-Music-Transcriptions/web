import './env.server'
import { NoticeEmail } from '~/components/email/NoticeEmail'
import {
  ALLOWED_UPLOAD_TYPES,
  type ContactInput,
  contactSchema,
  formDataToObject,
  MAX_UPLOAD_BYTES,
} from './contact'
import { renderEmail, sendMail } from './mailgun.server'

export type ContactResult = { ok: true } | { ok: false; errors: Record<string, string> }

/** Validates, drops obvious bots (honeypot, sub-3s submits), stores the attachment and emails the team. */
export async function processContact(fd: FormData): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(formDataToObject(fd))
  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!errors[key]) errors[key] = issue.message
    }
    return { ok: false, errors }
  }
  const input = parsed.data
  // Bots: honeypot filled or submitted unrealistically fast. Pretend success so they stop retrying.
  if (input.website || (input.startedAt && Date.now() - input.startedAt < 3000)) return { ok: true }

  const file = fd.get('file')
  let attachment: { name: string; type: string; bytes: ArrayBuffer } | undefined
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES)
      return {
        ok: false,
        errors: { file: 'fileSize' },
      }
    if (!ALLOWED_UPLOAD_TYPES.some((t) => file.type.startsWith(t)))
      return { ok: false, errors: { file: 'fileType' } }
    attachment = { name: file.name, type: file.type, bytes: await file.arrayBuffer() }
  }
  await deliverContact(input, attachment)
  return { ok: true }
}

/**
 * Delivery: stores the attachment in Netlify Blobs (when running on Netlify) and emails the team with
 * Mailgun (mailgun.server.ts). Without Mailgun's key and domain the submission is logged, so local and preview builds
 * never send mail.
 */
export async function deliverContact(
  input: ContactInput,
  attachment?: { name: string; type: string; bytes: ArrayBuffer },
) {
  let attachmentNote = 'No attachment'
  if (attachment) {
    attachmentNote = `Attachment: ${attachment.name} (${attachment.type}, ${Math.round(attachment.bytes.byteLength / 1024)} KB)`
    try {
      const { getStore } = await import('@netlify/blobs')
      const store = getStore({ name: 'contact-uploads', consistency: 'strong' })
      const key = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${attachment.name.replace(/[^\w.-]+/g, '_')}`
      await store.set(key, attachment.bytes, {
        metadata: { email: input.email, type: attachment.type },
      })
      attachmentNote += `\nStored as: ${key}`
    } catch (err) {
      attachmentNote += '\n(Blob storage unavailable in this environment; file not stored)'
      console.warn('[contact] blob store unavailable', err instanceof Error ? err.message : err)
    }
  }

  const gift = input.kind === 'gift-card'
  const reservation = input.kind === 'reservation'
  const fields: [string, string][] = reservation
    ? [
        ['Email', input.email],
        ['Reserved from', input.returnTo],
      ]
    : gift
      ? [
          ['Name', input.name],
          ['Email', input.email],
          ['Amount', `${input.amount} ${input.currency}`],
        ]
      : [
          ['Name', input.name],
          ['Email', input.email],
          ['Phone', [input.prefix, input.phone].filter(Boolean).join(' ') || '—'],
          ['Where to listen', input.link || '—'],
          ['Instruments', input.instruments || '—'],
          ['Purpose', input.purpose || '—'],
        ]
  const message = reservation
    ? undefined
    : gift
      ? input.message || '(no details given)'
      : input.message
  const note = reservation || gift ? undefined : attachmentNote
  const subject = reservation
    ? `New reservation on ${input.returnTo} from ${input.email}`
    : gift
      ? `New gift card request from ${input.name}`
      : `New transcription request from ${input.name}`
  const text = [
    ...fields.map(([label, value]) => `${label}: ${value}`),
    ...(message ? ['', message] : []),
    ...(note ? ['', note] : []),
  ].join('\n')
  const to = process.env.CONTACT_TO_EMAIL ?? 'info@mysheetmusictranscriptions.com'
  const from = process.env.CONTACT_FROM_EMAIL ?? 'website@mysheetmusictranscriptions.com'
  await sendMail(
    {
      from,
      to,
      replyTo: input.email,
      subject,
      text,
      html: await renderEmail(
        <NoticeEmail
          lang="en"
          title={subject}
          rows={fields.map(([label, value]) => ({ label, value }))}
          message={message}
          note={note}
        />,
      ),
      attachments:
        attachment && attachment.bytes.byteLength <= 10 * 1024 * 1024
          ? [{ filename: attachment.name, content: attachment.bytes, type: attachment.type }]
          : undefined,
    },
    'contact',
  )
}
