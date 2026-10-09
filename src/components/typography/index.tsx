import type { ComponentPropsWithoutRef } from 'react'
import { SmartLink, type SmartLinkProps } from '~/components/primitives/SmartLink'
import { cn } from '~/lib/cn'

/**
 * Semantic text components for the prose inside a page and inside blocks: each renders one element with its
 * Tailwind classes, so a page reads as plain JSX (`<Text>…<strong>…</strong></Text>`) and the look is set here once.
 * Emphasis inside a line stays plain <strong> and <em>, styled globally (the base layer of src/styles/theme.css).
 * They carry no outer margins: the container that holds them sets the rhythm (`flex flex-col gap-4`, `space-y-4`).
 * Pages use these instead of raw <p>, <h2>, <ul>, <a>… (tests/unit/content.test.ts enforces it), and the mockup
 * tooling reads them back as light markdown (scripts/design-system/mockup-lib.ts).
 */

/** A paragraph of body text. */
export function Text({ className, ...p }: ComponentPropsWithoutRef<'p'>) {
  return <p {...p} className={cn('text-body', className)} />
}

export interface HeadingProps extends ComponentPropsWithoutRef<'h2'> {
  /** h2 for a heading inside a section, h3 under it. A page's only h1 comes from its template. */
  level?: 2 | 3
}

/** A heading inside prose (a section's own title is the block's `title` prop). */
export function Heading({ level = 2, className, ...p }: HeadingProps) {
  const Tag = level === 2 ? 'h2' : 'h3'
  return <Tag {...p} className={cn(level === 2 ? 'text-h2' : 'text-h3', 'text-ink', className)} />
}

export interface ListProps extends ComponentPropsWithoutRef<'ul'> {
  /** Numbered (1, 2, 3…) instead of bullets. */
  ordered?: boolean
}

/** A bulleted or numbered list of `ListItem`s. */
export function List({ ordered = false, className, ...p }: ListProps) {
  const cls = cn('space-y-1 pl-6 text-body', ordered ? 'list-decimal' : 'list-disc', className)
  return ordered ? (
    <ol {...(p as ComponentPropsWithoutRef<'ol'>)} className={cls} />
  ) : (
    <ul {...p} className={cls} />
  )
}

export function ListItem(p: ComponentPropsWithoutRef<'li'>) {
  return <li {...p} />
}

/** A quotation set apart from the text. */
export function Quote({ className, ...p }: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      {...p}
      className={cn('border-l-4 border-accent pl-4 text-body italic text-ink', className)}
    />
  )
}

/**
 * A link inside text: internal paths become router links (SmartLink). Underlined, so it stands out from the
 * text around it by more than colour (WCAG 1.4.1).
 */
export function TextLink({ className, ...p }: SmartLinkProps) {
  return (
    <SmartLink
      {...p}
      className={cn(
        'text-primary underline underline-offset-2 hover:decoration-2 hover:text-primary-deep',
        className,
      )}
    />
  )
}

/** A thin rule between two parts of the text. */
export function Divider({ className, ...p }: ComponentPropsWithoutRef<'hr'>) {
  return <hr {...p} className={cn('border-line', className)} />
}
