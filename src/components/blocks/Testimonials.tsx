import * as m from 'motion/react-m'
import { useEffect, useRef, useState } from 'react'
import { BlockShell, type HeadingProps } from '~/components/primitives/BlockShell'
import { Card } from '~/components/primitives/Card'
import type { Cta } from '~/components/primitives/CtaLink'
import { drawGroup, drawLine, RevealItem } from '~/components/primitives/Motion'
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
 * all reviews. With `reveal` the staff lines paint themselves across the section, the cards come in one by one
 * and their stars pop in.
 */
export function Testimonials({ items, labels, ...shell }: TestimonialsProps) {
  return (
    <BlockShell {...shell} className="relative isolate overflow-hidden" cascade>
      <StaffLines />
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

/** The five staff lines, traced from the live site's background picture (3662×2060, drawn at half size). */
const STAFF = [
  'M0 120.2C39.8 98 80.1 76.8 123 61C249.6 14.3 371.7 24.5 483 103.4C534.7 140.1 579.8 186.7 624 231.8C688.8 297.8 759.7 369.3 846 406.3C1035.1 487.2 1118.7 341.7 1314 390.6C1363.5 403 1409.4 424.8 1452 452.8C1598.7 549.1 1688.1 704.5 1831 807.8',
  'M0 151C40 128.7 80 107.4 123 91.3C250.8 43.7 373.5 53.4 486 133.5C538.5 170.8 585 219.3 630 265.2C693.9 330.4 763.9 399.8 849 436.1C1036.2 516.1 1121.3 372.2 1314 419.5C1366.1 432.3 1413.5 455.1 1458 484.8C1600.6 580 1689.9 731.1 1831 835.7',
  'M0 181.8C40.9 158.9 82 136.9 126 120.6C252.4 73.6 374.3 83 486 161.4C537.3 197.5 583.2 244.6 627 289.4C691.8 355.6 762.7 427.2 849 464.7C1037.1 546.5 1122.2 402.6 1314 448.5C1365 460.7 1411.2 482.3 1455 510.9C1602 606.5 1691.4 762.8 1831 863.6',
  'M0 212.5C41.8 189.2 84 166.4 129 149.8C259.1 101.9 381.7 113.4 495 195.8C547.5 233.9 593.6 282.7 639 328.9C701.3 392.2 769.3 458.8 852 494.5C1041.7 576.5 1126.2 428.9 1323 479.7C1372.6 492.5 1418.4 514.5 1461 542.9C1605.3 638.7 1693.5 790.9 1831 891.4',
  'M0 243.3C43.5 218.7 88 194.9 135 177.9C260.8 132.4 381.8 143.4 492 221.5C544.6 258.8 591 307.1 636 353C700.4 418.8 771.8 489.7 858 525.7C1046 604.1 1129.8 458.4 1326 509.4C1376.6 522.6 1423.9 545.6 1467 574.9C1606.7 669.7 1694.4 815.3 1831 919.3',
]

/** The share of a line's length, from its start, up to its last point inside the box (w×h) the section shows. */
function shownShare(path: SVGPathElement, w: number, h: number) {
  const length = path.getTotalLength()
  for (let i = 100; i > 0; i--) {
    const { x, y } = path.getPointAtLength((length * i) / 100)
    if (x <= w && y <= h) return i / 100
  }
  return 1
}

/**
 * The peach staff lines behind the cards, covering the section from its top left corner as the live site's
 * background picture did. In a revealed block they paint themselves left to right, one after another, as the
 * cards come in (`drawLine`), over the part the section shows; anywhere else, and where nothing animates
 * (`data-reveal`), they are simply there. Positioned against the section: it sits in the shell's cascade
 * group, which never moves.
 */
function StaffLines() {
  const svg = useRef<SVGSVGElement>(null)
  const [shown, setShown] = useState<number[]>([])
  useEffect(() => {
    const el = svg.current
    if (!el) return
    const { width, height } = el.getBoundingClientRect()
    const scale = Math.max(width / 1831, height / 1030)
    if (!scale) return
    setShown(
      [...el.querySelectorAll('path')].map((p) => shownShare(p, width / scale, height / scale)),
    )
  }, [])
  return (
    <m.svg
      ref={svg}
      variants={drawGroup}
      viewBox="0 0 1831 1030"
      preserveAspectRatio="xMinYMin slice"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full fill-none stroke-staff/20 stroke-[4.4]"
    >
      {STAFF.map((d, i) => (
        <m.path key={d} d={d} data-reveal="" variants={drawLine} custom={shown[i]} />
      ))}
    </m.svg>
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
