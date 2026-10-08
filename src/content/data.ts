import type { Locale } from '~/i18n/types'
import type { RatingSource } from './types'

/**
 * The few data lists templates need (blocks get theirs from the page): the ratings of each locale, read from
 * content/<locale>/data/ratings.ts.
 */
const ratings = import.meta.glob<{ google?: RatingSource }>('/content/*/data/ratings.ts', {
  eager: true,
})

/** The Google rating of a locale (the compact card of page headers); undefined where there is none. */
export function googleRating(locale: Locale): RatingSource | undefined {
  return ratings[`/content/${locale}/data/ratings.ts`]?.google
}
