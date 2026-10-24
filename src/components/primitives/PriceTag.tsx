import type { Price, PriceTone } from '~/content/types'
import { cn } from '~/lib/cn'

export interface PriceTagProps {
  /** The price: what it is from, per what. */
  price: Price
  /** The coloured header above the price (a tier's name, a level, an instrument). */
  title?: string
  /** The header's colour (teal by default). */
  tone?: PriceTone
  /** The price lines on cream (a priced sample) or on white (a pricing tier's card). */
  surface?: 'cream' | 'white'
  className?: string
}

/** The header's colours: teal is the site's primary, blue its lighter sky, navy the dark one. */
const headers: Record<PriceTone, string> = {
  teal: 'bg-primary',
  blue: 'bg-sky',
  navy: 'bg-navy',
}

/**
 * How a price is written everywhere on the site: a coloured header with its name, then "from", the price in
 * bold and its unit, with the note beside it when there is one. The pricing tiers and the priced samples
 * both open with it; nothing else sets a price.
 */
export function PriceTag({
  price,
  title,
  tone = 'teal',
  surface = 'white',
  className,
}: PriceTagProps) {
  return (
    <div className={cn('flex flex-col text-center text-ink', className)}>
      {title ? (
        <h3
          className={cn('rounded-t-card px-4 py-4 text-center text-h3 text-white', headers[tone])}
        >
          {title}
        </h3>
      ) : null}
      <div
        className={cn(
          'flex flex-col pt-4',
          surface === 'cream' && 'rounded-b-card bg-cream px-4 pb-4',
        )}
      >
        {price.fromLabel ? <p className="text-lead">{price.fromLabel}</p> : null}
        <p className="mt-2 text-figure font-bold">{price.from}</p>
        <p className="mt-2 text-lead">{price.unit}</p>
        {price.note && surface === 'cream' ? (
          <p className="mt-2 text-small text-muted italic">{price.note}</p>
        ) : null}
      </div>
    </div>
  )
}
