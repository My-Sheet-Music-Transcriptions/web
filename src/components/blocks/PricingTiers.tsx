import type { ReactNode } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
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
  eyebrow?: string
  /** Intro paragraphs (MDX children) rendered above the cards. */
  children?: ReactNode
  ctaLabel?: string
  ctaHref?: string
}

/** "Flexible pricing": intro copy and three price-from cards with a coloured top edge and a factor checklist. */
export function PricingTiers({
  title = 'Flexible pricing',
  eyebrow = 'Pricing',
  children,
  ctaLabel = 'See the full pricing guide',
  ctaHref = '/pricing',
}: PricingTiersProps) {
  return (
    <section className="py-section lg:py-section-lg" aria-labelledby="pricing-title">
      <div className="container-content">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeading id="pricing-title" eyebrow={eyebrow} rule="none" align="left">
            {title}
          </SectionHeading>
          {children ? (
            <div className="space-y-4 text-body leading-relaxed text-charcoal [&_p]:my-0 [&_strong]:font-bold [&_strong]:text-ink [&_p+p]:mt-4">
              {children}
            </div>
          ) : null}
        </div>
        <ul className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6">
          {pricingTiers.map((t) => {
            const img = icons[`../../assets/images/icons/${t.icon}.png`]
            return (
              <li
                key={t.id}
                className="relative flex flex-col overflow-hidden rounded-card border border-line bg-white p-7 shadow-card lg:p-8"
              >
                <span
                  aria-hidden="true"
                  className={cn('absolute inset-x-0 top-0 h-1.5', tones[t.tone])}
                />
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-h3">{t.title}</h3>
                  {img ? (
                    <Picture image={img} alt="" sizes="56px" className="h-14 w-14 object-contain" />
                  ) : null}
                </div>
                <p className="mt-6 text-small text-muted">from</p>
                <p className="mt-1 text-price font-bold tracking-tight text-ink">{t.from}</p>
                <p className="mt-1 text-small text-muted">{t.unit}</p>
                <p className="mt-6 border-t border-line pt-5 text-small font-bold text-ink">
                  Pricing factors
                </p>
                <ul className="mt-3 space-y-2 text-small leading-snug text-charcoal">
                  {t.factors.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                {t.note ? (
                  <p className="mt-auto pt-6 text-caption italic text-muted">{t.note}</p>
                ) : (
                  <span className="mt-auto" />
                )}
              </li>
            )
          })}
        </ul>
        <div className="mt-10 text-center">
          <Button asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
