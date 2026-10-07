import { LOCALES, type Locale } from '../../src/i18n/types'

/** Validates SITE_LOCALE (build-time env) and defaults to English. */
export function resolveSiteLocale(value: string | undefined): Locale {
  if (!value) return 'en'
  if ((LOCALES as readonly string[]).includes(value)) return value as Locale
  throw new Error(`SITE_LOCALE must be one of ${LOCALES.join(', ')}; got "${value}"`)
}
