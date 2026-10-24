import type { RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'
import { Icon, type IconName } from './Icon'
import { Stars } from './Stars'

/** Each platform's mark in its own colour; the customers' globe in the site's sky. */
const sourceIcon: Record<RatingSource['id'], { icon: IconName; className: string }> = {
  google: { icon: 'fa-google', className: 'text-google' },
  facebook: { icon: 'fa-facebook-f', className: 'text-facebook' },
  customers: { icon: 'fa-globe-americas', className: 'text-sky' },
  trustpilot: { icon: 'trustpilot', className: 'text-trustpilot' },
}

/** White card with a platform mark, label, stars and count; `compact` is the floating hero variant. */
export function RatingCard({ source, compact }: { source: RatingSource; compact?: boolean }) {
  const { icon, className } = sourceIcon[source.id]
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-card bg-white text-center shadow-card',
        compact ? 'gap-2 px-4 py-5' : 'h-full gap-1 px-4 py-6',
      )}
    >
      <Icon name={icon} size={compact ? 40 : 48} className={cn('mb-2', className)} />
      <p className="text-body font-bold text-ink">{source.label}</p>
      {source.score ? (
        <Stars
          rating={Number(source.score.replace(',', '.'))}
          label={source.starsLabel ?? source.score}
          size={compact ? 20 : 24}
          className="my-1 gap-2"
        />
      ) : (
        <p className="my-1 text-h2 text-ink">{source.count}</p>
      )}
      {source.countLabel ? (
        <p className="max-w-40 text-small text-muted">{source.countLabel}</p>
      ) : null}
      {source.href && source.linkLabel ? (
        <a
          href={source.href}
          rel="noopener"
          className="label-caps mt-2 inline-flex min-h-11 items-center gap-2 px-4 text-primary hover:text-primary-deep hover:underline"
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
