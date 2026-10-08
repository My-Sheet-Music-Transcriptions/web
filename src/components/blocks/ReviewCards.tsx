import { Button } from '~/components/primitives/Button'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { Stars } from '~/components/primitives/Stars'
import { homeReviews } from '~/content/en/data/reviews'
import type { Review } from '~/content/types'

export interface ReviewCardsProps {
  title?: string
  eyebrow?: string
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
  eyebrow = 'What musicians say',
  limit,
  ctaLabel = 'Read all our reviews',
  ctaHref = '/customer-reviews',
}: ReviewCardsProps) {
  const items = limit ? homeReviews.slice(0, limit) : homeReviews
  return (
    <section className="bg-surface py-section lg:py-section-lg" aria-labelledby="reviews-title">
      <div className="container-content">
        <SectionHeading id="reviews-title" eyebrow={eyebrow} rule="none">
          {title}
        </SectionHeading>
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:gap-6">
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
    <a href={review.sourceUrl} rel="noopener" className="hover:text-primary hover:underline">
      {review.name}
    </a>
  ) : (
    review.name
  )
  const initials = review.name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-white p-7 shadow-card lg:p-8">
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-primary-tint text-[15px] font-bold text-primary-deep"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-[17px] font-bold text-ink">{name}</p>
          <p className="mt-0.5 text-small text-muted">
            {review.role} from {review.country} · {monthLabel(review.date)}
          </p>
        </div>
        <Stars rating={review.rating} color="primary" size={16} className="ml-auto shrink-0" />
      </header>
      <blockquote className="mt-5 text-[15px] leading-[1.7] text-charcoal">
        {review.quote}
      </blockquote>
    </article>
  )
}
