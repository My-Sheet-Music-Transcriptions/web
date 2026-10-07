import type { AnchorHTMLAttributes, ReactNode } from 'react'

/**
 * Stand-in for @tanstack/react-router inside the design-system bundle: links are plain anchors.
 * Only `Link` (and its props type) is used by the blocks and layout components; `useRouterState` exists for
 * `src/site.ts`, whose path-mode branch never runs in this (domain-mode) bundle.
 */
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string
  hash?: string
  children?: ReactNode
  activeProps?: Record<string, unknown>
  activeOptions?: Record<string, unknown>
  preload?: unknown
}

export function Link({
  to,
  hash,
  activeProps: _a,
  activeOptions: _o,
  preload: _p,
  children,
  ...rest
}: LinkProps) {
  return (
    <a href={hash ? `${to ?? ''}#${hash}` : (to ?? '#')} {...rest}>
      {children}
    </a>
  )
}

export function useRouterState<T>({
  select,
}: {
  select: (s: { location: { publicHref: string } }) => T
}): T {
  return select({ location: { publicHref: '/' } })
}
