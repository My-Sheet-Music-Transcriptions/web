import fs from 'node:fs'
import { sites } from '../src/i18n/sites'
import { checkSlugs, entriesFor, writeHreflangMap, writePortedPaths } from './lib/content-fs'
import { buildOgImages } from './lib/og'
import { resolveSiteLocale } from './lib/site-locale'

/** Runs before `vite build`: validates content, writes the hreflang map, robots.txt and OG images. */
const locale = resolveSiteLocale(process.env.SITE_LOCALE)
const site = sites[locale]

const problems = checkSlugs()
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
writeHreflangMap()
writePortedPaths(locale)

fs.mkdirSync('public', { recursive: true })
fs.writeFileSync(
  'public/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.domain}/sitemap.xml\n`,
)

const entries = entriesFor(locale)
const made = await buildOgImages(entries, site)
console.log(`[prebuild] ${locale}: ${entries.length} entries, ${made} OG images rendered`)
