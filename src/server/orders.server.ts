import { timingSafeEqual } from 'node:crypto'
import { type NewOrder, ORDER_REF, type Order, type OrderEvent, type OrderUpdate } from './shop'

/**
 * Where orders are kept: Netlify Blobs (store `shop-orders`, strongly consistent) on Netlify, a store in memory
 * anywhere else (local dev, tests), so the shop can be tried end to end without an account. Keys:
 *   orders/<number>      the order (src/server/shop.ts `Order`)
 *   sessions/<session>   the order number of a checkout session: a webhook delivered twice makes one order
 */
export interface OrderStore {
  get<T>(key: string): Promise<T | null>
  /** Writes `value`; with `onlyIfNew`, only when the key is free. Whether it was written. */
  set(key: string, value: unknown, o?: { onlyIfNew?: boolean }): Promise<boolean>
  keys(prefix: string): Promise<string[]>
}

export function memoryStore(): OrderStore {
  const data = new Map<string, string>()
  return {
    async get<T>(key: string) {
      const raw = data.get(key)
      return raw === undefined ? null : (JSON.parse(raw) as T)
    },
    async set(key, value, o) {
      if (o?.onlyIfNew && data.has(key)) return false
      data.set(key, JSON.stringify(value))
      return true
    },
    async keys(prefix) {
      return [...data.keys()].filter((k) => k.startsWith(prefix))
    },
  }
}

let fallback: OrderStore | undefined
let warned = false

/** The orders' store of this environment. */
export async function orderStore(): Promise<OrderStore> {
  try {
    const { getStore } = await import('@netlify/blobs')
    const store = getStore({ name: 'shop-orders', consistency: 'strong' })
    // outside Netlify getStore succeeds and the first call fails: try one cheap call before trusting it
    await store.list({ prefix: 'orders/' })
    return {
      async get<T>(key: string) {
        return ((await store.get(key, { type: 'json' })) as T | null) ?? null
      },
      async set(key, value, o) {
        const r = await store.setJSON(key, value, o?.onlyIfNew ? { onlyIfNew: true } : {})
        return r.modified
      },
      async keys(prefix) {
        return (await store.list({ prefix })).blobs.map((b) => b.key)
      },
    }
  } catch (err) {
    if (!warned) {
      warned = true
      console.warn(
        '[shop] Netlify Blobs unavailable here; orders are kept in memory until the server stops.',
        err instanceof Error ? err.message : err,
      )
    }
    fallback ??= memoryStore()
    return fallback
  }
}

/** A fresh order page secret: 18 random bytes, URL-safe (24 characters). */
function newKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18))
  return Buffer.from(bytes).toString('base64url')
}

const NUMBER = /^orders\/([A-Z]+)-(\d+)$/

/**
 * Files a new order under the next free number of its prefix (<prefix>-1001 first), recording its checkout session
 * first so a second delivery of the same payment gets the first order back instead of a new one.
 */
export async function createOrder(
  store: OrderStore,
  prefix: string,
  session: string,
  order: NewOrder,
): Promise<Order> {
  const sessionKey = `sessions/${session}`
  const known = await store.get<{ number?: string }>(sessionKey)
  if (known?.number) {
    const existing = await store.get<Order>(`orders/${known.number}`)
    if (existing) return existing
  }
  const key = newKey()
  for (let attempt = 0; attempt < 8; attempt++) {
    const used = (await store.keys(`orders/${prefix}-`))
      .map((k) => NUMBER.exec(k))
      .filter((m) => m?.[1] === prefix)
      .map((m) => Number(m?.[2]))
    const number = `${prefix}-${Math.max(1000, ...used) + 1 + attempt}`
    const full: Order = { number, ...order, key }
    if (await store.set(`orders/${number}`, full, { onlyIfNew: true })) {
      await store.set(sessionKey, { number })
      return full
    }
  }
  throw new Error(`No free order number for ${prefix} after 8 tries`)
}

/** The order number a checkout session became, once its payment is recorded. */
export async function numberOfSession(store: OrderStore, session: string) {
  return (await store.get<{ number?: string }>(`sessions/${session}`))?.number ?? null
}

export const getOrder = (store: OrderStore, number: string) => store.get<Order>(`orders/${number}`)

/** The order of a customer's link (`orderRef`), or null when the number or its secret does not match. */
export async function orderOfRef(store: OrderStore, ref: string): Promise<Order | null> {
  const [, number, key] = ORDER_REF.exec(ref) ?? []
  if (!number || !key) return null
  const order = await getOrder(store, number)
  if (!order?.key) return null
  const a = Buffer.from(order.key)
  const b = Buffer.from(key)
  return a.length === b.length && timingSafeEqual(a, b) ? order : null
}

/** Every order, newest first. */
export async function listOrders(store: OrderStore): Promise<Order[]> {
  const orders = await Promise.all((await store.keys('orders/')).map((k) => store.get<Order>(k)))
  return orders
    .filter((o): o is Order => !!o)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** An order moved to another status by `by` (the panel user), with the change in its history. */
export function applyUpdate(
  order: Order,
  update: OrderUpdate,
  by: string,
  now = new Date(),
): Order {
  const event: OrderEvent = {
    status: update.status,
    at: now.toISOString(),
    by,
    ...(update.note && { note: update.note }),
    ...(update.tracking && { tracking: update.tracking }),
    emailed: update.email,
  }
  return {
    ...order,
    status: update.status,
    ...(update.tracking && { tracking: update.tracking }),
    history: [...order.history, event],
  }
}
