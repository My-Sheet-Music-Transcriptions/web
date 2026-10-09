import { BlockShell, type HeadingProps } from '~/components/primitives/BlockShell'
import { RevealItem, Ticker } from '~/components/primitives/Motion'
import type { PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import type { Counter, RatingSource } from '~/content/types'
import { useLocale } from '~/site'

export interface RatingBannerProps extends HeadingProps {
  /** White heading over the photo. */
  title: string
  /** The big number under the heading: pass `counter` from content/<locale>/data/ratings. */
  counter?: Counter
  /** The rating cards: `homeRatings` or `platforms` from content/<locale>/data/ratings. */
  sources: RatingSource[]
  /** The photo behind the band (`~/assets/images/bands/stats-bg.jpg` is the piano every page uses). */
  image: PictureSource
}

/**
 * The big trust moment: a full-bleed photo with white wavy edges, a white heading, the transcriptions counter
 * and a row of rating cards (Google, Trustpilot or customers, Facebook). With `reveal` the counter ticks up like
 * an odometer and the stars pop in.
 */
export function RatingBanner({ counter, sources, ...shell }: RatingBannerProps) {
  const locale = useLocale()
  return (
    <BlockShell {...shell} cascade>
      {counter ? (
        <RevealItem as="p" className="mb-10 text-center">
          <Ticker className="block text-[69px] font-semibold leading-[69px]">
            {counter.value.toLocaleString(locale)}
          </Ticker>
          <span className="block text-body leading-10 text-white md:text-[19px] md:leading-[47.5px]">
            {counter.label}
          </span>
        </RevealItem>
      ) : null}
      <ul className="grid gap-5 md:grid-cols-3">
        {sources.map((r) => (
          <RevealItem as="li" key={r.id}>
            <RatingCard source={r} />
          </RevealItem>
        ))}
      </ul>
    </BlockShell>
  )
}
