import type { RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'
import { Icon, type IconName } from './Icon'
import { CountUp } from './Motion'
import { Stars } from './Stars'

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
              'h-full gap-[3px] shadow-band md:min-h-[267px] md:py-6',
              source.score ? 'py-[27px]' : 'py-[22px]',
            ),
      )}
    >
      <Icon name={icon} size={50} className={cn('mb-[7px]', className)} />
      <p className={cn('text-body font-bold text-[#575757]', !source.score && 'mb-[14.4px]')}>
        {source.label}
      </p>
      {source.score ? (
        <Stars
          rating={Number(source.score)}
          label={source.starsLabel ?? source.score}
          color="gold"
          size={compact ? 19 : 24}
          className={cn('my-[6px]', compact ? 'gap-[10px]' : 'gap-3')}
        />
      ) : (
        <p className="mt-[6px] text-h2 leading-8 font-bold text-ink">
          {source.count ? <CountUp>{source.count}</CountUp> : null}
        </p>
      )}
      {source.countLabel ? (
        <p
          className={cn(
            'text-body text-secondary',
            source.score ? 'mt-[6px] leading-4' : 'mb-[14.4px] max-w-[160px] text-[#575757]',
          )}
        >
          {source.countLabel}
        </p>
      ) : null}
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
          {compact && source.moreLabel ? (
            <>
              {source.moreLabel}
              <span className="sr-only">: {source.label}</span>
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
