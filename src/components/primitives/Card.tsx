import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'
import { type Tone, tones } from './tones'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** The element: a div, or an article for a card that stands alone (a review). */
  as?: 'div' | 'article'
  /** The surface: white (default), cream or peach, the same tones as a block's background. */
  tone?: Tone
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** `card`: soft shadow on light backgrounds. `band`: the wide shadow of white cards (over a photo, on white). */
  shadow?: 'card' | 'band' | 'none'
}

const shadows = { card: 'shadow-card', band: 'shadow-band', none: '' }
const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

/**
 * The rounded 12px surface of every card: rating cards, feature cards, pricing tiers, reviews, the sent
 * message of the form. Blocks never hand-roll `rounded-card bg-white shadow-…`.
 */
export function Card({
  as: Tag = 'div',
  tone = 'white',
  padding = 'md',
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
