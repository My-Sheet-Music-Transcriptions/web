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

const headers: Record<PriceTone, string> = {
  teal: 'bg-teal-light',
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
          data-live-colour=""
          className={cn(
            'rounded-t-card py-[22px] text-center text-[26px] font-bold leading-[26px] text-white',
            headers[tone],
          )}
        >
          {title}
        </h3>
      ) : null}
      <div
        className={cn(
          'flex flex-col pt-[5px]',
          surface === 'cream' && 'rounded-b-card bg-cream px-4 pb-4',
        )}
      >
        {price.fromLabel ? <p className="text-[18px] leading-9">{price.fromLabel}</p> : null}
        <p className="mt-1 text-price font-bold leading-[46px]">{price.from}</p>
        <p className="-mt-0.5 text-[18px] leading-9">{price.unit}</p>
        {price.note && surface === 'cream' ? (
          <p className="mt-1 text-small italic">{price.note}</p>
        ) : null}
      </div>
    </div>
  )
}
