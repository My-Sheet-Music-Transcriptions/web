import bg from '~/assets/images/home/stats-bg.jpg?w=900;1282&as=picture'
import { Card } from '~/components/primitives/Card'
import { Icon } from '~/components/primitives/Icon'
import { Picture } from '~/components/primitives/Picture'
import { Stars } from '~/components/primitives/Stars'
import { WaveDivider } from '~/components/primitives/WaveDivider'
import { counter, ratings } from '~/content/en/data/home'
import type { RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'

export interface StatsBannerProps {
  title?: string
  counterValue?: number
  counterLabel?: string
}

/** Full-bleed piano photo with wavy edges, big counter and three rating cards. */
export function StatsBanner({
  title = 'The highest-rated online sheet music transcribers',
  counterValue = counter.value,
  counterLabel = counter.label,
}: StatsBannerProps) {
  return (
    <section
      className="relative isolate overflow-hidden py-24 text-white lg:py-28"
      aria-labelledby="stats-title"
    >
      <Picture
        image={bg}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%]"
        pictureClassName="contents"
      />
      <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden="true" />
      <WaveDivider position="top" />
      <WaveDivider position="bottom" />
      <div className="container-content text-center">
        <h2 id="stats-title" className="text-[26px] font-bold leading-tight text-white md:text-h2">
          {title}
        </h2>
        <p className="mt-10">
          <span className="block text-[56px] font-bold leading-none md:text-counter">
            {counterValue.toLocaleString('en-US')}
          </span>
          <span className="mt-3 block text-body text-white">{counterLabel}</span>
        </p>
        <ul className="mx-auto mt-12 grid max-w-[1170px] gap-5 md:grid-cols-3">
          {ratings.map((r) => (
            <li key={r.id}>
              <RatingCard source={r} />
            </li>
          ))}
        </ul>
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
  customers: { icon: 'globe', className: 'text-teal-light' },
  trustpilot: { icon: 'trustpilot', className: 'text-trustpilot' },
}

/** White card with a platform mark, label, stars and count; `compact` is the floating hero variant. */
export function RatingCard({ source, compact }: { source: RatingSource; compact?: boolean }) {
  const { icon, className } = sourceIcon[source.id]
  return (
    <Card
      className={cn(
        'flex h-full flex-col items-center text-center text-ink',
        compact ? 'px-5 py-6' : 'px-6 py-8',
      )}
      padding="none"
    >
      <Icon
        name={icon}
        size={compact ? 38 : 44}
        className={className}
        title={source.id === 'customers' ? undefined : source.id}
      />
      <p className="mt-3 text-small font-bold">{source.label}</p>
      {source.score ? (
        <Stars
          rating={5}
          color="yellow"
          size={22}
          className="mt-3"
          label={`${source.score} out of 5 stars`}
        />
      ) : (
        <p className="mt-3 text-[26px] font-bold leading-none">{source.count}</p>
      )}
      <p className={cn('mt-2 text-small text-ink', !source.score && 'max-w-[150px] leading-5')}>
        {source.score ? source.countLabel : source.countLabel}
      </p>
      {source.href && source.linkLabel ? (
        <a
          href={source.href}
          rel="noopener"
          className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold uppercase text-primary hover:underline"
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
