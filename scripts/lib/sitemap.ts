import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { COLLECTIONS, type Collection } from '../../src/content/schema.ts'
import { type LocaleRouting, localeHref, localizePath } from '../../src/i18n/routing.ts'
import type { Locale } from '../../src/i18n/types.ts'
import { type Alternate, hreflangAlternates } from '../../src/seo/alternates.ts'
import { buildHreflangMap, CONTENT_DIR, type FsEntry, readAllEntries } from './content-fs.ts'

/**
 * The sitemaps, written by scripts/postbuild.ts: per locale an index at /sitemap.xml (what robots.txt and every page's
 * <link rel="sitemap"> name) and one sitemap per collection. They are made from the entries in content/, the same list
 * the build prerenders, so a page is never missed and nothing else (a crawled "/#contact") gets in; each URL carries
 * the hreflang alternates its <head> prints (src/seo/alternates.ts). A production build has one locale on its domain;
 * an all-languages build (path mode: previews, a site with no SITE_LOCALE) has the same files under each /<locale>,
 * with URLs on the deploy's origin, plus a parent /sitemap.xml over every language's sitemaps.
 */

/** The sitemap index, at the site's root. */
export const SITEMAP_INDEX = 'sitemap.xml'

/**
 * The sitemap of each collection, /<name>-sitemap.xml. Named like the WordPress sites' Yoast sitemaps, so the URLs
 * Search Console knows keep answering with the same kind of page. A new collection is a type error until it is named.
 */
export const SITEMAP_NAMES: Record<Collection, string> = {
  pages: 'page',
  services: 'services',
  posts: 'post',
  faqs: 'faqs',
  artists: 'artists',
  musicians: 'musicians',
  partners: 'partner',
  reviews: 'review',
}

/**
 * Sitemap URLs of the WordPress sites (docs/migration/redirects.md): Yoast's index and the child sitemaps of the
 * types the inventories saw, plus Yoast's taxonomy and author ones, and WordPress core's (the Catalan site). One list
 * for every domain, one by one because Netlify's _redirects has no wildcard inside a name.
 */
export const LEGACY_SITEMAPS: readonly string[] = [
  '/sitemap_index.xml',
  ...[
    'page',
    'post',
    'services',
    'popular',
    'endorsed',
    'partner',
    'product',
    'faqs',
    'review',
    'team',
    'category',
    'post_tag',
    'author',
  ].map((type) => `/${type}-sitemap.xml`),
  '/wp-sitemap.xml',
  '/wp-sitemap-posts-page-1.xml',
  '/wp-sitemap-posts-post-1.xml',
  '/wp-sitemap-taxonomies-category-1.xml',
  '/wp-sitemap-users-1.xml',
]

/** The protocol's limit per sitemap file. */
const MAX_URLS = 50_000

export interface SitemapUrl {
  loc: string
  lastmod?: string
  alternates: Alternate[]
}

export interface SitemapFile {
  /** Path in dist/client: page-sitemap.xml, en/page-sitemap.xml in path mode */
  file: string
  /** Its URL */
  loc: string
  collection: Collection
  urls: SitemapUrl[]
  xml: string
}

export interface Sitemaps {
  /** The locale's index: sitemap.xml, en/sitemap.xml in path mode */
  index: { file: string; xml: string }
  files: SitemapFile[]
}

/**
 * The index and the non-empty sitemap of each collection of a locale. `all` is every entry of every locale. URLs are
 * the build's: on the locale's domain in a production build, under /<locale> on `origin` in an all-languages one.
 */
