import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  tone?: 'white' | 'peach' | 'cream' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** `card`: soft shadow on light backgrounds. `band`: the wide shadow of white cards over a photo band. */
  shadow?: 'card' | 'band' | 'none'
}

const tones = {
  white: 'bg-white',
  peach: 'bg-peach',
  cream: 'bg-cream',
  outline: 'bg-white border border-line',
}
const shadows = { card: 'shadow-card', band: 'shadow-band', none: '' }
const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

/** Rounded 12px surface of rating cards, pricing tiers, feature cards and reviews. */
export function Card({
  tone = 'white',
  padding = 'md',
  shadow = tone === 'outline' ? 'none' : 'card',
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn('rounded-card', tones[tone], shadows[shadow], paddings[padding], className)}
    />
  )
}
