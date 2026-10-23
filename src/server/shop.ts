import { z } from 'zod'

/**
 * The shop's shapes shared by the server (src/server/*.server.ts), the cart (src/app/SiteCart.tsx) and the orders
 * panel (src/admin/orders): what a checkout asks for, and an order as it is stored and shown. No server code here.
 */

/** What the cart sends to open a payment: its lines, the zone it ships to, and the page to come back to. */
export const checkoutSchema = z.object({
  locale: z.string().regex(/^[a-z]{2}$/),
  lines: z
    .array(
      z.object({
        sku: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(30),
  zone: z.string().regex(/^[a-z][a-z0-9-]*$/),
  /** The page the payment started on (locale prefix included in previews): Stripe sends the buyer back there. */
  returnPath: z.string().regex(/^\/[a-z0-9/_-]*$/i),
})
export type CheckoutInput = z.infer<typeof checkoutSchema>

/** Where an order stands. Paid is set by the payment; every other status by us, in the orders panel. */
export const ORDER_STATUSES = [
  'paid',
  'preparing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface OrderLine {
  sku: string
  name: string
  /** Cents. */
  unitPrice: number
  quantity: number
  /** Cents. */
  total: number
}

export interface OrderAddress {
  line1: string
  line2?: string
  postalCode: string
  city: string
  state?: string
  /** ISO 3166-1 alpha-2. */
  country: string
}

export interface OrderEvent {
  status: OrderStatus
  /** ISO date and time. */
  at: string
  /** Who: "stripe", "demo" or the panel user's email. */
  by: string
  note?: string
  tracking?: string
  /** Whether the customer was emailed about it. */
  emailed: boolean
}

/** An order as stored (Netlify Blobs, store `shop-orders`, key `orders/<number>`). */
export interface Order {
  /** LMP-1001 */
  number: string
  /** ISO date and time of the payment. */
  createdAt: string
  /** The site it was bought on: its emails are in that language. */
  locale: string
  /** Made without payment, while Stripe is not set up (demo mode). */
  demo: boolean
  status: OrderStatus
  customer: { name: string; email: string; phone?: string }
  /** The name on the parcel (Stripe's shipping name), when it differs from the buyer's. */
  shipTo?: string
  address: OrderAddress
  zone: { id: string; label: string }
  lines: OrderLine[]
  /** Cents, as charged. */
  subtotal: number
  shipping: number
  total: number
  currency: 'eur'
  stripe?: { session: string; paymentIntent?: string; invoice?: string }
  /** The parcel's tracking link, once shipped. */
  tracking?: string
  history: OrderEvent[]
  /** The secret of the customer's own order page: its link (`orderRef`) is in every email they get. */
  key: string
}

/** An order before it is filed: its number and key are given then. */
export type NewOrder = Omit<Order, 'number' | 'key'>

/** What the customer's order link carries (`?order=<ref>` on any page of the site): its number and secret. */
export const orderRef = (o: Pick<Order, 'number' | 'key'>) => `${o.number}.${o.key}`

/** A customer's order link, as parsed: anything else is refused before the store is asked. */
export const ORDER_REF = /^([A-Z]{2,6}-\d+)\.([\w-]{20,64})$/

/**
 * What the customer's order page shows (the panel that the link in their emails opens): the order without our side
 * of it (who changed what, notes we did not email, Stripe ids), and the invoice and receipt Stripe made for it.
 */
export interface OrderView {
  number: string
  createdAt: string
  status: OrderStatus
  demo: boolean
  lines: OrderLine[]
  subtotal: number
  shipping: number
  total: number
  zone: string
  shipTo: string
  address: OrderAddress
  tracking?: string
  history: { status: OrderStatus; at: string; note?: string; tracking?: string }[]
  /** Stripe's invoice page and its PDF. */
  invoice?: { url: string; pdf?: string }
  /** Stripe's receipt of the payment. */
  receipt?: string
}

/** An order's line in the panel's list. */
export type OrderSummary = Pick<
  Order,
  'number' | 'createdAt' | 'status' | 'total' | 'demo' | 'locale'
> & { name: string; email: string; items: number }

export const summarize = (o: Order): OrderSummary => ({
  number: o.number,
  createdAt: o.createdAt,
  status: o.status,
  total: o.total,
  demo: o.demo,
  locale: o.locale,
  name: o.customer.name,
  email: o.customer.email,
  items: o.lines.reduce((n, l) => n + l.quantity, 0),
})

/** A change the panel makes to an order. */
export const orderUpdateSchema = z.object({
  number: z.string().regex(/^[A-Z]{2,6}-\d+$/),
  status: z.enum(ORDER_STATUSES),
  note: z.string().max(2000).optional(),
  tracking: z.string().url().max(500).optional(),
  /** Email the customer about it (the panel's "Email the customer" box). */
  email: z.boolean(),
})
export type OrderUpdate = z.infer<typeof orderUpdateSchema>
