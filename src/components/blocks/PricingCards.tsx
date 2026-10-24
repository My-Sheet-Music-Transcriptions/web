import type { ReactNode } from 'react'
import { BlockShell, type HeadingProps } from '~/components/primitives/BlockShell'
import { Card } from '~/components/primitives/Card'
import type { Cta } from '~/components/primitives/CtaLink'
import { RevealItem } from '~/components/primitives/Motion'
import { Picture } from '~/components/primitives/Picture'
import { PriceTag } from '~/components/primitives/PriceTag'
import type { PricingTier } from '~/content/types'

export interface PricingCardsProps extends HeadingProps {
  title: string
  /** The prices: a list from content/<locale>/data (never typed into a page). One tier is a wide card. */
  tiers: PricingTier[]
  /** Intro paragraphs (`<Text>`) above the cards. */
  children?: ReactNode
  /** Button under the cards ("See the full pricing guide"). */
  cta?: Cta
}

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
        <RevealItem className="flex flex-col gap-stack text-ink md:px-10">{children}</RevealItem>
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
    <ul className="mt-24 grid gap-y-28 md:mt-28 md:grid-cols-3 md:gap-x-grid-gap">
      {tiers.map((t) => {
        const img = t.icon
        return (
          <RevealItem as="li" key={t.id ?? t.title} className="flex">
            <Card padding="none" className="relative flex w-full flex-col">
              {img ? (
                <Picture
                  image={img}
                  alt=""
                  sizes="107px"
                  className="absolute -top-20 left-1/2 h-26 w-auto -translate-x-1/2"
                />
              ) : null}
              <PriceTag title={t.title} tone={t.tone} price={t} />
              <div className="flex flex-1 flex-col text-center text-ink">
                {t.factorsLabel ? (
                  <p className="mt-4 text-body font-bold">{t.factorsLabel}</p>
                ) : null}
                <ul className="mx-card-pad mt-2 list-disc pl-6 text-left text-body">
                  {t.factors.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                {t.note ? (
                  <p className="mt-auto px-card-pad pt-8 pb-card-pad text-right text-small text-muted italic">
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
      className="mx-auto mt-heading-gap grid max-w-narrow overflow-hidden md:grid-cols-2"
    >
      <div className="flex flex-col items-center justify-center bg-cream px-8 py-10 text-center text-ink">
        {tier.title ? <h3 className="mb-2 text-h3">{tier.title}</h3> : null}
        {tier.fromLabel ? <p className="text-lead">{tier.fromLabel}</p> : null}
        <p className="my-2 text-figure font-bold text-ink">{tier.from}</p>
        <p className="text-lead font-bold">{tier.unit}</p>
        {tier.note ? (
          <p className="mt-4 max-w-80 text-small text-muted italic">{tier.note}</p>
        ) : null}
      </div>
      <div className="flex flex-col justify-center px-8 py-10 text-ink">
        {tier.factorsLabel ? <p className="text-lead font-bold">{tier.factorsLabel}</p> : null}
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
