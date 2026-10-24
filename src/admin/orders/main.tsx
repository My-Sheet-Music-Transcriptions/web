import '~/styles/app.css'
import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
  type OrderSummary,
  type OrderUpdate,
} from '~/server/shop'
import { formatPrice } from '~/shop/cart'

/**
 * The shop's orders panel (/admin/orders): every order, newest first, and each one in full with its status buttons.
 * A change is saved through /api/shop/orders and, unless unticked, emails the customer in their language. Sign-in is
 * the CMS's Netlify Identity login; the server lets in users with the `shop` or `admin` role or listed in
 * SHOP_ADMIN_EMAILS. Staff-facing, in English, like the CMS.
 */

interface IdentityUser {
  email: string
  jwt: () => Promise<string>
}
interface Identity {
  currentUser: () => IdentityUser | null
  open: (tab?: 'login') => void
  logout: () => void
  on: (event: 'init' | 'login' | 'logout', cb: (user?: IdentityUser | null) => void) => void
  close: () => void
}
declare global {
  interface Window {
    netlifyIdentity?: Identity
  }
}

// The login's state, followed from the start: the widget may finish signing in before React's first effect runs.
const session = { ready: !window.netlifyIdentity, user: null as IdentityUser | null }
const subscribers = new Set<() => void>()
const publish = (user: IdentityUser | null) => {
  session.ready = true
  session.user = user
  for (const s of subscribers) s()
}
window.netlifyIdentity?.on('init', (u) => publish(u ?? null))
window.netlifyIdentity?.on('login', (u) => {
  publish(u ?? null)
  window.netlifyIdentity?.close()
})
window.netlifyIdentity?.on('logout', () => publish(null))

function useIdentity() {
  const [, rerender] = useState(0)
  useEffect(() => {
    const s = () => rerender((n) => n + 1)
    subscribers.add(s)
    return () => {
      subscribers.delete(s)
    }
  }, [])
  return session
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  paid: 'bg-accent-deep text-white',
  preparing: 'bg-peach text-ink',
  shipped: 'bg-primary text-white',
  delivered: 'bg-primary-deep text-white',
  cancelled: 'bg-line text-ink',
  refunded: 'bg-line text-ink',
}
const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: 'Paid · new',
  preparing: 'Preparing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

const price = (cents: number) => formatPrice(cents, 'en-GB')
const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const user = window.netlifyIdentity?.currentUser()
  const token = user ? await user.jwt() : null
  const res = await fetch(path, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(token && { authorization: `Bearer ${token}` }),
      ...init.headers,
    },
  })
  const body = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(body.error ?? `The server answered ${res.status}`)
  return body
}

