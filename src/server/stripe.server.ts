import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * The few calls the shop makes to Stripe's REST API (https://docs.stripe.com/api), with fetch: no SDK, nothing in
 * the browser. Only ever imported by server code.
 */

type Param = string | number | boolean | undefined | Param[] | { [key: string]: Param }

/** Nested params as Stripe's form encoding writes them: `line_items[0][price_data][currency]=eur`. */
export function formEncode(params: Record<string, Param>): string {
  const out = new URLSearchParams()
  const walk = (value: Param, key: string) => {
    if (value === undefined) return
    if (Array.isArray(value)) for (const [i, v] of value.entries()) walk(v, `${key}[${i}]`)
    else if (typeof value === 'object')
      for (const [k, v] of Object.entries(value)) walk(v, `${key}[${k}]`)
    else out.append(key, String(value))
  }
  for (const [k, v] of Object.entries(params)) walk(v, k)
  return out.toString()
}

export class StripeError extends Error {}

/**
 * The API version every call asks for, whatever the account's default: Checkout Sessions for Elements
 * (`ui_mode: 'elements'`) exist from this one on, and it is where the shapes read below come from.
 */
export const STRIPE_API_VERSION = '2026-03-25.dahlia'

/** One call to Stripe with the secret key; throws StripeError with Stripe's message when it refuses. */
export async function stripe<T>(
  secretKey: string,
  method: 'GET' | 'POST',
  path: string,
  params?: Record<string, Param>,
  idempotencyKey?: string,
): Promise<T> {
  const query = method === 'GET' && params ? `?${formEncode(params)}` : ''
  const res = await fetch(`https://api.stripe.com/v1/${path}${query}`, {
    method,
    headers: {
      authorization: `Bearer ${secretKey}`,
      'stripe-version': STRIPE_API_VERSION,
      'content-type': 'application/x-www-form-urlencoded',
      ...(idempotencyKey && { 'idempotency-key': idempotencyKey }),
    },
    body: method === 'POST' && params ? formEncode(params) : undefined,
  })
  const body = (await res.json()) as T & { error?: { message?: string } }
  if (!res.ok) throw new StripeError(body.error?.message ?? `Stripe answered ${res.status}`)
  return body
}

/**
 * Whether a webhook call really comes from Stripe: its `Stripe-Signature` header (`t=<time>,v1=<hmac>`) must hold an
 * HMAC-SHA256 of `<time>.<body>` with the endpoint's signing secret, made less than `toleranceSeconds` ago.
 */
export function verifyStripeSignature(
  body: string,
  header: string | null,
  secret: string,
  now = Date.now(),
  toleranceSeconds = 300,
): boolean {
  if (!header) return false
  const parts = header.split(',').map((p) => p.split('=') as [string, string])
  const time = Number(parts.find(([k]) => k === 't')?.[1])
  if (!Number.isFinite(time) || Math.abs(now / 1000 - time) > toleranceSeconds) return false
  const expected = createHmac('sha256', secret).update(`${time}.${body}`).digest()
  return parts
    .filter(([k]) => k === 'v1')
    .some(([, sig]) => {
      const given = Buffer.from(sig ?? '', 'hex')
      return given.length === expected.length && timingSafeEqual(given, expected)
    })
}

/**
 * The languages Stripe.js speaks (https://docs.stripe.com/js/appendix/supported_locales): the Payment Element in the
 * cart's panel takes the site's language when Stripe has it; Catalan is not among them, so a Catalan site gets the
 * element in Spanish (the words around it are the site's own); anything else the browser's language.
 */
const STRIPE_LOCALES = new Set(
  'ar bg cs da de el en es et fi fil fr he hr hu id it ja ko lt lv ms mt nb nl pl pt ro ru sk sl sv th tr vi zh'.split(
    ' ',
  ),
)
export const stripeLocale = (locale: string) =>
  STRIPE_LOCALES.has(locale) ? locale : locale === 'ca' ? 'es' : 'auto'

/** What the shop reads of a Checkout Session (in a webhook event, or fetched). */
export interface CheckoutSession {
  id: string
  /** Set on a session made for Elements (`ui_mode: 'elements'`): what Stripe.js takes the payment with. */
  client_secret?: string | null
  payment_status: 'paid' | 'unpaid' | 'no_payment_required'
  amount_subtotal: number | null
  amount_total: number | null
  total_details?: { amount_shipping?: number | null } | null
  payment_intent?: string | null
  invoice?: string | null
  metadata?: Record<string, string> | null
  customer_details?: {
    name?: string | null
    email?: string | null
    phone?: string | null
    address?: StripeAddress | null
  } | null
  /** Where API versions from 2025 put the shipping address. */
  collected_information?: { shipping_details?: ShippingDetails | null } | null
  /** Where older API versions put it. */
  shipping_details?: ShippingDetails | null
}

interface StripeAddress {
  line1?: string | null
  line2?: string | null
  postal_code?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
}
interface ShippingDetails {
  name?: string | null
  address?: StripeAddress | null
}

export interface StripeLineItem {
  description: string | null
  quantity: number | null
  amount_total: number
  price?: { unit_amount: number | null } | null
}
