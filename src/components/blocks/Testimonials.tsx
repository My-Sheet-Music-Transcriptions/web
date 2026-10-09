import { BlockShell, type HeadingProps } from '~/components/primitives/BlockShell'
import { Card } from '~/components/primitives/Card'
import type { Cta } from '~/components/primitives/CtaLink'
import { RevealItem } from '~/components/primitives/Motion'
import { Stars } from '~/components/primitives/Stars'
import type { Review, ReviewLabels } from '~/content/types'
import { fill } from '~/lib/strings'
import { useLocale } from '~/site'

export interface TestimonialsProps extends HeadingProps {
  title: string
  /** The reviews, verbatim: a list from content/<locale>/data/reviews. */
  items: Review[]
  /** Button under the cards ("Read all our reviews"). */
  cta?: Cta
  /** The words around each review (stars, "{role} from {country}"): `reviews` from content/<locale>/data/labels. */
  labels: ReviewLabels
}

/**
 * Customer quote cards in two columns with teal stars over the peach staff lines, and an optional link to
 * all reviews.
 */
export function Testimonials({ items, labels, ...shell }: TestimonialsProps) {
  return (
    <BlockShell
      {...shell}
      className="relative isolate overflow-hidden bg-staff-lines bg-cover bg-left-top"
      cascade
    >
      <ul className="grid items-start gap-[33px] md:grid-cols-2 md:gap-x-9 md:gap-y-[33px]">
        {items.map((r) => (
          <RevealItem as="li" key={r.name + r.quote.slice(0, 24)}>
            <ReviewCard review={r} labels={labels} />
          </RevealItem>
        ))}
      </ul>
    </BlockShell>
  )
}

function monthLabel(date: string, locale: string) {
  const [y, m] = date.split('-').map(Number)
  return new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, 1)).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** One review: name (linked to the original), stars, who and when, and the quote. */
export function ReviewCard({ review, labels }: { review: Review; labels: ReviewLabels }) {
  const locale = useLocale()
  const name = review.sourceUrl ? (
    <a href={review.sourceUrl} rel="noopener" className="hover:text-accent-deep hover:underline">
      {review.name}
    </a>
  ) : (
    review.name
  )
  const who =
    review.role && review.country
      ? fill(labels.roleFrom, { role: review.role, country: review.country })
      : (review.role ?? review.country ?? '')
  return (
    <Card as="article" padding="none" className="pb-10">
      <div className="p-px md:mx-[14px]">
        <header className="border-b border-[#e1e8ed] px-[15px] pt-[15px] pb-6 text-[#202020]">
          <p className="text-[20px] leading-[38px] font-semibold">{name}</p>
          <Stars
            rating={review.rating}
            label={fill(labels.stars, { rating: review.rating })}
            color="primary"
            size={22}
            className="h-[30px] gap-[5px]"
          />
          {who || review.date ? (
            <p className="text-body leading-8 md:text-[18px] md:leading-[44px]">
              {who}
              {who && review.date ? ' | ' : null}
              {review.date ? (
                <strong className="font-bold">{monthLabel(review.date, locale)}</strong>
              ) : null}
            </p>
          ) : null}
        </header>
        <blockquote className="px-[15px] pt-6 pb-[29.4px] text-body leading-[30.4px] text-[#202020]">
          {review.quote}
        </blockquote>
      </div>
    </Card>
  )
}
