import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** `rule` (default): a hairline above, no box. `outline`: a bordered panel for forms and banners. */
  tone?: 'rule' | 'outline' | 'peach'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const tones = {
  rule: 'border-t border-line',
  outline: 'rounded-ui border border-line bg-white',
  peach: 'rounded-ui bg-peach',
}
const paddings = { none: '', sm: 'p-5', md: 'p-7', lg: 'p-9' }

/** Flat container: by default a column set off by a hairline, the way every grouped item reads on the site. */
export function Card({ tone = 'rule', padding = 'none', className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(tones[tone], tone === 'rule' ? 'pt-6' : paddings[padding], className)}
    />
  )
}
