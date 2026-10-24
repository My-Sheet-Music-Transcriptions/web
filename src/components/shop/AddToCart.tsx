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
  placeholder,
  className,
}: {
  product: Product
  labels: ShopLabels
  size?: 'lg' | 'sm'
  /** An empty cell where a product without a price would show one (a card keeps its rows); it takes no room. */
  placeholder?: boolean
  className?: string
}) {
  const locale = useLocale()
  if (product.price === undefined) return placeholder ? <p aria-hidden="true" /> : null
  return (
    <p
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1',
        size === 'sm' && 'justify-center',
        className,
      )}
    >
      <span className={cn('font-bold text-ink', size === 'lg' ? 'text-h2' : 'text-h3')}>
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
          <span className="rounded-pill bg-peach px-3 py-1 text-caption font-bold tracking-label uppercase text-accent-deep">
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

  // on a card every action is the same full-width pill with the button's own padding, its words wrapping in
  // balanced lines when long (without its icon on phones, where the column is narrow); the card's grid row
  // makes every pill of a row as tall as the tallest
  const fit = compact && 'mt-4 mb-14 w-full text-balance'
  let action: ReactNode
  if (product.availability === 'external' && product.externalUrl)
    action = (
      <Button asChild variant="secondary" className={cn(fit)}>
        <a href={product.externalUrl} rel="noopener">
          {/* the icon stays glued to the last word (a non-breaking space), so wrapped words centre as a block */}
          <span>
            {labels.buyElsewhere}
            {'\u00a0'}
            <Icon name="external" size={compact ? 15 : 18} className="inline-block align-middle" />
          </span>
        </a>
      </Button>
    )
  else if (product.availability !== 'available')
    action = (
      <span
        className={cn(
          'label-caps rounded-pill bg-cream text-ink',
          compact
            ? 'mt-4 mb-14 flex min-h-11 w-full items-center justify-center px-6 py-3'
            : 'inline-flex min-h-11 items-center px-6 py-3',
        )}
      >
        {product.availability === 'soldOut' ? labels.soldOut : labels.soon}
      </span>
    )
  else {
    const button = (
      <Button
        size={compact ? 'md' : 'lg'}
        disabled={room < 1}
        className={cn(fit, !compact && 'max-md:grow')}
        aria-label={compact ? `${labels.add}: ${product.name}` : undefined}
        onClick={(e) => {
          cart.add(sku, compact ? 1 : Math.min(quantity, room), pictureNear(e.currentTarget))
          setAdded(true)
          setQuantity(1)
        }}
      >
        <Icon name={added ? 'check' : 'bag'} size={18} className={cn(compact && 'max-md:hidden')} />
        <span aria-live="polite">{added ? labels.added : labels.add}</span>
      </Button>
    )
    // the card's button is its grid cell on its own; a product page puts the quantity beside it
    action = compact ? (
      button
    ) : (
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={Math.min(quantity, Math.max(room, 1))}
          max={Math.max(room, 1)}
          onChange={setQuantity}
          labels={labels}
          name={product.name}
        />
        {button}
      </div>
    )
  }

  // on a card the price and the action are two rows of the card's grid (PictureGrid shares them across the
  // row: a row with no price has no price line), the price's cell there even when empty
  if (compact)
    return (
      <>
        <ProductPrice
          product={product}
          labels={labels}
          size="sm"
          placeholder
          className="mt-4 self-end"
        />
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
