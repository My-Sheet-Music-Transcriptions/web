import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import type { ShopLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { fill } from '~/lib/strings'
import type { OrderStatus, OrderView } from '~/server/shop'
import { formatPrice } from '~/shop/cart'
import { useLocale } from '~/site'

/** The road of an order that goes well; a cancelled or refunded one shows the statuses it went through instead. */
const ROAD: OrderStatus[] = ['paid', 'preparing', 'shipped', 'delivered']

/** "correos.es" from a tracking link: the carrier the customer will land on. */
const carrierOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * A customer's order as the link in their emails shows it, in the cart's panel: where it stands (each step with its
 * date), the carrier's tracking page, Stripe's invoice and receipt, what they bought and where it goes.
 */
export function OrderDetails({ order, labels }: { order: OrderView; labels: ShopLabels }) {
  const locale = useLocale()
  const price = (cents: number) => formatPrice(cents, locale)
  const date = (iso: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso))
  const reached = (s: OrderStatus) => [...order.history].reverse().find((e) => e.status === s)
  const off = order.status === 'cancelled' || order.status === 'refunded'
  const steps = off ? [...new Set(order.history.map((e) => e.status))] : ROAD
  const at = steps.indexOf(order.status)
  const notes = order.history.filter((e) => e.note)
  const a = order.address

  return (
    <div className="flex flex-col gap-6 px-5 py-5">
      <div>
        <p className="text-h3 text-ink">{fill(labels.order, { number: order.number })}</p>
        <p className="text-small text-muted">
          {fill(labels.placed, { date: date(order.createdAt) })}
        </p>
      </div>

      <section aria-label={labels.progress}>
        <ol className="flex flex-col">
          {steps.map((s, i) => {
            const done = i <= at
            const when = reached(s)
            return (
              <li key={s} className="relative flex gap-3 pb-4 last:pb-0">
                {i < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute top-7 bottom-0 left-3 w-px',
                      i < at ? 'bg-primary' : 'bg-line',
                    )}
                  />
                ) : null}
                <span
                  className={cn(
                    'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2',
                    done ? 'border-primary bg-primary text-white' : 'border-line bg-white',
                  )}
                >
                  {done ? <Icon name="check" size={14} /> : null}
                </span>
                <span className="flex flex-col pt-1">
                  <span className={cn('text-small font-bold', done ? 'text-ink' : 'text-muted')}>
                    {labels.statuses[s]}
                  </span>
                  {done && when ? (
                    <span className="text-caption text-muted">{date(when.at)}</span>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ol>
      </section>

      {order.tracking || order.invoice || order.receipt ? (
        <div className="flex flex-col gap-2">
          {order.tracking ? (
            <Button asChild className="w-full">
              <a href={order.tracking} target="_blank" rel="noopener noreferrer">
                {fill(labels.track, { carrier: carrierOf(order.tracking) })}
                <Icon name="external" size={16} />
              </a>
            </Button>
          ) : null}
          {order.invoice ? (
            <Button asChild variant="secondary" className="w-full">
              <a
                href={order.invoice.pdf ?? order.invoice.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {labels.invoice}
                <Icon name="external" size={16} />
              </a>
            </Button>
          ) : null}
          {order.receipt ? (
            <Button asChild variant="secondary" className="w-full">
              <a href={order.receipt} target="_blank" rel="noopener noreferrer">
                {labels.receipt}
                <Icon name="external" size={16} />
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}

      {notes.length ? (
        <ul className="flex flex-col gap-2">
          {notes.map((e) => (
            <li key={e.at} className="rounded-card bg-cream px-4 py-3 text-small text-ink">
              {e.note}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="border-t border-line pt-4">
        <ul className="flex flex-col gap-1 text-small text-ink">
          {order.lines.map((l) => (
            <li key={l.sku || l.name} className="flex justify-between gap-3">
              <span>
                {l.quantity} × {l.name}
              </span>
              <span>{price(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 grid grid-cols-[1fr_auto] gap-y-1 text-small text-ink">
          <dt>{labels.subtotal}</dt>
          <dd className="text-right">{price(order.subtotal)}</dd>
          <dt>
            {labels.shipping} ({order.zone})
          </dt>
          <dd className="text-right">{order.shipping ? price(order.shipping) : labels.free}</dd>
          <dt className="font-bold">{labels.total}</dt>
          <dd className="text-right font-bold">{price(order.total)}</dd>
        </dl>
      </div>

      <div className="text-small text-ink">
        <p className="font-bold">{labels.deliverTo}</p>
        <p className="whitespace-pre-line">
          {[order.shipTo, a.line1, a.line2, `${a.postalCode} ${a.city}`, a.state, a.country]
            .filter(Boolean)
            .join('\n')}
        </p>
      </div>

      <p className="text-caption text-muted">{order.demo ? labels.demo : labels.privateLink}</p>
    </div>
  )
}
