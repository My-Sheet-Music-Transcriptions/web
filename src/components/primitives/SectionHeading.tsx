import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

export interface SectionHeadingProps {
  children: ReactNode
  /** Small uppercase label above the heading (orange on light, peach on dark). */
  eyebrow?: ReactNode
  /** Short bar under the heading: orange (accent), grey, or none (default). */
  rule?: 'accent' | 'grey' | 'none'
  /** Heading level; the homepage uses h2 for every section. */
  as?: 'h1' | 'h2' | 'h3'
  tone?: 'dark' | 'light'
  /** Left (default) or centered. */
  align?: 'center' | 'left'
  subtitle?: ReactNode
  className?: string
  id?: string
}

/** Section title: optional eyebrow, the heading and a subtitle, left-aligned in a 640px measure. */
export function SectionHeading({
  children,
  eyebrow,
  rule = 'none',
  as: Tag = 'h2',
  tone = 'dark',
  align = 'left',
  subtitle,
  className,
  id,
}: SectionHeadingProps) {
  const light = tone === 'light'
  return (
    <div
      className={cn(
        'flex max-w-[640px] flex-col gap-3.5',
        align === 'center' ? 'mx-auto items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn('eyebrow', light ? 'text-accent-light' : 'text-accent-text')}>{eyebrow}</p>
      ) : null}
      <Tag
        id={id}
        className={cn('text-[30px] leading-[1.1] md:text-h2', light ? 'text-white' : 'text-ink')}
      >
        {children}
      </Tag>
      {rule !== 'none' && (
        <span
          aria-hidden="true"
          className={cn(
            'mt-1 block h-0.5 w-12',
            rule === 'accent' ? 'bg-accent' : light ? 'bg-white/30' : 'bg-line',
          )}
        />
      )}
      {subtitle ? (
        <p
          className={cn(
            'text-[17px] leading-relaxed md:text-[18px]',
            light ? 'text-white/85' : 'text-charcoal',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  )
}
