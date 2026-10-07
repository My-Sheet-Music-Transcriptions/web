import type { LocaleRouting } from '../../src/i18n/routing'
import { LOCALES, type Locale } from '../../src/i18n/types'

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
