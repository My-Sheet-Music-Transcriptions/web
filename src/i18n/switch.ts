import portedPaths from '~/content/paths.generated.json'
import { LOCALE_ROUTING, siteUrl } from '~/site'
import { sites } from './sites'
import type { Locale } from './types'

const ported = portedPaths as Partial<Record<Locale, string[]>>

/**
 * href of a language-switcher entry: the locale's TLD in production; in path-mode previews "/<locale>/..."
 * when that locale has pages in the repo, else its live site (so previews never link to a missing locale).
 */
export function localeSwitchHref(locale: Locale, path = '/'): string {
  if (LOCALE_ROUTING === 'path' && !ported[locale]?.includes(path))
    return `${sites[locale].legacyOrigin ?? sites[locale].domain}${path}`
  return siteUrl(locale, path)
}
