import { cn } from '~/lib/cn'

export interface StarsProps {
  rating?: number
  max?: number
  /** yellow = Google/Facebook rating cards, primary = teal review cards. */
  color?: 'yellow' | 'primary' | 'trustpilot'
  size?: number
  className?: string
  label?: string
}

const STAR_IDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const colors = { yellow: 'text-yellow', primary: 'text-sky', trustpilot: 'text-trustpilot' }

/** Accessible star rating: one inline SVG per star and a text label for assistive tech. */
export function Stars({
  rating = 5,
  max = 5,
  color = 'yellow',
  size = 20,
  className,
  label,
}: StarsProps) {
  return (
    <span
      role="img"
      aria-label={label ?? `${rating} out of ${max} stars`}
      className={cn('inline-flex items-center gap-1', colors[color], className)}
    >
      {STAR_IDS.slice(0, max).map((id, i) => (
        <svg
          key={id}
          aria-hidden="true"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z" />
        </svg>
      ))}
    </span>
  )
}
