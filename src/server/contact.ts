import { z } from 'zod'

/** Shared validation for the quote request form (client hints + server enforcement). */
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name').max(120),
  email: z.string().trim().email('Please enter a valid email address').max(200),
  link: z.string().trim().max(2000).optional().default(''),
  instruments: z.string().trim().max(1000).optional().default(''),
  message: z.string().trim().min(10, 'Please tell us what you need').max(5000),
  prefix: z.string().trim().max(8).optional().default(''),
  phone: z.string().trim().max(32).optional().default(''),
  /** Honeypot: must stay empty. */
  website: z.string().max(0).optional().default(''),
  /** Timestamp set when the form rendered; submissions faster than 3 s are treated as bots. */
  startedAt: z.coerce.number().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024
export const ALLOWED_UPLOAD_TYPES = [
  'audio/',
  'video/',
  'application/pdf',
  'image/',
  'application/zip',
  'application/x-zip-compressed',
]

export function formDataToObject(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of fd.entries()) if (typeof v === 'string') out[k] = v
  return out
}
