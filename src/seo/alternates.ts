import { DEFAULT_LOCALE } from '../i18n/routing.ts'
import { sites } from '../i18n/sites/index.ts'
import type { Locale } from '../i18n/types.ts'

/** translationKey -> locale -> locale-free public path (src/i18n/hreflang.generated.json, scripts/lib/content-fs.ts). */
export type HreflangMap = Record<string, Partial<Record<Locale, string>>>

export interface Alternate {
  hreflang: string
  href: string
}

/**
 * The hreflang alternates of a translation, the one list both a page's <head> (head.ts) and its sitemap entry
 * (scripts/lib/sitemap.ts) print: every locale that has the page, plus x-default (the default locale's URL) when it is
 * one of them; none for a page with no translation. `href` makes the URL for the build's routing. Pure (relative
 * imports, no import.meta.env), so build scripts use it too.
 */
export function hreflangAlternates(
  translationKey: string,
  map: HreflangMap,
  href: (locale: Locale, path: string) => string,
): Alternate[] {
  const paths = map[translationKey] ?? {}
  const out: Alternate[] = []
  for (const [l, path] of Object.entries(paths))
    if (path) out.push({ hreflang: sites[l as Locale].lang, href: href(l as Locale, path) })
  if (out.length < 2) return []
  const def = paths[DEFAULT_LOCALE]
  if (def) out.push({ hreflang: 'x-default', href: href(DEFAULT_LOCALE, def) })
  return out
}
