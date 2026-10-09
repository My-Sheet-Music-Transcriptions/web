import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

export interface SectionHeadingProps {
  children: ReactNode
  /**
   * The short orange rule under the heading, as on every live section: 50% of the heading's width on
   * phones, 20% from tablet up, 35px below the heading and 15px above what follows.
   */
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
      <h2
        id={id}
        className={cn(
          'text-[28px] leading-8 md:text-h2 md:leading-8',
          tone === 'light' ? 'font-bold text-white' : 'text-ink',
        )}
      >
        {children}
      </h2>
      {rule ? (
        <span
          aria-hidden="true"
          className="mt-[35px] mb-[15px] block h-px w-1/2 bg-accent md:w-1/5"
        />
      ) : null}
    </div>
  )
}
