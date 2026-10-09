import { cn } from '~/lib/cn'

export interface StarsProps {
  /** Filled stars; a score with decimals fills the star it reaches (4.9 shows five). */
  rating?: number
  max?: number
  /** gold: the platform rating cards. yellow: rating stars elsewhere. primary: customer review cards. */
  color?: 'gold' | 'yellow' | 'primary' | 'trustpilot'
  /** Height of each star in px. */
  size?: number
  className?: string
  /** What the stars say to screen readers ("5 out of 5 stars"). */
  label: string
}

const STAR_IDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
const colors = {
  gold: 'text-gold',
  yellow: 'text-yellow',
  primary: 'text-sky',
  trustpilot: 'text-trustpilot',
}
/** The live site's rounded star (one star of its five-star rating graphic). */
const STAR =
  'M682.1,404.8l8.1,24.9c0.3,1,1.2,1.6,2.2,1.6h26.2c2.3,0,3.2,2.9,1.4,4.2L698.8,451c-0.8,0.6-1.2,1.6-0.8,2.6l8.1,24.9c0.7,2.2-1.8,3.9-3.6,2.6l-21.2-15.4c-0.8-0.6-1.9-0.6-2.7,0l-21.2,15.4c-1.8,1.3-4.3-0.5-3.6-2.6l8.1-24.9c0.3-1,0-2-0.8-2.6l-21.2-15.4c-1.8-1.3-0.9-4.2,1.4-4.2h26.2c1,0,1.9-0.7,2.2-1.6l8.1-24.9C678.4,402.7,681.4,402.7,682.1,404.8z'
const BOX = { x: 636.6, y: 402.6, w: 85.6, h: 79.4 }

/**
 * Accessible star rating: one inline SVG per star (the live site's star, filled up to `rating`, outlined
 * after) and a text label for assistive tech. The rating cards and the review cards both use it.
 */
export function Stars({
  rating = 5,
  max = 5,
  color = 'yellow',
  size = 20,
  className,
  label,
}: StarsProps) {
  const width = Math.round(((size * BOX.w) / BOX.h) * 10) / 10
  return (
    <span
      role="img"
      aria-label={label}
      className={cn('inline-flex items-center gap-1', colors[color], className)}
    >
      {STAR_IDS.slice(0, max).map((id, i) => (
        <svg
          key={id}
          aria-hidden="true"
          width={width}
          height={size}
          viewBox={`${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}`}
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={i < rating ? 0 : 4}
        >
          <path d={STAR} />
        </svg>
      ))}
    </span>
  )
}
