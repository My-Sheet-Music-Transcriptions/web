import { homeReviews } from '@content/en/data/reviews'
import { Reveal } from '~/components/motion/Reveal'
import { Icon } from '~/components/primitives/Icon'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { Stars } from '~/components/primitives/Stars'
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

/** "Customer reviews": quotes in two columns, each under a hairline with teal stars and the reviewer below. */
export function ReviewCards({
  title = 'Customer reviews',
  eyebrow = 'What musicians say',
  limit,
  ctaLabel = 'Read all our reviews',
  ctaHref = '/customer-reviews',
}: ReviewCardsProps) {
  const items = limit ? homeReviews.slice(0, limit) : homeReviews
  return (
    <section className="py-section lg:py-section-lg" aria-labelledby="reviews-title">
      <div className="container-content">
        <SectionHeading id="reviews-title" eyebrow={eyebrow}>
          {title}
        </SectionHeading>
        <ul className="mt-10 grid md:grid-cols-2 md:gap-x-14 lg:mt-14">
          {items.map((r, i) => (
            <Reveal as="li" key={r.name + r.date} delay={(i % 2) * 0.06}>
              <ReviewCard review={r} />
            </Reveal>
          ))}
        </ul>
        <SmartLink
          href={ctaHref}
          className="group mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:underline"
        >
          {ctaLabel}
          <Icon
            name="arrow-right"
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </SmartLink>
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
  return (
    <article className="flex h-full flex-col gap-3.5 border-t border-line pb-9 pt-7">
      <Stars rating={review.rating} color="primary" size={16} />
      <blockquote className="text-[17px] leading-[1.65] text-ink">{review.quote}</blockquote>
      <p className="text-small text-muted">
        <span className="font-bold text-ink">{name}</span> · {review.role} from {review.country} ·{' '}
        {monthLabel(review.date)}
      </p>
    </article>
  )
}
