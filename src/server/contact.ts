import { z } from 'zod'

export const CURRENCIES = ['EUR', 'USD'] as const

/**
 * Shared validation for the request forms (client hints + server enforcement). `kind` selects the form:
 * `quote` (default) needs a message; `gift-card` needs an amount and currency and the details are optional.
 */
export const contactSchema = z
  .object({
    kind: z.enum(['quote', 'gift-card']).optional().default('quote'),
    name: z.string().trim().min(2, 'Please enter your name').max(120),
    email: z.string().trim().email('Please enter a valid email address').max(200),
    link: z.string().trim().max(2000).optional().default(''),
    instruments: z.string().trim().max(1000).optional().default(''),
    message: z.string().trim().max(5000).optional().default(''),
    prefix: z.string().trim().max(8).optional().default(''),
    phone: z.string().trim().max(32).optional().default(''),
    /** Gift card: the value of the voucher. */
    amount: z
      .string()
      .trim()
      .optional()
      .default('')
      .transform((v) => (v === '' ? undefined : Number(v))),
    currency: z.enum(CURRENCIES).optional().default('EUR'),
    /** Internal path the no-JS fallback redirects back to (the page that hosted the form). */
    returnTo: z
      .string()
      .regex(/^\/[a-z0-9/-]*$/, 'Invalid return path')
      .max(200)
      .optional()
      .default('/'),
    /** Anchor of the form on that page. */
    anchor: z
      .string()
      .regex(/^[a-z0-9-]*$/, 'Invalid anchor')
      .max(80)
      .optional()
      .default('contact'),
    /** Honeypot: must stay empty. */
    website: z.string().max(0).optional().default(''),
    /** Timestamp set when the form rendered; submissions faster than 3 s are treated as bots. */
    startedAt: z.coerce.number().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.kind === 'gift-card') {
      if (v.amount === undefined || !Number.isFinite(v.amount) || v.amount <= 0)
        ctx.addIssue({
          code: 'custom',
          path: ['amount'],
          message: 'Please enter the amount to gift',
        })
    } else if (v.message.length < 10) {
      ctx.addIssue({ code: 'custom', path: ['message'], message: 'Please tell us what you need' })
    }
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
