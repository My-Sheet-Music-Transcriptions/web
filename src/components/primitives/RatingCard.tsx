import starRating from '~/assets/images/icons/star-rating.svg'
import type { RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'
import { Icon, type IconName } from './Icon'

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
