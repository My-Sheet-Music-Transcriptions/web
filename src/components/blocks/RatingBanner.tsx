import stats from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import { PhotoBand } from '~/components/primitives/PhotoBand'
import type { PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import type { Counter, RatingSource } from '~/content/types'
import { useTitleId } from '~/lib/use-title-id'
import { useLocale } from '~/site'

export interface RatingBannerProps {
  /** White heading over the photo. */
  title: string
  /** The big number under the heading: pass `counter` from content/<locale>/data/ratings. */
  counter?: Counter
  /** The rating cards: `homeRatings` or `platforms` from content/<locale>/data/ratings. */
  sources: RatingSource[]
  /** The photo behind the band (the piano by default). */
  image?: PictureSource
  /** Anchor id. */
  id?: string
}

/** The big trust moment: a photo band with the transcriptions counter and the rating cards. */
export function RatingBanner({ title, counter, sources, image = stats, id }: RatingBannerProps) {
  const titleId = useTitleId(id)
  const locale = useLocale()
  return (
    <PhotoBand image={image} title={title} titleId={titleId} id={id} preset="stats">
      {counter ? (
        <p className="mt-[60px]">
          <span className="block text-[69px] font-semibold leading-[69px]">
            {counter.value.toLocaleString(locale)}
          </span>
          <span className="block text-body leading-10 text-white md:text-[19px] md:leading-[47.5px]">
            {counter.label}
          </span>
        </p>
      ) : null}
      <ul className="mt-[60px] grid gap-5 md:grid-cols-3">
        {sources.map((r) => (
          <li key={r.id}>
            <RatingCard source={r} />
          </li>
        ))}
      </ul>
    </PhotoBand>
  )
}
