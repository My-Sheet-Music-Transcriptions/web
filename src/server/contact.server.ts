import {
  ALLOWED_UPLOAD_TYPES,
  type ContactInput,
  contactSchema,
  formDataToObject,
  MAX_UPLOAD_BYTES,
} from './contact'

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
        errors: { file: 'The file is larger than 25 MB. Please send it by email instead.' },
      }
    if (!ALLOWED_UPLOAD_TYPES.some((t) => file.type.startsWith(t)))
      return { ok: false, errors: { file: 'Please attach an audio, video, PDF or image file.' } }
    attachment = { name: file.name, type: file.type, bytes: await file.arrayBuffer() }
  }
  await deliverContact(input, attachment)
  return { ok: true }
}

/**
 * Delivery: stores the attachment in Netlify Blobs (when running on Netlify) and emails the team with
 * Resend. Without RESEND_API_KEY the submission is logged, so local and preview builds never send mail.
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

  const lines = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${[input.prefix, input.phone].filter(Boolean).join(' ') || '—'}`,
    `Where to listen: ${input.link || '—'}`,
    `Instruments: ${input.instruments || '—'}`,
    '',
    input.message,
    '',
    attachmentNote,
  ]
  const text = lines.join('\n')
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL ?? 'info@mysheetmusictranscriptions.com'
  const from = process.env.CONTACT_FROM_EMAIL ?? 'website@mysheetmusictranscriptions.com'
  if (!apiKey) {
    console.info('[contact] RESEND_API_KEY not set; submission logged only:\n', text)
    return
  }
  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `New transcription request from ${input.name}`,
    text,
    attachments:
      attachment && attachment.bytes.byteLength <= 10 * 1024 * 1024
        ? [{ filename: attachment.name, content: Buffer.from(attachment.bytes) }]
        : undefined,
  })
  if (error) throw new Error(`Email delivery failed: ${error.message}`)
}
