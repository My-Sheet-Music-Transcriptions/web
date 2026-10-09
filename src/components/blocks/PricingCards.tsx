import type { ReactNode } from 'react'
import { BlockShell, type HeadingProps } from '~/components/primitives/BlockShell'
import { Card } from '~/components/primitives/Card'
import type { Cta } from '~/components/primitives/CtaLink'
import { RevealItem } from '~/components/primitives/Motion'
import { Picture } from '~/components/primitives/Picture'
import type { PricingTier } from '~/content/types'
import { cn } from '~/lib/cn'

export interface PricingCardsProps extends HeadingProps {
  title: string
  /** The prices: a list from content/<locale>/data (never typed into a page). One tier is a wide card. */
  tiers: PricingTier[]
  /** Intro paragraphs (`<Text>`) above the cards. */
  children?: ReactNode
  /** Button under the cards ("See the full pricing guide"). */
  cta?: Cta
}

const headers = { teal: 'bg-teal-light', blue: 'bg-sky', navy: 'bg-navy' }

/**
 * Prices from: three cards with coloured headers, a floating icon and the pricing factors (the homepage), or
 * one wide card with the price beside the numbered factors when given one tier (a service or landing page).
 * Intro prose goes in the children.
 */
export function PricingCards({ tiers, children, ...shell }: PricingCardsProps) {
  const single = tiers.length === 1 ? tiers[0] : undefined
  return (
    <BlockShell {...shell} spacing="tight" cascade>
      {children ? (
        <RevealItem className="flex flex-col gap-[14.4px] text-ink md:px-[45px]">
          {children}
        </RevealItem>
      ) : null}
      {single ? (
        <RevealItem>
          <SingleTier tier={single} />
        </RevealItem>
      ) : (
        <Tiers tiers={tiers} />
      )}
    </BlockShell>
  )
}

function Tiers({ tiers }: { tiers: PricingTier[] }) {
  return (
    <ul className="mt-[92px] grid gap-y-[121px] md:mt-[122px] md:grid-cols-3 md:gap-x-5">
      {tiers.map((t) => {
        const img = t.icon
        return (
          <RevealItem as="li" key={t.id ?? t.title} className="flex">
            <Card
              padding="none"
              shadow="band"
              className={cn(
                'relative flex w-full flex-col md:min-h-[435px]',
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
                  headers[t.tone ?? 'teal'],
                )}
              >
                {t.title}
              </h3>
              <div className="flex flex-1 flex-col pt-[5px] text-center text-ink">
                {t.fromLabel ? <p className="text-[18px] leading-9">{t.fromLabel}</p> : null}
                <p className="mt-1 text-price font-bold leading-[46px]">{t.from}</p>
                <p className="-mt-0.5 text-[18px] leading-9">{t.unit}</p>
                {t.factorsLabel ? (
                  <p className="mt-5 text-body font-bold leading-8">{t.factorsLabel}</p>
                ) : null}
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
            </Card>
          </RevealItem>
        )
      })}
    </ul>
  )
}

function SingleTier({ tier }: { tier: PricingTier }) {
  return (
    <Card
      padding="none"
      shadow="band"
      className="mx-auto mt-12 grid max-w-[900px] overflow-hidden md:grid-cols-2"
    >
      <div className="flex flex-col items-center justify-center gap-1 bg-cream px-8 py-10 text-center text-ink">
        {tier.title ? <h3 className="mb-2 text-h3 font-bold">{tier.title}</h3> : null}
        {tier.fromLabel ? <p className="text-[18px] leading-9">{tier.fromLabel}</p> : null}
        <p className="text-price font-bold leading-[46px] text-ink">{tier.from}</p>
        <p className="text-[18px] font-bold leading-9">{tier.unit}</p>
        {tier.note ? <p className="mt-4 max-w-[320px] text-small italic">{tier.note}</p> : null}
      </div>
      <div className="flex flex-col justify-center px-8 py-10 text-ink">
        {tier.factorsLabel ? (
          <p className="text-[18px] font-bold leading-8">{tier.factorsLabel}</p>
        ) : null}
        <ol className="mt-3 flex flex-col gap-2 text-body">
          {tier.factors.map((f, i) => (
            <li key={f}>
              <strong>{i + 1}.</strong> {f}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  )
}