export function buildSitemaps(
  locale: Locale,
  all: FsEntry[] = readAllEntries(),
  { mode, origin }: { mode: LocaleRouting; origin: string } = { mode: 'domain', origin: '' },
): Sitemaps {
  const map = buildHreflangMap(all)
  const href = (l: Locale, p: string) => localeHref(mode, l, p, origin)
  // Where this locale's files go: the root of a production build, /<locale> in an all-languages one.
  const at = (p: string) => (mode === 'path' ? localizePath(locale, p) : p).slice(1)
  const entries = all.filter((e) => e.locale === locale && !e.meta.draft && !e.meta.noindex)
  const files: SitemapFile[] = []
  for (const collection of COLLECTIONS) {
    const urls = entries
      .filter((e) => e.collection === collection)
      .sort((a, b) => (a.path < b.path ? -1 : 1))
      .map((e) => ({
        loc: href(locale, e.path),
        lastmod: e.meta.updated ?? gitLastModified(e.dir),
        alternates: hreflangAlternates(e.meta.translationKey, map, href),
      }))
    if (!urls.length) continue
    const name = `/${SITEMAP_NAMES[collection]}-sitemap.xml`
    if (urls.length > MAX_URLS)
      throw new Error(`${at(name)}: ${urls.length} URLs, over the ${MAX_URLS} a sitemap may hold`)
    files.push({ file: at(name), loc: href(locale, name), collection, urls, xml: urlsetXml(urls) })
  }
  return { index: { file: at(`/${SITEMAP_INDEX}`), xml: sitemapIndexXml(files) }, files }
}

/**
 * A sitemap index over these sitemaps: a locale's index, or the parent at the root of an all-languages build, which
 * lists every language's sitemaps themselves (an index may not list another index).
 */
export function sitemapIndexXml(files: readonly SitemapFile[]): string {
  return indexXml(files.map((f) => ({ loc: f.loc, lastmod: newest(f.urls) })))
}

/**
 * Netlify _redirects rules: every WordPress sitemap URL a locale's build did not write goes to its index (under
 * /<locale> in an all-languages build, so previews show what production does).
 */
export function legacySitemapRedirects({ index, files }: Sitemaps): string[] {
  const target = `/${index.file}`
  const prefix = target.slice(0, -`/${SITEMAP_INDEX}`.length)
  const served = new Set(files.map((f) => `/${f.file}`))
  return LEGACY_SITEMAPS.map((u) => `${prefix}${u}`)
    .filter((u) => !served.has(u))
    .map((u) => `${u}  ${target}  301`)
}

let history: boolean | undefined

/** Whether git has this checkout's history; a shallow clone would date every page by its one commit. */
export function hasGitHistory(): boolean {
  if (history === undefined)
    try {
      const shallow = execFileSync('git', ['rev-parse', '--is-shallow-repository'], {
        encoding: 'utf8',
      })
      history = shallow.trim() === 'false'
    } catch {
      history = false
    }
  return history
}

/** Date of the last commit touching the page folder (its text, meta or pictures); none without git history. */
function gitLastModified(dir: string): string | undefined {
  if (!hasGitHistory()) return undefined
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', path.posix.join(CONTENT_DIR, dir)],
      { encoding: 'utf8' },
    ).trim()
    return out || undefined
  } catch {
    return undefined
  }
}

function newest(urls: SitemapUrl[]): string | undefined {
  return urls.reduce<string | undefined>(
    (max, u) => (u.lastmod && (!max || u.lastmod > max) ? u.lastmod : max),
    undefined,
  )
}

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>'
const SITEMAP_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlsetXml(urls: SitemapUrl[]): string {
  const lines = [
    XML_HEAD,
    `<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
  ]
  for (const u of urls) {
    lines.push('  <url>', `    <loc>${escapeXml(u.loc)}</loc>`)
    if (u.lastmod) lines.push(`    <lastmod>${u.lastmod}</lastmod>`)
    for (const a of u.alternates)
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}"/>`,
      )
    lines.push('  </url>')
  }
  lines.push('</urlset>', '')
  return lines.join('\n')
}

function indexXml(sitemaps: { loc: string; lastmod?: string }[]): string {
  const lines = [XML_HEAD, `<sitemapindex xmlns="${SITEMAP_NS}">`]
  for (const s of sitemaps) {
    lines.push('  <sitemap>', `    <loc>${escapeXml(s.loc)}</loc>`)
    if (s.lastmod) lines.push(`    <lastmod>${s.lastmod}</lastmod>`)
    lines.push('  </sitemap>')
  }
  lines.push('</sitemapindex>', '')
  return lines.join('\n')
}
