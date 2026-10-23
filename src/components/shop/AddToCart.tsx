import { type ReactNode, useEffect, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import type { ShopLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { fill } from '~/lib/strings'
import { formatPrice } from '~/shop/cart'
import type { Product } from '~/shop/catalogue'
import { useLocale } from '~/site'
import { useCart } from './CartProvider'
import { QuantityStepper } from './QuantityStepper'

/** A product's price, and the one before an offer struck through beside it with the offer's badge. */
export function ProductPrice({
  product,
  labels,
  size = 'lg',
}: {
  product: Product
  labels: ShopLabels
  size?: 'lg' | 'sm'
}) {
  const locale = useLocale()
  if (product.price === undefined) return null
  return (
    <p
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1',
        size === 'sm' && 'justify-center',
      )}
    >
      <span className={cn('font-bold text-ink', size === 'lg' ? 'text-[24px]' : 'text-body')}>
        {formatPrice(product.price, locale)}
      </span>
      {product.compareAt ? (
        <>
          <s className="text-small text-muted">
            <span className="sr-only">
              {fill(labels.was, { price: formatPrice(product.compareAt, locale) })}
            </span>
            <span aria-hidden="true">{formatPrice(product.compareAt, locale)}</span>
          </s>
          <span className="rounded-pill bg-peach px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wide text-accent-deep">
            {labels.offer}
          </span>
        </>
      ) : null}
    </p>
  )
}

/** The picture of the product the button belongs to, as the page shows it now: where a flight to the cart starts. */
function pictureNear(button: HTMLElement | null): HTMLImageElement | null {
  const scope = button?.closest('header, li, article')
  if (!scope) return null
  const shown = [...scope.querySelectorAll('img')].find((img) => {
    const r = img.getBoundingClientRect()
    return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0
  })
  return shown ?? null
}

export interface AddToCartProps {
  /** The product's code (`shop.sku` in its page.json). */
  sku: string
  /** full: the price, a quantity and the add button (a product page). compact: the price and a small add button, two cells of a card's grid (PictureGrid). */
  variant?: 'full' | 'compact'
  className?: string
}

/**
 * What a product offers a buyer: its price and an add-to-cart button that sends its picture flying to the cart, or
 * "coming soon", "sold out", or a link to the other shop that sells it. Inside the CartProvider (the app); renders
 * nothing outside one (Storybook, the CMS preview) or for a product without sale fields.
 */
export function AddToCart({ sku, variant = 'full', className }: AddToCartProps) {
  const cart = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  useEffect(() => {
    if (!added) return
    const t = window.setTimeout(() => setAdded(false), 1600)
    return () => window.clearTimeout(t)
  }, [added])
  const product = cart?.products.find((p) => p.sku === sku)
  if (!cart || !product) return null
  const { labels } = cart
  const compact = variant === 'compact'
  const inCart = cart.lines.find((l) => l.sku === sku)?.quantity ?? 0
  const room = product.maxPerOrder - inCart

  // on a card every action is the same full-width pill, its words wrapping onto a second line when long (and
  // without its icon on phones, where the column is narrow)
  const fit = compact && 'h-full w-full min-h-11 py-2 leading-tight text-balance'
  let action: ReactNode
  if (product.availability === 'external' && product.externalUrl)
    action = (
      <Button asChild variant="primary" size={compact ? 'sm' : 'md'} className={cn(fit)}>
        <a href={product.externalUrl} rel="noopener">
          {labels.buyElsewhere}
          <Icon name="external" size={16} className={cn(compact && 'max-md:hidden')} />
        </a>
      </Button>
    )
  else if (product.availability !== 'available')
    action = (
      <span
        className={cn(
          'rounded-pill bg-cream font-bold uppercase tracking-wide text-ink',
          compact
            ? 'flex h-full min-h-11 w-full items-center justify-center px-4 py-2 text-[13px] leading-tight'
            : 'inline-block px-4 py-2 text-small',
        )}
      >
        {product.availability === 'soldOut' ? labels.soldOut : labels.soon}
      </span>
    )
  else
    action = (
      <div className={cn('flex flex-wrap items-center gap-3', compact && 'w-full')}>
        {compact ? null : (
          <QuantityStepper
            value={Math.min(quantity, Math.max(room, 1))}
            max={Math.max(room, 1)}
            onChange={setQuantity}
            labels={labels}
            name={product.name}
          />
        )}
        <Button
          variant="accent"
          size={compact ? 'sm' : 'md'}
          disabled={room < 1}
          className={cn(fit)}
          aria-label={compact ? `${labels.add}: ${product.name}` : undefined}
          onClick={(e) => {
            cart.add(sku, compact ? 1 : Math.min(quantity, room), pictureNear(e.currentTarget))
            setAdded(true)
            setQuantity(1)
          }}
        >
          <Icon
            name={added ? 'check' : 'bag'}
            size={compact ? 14 : 18}
            className={cn(compact && 'max-md:hidden')}
          />
          <span aria-live="polite">{added ? labels.added : labels.add}</span>
        </Button>
      </div>
    )

  // on a card the price and the action are two cells of the card's grid (PictureGrid lines them up across the
  // row), the price's there even when empty
  if (compact)
    return (
      <>
        <div className={cn('self-end', className)}>
          <ProductPrice product={product} labels={labels} size="sm" />
        </div>
        {action}
      </>
    )
  return (
    <div className={cn('flex flex-col items-start gap-4', className)}>
      <ProductPrice product={product} labels={labels} />
      {action}
    </div>
  )
}