function Status({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-pill px-3 py-1 text-caption font-bold whitespace-nowrap ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

function OrderView({ number, onChanged }: { number: string; onChanged: () => void }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState<OrderStatus>('preparing')
  const [note, setNote] = useState('')
  const [tracking, setTracking] = useState('')
  const [email, setEmail] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setOrder(null)
    setMessage('')
    api<{ order: Order; link: string }>(`/api/shop/orders?number=${encodeURIComponent(number)}`)
      .then(({ order, link }) => {
        setOrder(order)
        setLink(link)
        const next = ORDER_STATUSES[ORDER_STATUSES.indexOf(order.status) + 1]
        setStatus(next && next !== 'cancelled' ? next : order.status)
        setTracking(order.tracking ?? '')
      })
      .catch((e: Error) => setError(e.message))
  }, [number])

  if (error) return <p className="p-6 font-bold text-accent-deep">{error}</p>
  if (!order) return <p className="p-6 text-muted">Loading {number}…</p>
  const a = order.address
  const address = [
    order.shipTo ?? order.customer.name,
    a.line1,
    a.line2,
    `${a.postalCode} ${a.city}`,
    a.state,
    a.country,
  ]
    .filter(Boolean)
    .join('\n')

  const save = async () => {
    const update: OrderUpdate = {
      number: order.number,
      status,
      email,
      ...(note.trim() && { note: note.trim() }),
      ...(status === 'shipped' && tracking.trim() && { tracking: tracking.trim() }),
    }
    const what = `${order.number} → ${STATUS_LABEL[status]}${email ? `, emailing ${order.customer.email}` : ', without an email'}`
    if (!window.confirm(`Save ${what}?`)) return
    setSaving(true)
    try {
      const r = await api<{ order: Order; warning?: string }>('/api/shop/orders', {
        method: 'POST',
        body: JSON.stringify(update),
      })
      setOrder(r.order)
      setNote('')
      setMessage(r.warning ?? `Saved${email ? ' and emailed' : ''}.`)
      onChanged()
    } catch (e) {
      setMessage((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <article className="flex flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center gap-3">
        <h2 className="text-h2 font-bold text-ink">{order.number}</h2>
        <Status status={order.status} />
        {order.demo ? (
          <span className="rounded-pill bg-star px-3 py-1 text-caption font-bold">DEMO</span>
        ) : null}
        <span className="text-small text-muted">
          {when(order.createdAt)} · {order.locale.toUpperCase()} site
        </span>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-card bg-white p-5 shadow-card">
          <h3 className="mb-2 text-h4 font-bold text-ink">Customer</h3>
          <p className="text-small text-ink">{order.customer.name}</p>
          <p className="text-small">
            <a className="text-primary underline" href={`mailto:${order.customer.email}`}>
              {order.customer.email}
            </a>
          </p>
          {order.customer.phone ? (
            <p className="text-small">
              <a className="text-primary underline" href={`tel:${order.customer.phone}`}>
                {order.customer.phone}
              </a>
            </p>
          ) : null}
          <p className="mt-3 text-small">
            <a
              className="text-primary underline"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Their order page
            </a>{' '}
            <span className="text-muted">(the link in every email we send them)</span>
          </p>
        </div>
        <div className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-h4 font-bold text-ink">Ship to · {order.zone.label}</h3>
            <button
              type="button"
              className="text-small font-bold text-primary"
              onClick={() => navigator.clipboard?.writeText(address)}
            >
              Copy
            </button>
          </div>
          <p className="text-small whitespace-pre-line text-ink">{address}</p>
        </div>
      </section>

      <section className="rounded-card bg-white p-5 shadow-card">
        <table className="w-full text-small text-ink">
          <thead>
            <tr className="text-left text-muted">
              <th className="pb-2 font-normal">Product</th>
              <th className="pb-2 text-right font-normal">Qty</th>
              <th className="pb-2 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l) => (
              <tr key={l.sku} className="border-t border-line">
                <td className="py-2">
                  {l.name} <span className="text-muted">({l.sku})</span>
                </td>
                <td className="py-2 text-right">{l.quantity}</td>
                <td className="py-2 text-right">{price(l.total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line">
              <td className="pt-2" colSpan={2}>
                Shipping
              </td>
              <td className="pt-2 text-right">{price(order.shipping)}</td>
            </tr>
            <tr>
              <td className="pt-1 font-bold" colSpan={2}>
                Total paid
              </td>
              <td className="pt-1 text-right font-bold">{price(order.total)}</td>
            </tr>
          </tfoot>
        </table>
        {order.stripe?.paymentIntent ? (
          <a
            className="mt-3 inline-block text-small font-bold text-primary underline"
            href={`https://dashboard.stripe.com/payments/${order.stripe.paymentIntent}`}
            target="_blank"
            rel="noopener"
          >
            The payment in Stripe (refunds, invoice)
          </a>
        ) : null}
      </section>

      <section className="rounded-card bg-white p-5 shadow-card">
        <h3 className="mb-3 text-h4 font-bold text-ink">Move it on</h3>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={`rounded-pill border px-4 py-2 text-small font-bold ${status === s ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink'}`}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        {status === 'shipped' ? (
          <label className="mt-4 block text-small text-ink">
            Tracking link (optional)
            <input
              type="url"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="https://…"
              className="mt-1 block w-full rounded-card border border-line px-4 py-2"
            />
          </label>
        ) : null}
        <label className="mt-4 block text-small text-ink">
          Note for the customer (optional, added to the email)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="mt-1 block w-full rounded-card border border-line px-4 py-2"
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-small text-ink">
          <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} />
          Email the customer ({order.customer.email})
        </label>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="rounded-pill bg-navy px-6 py-3 text-small font-bold text-white uppercase disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <span aria-live="polite" className="text-small text-ink">
            {message}
          </span>
        </div>
      </section>

      <section>
        <h3 className="mb-2 text-h4 font-bold text-ink">History</h3>
        <ol className="flex flex-col gap-2">
          {[...order.history].reverse().map((e) => (
            <li key={`${e.at}${e.status}`} className="text-small text-ink">
              <Status status={e.status} /> {when(e.at)} by {e.by}
              {e.emailed ? ' · emailed' : ''}
              {e.tracking ? ` · ${e.tracking}` : ''}
              {e.note ? <span className="block pl-2 text-muted">“{e.note}”</span> : null}
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}

function Orders() {
  const { user, ready } = useIdentity()
  const [orders, setOrders] = useState<OrderSummary[] | null>(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<OrderStatus | 'all' | 'open'>('open')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(() =>
    new URLSearchParams(window.location.search).get('order'),
  )
  const local = ['localhost', '127.0.0.1'].includes(window.location.hostname)

  const load = useCallback(() => {
    api<{ orders: OrderSummary[] }>('/api/shop/orders')
      .then((r) => {
        setOrders(r.orders)
        setError('')
      })
      .catch((e: Error) => setError(e.message))
  }, [])
  useEffect(() => {
    if (ready && (user || local)) load()
  }, [ready, user, local, load])

  const pick = (number: string) => {
    setSelected(number)
    const url = new URL(window.location.href)
    url.searchParams.set('order', number)
    window.history.replaceState(null, '', url)
  }

  if (!ready) return null
  if (!user && !local)
    return (
      <main className="mx-auto flex min-h-screen max-w-narrow flex-col items-center justify-center gap-6 p-6 text-center">
        <h1 className="text-h2 font-bold text-ink">Orders</h1>
        <p className="text-body text-ink">
          Sign in with your content manager account to see the shop’s orders.
        </p>
        <button
          type="button"
          className="rounded-pill bg-navy px-6 py-3 text-small font-bold text-white uppercase"
          onClick={() => window.netlifyIdentity?.open('login')}
        >
          Sign in
        </button>
      </main>
    )

  const q = search.trim().toLowerCase()
  const shown = (orders ?? []).filter(
    (o) =>
      (filter === 'all' ||
        (filter === 'open'
          ? o.status === 'paid' || o.status === 'preparing'
          : o.status === filter)) &&
      (!q || `${o.number} ${o.name} ${o.email}`.toLowerCase().includes(q)),
  )
  const count = (s: OrderStatus) => (orders ?? []).filter((o) => o.status === s).length

  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-navy px-6 py-4 text-white">
        <h1 className="text-h3 font-bold text-white">
          Orders <span className="font-normal opacity-80">· {count('paid')} new</span>
        </h1>
        <div className="flex items-center gap-4 text-small">
          <a href="/admin/" className="underline">
            Content manager
          </a>
          {user ? (
            <button
              type="button"
              className="underline"
              onClick={() => window.netlifyIdentity?.logout()}
            >
              Sign out {user.email}
            </button>
          ) : null}
        </div>
      </header>
      <div className="grid lg:grid-cols-[420px_1fr]">
        <aside className="border-r border-line bg-white lg:min-h-svh">
          <div className="flex flex-col gap-3 border-b border-line p-4">
            <input
              type="search"
              placeholder="Search number, name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-card border border-line px-4 py-2 text-small"
            />
            <div className="flex flex-wrap gap-2">
              {(['open', 'all', ...ORDER_STATUSES] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`rounded-pill px-3 py-1 text-caption font-bold ${filter === f ? 'bg-navy text-white' : 'bg-cream text-ink'}`}
                >
                  {f === 'open' ? 'To do' : f === 'all' ? 'All' : STATUS_LABEL[f]}
                </button>
              ))}
            </div>
          </div>
          {error ? <p className="p-4 text-small font-bold text-accent-deep">{error}</p> : null}
          {orders === null && !error ? <p className="p-4 text-small text-muted">Loading…</p> : null}
          {orders && !shown.length ? (
            <p className="p-4 text-small text-muted">No orders here.</p>
          ) : null}
          <ul>
            {shown.map((o) => (
              <li key={o.number}>
                <button
                  type="button"
                  onClick={() => pick(o.number)}
                  className={`flex w-full flex-col gap-1 border-b border-line px-4 py-3 text-left hover:bg-cream/60 ${selected === o.number ? 'bg-cream' : ''}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-small font-bold text-ink">
                      {o.number}
                      {o.demo ? <span className="ml-2 text-caption text-muted">DEMO</span> : null}
                    </span>
                    <Status status={o.status} />
                  </span>
                  <span className="flex justify-between gap-2 text-small text-muted">
                    <span className="truncate">
                      {o.name} · {o.items} item{o.items === 1 ? '' : 's'}
                    </span>
                    <span>{price(o.total)}</span>
                  </span>
                  <span className="text-caption text-muted">{when(o.createdAt)}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main>
          {selected ? (
            <OrderView number={selected} onChanged={load} />
          ) : (
            <p className="p-6 text-muted">Pick an order on the left.</p>
          )}
        </main>
      </div>
    </div>
  )
}

const root = document.getElementById('orders')
if (root)
  createRoot(root).render(
    <StrictMode>
      <Orders />
    </StrictMode>,
  )
