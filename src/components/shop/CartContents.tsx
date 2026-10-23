import { useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { Picture } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { fill } from '~/lib/strings'
import { formatPrice } from '~/shop/cart'
import { useLocale } from '~/site'
import type { CartState } from './CartProvider'
import { QuantityStepper } from './QuantityStepper'

/**
 * What the cart holds: a line per product (picture, name, price, quantity, remove), where it ships, the sums and the
 * button to pay, which opens Stripe's page. An empty cart leads to the shop.
 */
export function CartContents({ cart, onNavigate }: { cart: CartState; onNavigate?: () => void }) {
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'paying' | 'failed'>('idle')
  const { labels, priced } = cart
  const price = (cents: number) => formatPrice(cents, locale)

  if (!priced.lines.length)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
        <Icon name="bag" size={48} className="text-muted" />
        <p className="text-body text-ink">{labels.empty}</p>
        <Button asChild variant="outline">
          <SmartLink href={cart.shopHref} onClick={onNavigate}>
            {labels.browse}
          </SmartLink>
        </Button>
      </div>
    )

  return (
    <>
      <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
        {priced.lines.map(({ product, quantity, total }) => (
          <li key={product.sku} className="flex gap-4 py-4">
            <Picture
              image={product.image}
              alt=""
              sizes="72px"
              className="h-[72px] w-[72px] shrink-0 rounded-card bg-cream object-contain"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <SmartLink
                  href={product.path}
                  onClick={onNavigate}
                  className="text-small font-bold text-ink hover:text-accent-deep"
                >
                  {product.name}
                </SmartLink>
                <button
                  type="button"
                  className="-mt-1 -mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-black/5 hover:text-ink"
                  aria-label={fill(labels.remove, { name: product.name })}
                  onClick={() => cart.remove(product.sku)}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <QuantityStepper
                  value={quantity}
                  max={product.maxPerOrder}
                  min={0}
                  onChange={(q) => cart.setQuantity(product.sku, q)}
                  labels={labels}
                  name={product.name}
                />
                <span className="text-small font-bold text-ink">{price(total)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-line bg-cream/60 px-5 py-5">
        {cart.zones.length > 1 ? (
          <label className="mb-4 flex items-center justify-between gap-3 text-small text-ink">
            <span className="font-bold">{labels.shipTo}</span>
            <select
              className="rounded-field border border-line bg-white px-4 py-2 text-small text-ink"
              value={cart.zone?.id}
              onChange={(e) => cart.setZone(e.target.value)}
            >
              {cart.zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <dl className="grid grid-cols-[1fr_auto] gap-y-1.5 text-small text-ink">
          <dt>{labels.subtotal}</dt>
          <dd className="text-right">{price(priced.subtotal)}</dd>
          <dt>
            {labels.shipping}
            {cart.zone && cart.zones.length < 2 ? ` (${cart.zone.label})` : ''}
          </dt>
          <dd className="text-right">{priced.shipping ? price(priced.shipping) : labels.free}</dd>
          <dt className="mt-2 text-body font-bold">{labels.total}</dt>
          <dd className="mt-2 text-right text-body font-bold">{price(priced.total)}</dd>
        </dl>
        <Button
          size="block"
          className="mt-5"
          disabled={status === 'paying'}
          onClick={async () => {
            setStatus('paying')
            const result = await cart.checkout().catch(() => ({ error: 'network' }))
            if ('url' in result) window.location.assign(result.url)
            else setStatus('failed')
          }}
        >
          <Icon name="bag" size={18} />
          {status === 'paying' ? labels.paying : labels.pay}
        </Button>
        <p aria-live="polite" className="mt-3 text-center text-[13px] text-muted">
          {status === 'failed' ? (
            <span className="font-bold text-accent-deep">{labels.failed}</span>
          ) : (
            labels.secure
          )}
        </p>
      </div>
    </>
  )
}
