import bg from '~/assets/images/home/stats-bg.jpg?w=900;1282&as=picture'
import { Card } from '~/components/primitives/Card'
import { Icon } from '~/components/primitives/Icon'
import { Picture } from '~/components/primitives/Picture'
import { Stars } from '~/components/primitives/Stars'
import { counter, ratings } from '~/content/en/data/home'
import type { RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'

export interface StatsBannerProps {
  title?: string
  eyebrow?: string
  counterValue?: number
  counterLabel?: string
}

/** Navy panel over a dimmed piano photo: big counter and the three rating cards. */
export function StatsBanner({
  title = 'The highest-rated online sheet music transcribers',
  eyebrow = 'Trusted since 2011',
  counterValue = counter.value,
  counterLabel = counter.label,
}: StatsBannerProps) {
  return (
    <section className="pb-section lg:pb-section-lg" aria-labelledby="stats-title">
      <div className="container-wide">
        <div className="relative isolate overflow-hidden rounded-panel bg-navy px-6 py-14 text-white md:px-12 lg:px-16 lg:py-20">
          <Picture
            image={bg}
            alt=""
            sizes="(min-width: 1320px) 1256px, 100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%] opacity-30"
            pictureClassName="contents"
          />
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-br from-navy/95 via-navy/85 to-navy-deep/90"
            aria-hidden="true"
          />
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <p className="eyebrow text-accent-light">{eyebrow}</p>
              <h2
                id="stats-title"
                className="mt-4 text-[30px] font-bold leading-[1.1] text-white md:text-h2"
              >
                {title}
              </h2>
              <p className="mt-8">
                <span className="block text-[60px] font-bold leading-none tabular-nums tracking-tight md:text-counter">
                  {counterValue.toLocaleString('en-US')}
                </span>
                <span className="mt-3 block text-[17px] text-white/85">{counterLabel}</span>
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3 lg:gap-5">
              {ratings.map((r) => (
                <li key={r.id}>
                  <RatingCard source={r} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

const sourceIcon: Record<
  RatingSource['id'],
  { icon: 'google' | 'facebook' | 'globe' | 'trustpilot'; className: string }
> = {
  google: { icon: 'google', className: 'text-google' },
  facebook: { icon: 'facebook', className: 'text-facebook' },
  customers: { icon: 'globe', className: 'text-primary' },
  trustpilot: { icon: 'trustpilot', className: 'text-trustpilot' },
}

/** White card with a platform mark, label, stars and count; `compact` is the floating hero variant. */
export function RatingCard({ source, compact }: { source: RatingSource; compact?: boolean }) {
  const { icon, className } = sourceIcon[source.id]
  return (
    <Card
      className={cn(
        'flex h-full flex-col items-center text-center text-ink',
        compact ? 'px-5 py-5' : 'px-5 py-7',
      )}
      padding="none"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-pill bg-surface">
        <Icon
          name={icon}
          size={compact ? 24 : 26}
          className={className}
          title={source.id === 'customers' ? undefined : source.id}
        />
      </span>
      <p className="mt-3 text-small font-bold leading-snug">{source.label}</p>
      {source.score ? (
        <Stars
          rating={5}
          color="yellow"
          size={compact ? 18 : 20}
          className="mt-2"
          label={`${source.score} out of 5 stars`}
        />
      ) : (
        <p className="mt-2 text-[28px] font-bold leading-none tabular-nums tracking-tight">
          {source.count}
        </p>
      )}
      <p className={cn('mt-2 text-small text-muted', !source.score && 'max-w-[160px] leading-5')}>
        {source.countLabel}
      </p>
      {source.href && source.linkLabel ? (
        <a
          href={source.href}
          rel="noopener"
          className="mt-3 inline-flex items-center gap-1 text-small font-bold text-primary hover:underline"
        >
          {compact ? (
            <>
              See more<span className="sr-only"> reviews on Google</span>
            </>
          ) : (
            source.linkLabel
          )}{' '}
          <Icon name="arrow-right" size={14} />
        </a>
      ) : null}
    </Card>
  )
}
