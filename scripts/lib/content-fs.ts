import fs from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import { DATA_PAGE_FILE, splitDataPage } from '../../src/content/data-page.ts'
import { menuPages, parseMenu } from '../../src/content/menu.ts'
import { parseRedirects, type RedirectRule, redirectProblems } from '../../src/content/redirects.ts'
import {
  COLLECTIONS,
  type Collection,
  type EntryMeta,
  parseMeta,
  pathFor,
  RESERVED_SLUGS,
} from '../../src/content/schema.ts'
import { DEFAULT_LOCALE, type LocaleRouting, localizePath } from '../../src/i18n/routing.ts'
import { sites } from '../../src/i18n/sites/index.ts'
import { LOCALES, type Locale } from '../../src/i18n/types.ts'
import type { HreflangMap } from '../../src/seo/alternates.ts'
import { readDefaultExportLiteral } from './ts-literal.ts'

/**
 * Node-side view of content/ for build scripts and vite.config.ts (no import.meta.glob here). A page is a folder
 * content/<locale>/<collection>/<slug>/ with its pictures and either meta.ts (a plain literal, read statically: it
 * never runs) and index.tsx (the page component, compiled by Vite), or page.json, a data page edited in the CMS
 * (src/content/data-page.ts: the meta fields and the blocks in one file).
 */

export interface FsEntry {
  locale: Locale
  collection: Collection
  slug: string
  path: string
  url: string
  /** The page folder relative to content/, e.g. en/pages/gift-card */
  dir: string
  /** dir + '/meta.ts' (or '/page.json') */
  file: string
  /** dir + '/index.tsx' (or '/page.json') */
  page: string
  /** A hand-built page (index.tsx + meta.ts) or a data page (page.json, edited in the CMS). */
  kind: 'tsx' | 'data'
  meta: EntryMeta
}

/** The content folder, relative to the repo root. */
export const CONTENT_DIR = 'content'
const ROOT = path.resolve(process.cwd(), CONTENT_DIR)
const COLLECTION_GLOB = `{${COLLECTIONS.join(',')}}`

/** Parses and validates a meta.ts source; `file` is relative to content/ (<locale>/<collection>/<slug>/meta.ts). */
export function readMetaSource(text: string, file: string): EntryMeta {
  const collection = file.split('/')[1] as Collection
  if (!COLLECTIONS.includes(collection)) throw new Error(`Unknown collection folder in ${file}`)
  return parseMeta(collection, readDefaultExportLiteral(text, file), file)
}

/** Parses and validates a page.json's meta; `file` is relative to content/ (<locale>/<collection>/<slug>/page.json). */
export function readDataPageSource(text: string, file: string): EntryMeta {
  const collection = file.split('/')[1] as Collection
  if (!COLLECTIONS.includes(collection)) throw new Error(`Unknown collection folder in ${file}`)
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch (e) {
    throw new Error(`${file}: invalid JSON (${(e as Error).message})`)
  }
  return parseMeta(collection, splitDataPage(data, file).meta, file)
}

export function readAllEntries(): FsEntry[] {
  const metas = fg.sync(`*/${COLLECTION_GLOB}/*/meta.ts`, { cwd: ROOT })
  const pages = fg.sync(`*/${COLLECTION_GLOB}/*/index.tsx`, { cwd: ROOT })
  const dataPages = fg.sync(`*/${COLLECTION_GLOB}/*/${DATA_PAGE_FILE}`, { cwd: ROOT })
  for (const rel of pages)
    if (!metas.includes(rel.replace(/index\.tsx$/, 'meta.ts')))
      throw new Error(
        `${CONTENT_DIR}/${rel} has no meta.ts beside it (title, description, translationKey…)`,
      )
  for (const rel of dataPages)
    if (metas.includes(rel.replace(DATA_PAGE_FILE, 'meta.ts')))
      throw new Error(
        `${CONTENT_DIR}/${path.posix.dirname(rel)} has both a page.json and a meta.ts: a page is one or the other`,
      )
  const entry = (rel: string, kind: FsEntry['kind']): FsEntry => {
    const [locale, collection, slug] = rel.split('/') as [Locale, Collection, string]
    if (!LOCALES.includes(locale)) throw new Error(`Unknown locale folder in ${rel}`)
    const dir = path.posix.dirname(rel)
    const page = kind === 'data' ? rel : `${dir}/index.tsx`
    if (!fs.existsSync(path.join(ROOT, page)))
      throw new Error(`${CONTENT_DIR}/${rel} has no index.tsx beside it (the page component)`)
    const text = fs.readFileSync(path.join(ROOT, rel), 'utf8')
    const meta = kind === 'data' ? readDataPageSource(text, rel) : readMetaSource(text, rel)
    const site = sites[locale]
    const p = pathFor(collection, slug, site.routes)
    return {
      locale,
      collection,
      slug,
      path: p,
      url: `${site.domain}${p === '/' ? '/' : p}`,
      dir,
      file: rel,
      page,
      kind,
      meta,
    }
  }
  return [
    ...metas.map((rel) => entry(rel, 'tsx')),
    ...dataPages.map((rel) => entry(rel, 'data')),
  ].sort((a, b) => (a.dir < b.dir ? -1 : a.dir > b.dir ? 1 : 0))
}

