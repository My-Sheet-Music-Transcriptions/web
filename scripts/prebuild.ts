import fs from 'node:fs'
import { sites } from '../src/i18n/sites'
import { checkSlugs, entriesFor, writeHreflangMap, writePortedPaths } from './lib/content-fs'
import { buildOgImages } from './lib/og'
import { deployOrigin, LOCAL_ORIGIN, resolveLocaleRouting } from './lib/site-locale'

/** Runs before `vite build`: validates content, writes the hreflang map, robots.txt and OG images. */
const { mode, locale, locales } = resolveLocaleRouting(process.env.SITE_LOCALE)
const site = sites[locale]

const problems = checkSlugs()
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
writeHreflangMap()
writePortedPaths()

fs.mkdirSync('public', { recursive: true })
fs.writeFileSync(
  'public/robots.txt',
  mode === 'domain'
    ? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.domain}/sitemap.xml\n`
    : // Every locale under /<locale> (previews, a site with no SITE_LOCALE): never indexed, its sitemaps still named.
      `User-agent: *\nDisallow: /\n\nSitemap: ${deployOrigin() || LOCAL_ORIGIN}/sitemap.xml\n`,
)
// Stale from an older checkout (it now goes straight to dist/client, see postbuild.ts).
fs.rmSync('public/_redirects', { force: true })

// Every og:image the <head> can link, the site card of a locale with no pages yet included (its 404).
for (const l of locales) {
  const entries = entriesFor(l)
  const made = await buildOgImages(entries, sites[l])
  console.log(`[prebuild] ${l} (${mode}): ${entries.length} entries, ${made} OG images rendered`)
}
