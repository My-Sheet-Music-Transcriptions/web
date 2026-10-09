import { useState } from 'react'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { FeatureItem } from '~/components/primitives/FeatureItem'
import { RevealItem } from '~/components/primitives/Motion'
import type { PictureSource } from '~/components/primitives/Picture'
import type { CardItem } from '~/content/types'
import { cn } from '~/lib/cn'
import { gridCols } from '~/lib/grid'

/** One set of cards to switch to, e.g. the same services priced in another currency. */
export interface CardTab {
  label: string
  items: CardItem[]
}

export interface CardGridProps extends ShellProps {
  /** The cards: a list from content/<locale>/data (audiences, included) or written in the page. */
  items?: CardItem[]
  /** Instead of items: sets of cards behind buttons (one per currency, per audience…). */
  tabs?: CardTab[]
  /** Cards per row from desktop up (two on tablets, one on phones). */
  columns?: 2 | 3 | 4
  /** card: white cards with a soft shadow (default). tile: peach rounded tiles. plain: no surface. */
  variant?: 'card' | 'tile' | 'plain'
  /** A full-bleed photo behind the cards: the photo band, its cards centred (`~/assets/images/bands/included-bg.jpg`). */
  image?: PictureSource
}

/**
 * A grid of cards, each an icon or picture with a title, a short text and an optional button. `variant`:
 * card (white), tile (peach, the audiences) or plain. With an `image`, white cards over that photo band.
 * `tabs`: the same cards in sets (currencies).
 */
export function CardGrid({
  items = [],
  tabs,
  columns = 3,
  variant = 'card',
  image,
  ...shell
}: CardGridProps) {
  const [tab, setTab] = useState(0)
  const shown = tabs ? (tabs[tab]?.items ?? []) : items
  return (
    <BlockShell
      {...shell}
      image={image}
      spacing={variant === 'tile' ? 'loose' : 'normal'}
      width={variant === 'tile' ? 'full' : 'content'}
      cascade
    >
      {tabs ? (
        <RevealItem className="mb-8 flex justify-center gap-3">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              aria-pressed={i === tab}
              onClick={() => setTab(i)}
              className={cn(
                'min-w-14 rounded-pill border-2 border-primary px-5 py-2 font-bold',
                i === tab ? 'bg-primary text-white' : 'bg-white text-primary',
              )}
            >
              {t.label}
            </button>
          ))}
        </RevealItem>
      ) : null}
      <ul
        className={cn(
          gridCols(columns, { tablet: 2 }),
          variant === 'tile' ? 'gap-[30px]' : 'gap-6',
        )}
      >
        {shown.map((item) => (
          <RevealItem as="li" key={item.title ?? item.body} className="flex">
            <FeatureItem item={item} surface={variant} align={image ? 'center' : undefined} />
          </RevealItem>
        ))}
      </ul>
    </BlockShell>
  )
}
