import fs from 'node:fs'
import path from 'node:path'
import { DEFAULT_LOCALE } from '../src/i18n/routing'
import { entriesFor } from './lib/content-fs'
import { resolveLocaleRouting } from './lib/site-locale'
import { buildSitemaps, hasGitHistory, legacySitemapRedirects, SITEMAP_INDEX } from './lib/sitemap'

/**
 * Runs after `vite build`, writing to dist/client (not public/, so `pnpm dev`, which emulates Netlify redirects,
 * never serves a stale file):
 * - path mode (previews): a Netlify _redirects file so "/" goes to the default locale and unknown paths under a
 *   locale get that locale's 404 page; no sitemaps (previews are not indexed);
 * - domain mode (production): the sitemaps (scripts/lib/sitemap.ts) and a _redirects file sending the WordPress
 *   sites' sitemap URLs to the index.
 */
const { mode, locale, locales } = resolveLocaleRouting(process.env.SITE_LOCALE)
const dir = 'dist/client'
const out = path.join(dir, '_redirects')

if (mode === 'path') {
  const served = locales.filter((l) => entriesFor(l).length)
  const rules = [`/  /${DEFAULT_LOCALE}  302`, ...served.map((l) => `/${l}/*  /${l}/404.html  404`)]
  fs.writeFileSync(out, `${rules.join('\n')}\n`)
  console.log(`[postbuild] ${out}: ${rules.length} rules`)
} else {
  const { index, files } = buildSitemaps(locale)
  fs.writeFileSync(path.join(dir, SITEMAP_INDEX), index)
  for (const f of files) fs.writeFileSync(path.join(dir, f.file), f.xml)
  const listed = files.map((f) => `${f.file} (${f.urls.length})`).join(', ') || 'no pages yet'
  console.log(`[postbuild] ${path.join(dir, SITEMAP_INDEX)}: ${listed}`)
  if (!hasGitHistory())
    console.warn('[postbuild] shallow clone: sitemaps carry only the lastmod dates set in meta.ts')
  const rules = legacySitemapRedirects(files.map((f) => f.file))
  fs.writeFileSync(out, `${rules.join('\n')}\n`)
  console.log(`[postbuild] ${out}: ${rules.length} rules`)
}
