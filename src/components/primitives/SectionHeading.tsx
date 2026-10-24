import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

export interface SectionHeadingProps {
  children: ReactNode
  /** The short orange rule under the heading (`heading-rule`, theme.css): on every section but photo bands. */
  rule?: boolean
  /** Centred (default) or at the start of the column. */
  align?: 'center' | 'start'
  /** dark: ink on a light background. light: white over a photo. */
  tone?: 'dark' | 'light'
  className?: string
  id?: string
}

/** A section's h2 with the signature short rule beneath it. BlockShell renders it for every block. */
export function SectionHeading({
  children,
  rule = true,
  align = 'center',
  tone = 'dark',
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      <h2 id={id} className={cn('text-h2', tone === 'light' ? 'text-white' : 'text-ink')}>
        {children}
      </h2>
      {rule ? <span aria-hidden="true" className="heading-rule" /> : null}
    </div>
  )
}
