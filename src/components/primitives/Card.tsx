import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  tone?: 'white' | 'peach' | 'cream' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const tones = {
  white: 'bg-white shadow-card',
  peach: 'bg-peach shadow-card',
  cream: 'bg-cream shadow-card',
  outline: 'bg-white border border-line',
}
const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

/** Rounded 12px surface used by rating cards, pricing tiers, reviews and audience tiles. */
export function Card({ tone = 'white', padding = 'md', className, ...props }: CardProps) {
  return (
    <div {...props} className={cn('rounded-card', tones[tone], paddings[padding], className)} />
  )
}
