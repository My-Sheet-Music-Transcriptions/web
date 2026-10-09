/**
 * Where every og:image lives. The one place that names them: the <head> (src/seo/head.ts) links exactly what the
 * build writes (scripts/lib/og.ts, run by prebuild for every page), so no page can point at an image that was not made.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const

interface OgEntry {
  locale: string
  collection: string
  slug: string
  meta: { og?: { image?: { src: string } } }
}

/** A page's og:image: its own picture (`og.image` in meta.ts, cropped to a JPEG) or else its Satori card (PNG). */
export function entryOgImage(e: OgEntry): string {
  return `/og/${e.locale}/${e.collection}/${e.slug}.${e.meta.og?.image ? 'jpg' : 'png'}`
}

/** The locale's Satori site card: the og:image of every page that is not an entry (404, error page). */
export function siteOgImage(locale: string): string {
  return `/og/${locale}/site.png`
}
