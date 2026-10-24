import { BlockShell, type HeadingProps } from '~/components/primitives/BlockShell'
import { RevealItem, Ticker } from '~/components/primitives/Motion'
import type { PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import type { Counter, RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'
import { inlineMarkdown } from '~/lib/light-markdown'
import { useLocale } from '~/site'

export interface RatingBannerProps extends HeadingProps {
  /** White heading over the photo. */
  title: string
  /** The big number under the heading, or two side by side: pass `counter` (or `counters`) from content/<locale>/data/ratings. */
  counter?: Counter | Counter[]
  /** The rating cards: `homeRatings` or `platforms` from content/<locale>/data/ratings. */
  sources: RatingSource[]
  /** The photo behind the band (`~/assets/images/bands/stats-bg.jpg` is the piano every page uses). */
  image: PictureSource
  /** A line under the cards, in white (where the reviews come from); **bold** and [links](/path) kept. */
  note?: string
}

/**
 * The big trust moment: a full-bleed photo with white wavy edges, a white heading, the transcriptions counter
 * and a row of rating cards (Google, Trustpilot or customers, Facebook). With `reveal` the counter ticks up like
 * an odometer and the stars pop in.
 */
export function RatingBanner({ counter, sources, note, ...shell }: RatingBannerProps) {
  const locale = useLocale()
  const counters = counter ? (Array.isArray(counter) ? counter : [counter]) : []
  return (
    <BlockShell {...shell} cascade>
      {counters.length ? (
        <div className={cn('mb-heading-gap grid gap-8', counters.length > 1 && 'md:grid-cols-2')}>
          {counters.map((c) => (
            <RevealItem as="p" key={c.label} className="text-center">
              <Ticker className="block text-figure-lg font-semibold">
                {c.value.toLocaleString(locale)}
              </Ticker>
              <span className="mt-3 block text-lead text-white">{c.label}</span>
            </RevealItem>
          ))}
        </div>
      ) : null}
      <ul className="grid gap-grid-gap md:grid-cols-3">
        {sources.map((r) => (
          <RevealItem as="li" key={r.id}>
            <RatingCard source={r} />
          </RevealItem>
        ))}
      </ul>
      {note ? (
        <RevealItem
          as="p"
          className="mx-auto mt-heading-gap max-w-prose text-center text-body text-white"
        >
          {inlineMarkdown(note)}
        </RevealItem>
      ) : null}
    </BlockShell>
  )
}
