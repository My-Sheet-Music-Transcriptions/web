import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'
import { type Tone, tones } from './tones'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** The element: a div, or an article for a card that stands alone (a review). */
  as?: 'div' | 'article'
  /** The surface: white (default), cream or peach, the same tones as a block's background. */
  tone?: Tone
  /** The card's padding (`card-pad`, 24px, 20px on phones), or none when the content frames itself. */
  padding?: 'none' | 'card'
  /** `card`: the soft shadow of a card at rest. `float`: what floats over the page (a menu, a lightbox). */
  shadow?: 'card' | 'float' | 'none'
}

const shadows = { card: 'shadow-card', float: 'shadow-float', none: '' }
const paddings = { none: '', card: 'p-card-pad' }

/**
 * The rounded 12px surface of every card: rating cards, feature cards, pricing tiers, reviews, the sent
 * message of the form. Blocks never hand-roll `rounded-card bg-white shadow-…`.
 */
export function Card({
  as: Tag = 'div',
  tone = 'white',
  padding = 'card',
  shadow = 'card',
  className,
  ...props
}: CardProps) {
  return (
    <Tag
      {...props}
      className={cn('rounded-card', tones[tone], shadows[shadow], paddings[padding], className)}
    />
  )
}
