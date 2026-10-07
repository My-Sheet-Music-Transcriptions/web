import fs from 'node:fs'
import { sites } from '../src/i18n/sites'
import { checkSlugs, entriesFor, writeHreflangMap, writePortedPaths } from './lib/content-fs'
import { buildOgImages } from './lib/og'
import { resolveLocaleRouting } from './lib/site-locale'

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
    : // Path-mode previews (every locale under /<locale>) are never indexed.
      'User-agent: *\nDisallow: /\n',
)
// Stale from an older checkout (it now goes straight to dist/client, see postbuild.ts).
fs.rmSync('public/_redirects', { force: true })

for (const l of locales) {
  const entries = entriesFor(l)
  if (!entries.length) continue
  const made = await buildOgImages(entries, sites[l])
  console.log(`[prebuild] ${l} (${mode}): ${entries.length} entries, ${made} OG images rendered`)
}
