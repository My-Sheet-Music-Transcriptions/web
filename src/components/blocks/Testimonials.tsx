import lines from '~/assets/images/bands/reviews-lines.png?w=1440;2880&as=picture'
import type { Cta } from '~/components/primitives/CtaLink'
import { CtaLink } from '~/components/primitives/CtaLink'
import { Picture } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { Stars } from '~/components/primitives/Stars'
import type { Review } from '~/content/types'
import { useTitleId } from '~/lib/use-title-id'
import { useLocale } from '~/site'

export interface TestimonialsProps {
  title: string
  /** The reviews, verbatim: a list from content/<locale>/data/reviews. */
  items: Review[]
  /** Show only the first n reviews. */
  limit?: number
  /** Button under the cards ("Read all our reviews"). */
  cta?: Cta
  /** Anchor id. */
  id?: string
}

/** Customer quotes in two columns, with stars, over the peach staff lines. */
export function Testimonials({ title, items, limit, cta, id }: TestimonialsProps) {
  const titleId = useTitleId(id)
  const shown = limit ? items.slice(0, limit) : items
  return (
    <section
      id={id}
      className="relative isolate overflow-hidden pt-[30px] pb-[50px] md:pt-[60px]"
      aria-labelledby={titleId}
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
        <SectionHeading id={titleId}>{title}</SectionHeading>
        <ul className="mt-[23px] grid items-start gap-[33px] md:grid-cols-2 md:gap-x-9 md:gap-y-[33px]">
          {shown.map((r) => (
            <li key={r.name + r.quote.slice(0, 24)}>
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>
        {cta ? (
          <div className="mt-[62px] text-center md:mt-[59px]">
            <CtaLink cta={cta} />
          </div>
        ) : null}
      </div>
    </section>
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
export function ReviewCard({ review }: { review: Review }) {
  const locale = useLocale()
  const name = review.sourceUrl ? (
    <a href={review.sourceUrl} rel="noopener" className="hover:text-accent-deep hover:underline">
      {review.name}
    </a>
  ) : (
    review.name
  )
  const who = [review.role, review.country].filter(Boolean).join(' from ')
  return (
    <article className="rounded-card bg-white pb-10 shadow-[0_0_4px_rgb(0_0_0/0.17)]">
      <div className="p-px md:mx-[14px]">
        <header className="border-b border-[#e1e8ed] px-[15px] pt-[15px] pb-6 text-[#202020]">
          <p className="text-[20px] leading-[38px] font-semibold">{name}</p>
          <Stars rating={review.rating} color="primary" size={22} className="h-[30px] gap-[5px]" />
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
    </article>
  )
}
