import type { ReactNode } from 'react'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import type { Cta } from '~/components/primitives/CtaLink'
import { cn } from '~/lib/cn'

export interface SectionProps extends ShellProps {
  /** How the prose sits under the heading: at the start (default), or centred (a short band that points somewhere). */
  align?: 'start' | 'center'
  /** The short orange rule under the heading. */
  rule?: boolean
  /** Column width: content 1140px (default), narrow 900px, wide 1200px. */
  width?: 'content' | 'narrow' | 'wide'
  /** Outline buttons beside the `cta` (jump links to the sections below, related pages). */
  links?: Cta[]
  /** The page's own prose: `Text`, `Heading`, `List`… from ~/components/typography. */
  children?: ReactNode
}

/**
 * A titled section for a page's own prose (`Text`, `Heading`, `List`… from ~/components/typography), and,
 * centred with a button, the short band that points somewhere ("Unsure about music notation?").
 */
export function Section({
  align = 'start',
  rule = true,
  width = 'content',
  children,
  ...shell
}: SectionProps) {
  return (
    <BlockShell {...shell} rule={rule} width={width}>
      {children ? (
        <div
          className={cn(
            'flex flex-col gap-4 text-charcoal',
            align === 'center' && 'mx-auto max-w-3xl items-center text-center',
          )}
        >
          {children}
        </div>
      ) : null}
    </BlockShell>
  )
}
