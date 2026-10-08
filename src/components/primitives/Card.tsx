import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  tone?: 'white' | 'peach' | 'cream' | 'surface' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const tones = {
  white: 'bg-white border border-line shadow-card',
  peach: 'bg-peach',
  cream: 'bg-cream',
  surface: 'bg-surface',
  outline: 'bg-white border border-line',
}
const paddings = { none: '', sm: 'p-5', md: 'p-7', lg: 'p-9' }

/** Rounded 20px surface used by rating cards, pricing tiers, reviews and audience tiles. */
export function Card({ tone = 'white', padding = 'md', className, ...props }: CardProps) {
  return (
    <div {...props} className={cn('rounded-card', tones[tone], paddings[padding], className)} />
  )
}
