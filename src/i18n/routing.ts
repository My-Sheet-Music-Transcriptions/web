import type { LocationRewrite } from '@tanstack/react-router'
import { sites } from './sites'
import { LOCALES, type Locale } from './types'

/**
 * How a locale shows up in URLs. This module is pure (no import.meta.env) so build scripts can use it too;
 * `src/site.ts` picks the mode of the running build.
 *
 * - `domain` (production): one build per locale, each on its own TLD; paths carry no locale.
 *     mysheetmusictranscriptions.com/pricing, mistranscripcionesmusicales.com/precios
 * - `path` (deploy previews, `pnpm dev`): one build with every locale under its own prefix.
 *     /en/pricing, /es/precios
 *
 * Routes, content paths and every `<Link to>` stay locale-free ("/pricing"); in path mode the router's URL
 * rewrite (src/router.tsx) strips the prefix on the way in and adds the current one on the way out. Never
 * hand-write "/es/..." in components or content.
 */
export type LocaleRouting = 'domain' | 'path'

/** Locale served at `/` in path mode and used for hreflang x-default. */
export const DEFAULT_LOCALE: Locale = 'en'

/** Paths that are never localized (server routes and static files shared by every locale). */
const UNLOCALIZED = /^\/(api|assets|og)(\/|$)/

/** Whether a locale-free path gets a locale (prefix or TLD); /api, /assets and /og are shared. */
export function isLocalized(path: string): boolean {
  return !UNLOCALIZED.test(path)
}

function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/** The locale prefix of a public pathname ("/es/precios" → "es"), if any. */
export function localeFromPathname(pathname: string): Locale | undefined {
  const first = pathname.split(/[/?#]/)[1]
  return isLocale(first) ? first : undefined
}

/** Splits "/es/precios" into { locale: 'es', path: '/precios' }; "/es" → "/". Unprefixed paths pass through. */
export function stripLocale(pathname: string): { locale?: Locale; path: string } {
  const locale = localeFromPathname(pathname)
  if (!locale) return { path: pathname }
  return { locale, path: pathname.slice(locale.length + 1) || '/' }
}

/** "/precios" → "/es/precios", "/" → "/es". Already-prefixed and unlocalized paths are returned unchanged. */
export function localizePath(locale: Locale, path: string): string {
  if (!isLocalized(path) || localeFromPathname(path)) return path
  const [, pathname = '/', rest = ''] = /^([^?#]*)(.*)$/.exec(path) ?? []
  return `/${locale}${pathname === '/' ? '' : pathname}${rest}`
}

/**
 * Where a locale's page lives, as an href usable from any other locale:
 * domain mode → absolute URL on that locale's TLD; path mode → `origin` + "/<locale><path>" (origin may be '').
 */
export function localeHref(mode: LocaleRouting, locale: Locale, path: string, origin = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (mode === 'domain') return `${sites[locale].domain}${clean}`
  return `${origin}${localizePath(locale, clean)}`
}

/**
 * Router URL rewrite of path mode (src/router.tsx): the router only ever sees locale-free paths, so routes
 * and `<Link to="/pricing">` are the same as in production, preloading included. In: "/es/precios" →
 * "/precios". Out: every href gets the prefix of the page being viewed, read from the real URL
 * (`currentPathname`, the history's location, per request on the server). Switching language is a document
 * navigation (LangSwitcher), so the prefix never changes within a client session.
 */
export function localePrefixRewrite(currentPathname: () => string): LocationRewrite {
  return {
    input: ({ url }) => {
      const { locale, path } = stripLocale(url.pathname)
      if (!locale) return undefined
      url.pathname = path
      return url
    },
    output: ({ url }) => {
      url.pathname = localizePath(
        localeFromPathname(currentPathname()) ?? DEFAULT_LOCALE,
        url.pathname,
      )
      return url
    },
  }
}
