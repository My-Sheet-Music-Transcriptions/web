import { pricingTiers } from '@content/en/data/home'
import type { ReactNode } from 'react'
import { Reveal } from '~/components/motion/Reveal'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { cn } from '~/lib/cn'

const tones = { teal: 'border-t-teal', blue: 'border-t-sky', navy: 'border-t-navy' }

export interface PricingTiersProps {
  title?: string
  eyebrow?: string
  /** Intro paragraphs (`<p>` children) rendered beside the heading. */
  children?: ReactNode
  ctaLabel?: string
  ctaHref?: string
}

/** "Flexible pricing": heading beside the intro copy, then three price-from columns with a coloured top rule. */
export function PricingTiers({
  title = 'Flexible pricing',
  eyebrow = 'Pricing',
  children,
  ctaLabel = 'See the full pricing guide',
  ctaHref = '/pricing',
}: PricingTiersProps) {
  return (
    <section
      className="border-t border-line py-section lg:py-section-lg"
      aria-labelledby="pricing-title"
    >
      <div className="container-content">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading id="pricing-title" eyebrow={eyebrow}>
            {title}
          </SectionHeading>
          {children ? <div className="space-y-4 text-charcoal">{children}</div> : null}
        </div>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 lg:mt-14">
          {pricingTiers.map((t, i) => (
            <Reveal
              as="li"
              key={t.id}
              delay={i * 0.06}
              className={cn('flex flex-col border-t-[3px] pt-6', tones[t.tone])}
            >
              <h3 className="text-[22px]">{t.title}</h3>
              <p className="mt-4 text-caption text-muted">from</p>
              <p className="text-price font-bold tabular-nums tracking-tight text-ink">{t.from}</p>
              <p className="mt-1 text-small text-muted">{t.unit}</p>
              <p className="mt-5 text-small font-bold text-ink">Pricing factors</p>
              <ul className="mt-2.5 space-y-2 text-small leading-snug text-charcoal">
                {t.factors.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              {t.note ? <p className="mt-4 text-caption italic text-muted">{t.note}</p> : null}
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <Button variant="outline" asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
