import type { ReactNode } from 'react'
import { Button } from '~/components/primitives/Button'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { pricingTiers } from '~/content/en/data/home'
import { cn } from '~/lib/cn'

const icons = import.meta.glob<PictureSource>('../../assets/images/icons/*.png', {
  eager: true,
  import: 'default',
  query: '?w=110;220&as=picture',
})
const tones = { teal: 'bg-teal', blue: 'bg-sky', navy: 'bg-navy' }

export interface PricingTiersProps {
  title?: string
  /** Intro paragraphs (MDX children) rendered above the cards. */
  children?: ReactNode
  ctaLabel?: string
  ctaHref?: string
}

/** "Flexible pricing": intro copy and three price-from cards with coloured headers and factor lists. */
export function PricingTiers({
  title = 'Flexible pricing',
  children,
  ctaLabel = 'See the full pricing guide',
  ctaHref = '/pricing',
}: PricingTiersProps) {
  return (
    <section className="pb-16 pt-20" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-[1120px] px-4 md:px-10">
        <SectionHeading id="pricing-title">{title}</SectionHeading>
        {children ? (
          <div className="mt-8 space-y-4 text-body leading-6 text-ink [&_p]:my-0 [&_strong]:font-bold [&_p+p]:mt-4">
            {children}
          </div>
        ) : null}
        <ul className="mt-20 grid gap-x-5 gap-y-20 md:grid-cols-3">
          {pricingTiers.map((t) => {
            const img = icons[`../../assets/images/icons/${t.icon}.png`]
            return (
              <li key={t.id} className="relative flex flex-col rounded-card bg-white shadow-card">
                {img ? (
                  <Picture
                    image={img}
                    alt=""
                    sizes="107px"
                    className="absolute left-1/2 top-0 h-[107px] w-[107px] -translate-x-1/2 -translate-y-[62%]"
                  />
                ) : null}
                <h3
                  className={cn(
                    'rounded-t-card py-[22px] pt-10 text-center text-[26px] font-bold leading-none text-white',
                    tones[t.tone],
                  )}
                >
                  {t.title}
                </h3>
                <div className="flex flex-1 flex-col px-6 pb-7 pt-5 text-center text-ink">
                  <p className="text-[18px] leading-9">from</p>
                  <p className="text-price font-bold leading-none">{t.from}</p>
                  <p className="mt-2 text-[18px] leading-9">{t.unit}</p>
                  <p className="mt-4 text-body font-bold leading-8">Pricing factors:</p>
                  <ul className="mx-auto mt-1 list-disc space-y-1 pl-5 text-left text-small leading-5">
                    {t.factors.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  {t.note ? (
                    <p className="mt-auto pt-6 text-right text-caption italic leading-5">
                      {t.note}
                    </p>
                  ) : (
                    <span className="mt-auto" />
                  )}
                </div>
              </li>
            )
          })}
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
