import { useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { Picture } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { fill } from '~/lib/strings'
import type { CheckoutAnswer, CheckoutCustomer } from '~/server/shop'
import { formatPrice } from '~/shop/cart'
import { useLocale } from '~/site'
import type { CartState } from './CartProvider'
import { CheckoutDetails, type CustomerForm, emptyCustomer } from './CheckoutDetails'
import { CheckoutPayment } from './CheckoutPayment'
import { QuantityStepper } from './QuantityStepper'

type Payment = Exclude<CheckoutAnswer, { demo: true }>
type Step =
  | { at: 'cart' }
  | { at: 'details'; status: 'idle' | 'submitting' | 'failed' }
  | { at: 'payment'; payment: Payment; customer: CheckoutCustomer }

export interface CartContentsProps {
  cart: CartState
  onNavigate?: () => void
  /** A checkout is paid (or, in demo mode, recorded): `session` is what the order is filed under. */
  onPaid: (session: string) => void
}

/**
 * The cart's panel, in three steps that never leave it: what the cart holds (a line per product with picture, name,
 * price, quantity and remove; where it ships; the sums) and the button to pay, then the buyer's details, then the
 * payment itself (Stripe's element). An empty cart leads to the shop.
 */
export function CartContents({ cart, onNavigate, onPaid }: CartContentsProps) {
  const locale = useLocale()
  const [step, setStep] = useState<Step>({ at: 'cart' })
  const [form, setForm] = useState<CustomerForm>(() => emptyCustomer(cart.zone?.countries[0]))
  const { labels, priced } = cart
  const price = (cents: number) => formatPrice(cents, locale)

  if (step.at === 'details' && cart.zone)
    return (
      <CheckoutDetails
        labels={labels}
        zone={cart.zone}
        value={form}
        onChange={setForm}
        onBack={() => setStep({ at: 'cart' })}
        status={step.status}
        onSubmit={async (customer) => {
          setStep({ at: 'details', status: 'submitting' })
          const result = await cart.checkout(customer).catch(() => ({ error: 'network' }))
          if ('error' in result) setStep({ at: 'details', status: 'failed' })
          else if ('demo' in result) onPaid(result.session)
          else setStep({ at: 'payment', payment: result, customer })
        }}
      />
    )
  if (step.at === 'payment')
    return (
      <CheckoutPayment
        labels={labels}
        payment={step.payment}
        customer={step.customer}
        onPaid={onPaid}
        onBack={() => setStep({ at: 'details', status: 'idle' })}
      />
    )

  if (!priced.lines.length)
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-12 text-center">
        <Icon name="bag" size={48} className="text-muted" />
        <p className="text-body text-ink">{labels.empty}</p>
        <Button asChild variant="secondary">
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
              className="size-18 shrink-0 rounded-card bg-cream object-contain"
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
              className="min-h-11 rounded-card border border-line bg-white px-4 py-2 text-small text-ink"
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
        <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-small text-ink">
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
          size="lg"
          className="mt-5 w-full"
          onClick={() => {
            // the country menu follows the zone the buyer picked
            if (cart.zone && !cart.zone.countries.includes(form.country))
              setForm({ ...form, country: cart.zone.countries[0] ?? '' })
            setStep({ at: 'details', status: 'idle' })
          }}
        >
          <Icon name="bag" size={18} />
          {labels.pay}
        </Button>
        <p className="mt-3 text-center text-small text-muted">{labels.secure}</p>
      </div>
    </>
  )
}
