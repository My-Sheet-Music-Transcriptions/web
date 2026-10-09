import fs from 'node:fs'
import path from 'node:path'
import { DEFAULT_LOCALE } from '../src/i18n/routing'
import { entriesFor, readAllEntries } from './lib/content-fs'
import { deployOrigin, LOCAL_ORIGIN, resolveLocaleRouting } from './lib/site-locale'
import {
  buildSitemaps,
  hasGitHistory,
  legacySitemapRedirects,
  SITEMAP_INDEX,
  type SitemapFile,
  type Sitemaps,
  sitemapIndexXml,
} from './lib/sitemap'

/**
 * Runs after `vite build`, writing to dist/client (not public/, so `pnpm dev`, which emulates Netlify redirects,
 * never serves a stale file) the sitemaps (scripts/lib/sitemap.ts) and a Netlify _redirects file:
 * - domain mode (production): the locale's sitemaps; the WordPress sitemap URLs go to its index;
 * - path mode (every locale under /<locale>: previews, a site with no SITE_LOCALE): each locale's sitemaps under its
 *   prefix and a parent /sitemap.xml over all of them; the WordPress sitemap URLs under each prefix go to that
 *   locale's index, "/" goes to the default locale and unknown paths under a locale get its 404 page.
 */
const { mode, locale, locales } = resolveLocaleRouting(process.env.SITE_LOCALE)
const dir = 'dist/client'
const out = path.join(dir, '_redirects')
const all = readAllEntries()

function write({ index, files }: Sitemaps): void {
  for (const f of [index, ...files]) {
    fs.mkdirSync(path.dirname(path.join(dir, f.file)), { recursive: true })
    fs.writeFileSync(path.join(dir, f.file), f.xml)
  }
  const listed = files.map((f) => `${f.file} (${f.urls.length})`).join(', ') || 'no pages yet'
  console.log(`[postbuild] ${path.join(dir, index.file)}: ${listed}`)
}

let rules: string[]
if (mode === 'path') {
  const origin = deployOrigin() || LOCAL_ORIGIN
  const served = locales.filter((l) => entriesFor(l).length)
  const children: SitemapFile[] = []
  const legacy: string[] = []
  for (const l of served) {
    const sitemaps = buildSitemaps(l, all, { mode, origin })
    write(sitemaps)
    children.push(...sitemaps.files)
    legacy.push(...legacySitemapRedirects(sitemaps))
  }
  fs.writeFileSync(path.join(dir, SITEMAP_INDEX), sitemapIndexXml(children))
  console.log(
    `[postbuild] ${path.join(dir, SITEMAP_INDEX)}: ${children.length} sitemaps (${origin})`,
  )
  // Netlify takes the first rule that matches: the sitemap ones before each locale's catch-all 404.
  rules = [
    ...legacy,
    `/  /${DEFAULT_LOCALE}  302`,
    ...served.map((l) => `/${l}/*  /${l}/404.html  404`),
  ]
} else {
  const sitemaps = buildSitemaps(locale, all)
  write(sitemaps)
  rules = legacySitemapRedirects(sitemaps)
}
if (!hasGitHistory())
  console.warn('[postbuild] shallow clone: sitemaps carry only the lastmod dates set in meta.ts')
fs.writeFileSync(out, `${rules.join('\n')}\n`)
console.log(`[postbuild] ${out}: ${rules.length} rules`)
