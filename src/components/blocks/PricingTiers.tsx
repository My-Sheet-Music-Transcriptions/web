import { pricingTiers } from '@content/en/data/home'
import type { ReactNode } from 'react'
import { Button } from '~/components/primitives/Button'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { cn } from '~/lib/cn'

const icons = import.meta.glob<PictureSource>('../../assets/images/icons/*.png', {
  eager: true,
  import: 'default',
  query: '?w=110;220&as=picture',
})
const tones = { teal: 'bg-teal-light', blue: 'bg-sky', navy: 'bg-navy' }

export interface PricingTiersProps {
  title?: string
  /** Intro paragraphs (`<p>` children) rendered above the cards. */
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
    <section className="pt-[30px] pb-[10px]" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-[1108px] px-5 md:px-0">
        <SectionHeading id="pricing-title" className="px-[10px] md:px-[41px]">
          {title}
        </SectionHeading>
        {children ? (
          <div className="mt-5 flex flex-col gap-[14.4px] px-[10px] text-ink md:px-[65px]">
            {children}
          </div>
        ) : null}
        <ul className="mt-[92px] grid gap-y-[121px] md:mt-[162px] md:grid-cols-3 md:gap-x-5">
          {pricingTiers.map((t) => {
            const img = icons[`../../assets/images/icons/${t.icon}.png`]
            return (
              <li
                key={t.id}
                className={cn(
                  'relative flex flex-col rounded-card bg-white shadow-[0_0_45px_rgb(0_0_0/0.13)] md:min-h-[435px]',
                  t.note ? 'min-h-[435px]' : 'min-h-[368px]',
                )}
              >
                {img ? (
                  <Picture
                    image={img}
                    alt=""
                    sizes="107px"
                    className="absolute left-1/2 top-[-83px] h-[104px] w-[105px] -translate-x-1/2 md:h-[106px] md:w-[107px]"
                  />
                ) : null}
                <h3
                  data-live-colour=""
                  className={cn(
                    'rounded-t-card py-[22px] text-center text-[26px] font-bold leading-[26px] text-white',
                    tones[t.tone],
                  )}
                >
                  {t.title}
                </h3>
                <div className="flex flex-1 flex-col pt-[5px] text-center text-ink">
                  <p className="text-[18px] leading-9">from</p>
                  <p className="mt-1 text-price font-bold leading-[46px]">{t.from}</p>
                  <p className="-mt-0.5 text-[18px] leading-9">{t.unit}</p>
                  <p className="mt-5 text-body font-bold leading-8">Pricing factors:</p>
                  <ul className="mx-[26px] mt-[5px] list-disc pl-10 text-left text-body">
                    {t.factors.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  {t.note ? (
                    <p className="mt-auto pt-9 pr-[26px] pb-[26px] text-right text-small leading-[21px] italic">
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
        <div className="mt-[63px] text-center md:mt-[65px]">
          <Button asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
