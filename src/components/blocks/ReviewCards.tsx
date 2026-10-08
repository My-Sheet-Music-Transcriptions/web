import { homeReviews } from '@content/en/data/reviews'
import lines from '~/assets/images/home/reviews-lines.png?w=1440;2880&as=picture'
import { Button } from '~/components/primitives/Button'
import { Picture } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { Stars } from '~/components/primitives/Stars'
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

/** "Customer Reviews": two-column grid of quote cards with teal stars over the peach staff lines, and a link to all reviews. */
export function ReviewCards({
  title = 'Customer Reviews',
  limit,
  ctaLabel = 'Read all our reviews',
  ctaHref = '/customer-reviews',
}: ReviewCardsProps) {
  const items = limit ? homeReviews.slice(0, limit) : homeReviews
  return (
    <section
      className="relative isolate overflow-hidden pt-[30px] pb-[50px] md:pt-[60px]"
      aria-labelledby="reviews-title"
    >
      {/* The live site's peach staff lines behind the section (background-size: cover from the top left). */}
      <Picture
        image={lines}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-left-top"
        pictureClassName="contents"
      />
      <div className="mx-auto max-w-[1140px] px-5 md:px-[10px]">
        <SectionHeading id="reviews-title">{title}</SectionHeading>
        <ul className="mt-[23px] grid items-start gap-[33px] md:grid-cols-2 md:gap-x-9 md:gap-y-[33px]">
          {items.map((r) => (
            <li key={r.name + r.date}>
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>
        <div className="mt-[62px] text-center md:mt-[59px]">
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
  return (
    <article className="rounded-card bg-white pb-10 shadow-[0_0_4px_rgb(0_0_0/0.17)]">
      <div className="p-px md:mx-[14px]">
        <header className="border-b border-[#e1e8ed] px-[15px] pt-[15px] pb-6 text-[#202020]">
          <p className="text-[20px] leading-[38px] font-semibold">{name}</p>
          <Stars rating={review.rating} color="primary" size={22} className="h-[30px] gap-[5px]" />
          <p className="text-body leading-8 md:text-[18px] md:leading-[44px]">
            {review.role} from {review.country} |{' '}
            <strong className="font-bold">{monthLabel(review.date)}</strong>
          </p>
        </header>
        <blockquote className="px-[15px] pt-6 pb-[29.4px] text-body leading-[30.4px] text-[#202020]">
          {review.quote}
        </blockquote>
      </div>
    </article>
  )
}
