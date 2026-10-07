import { Link, type LinkProps } from '@tanstack/react-router'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import portedPaths from '~/content/paths.generated.json'
import { site } from '~/site'

export interface SmartLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  href: string
  children: ReactNode
  /** Router active-state props, forwarded when the link is internal. */
  activeProps?: LinkProps['activeProps']
  activeOptions?: LinkProps['activeOptions']
}

const PORTED = new Set<string>(['/', '/404', ...(portedPaths as string[])])

/**
 * Decides how to render a link from content data:
 * - internal path that exists in this build → router <Link> (preloaded on hover);
 * - internal path that is not ported yet → absolute link to the same path on the legacy site, so the
 *   preview stays fully navigable during the migration (and the SEO suite only sees real internal links);
 * - anchors, mailto/tel and external URLs → plain <a>.
 */
export function SmartLink({ href, children, activeProps, activeOptions, ...rest }: SmartLinkProps) {
  const external =
    /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
  if (external) {
    const sameSite = href.startsWith(site.domain)
    return (
      <a
        href={href}
        rel={
          sameSite || href.startsWith('mailto:') || href.startsWith('tel:') ? undefined : 'noopener'
        }
        {...rest}
      >
        {children}
      </a>
    )
  }
  if (href.startsWith('#')) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }
  const path = href.split(/[?#]/)[0] ?? href
  const ported = PORTED.has(path === '' ? '/' : path.replace(/\/$/, '') || '/')
  if (!ported && site.legacyOrigin) {
    return (
      <a href={`${site.legacyOrigin}${href}`} data-legacy-link {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} activeProps={activeProps} activeOptions={activeOptions} {...rest}>
      {children}
    </Link>
  )
}
