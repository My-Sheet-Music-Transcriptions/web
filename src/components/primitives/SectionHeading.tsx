import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

export interface SectionHeadingProps {
  children: ReactNode
  /** Small uppercase label above the heading (orange on light, peach on dark). */
  eyebrow?: ReactNode
  /** Short rounded bar under the heading: orange (accent), grey or none. */
  rule?: 'accent' | 'grey' | 'none'
  /** Heading level; the homepage uses h2 for every section. */
  as?: 'h1' | 'h2' | 'h3'
  tone?: 'dark' | 'light'
  align?: 'center' | 'left'
  subtitle?: ReactNode
  className?: string
  id?: string
}

/** Section title with an optional eyebrow, the short brand rule and a subtitle; centered or left-aligned. */
export function SectionHeading({
  children,
  eyebrow,
  rule = 'accent',
  as: Tag = 'h2',
  tone = 'dark',
  align = 'center',
  subtitle,
  className,
  id,
}: SectionHeadingProps) {
  const light = tone === 'light'
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn('eyebrow mb-4', light ? 'text-accent-light' : 'text-accent-text')}>
          {eyebrow}
        </p>
      ) : null}
      <Tag
        id={id}
        className={cn(
          'max-w-[26ch] text-[32px] leading-[1.1] md:text-h2',
          light ? 'text-white' : 'text-ink',
        )}
      >
        {children}
      </Tag>
      {rule !== 'none' && (
        <span
          aria-hidden="true"
          className={cn(
            'mt-5 block h-1 w-12 rounded-pill',
            rule === 'accent' ? 'bg-accent' : light ? 'bg-white/30' : 'bg-line',
          )}
        />
      )}
      {subtitle ? (
        <p
          className={cn(
            'mt-5 max-w-2xl text-[17px] leading-relaxed md:text-[18px]',
            light ? 'text-white/85' : 'text-charcoal',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
