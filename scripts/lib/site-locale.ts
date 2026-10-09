import type { LocaleRouting } from '../../src/i18n/routing.ts'
import { LOCALES, type Locale } from '../../src/i18n/types.ts'

/** Validates SITE_LOCALE (build-time env) and defaults to English. */
export function resolveSiteLocale(value: string | undefined): Locale {
  if (!value || value === 'all') return 'en'
  if ((LOCALES as readonly string[]).includes(value)) return value as Locale
  throw new Error(`SITE_LOCALE must be one of ${LOCALES.join(', ')} or "all"; got "${value}"`)
}

/**
 * What a build serves, from SITE_LOCALE (see src/i18n/routing.ts):
 * - one locale ("es")       → domain mode: that locale only, on its own TLD (production);
 * - unset or "all"          → path mode: every locale under /<locale> (deploy previews, `pnpm dev`).
 */
export function resolveLocaleRouting(value: string | undefined): {
  mode: LocaleRouting
  locale: Locale
  locales: readonly Locale[]
} {
  const locale = resolveSiteLocale(value)
  if (!value || value === 'all') return { mode: 'path', locale, locales: LOCALES }
  return { mode: 'domain', locale, locales: [locale] }
}

/**
 * Origin of an all-languages (path-mode) deploy, for its absolute URLs (canonicals, Open Graph, sitemaps): on Netlify
 * the site's main address for a production deploy (URL, not the per-branch DEPLOY_PRIME_URL) and the deploy's own for
 * previews and branch deploys; '' anywhere else.
 */
export function deployOrigin(env: Record<string, string | undefined> = process.env): string {
  const url = env.CONTEXT === 'production' ? env.URL : env.DEPLOY_PRIME_URL
  return (url ?? '').replace(/\/+$/, '')
}

/** Where `pnpm serve:dist` serves a build: the origin of the sitemaps of a path build made outside Netlify. */
export const LOCAL_ORIGIN = 'http://localhost:4173'
