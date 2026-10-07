import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '~/lib/cn'
import { SmartLink } from './SmartLink'

/** Typographic defaults for free MDX prose (blog posts, text pages). Blocks opt out by design. */
export const prose: MDXComponents = {
  h1: (p: ComponentPropsWithoutRef<'h1'>) => (
    <h1 {...p} className={cn('text-display mt-10 mb-4', p.className)} />
  ),
  h2: (p: ComponentPropsWithoutRef<'h2'>) => (
    <h2 {...p} className={cn('text-h2 mt-10 mb-4', p.className)} />
  ),
  h3: (p: ComponentPropsWithoutRef<'h3'>) => (
    <h3 {...p} className={cn('text-h3 mt-8 mb-3', p.className)} />
  ),
  p: (p: ComponentPropsWithoutRef<'p'>) => (
    <p {...p} className={cn('my-4 text-body', p.className)} />
  ),
  ul: (p: ComponentPropsWithoutRef<'ul'>) => (
    <ul {...p} className={cn('my-4 list-disc pl-6 space-y-1', p.className)} />
  ),
  ol: (p: ComponentPropsWithoutRef<'ol'>) => (
    <ol {...p} className={cn('my-4 list-decimal pl-6 space-y-1', p.className)} />
  ),
  // Markdown links go through SmartLink: internal ones become router <Link>s (locale prefix + preloading).
  a: ({ href = '', children, ...p }: ComponentPropsWithoutRef<'a'>) => (
    <SmartLink
      {...p}
      href={href}
      className={cn('text-primary underline-offset-2 hover:underline', p.className)}
    >
      {children}
    </SmartLink>
  ),
  strong: (p: ComponentPropsWithoutRef<'strong'>) => (
    <strong {...p} className={cn('font-bold', p.className)} />
  ),
  blockquote: (p: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      {...p}
      className={cn('my-6 border-l-4 border-accent pl-4 italic text-ink', p.className)}
    />
  ),
  hr: (p: ComponentPropsWithoutRef<'hr'>) => (
    <hr {...p} className={cn('my-10 border-line', p.className)} />
  ),
}

export function ProseContainer({ className, ...p }: ComponentPropsWithoutRef<'div'>) {
  return <div {...p} className={cn('container-narrow py-12', className)} />
}