export function entriesFor(locale: Locale): FsEntry[] {
  return readAllEntries().filter((e) => e.locale === locale && !e.meta.draft)
}

/**
 * Fails on duplicate public paths within a locale, on reserved slugs, on a menu (content/<locale>/data/menu.json)
 * that is invalid or points at a page its language does not have, and on redirects (redirects.json) that are invalid,
 * hide a page, chain or lead nowhere.
 */
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
  return [...problems, ...checkMenus(all), ...checkRedirects(all)]
}

/** A language's redirects (content/<locale>/data/redirects.json, src/content/redirects.ts), or none. */
export function redirectsFor(locale: Locale): RedirectRule[] {
  const file = `${CONTENT_DIR}/${locale}/data/redirects.json`
  if (!fs.existsSync(file)) return []
  return parseRedirects(JSON.parse(fs.readFileSync(file, 'utf8')), file)
}

function checkRedirects(all: FsEntry[]): string[] {
  const problems: string[] = []
  for (const locale of LOCALES) {
    let rules: RedirectRule[]
    try {
      rules = redirectsFor(locale)
    } catch (e) {
      problems.push((e as Error).message)
      continue
    }
    const pages = new Set(
      all.filter((e) => e.locale === locale && !e.meta.draft).map((e) => e.path),
    )
    problems.push(...redirectProblems(rules, pages, `${CONTENT_DIR}/${locale}/data/redirects.json`))
  }
  return problems
}

function checkMenus(all: FsEntry[]): string[] {
  const problems: string[] = []
  for (const locale of LOCALES) {
    const file = `${CONTENT_DIR}/${locale}/data/menu.json`
    if (!fs.existsSync(file)) continue
    let pages: ReturnType<typeof menuPages>
    try {
      pages = menuPages(parseMenu(JSON.parse(fs.readFileSync(file, 'utf8')), file))
    } catch (e) {
      problems.push((e as Error).message)
      continue
    }
    const paths = new Set(
      all.filter((e) => e.locale === locale && !e.meta.draft).map((e) => e.path),
    )
    for (const { page, at } of pages)
      if (!paths.has(page))
        problems.push(
          `${file} ${at}: ${locale} has no page ${page} (pick another, or write it as an address)`,
        )
  }
  return problems
}

/**
 * translationKey -> locale -> locale-free public path, across every locale in the repo. The URLs are made where they
 * are used (head.ts, scripts/lib/sitemap.ts, both through src/seo/alternates.ts), for the build's locale routing: the
 * locale's TLD or a /<locale> prefix.
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

interface PrerenderPage {
  path: string
  prerender: { enabled: boolean; outputPath?: string }
}

/**
 * The `pages` option for tanstackStart(): what is prerendered. Domain mode: every entry of the locale. Path mode
 * (previews): every entry of every locale under /<locale>. The sitemaps are not made from this list (nor from the
 * prerender's crawl) but from the entries themselves, by scripts/lib/sitemap.ts.
 */
export function listPrerenderPages(
  locales: readonly Locale[],
  mode: LocaleRouting,
): PrerenderPage[] {
  const problems = checkSlugs()
  if (problems.length) throw new Error(`Content slug problems:\n${problems.join('\n')}`)
  writeHreflangMap()
  writePortedPaths()
  if (mode === 'path') {
    const pages: PrerenderPage[] = []
    for (const locale of locales) {
      const entries = entriesFor(locale)
      if (!entries.length) continue
      for (const e of entries)
        pages.push({ path: localizePath(locale, e.path), prerender: { enabled: true } })
      pages.push({
        path: localizePath(locale, '/404'),
        prerender: { enabled: true, outputPath: `/${locale}/404.html` },
      })
    }
    return pages
  }
  const [locale = DEFAULT_LOCALE] = locales
  const pages: PrerenderPage[] = entriesFor(locale).map((e) => ({
    path: e.path,
    prerender: { enabled: true },
  }))
  pages.push({ path: '/404', prerender: { enabled: true, outputPath: '/404.html' } })
  for (const p of sites[locale].ssrOnlyPaths) pages.push({ path: p, prerender: { enabled: false } })
  return pages
}
