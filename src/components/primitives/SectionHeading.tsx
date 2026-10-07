import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

export interface SectionHeadingProps {
  children: ReactNode
  /** Short rule under the heading: orange (accent) or grey, as on the live site. */
  rule?: 'accent' | 'grey' | 'none'
  /** Heading level; the homepage uses h2 for every section. */
  as?: 'h1' | 'h2' | 'h3'
  tone?: 'dark' | 'light'
  subtitle?: ReactNode
  className?: string
  id?: string
}

/** Centered section title with the signature short rule beneath it. */
export function SectionHeading({
  children,
  rule = 'accent',
  as: Tag = 'h2',
  tone = 'dark',
  subtitle,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <Tag
        id={id}
        className={cn(
          'text-[28px] leading-tight md:text-h2',
          tone === 'light' ? 'text-white' : 'text-ink',
        )}
      >
        {children}
      </Tag>
      {rule !== 'none' && (
        <span
          aria-hidden="true"
          className={cn(
            'mt-5 block h-px w-[150px]',
            rule === 'accent' ? 'bg-accent' : 'bg-[#c9c9c9]',
          )}
        />
      )}
      {subtitle ? (
        <p
          className={cn(
            'mt-5 max-w-3xl text-[18px] leading-relaxed',
            tone === 'light' ? 'text-white' : 'text-ink',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
