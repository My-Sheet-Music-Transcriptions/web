import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'
import {
  COLLECTIONS,
  type Collection,
  type EntryMeta,
  parseFrontmatter,
  pathFor,
  RESERVED_SLUGS,
} from '../../src/content/schema'
import {
  DEFAULT_LOCALE,
  type LocaleRouting,
  localeHref,
  localizePath,
} from '../../src/i18n/routing'
import { sites } from '../../src/i18n/sites'
import { LOCALES, type Locale } from '../../src/i18n/types'

/** Node-side view of src/content for build scripts and vite.config.ts (no import.meta.glob here). */

export interface FsEntry {
  locale: Locale
  collection: Collection
  slug: string
  path: string
  url: string
  file: string
  meta: EntryMeta
  body: string
}

const ROOT = path.resolve(process.cwd(), 'src/content')

export function readAllEntries(): FsEntry[] {
  const files = fg.sync(
    [
      '*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*/index.mdx',
      '*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*.mdx',
    ],
    { cwd: ROOT },
  )
  return files.map((rel) => {
    const [locale, collection, name] = rel.split('/') as [Locale, Collection, string]
    if (!LOCALES.includes(locale)) throw new Error(`Unknown locale folder in ${rel}`)
    if (!COLLECTIONS.includes(collection)) throw new Error(`Unknown collection folder in ${rel}`)
    // <slug>/index.mdx (a page folder with its images) or the flat <slug>.mdx
    const slug = name.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(ROOT, rel), 'utf8')
    const { data, content } = matter(raw)
    const meta = parseFrontmatter(collection, data, rel)
    const site = sites[locale]
    const p = pathFor(collection, slug, site.routes)
    return {
      locale,
      collection,
      slug,
      path: p,
      url: `${site.domain}${p === '/' ? '/' : p}`,
      file: rel,
      meta,
      body: content,
    }
  })
}

export function entriesFor(locale: Locale): FsEntry[] {
  return readAllEntries().filter((e) => e.locale === locale && !e.meta.draft)
}

/** Fails on duplicate public paths within a locale and on reserved slugs. */
export function checkSlugs(all = readAllEntries()): string[] {
  const problems: string[] = []
  for (const locale of LOCALES) {
    const seen = new Map<string, string>()
    for (const e of all.filter((x) => x.locale === locale)) {
      const first = seen.get(e.path)
      if (first) problems.push(`${locale}: ${e.path} is defined by both ${first} and ${e.file}`)
      seen.set(e.path, e.file)
      if (
        RESERVED_SLUGS.includes(e.slug) &&
        !(e.collection === 'faqs' || e.collection === 'reviews')
      )
        problems.push(`${locale}: slug "${e.slug}" in ${e.file} is reserved`)
      if (e.collection === 'pages' && e.slug === 'home' && e.meta.translationKey !== 'home')
        problems.push(`${locale}: pages/home must have translationKey "home"`)
    }
  }
  return problems
}

export type HreflangMap = Record<string, Partial<Record<Locale, string>>>

/**
 * translationKey -> locale -> locale-free public path, across every locale in the repo. The URL is made where
 * it is used (head.ts, sitemap), for the build's locale routing: the locale's TLD or a /<locale> prefix.
 */
export function buildHreflangMap(all = readAllEntries()): HreflangMap {
  const map: HreflangMap = {}
  for (const e of all) {
    if (e.meta.draft || e.meta.noindex) continue
    const key = e.meta.translationKey
    map[key] ??= {}
    const existing = map[key][e.locale]
    if (existing && existing !== e.path)
      throw new Error(
        `translationKey "${key}" used twice in ${e.locale}: ${existing} and ${e.path}`,
      )
    map[key][e.locale] = e.path
  }
  return map
}

export function writeHreflangMap(outFile = 'src/i18n/hreflang.generated.json'): HreflangMap {
  const map = buildHreflangMap()
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, `${JSON.stringify(map, null, 2)}\n`)
  return map
}

/** locale -> locale-free public paths (read by SmartLink to tell ported pages from legacy ones). */
export function writePortedPaths(
  outFile = 'src/content/paths.generated.json',
): Partial<Record<Locale, string[]>> {
  const all = readAllEntries().filter((e) => !e.meta.draft)
  const out: Partial<Record<Locale, string[]>> = {}
  for (const locale of LOCALES) {
    const paths = all
      .filter((e) => e.locale === locale)
      .map((e) => e.path)
      .sort()
    if (paths.length) out[locale] = paths
  }
  fs.writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`)
  return out
}

function gitLastModified(file: string): string | undefined {
  try {
    const out = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', path.join('src/content', file)],
      { encoding: 'utf8' },
    ).trim()
    return out || undefined
  } catch {
    return undefined
  }
}

interface PrerenderPage {
  path: string
  prerender: { enabled: boolean; outputPath?: string }
  sitemap?: Record<string, unknown>
}

/**
 * The `pages` option for tanstackStart(). Domain mode: every entry of the locale with sitemap metadata.
 * Path mode (previews): every entry of every locale under /<locale>, no sitemap.
 */
export function listPrerenderPages(
  locales: readonly Locale[],
  mode: LocaleRouting,
): PrerenderPage[] {
  const problems = checkSlugs()
  if (problems.length) throw new Error(`Content slug problems:\n${problems.join('\n')}`)
  const map = writeHreflangMap()
  writePortedPaths()
  if (mode === 'path') {
    const pages: PrerenderPage[] = []
    for (const locale of locales) {
      const entries = entriesFor(locale)
      if (!entries.length) continue
      for (const e of entries)
        pages.push({
          path: localizePath(locale, e.path),
          prerender: { enabled: true },
          sitemap: { exclude: true },
        })
      pages.push({
        path: localizePath(locale, '/404'),
        prerender: { enabled: true, outputPath: `/${locale}/404.html` },
        sitemap: { exclude: true },
      })
    }
    return pages
  }
  const [locale = DEFAULT_LOCALE] = locales
  const site = sites[locale]
  const entries = entriesFor(locale)
  const pages: PrerenderPage[] = entries.map((e) => {
    const alternates = map[e.meta.translationKey] ?? {}
    const alternateRefs = Object.entries(alternates).map(([l, p]) => ({
      hreflang: sites[l as Locale].lang,
      href: localeHref('domain', l as Locale, p as string),
    }))
    const def = alternates[DEFAULT_LOCALE]
    if (def && alternateRefs.length > 1)
      alternateRefs.push({ hreflang: 'x-default', href: localeHref('domain', DEFAULT_LOCALE, def) })
    return {
      path: e.path,
      prerender: { enabled: true },
      sitemap: e.meta.noindex
        ? { exclude: true }
        : {
            priority: e.path === '/' ? 1 : e.collection === 'posts' ? 0.6 : 0.8,
            changefreq: (e.collection === 'posts' ? 'monthly' : 'weekly') as 'monthly' | 'weekly',
            lastmod: e.meta.updated ?? gitLastModified(e.file),
            alternateRefs: alternateRefs.length > 2 ? alternateRefs : undefined,
          },
    }
  })
  pages.push({
    path: '/404',
    prerender: { enabled: true, outputPath: '/404.html' },
    sitemap: { exclude: true },
  })
  for (const p of site.ssrOnlyPaths)
    pages.push({ path: p, prerender: { enabled: false }, sitemap: { exclude: true } })
  return pages
}
