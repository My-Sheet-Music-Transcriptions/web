import { Button } from '~/components/primitives/Button'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { Stars } from '~/components/primitives/Stars'
import { homeReviews } from '~/content/en/data/reviews'
import type { Review } from '~/content/types'

export interface ReviewCardsProps {
  title?: string
  /** Number of reviews shown (defaults to all in content/en/data/reviews.ts). */
  limit?: number
  ctaLabel?: string
  ctaHref?: string
}

function monthLabel(date: string) {
  const [y, m] = date.split('-').map(Number)
  return new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "Customer Reviews": two-column grid of quote cards with teal stars and a link to all reviews. */
export function ReviewCards({
  title = 'Customer Reviews',
  limit,
  ctaLabel = 'Read all our reviews',
  ctaHref = '/customer-reviews',
}: ReviewCardsProps) {
  const items = limit ? homeReviews.slice(0, limit) : homeReviews
  return (
    <section className="py-12" aria-labelledby="reviews-title">
      <div className="container-content">
        <SectionHeading id="reviews-title">{title}</SectionHeading>
        <ul className="mx-auto mt-10 grid max-w-[1130px] gap-8 md:grid-cols-2">
          {items.map((r) => (
            <li key={r.name + r.date}>
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <Button asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}

export function ReviewCard({ review }: { review: Review }) {
  const name = review.sourceUrl ? (
    <a href={review.sourceUrl} rel="noopener" className="hover:text-accent-deep hover:underline">
      {review.name}
    </a>
  ) : (
    review.name
  )
  const body = (
    <>
      <p className="text-[18px] font-bold text-[#222]">{name}</p>
      <Stars rating={review.rating} color="primary" size={18} className="mt-2" />
      <p className="mt-3 text-body text-ink">
        {review.role} from {review.country} |{' '}
        <strong className="font-bold">{monthLabel(review.date)}</strong>
      </p>
    </>
  )
  return (
    <article className="flex h-full flex-col rounded-card border border-[#e8e8e8] bg-white p-[30px]">
      <header className="border-b border-line pb-5">{body}</header>
      <blockquote className="pt-6 text-[15px] leading-[1.7] text-ink">{review.quote}</blockquote>
    </article>
  )
}
