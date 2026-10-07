import type { AnchorHTMLAttributes, ReactNode } from 'react'

/**
 * Stand-in for @tanstack/react-router inside the design-system bundle: links are plain anchors.
 * Only `Link` (and its props type) is used by the blocks and layout components.
 */
export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string
  children?: ReactNode
  activeProps?: Record<string, unknown>
  activeOptions?: Record<string, unknown>
  preload?: unknown
}

export function Link({
  to,
  activeProps: _a,
  activeOptions: _o,
  preload: _p,
  children,
  ...rest
}: LinkProps) {
  return (
    <a href={to ?? '#'} {...rest}>
      {children}
    </a>
  )
}
