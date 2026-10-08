import { counter, ratings } from '@content/en/data/home'
import bg from '~/assets/images/home/stats-bg.jpg?w=900;1282&as=picture'
import starRating from '~/assets/images/icons/star-rating.svg'
import { Icon, type IconName } from '~/components/primitives/Icon'
import { Picture } from '~/components/primitives/Picture'
import { WaveDivider } from '~/components/primitives/WaveDivider'
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
      className="relative isolate overflow-hidden px-4 pt-[140px] pb-[100px] text-white md:my-[50px] md:px-[10px] md:pt-[110px] md:pb-[110px]"
      aria-labelledby="stats-title"
    >
      <Picture
        image={bg}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%]"
        pictureClassName="contents"
      />
      <div className="absolute inset-0 -z-10 bg-[#3a3a3a] opacity-[0.32]" aria-hidden="true" />
      <WaveDivider position="top" width={138} mobileHeight={20} mobileWidth={266} />
      <WaveDivider position="bottom" width={135} mobileHeight={20} mobileWidth={266} />
      <div className="mx-auto max-w-[1140px] text-center">
        <h2
          id="stats-title"
          className="text-[28px] font-bold leading-[32px] text-white md:text-h2 md:leading-8"
        >
          {title}
        </h2>
        <p className="mt-[60px]">
          <span className="block text-[69px] font-semibold leading-[69px]">
            {counterValue.toLocaleString('en-US')}
          </span>
          <span className="block text-body leading-10 text-white md:text-[19px] md:leading-[47.5px]">
            {counterLabel}
          </span>
        </p>
        <ul className="mt-[60px] grid gap-5 md:grid-cols-3">
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

const sourceIcon: Record<RatingSource['id'], { icon: IconName; className: string; link: string }> =
  {
    google: { icon: 'fa-google', className: 'text-blue', link: 'text-sky' },
    facebook: { icon: 'fa-facebook-f', className: 'text-[#4683f4]', link: 'text-[#4683f4]' },
    customers: { icon: 'fa-globe-americas', className: 'text-teal-light', link: 'text-sky' },
    trustpilot: { icon: 'trustpilot', className: 'text-trustpilot', link: 'text-sky' },
  }

/** White card with a platform mark, label, stars and count; `compact` is the floating hero variant. */
export function RatingCard({ source, compact }: { source: RatingSource; compact?: boolean }) {
  const { icon, className, link } = sourceIcon[source.id]
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card bg-white text-center',
        compact
          ? 'gap-[10px] py-5 shadow-card'
          : cn(
              'h-full gap-[3px] shadow-[0_0_45px_rgb(0_0_0/0.13)] md:min-h-[267px] md:py-6',
              source.score ? 'py-[27px]' : 'py-[22px]',
            ),
      )}
    >
      <Icon
        name={icon}
        size={50}
        className={cn('mb-[7px]', className)}
        title={source.id === 'customers' ? undefined : source.id}
      />
      <p className={cn('text-body font-bold text-[#575757]', !source.score && 'mb-[14.4px]')}>
        {source.label}
      </p>
      {source.score ? (
        <img
          src={starRating}
          alt={`${source.score} out of 5 stars`}
          width={compact ? 144 : 181}
          height={compact ? 29 : 36}
          loading="lazy"
          className={compact ? undefined : 'h-8 w-auto md:h-9'}
        />
      ) : (
        <p className="mt-[6px] text-h2 leading-8 font-bold text-ink">{source.count}</p>
      )}
      <p
        className={cn(
          'text-body text-secondary',
          source.score ? 'mt-[6px] leading-4' : 'mb-[14.4px] max-w-[160px] text-[#575757]',
        )}
      >
        {source.countLabel}
      </p>
      {source.href && source.linkLabel ? (
        <a
          href={source.href}
          rel="noopener"
          data-live-colour=""
          className={cn(
            'inline-flex items-center gap-[5px] px-5 py-[14px] text-small leading-[14px] font-bold uppercase hover:underline',
            link,
          )}
        >
          {compact ? (
            <>
              See more<span className="sr-only"> reviews on Google</span>
            </>
          ) : (
            source.linkLabel
          )}
          <Icon name="fa-arrow-right" size={12} />
        </a>
      ) : null}
    </div>
  )
}
