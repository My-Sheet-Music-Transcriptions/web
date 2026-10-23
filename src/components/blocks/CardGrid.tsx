import { useState } from 'react'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { FeatureItem } from '~/components/primitives/FeatureItem'
import { RevealItem } from '~/components/primitives/Motion'
import type { PictureSource } from '~/components/primitives/Picture'
import { Tabs } from '~/components/primitives/Tabs'
import type { CardItem, MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { balanceColumns, gridCols } from '~/lib/grid'

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
  /** Cards per row from desktop up (two on tablets, one on phones; five fit plain items only; one, wide cards one under another). */
  columns?: 1 | 2 | 3 | 4 | 5
  /** card: white cards with a soft shadow (default). tile: peach rounded tiles. plain: no surface. overlay: each card's picture fills it, darkened, the words in white over it (the Catalan homepage). */
  variant?: 'card' | 'tile' | 'plain' | 'overlay'
  /** A full-bleed photo behind the cards: the photo band, its cards centred (`~/assets/images/bands/included-bg.jpg`). */
  image?: PictureSource
  /** The words of the play button: `media` from content/<locale>/data/labels (cards with a video). */
  labels?: MediaLabels
  /** The still shown over each video until it is played (`~/assets/images/brand/video-poster.jpg`). */
  videoPoster?: PictureSource
}

/**
 * A grid of cards, each an icon or picture with a title, a short text and an optional button. `variant`:
 * card (white), tile (peach, the audiences), plain or overlay (the words over the card's picture). With an `image`, white cards over that photo band.
 * `tabs`: the same cards in sets (currencies). A card can show a video instead of its picture.
 */
export function CardGrid({
  items = [],
  tabs,
  columns = 3,
  variant = 'card',
  image,
  labels,
  videoPoster,
  ...shell
}: CardGridProps) {
  const [tab, setTab] = useState(0)
  const shown = tabs ? (tabs[tab]?.items ?? []) : items
  // never a last row of one or two cards: 6 in 4 columns become 3, 4 in 3 become 4
  const cols = balanceColumns(columns, shown.length, columns > 4 ? columns : 4)
  return (
    <BlockShell
      {...shell}
      image={image}
      spacing={variant === 'tile' ? 'loose' : 'normal'}
      width={variant === 'tile' ? 'full' : 'content'}
      cascade
    >
      {tabs ? <Tabs tabs={tabs.map((t) => t.label)} active={tab} onChange={setTab} /> : null}
      <ul
        className={cn(
          gridCols(cols, { tablet: cols === 5 ? 3 : cols === 1 ? 1 : 2 }),
          variant === 'tile' ? 'gap-[30px]' : variant === 'overlay' ? 'gap-5' : 'gap-6',
        )}
      >
        {shown.map((item) => (
          <RevealItem as="li" key={item.title ?? item.video?.youtube ?? item.body} className="flex">
            <FeatureItem
              item={item}
              surface={variant}
              align={image ? 'center' : undefined}
              labels={labels}
              videoPoster={videoPoster}
            />
          </RevealItem>
        ))}
      </ul>
    </BlockShell>
  )
}
