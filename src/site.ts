import { getSiteConfig } from './i18n/sites'
import type { Locale } from './i18n/types'

/** The locale this build was produced for (injected by vite.config.ts from SITE_LOCALE). */
export const SITE_LOCALE: Locale = (import.meta.env.SITE_LOCALE as Locale | undefined) ?? 'en'

/** The active site's configuration: domain, strings, navigation, contact facts. */
export const site = getSiteConfig(SITE_LOCALE)

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${site.domain}${clean === '/' ? '/' : clean.replace(/\/$/, '')}`
}
