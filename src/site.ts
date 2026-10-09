import { useRouterState } from '@tanstack/react-router'
import {
  DEFAULT_LOCALE,
  type LocaleRouting,
  localeFromPathname,
  localeHref,
  localizePath,
} from './i18n/routing'
import { getSiteConfig } from './i18n/sites'
import { LOCALES, type Locale, type SiteConfig } from './i18n/types'

/**
 * Locale routing of this build (injected by vite.config.ts): `domain` when SITE_LOCALE names one locale
 * (production, one site per TLD), `path` when it is unset or "all" (deploy previews, `pnpm dev`).
 * Builds without the define (Storybook, design-system export, unit tests) are domain builds.
 */
export const LOCALE_ROUTING: LocaleRouting =
  import.meta.env.LOCALE_ROUTING === 'path' ? 'path' : 'domain'

/** The one locale of a domain build (also the fallback of a path build). */
export const SITE_LOCALE: Locale = (import.meta.env.SITE_LOCALE as Locale | undefined) ?? 'en'

/** Locales served by this build. */
export const SITE_LOCALES: readonly Locale[] = LOCALE_ROUTING === 'path' ? LOCALES : [SITE_LOCALE]

/** Origin of a path build's deploy (scripts/lib/site-locale.ts deployOrigin()), for absolute URLs; '' when unknown. */
const PREVIEW_ORIGIN = import.meta.env.PREVIEW_ORIGIN ?? ''

/** Locale of a public URL path (the browser's, before the router rewrite). */
export function localeOf(publicHref: string): Locale {
  if (LOCALE_ROUTING === 'domain') return SITE_LOCALE
  return localeFromPathname(publicHref) ?? DEFAULT_LOCALE
}

/** Locale of the page being rendered. */
export function useLocale(): Locale {
  // LOCALE_ROUTING is a build-time constant, so the hook order never changes within a build.
  if (LOCALE_ROUTING === 'domain') return SITE_LOCALE
  // biome-ignore lint/correctness/useHookAtTopLevel: constant condition per build
  return useRouterState({ select: (s) => localeOf(s.location.publicHref) })
}

/** Configuration (domain, strings, nav, contact facts) of the page's locale. */
export function useSite(): SiteConfig {
  return getSiteConfig(useLocale())
}

/**
 * Public href of a locale-free path in the current locale, for the few places that are not a router <Link>
 * (form fields, server redirects): "/gift-card" in production, "/es/gift-card" in an /es preview.
 */
export function usePublicPath(path: string): string {
  const locale = useLocale()
  return LOCALE_ROUTING === 'path' ? localizePath(locale, path) : path
}

/** Link to `path` in another locale: its TLD in production, "/<locale><path>" in previews. */
export function siteUrl(locale: Locale, path: string): string {
  return localeHref(LOCALE_ROUTING, locale, path)
}

/** Absolute URL of a path in a locale (canonical, Open Graph, JSON-LD). */
export function absoluteUrl(locale: Locale, path: string): string {
  if (/^https?:\/\//.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  const trimmed = clean === '/' ? '/' : clean.replace(/\/$/, '')
  // Static files (/og/..., /favicon.ico) are shared by every locale of a path build.
  if (LOCALE_ROUTING === 'path' && /\.[a-z0-9]+$/i.test(trimmed))
    return `${PREVIEW_ORIGIN}${trimmed}`
  return localeHref(LOCALE_ROUTING, locale, trimmed, PREVIEW_ORIGIN)
}

export { getSiteConfig }
