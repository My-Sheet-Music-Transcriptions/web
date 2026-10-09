import fs from 'node:fs'
import * as cheerio from 'cheerio'
import { describe, expect, it } from 'vitest'
import { type FsEntry, readAllEntries } from '../../scripts/lib/content-fs'
import {
  buildSitemaps,
  LEGACY_SITEMAPS,
  legacySitemapRedirects,
  SITEMAP_INDEX,
  SITEMAP_NAMES,
  sitemapIndexXml,
} from '../../scripts/lib/sitemap'
import { type Collection, parseMeta } from '../../src/content/schema'
import { localizePath } from '../../src/i18n/routing'
import { sites } from '../../src/i18n/sites'
import { LOCALES, type Locale } from '../../src/i18n/types'

const xml = (source: string) => cheerio.load(source, { xml: true })
/** The deploy origin of the all-languages fixtures. */
const ORIGIN = 'https://x.netlify.app'
const PATH_MODE = { mode: 'path', origin: ORIGIN } as const

/** The <loc>s a sitemap index lists. */
function indexLocs(source: string): string[] {
  const $ = xml(source)
  return $('sitemap > loc')
    .map((_, l) => $(l).text())
    .get()
}

/** Every <loc> of a urlset, with its hreflang alternates. */
function parseUrlset(source: string): Map<string, Map<string, string>> {
  const $ = xml(source)
  const out = new Map<string, Map<string, string>>()
  $('url').each((_, u) => {
    const alts = new Map<string, string>()
    $(u)
      .find('xhtml\\:link')
      .each((_, l) => {
        alts.set($(l).attr('hreflang') ?? '', $(l).attr('href') ?? '')
      })
    out.set($(u).find('loc').text(), alts)
  })
  return out
}

describe('sitemaps of the content in the repo', () => {
  const all = readAllEntries()
  const locales = LOCALES.filter((l) => all.some((e) => e.locale === l))

  it.each(locales)(
    '%s: lists every indexable entry once, in its collection’s sitemap',
    (locale) => {
      const { index, files } = buildSitemaps(locale, all)
      const indexable = all.filter((e) => e.locale === locale && !e.meta.draft && !e.meta.noindex)
      const byLoc = new Map(indexable.map((e) => [`${sites[locale].domain}${e.path}`, e]))
      const listed = files.flatMap((f) => [...parseUrlset(f.xml).keys()])
      expect([...listed].sort()).toEqual([...byLoc.keys()].sort())
      for (const f of files) {
        expect(f.file).toBe(`${SITEMAP_NAMES[f.collection]}-sitemap.xml`)
        for (const loc of parseUrlset(f.xml).keys()) {
          expect(byLoc.get(loc)?.collection, `${loc} in ${f.file}`).toBe(f.collection)
          expect(loc, 'no fragment or query').not.toMatch(/[#?]/)
        }
      }
      expect(index.file).toBe(SITEMAP_INDEX)
      expect(indexLocs(index.xml)).toEqual(files.map((f) => `${sites[locale].domain}/${f.file}`))
    },
  )

  it.each(locales)(
    '%s, all-languages build: the same pages under /<locale> on the deploy’s origin',
    (locale) => {
      const { index, files } = buildSitemaps(locale, all, PATH_MODE)
      const expected = all
        .filter((e) => e.locale === locale && !e.meta.draft && !e.meta.noindex)
        .map((e) => `${ORIGIN}${localizePath(locale, e.path)}`)
      const listed = files.flatMap((f) => [...parseUrlset(f.xml).keys()])
      expect([...listed].sort()).toEqual(expected.sort())
      for (const f of files)
        expect(f.file).toBe(`${locale}/${SITEMAP_NAMES[f.collection]}-sitemap.xml`)
      expect(index.file).toBe(`${locale}/${SITEMAP_INDEX}`)
      expect(indexLocs(index.xml)).toEqual(files.map((f) => `${ORIGIN}/${f.file}`))
    },
  )
})

/** A page of the fixture: only what the sitemaps read. */
function entry(
  locale: Locale,
  slug: string,
  translationKey: string,
  extra: { collection?: Collection; noindex?: boolean; draft?: boolean; updated?: string } = {},
): FsEntry {
  const { collection = 'pages', ...flags } = extra
  const file = `${locale}/${collection}/${slug}/meta.ts`
  const meta = parseMeta(
    'pages',
    {
      title: `Fixture ${slug}`,
      description: 'A fixture page description, long enough for the meta schema to accept it.',
      translationKey,
      updated: '2026-01-01',
      ...flags,
    },
    file,
  )
  const path = slug === 'home' ? '/' : `/${slug}`
  return {
    locale,
    collection,
    slug,
    path,
    url: `${sites[locale].domain}${path}`,
    dir: `${locale}/${collection}/${slug}`,
    file,
    page: `${locale}/${collection}/${slug}/index.tsx`,
    meta,
  }
}

const fixture: FsEntry[] = [
  entry('en', 'home', 'home'),
  entry('es', 'home', 'home'),
  entry('ca', 'home', 'home', { updated: '2026-03-01' }),
  entry('en', 'gift-card', 'gift-card'),
  entry('es', 'tarjeta-regalo', 'gift-card'),
  entry('ca', 'targeta-regal', 'gift-card'),
  entry('en', 'careers', 'careers'),
  entry('en', 'piano', 'piano', { collection: 'services', updated: '2026-02-01' }),
  entry('es', 'piano', 'piano', { collection: 'services', noindex: true }),
  entry('es', 'equipo', 'team'),
  entry('ca', 'equip', 'team'),
  entry('ca', 'esborrany', 'draft', { draft: true }),
  entry('en', 'rock-&-roll', 'rock'),
]

describe('sitemaps across languages (fixture)', () => {
  const built = (locale: Locale) => {
    const { index, files } = buildSitemaps(locale, fixture)
    return { index, files, urls: new Map(files.flatMap((f) => [...parseUrlset(f.xml)])) }
  }
  const sitemaps: Partial<Record<Locale, ReturnType<typeof built>>> = {
    en: built('en'),
    es: built('es'),
    ca: built('ca'),
  }
  const site = (locale: Locale) => sitemaps[locale] ?? built(locale)
  const en = sites.en.domain
  const es = sites.es.domain
  const ca = sites.ca.domain

  it('gives a translated page every language plus x-default, the same set in every locale', () => {
    const expected = new Map([
      ['en', `${en}/gift-card`],
      ['es', `${es}/tarjeta-regalo`],
      ['ca', `${ca}/targeta-regal`],
      ['x-default', `${en}/gift-card`],
    ])
    expect(site('en').urls.get(`${en}/gift-card`)).toEqual(expected)
    expect(site('es').urls.get(`${es}/tarjeta-regalo`)).toEqual(expected)
    expect(site('ca').urls.get(`${ca}/targeta-regal`)).toEqual(expected)
  })
  it('makes every alternate reciprocal: it is a <loc> of that locale, listing the same alternates', () => {
    for (const [locale, { urls }] of Object.entries(sitemaps))
      for (const [loc, alts] of urls)
        for (const [lang, href] of alts) {
          if (lang === 'x-default') continue
          const other = site(lang as Locale).urls.get(href)
          expect(other, `${loc} (${locale}) → ${href}`).toEqual(alts)
        }
  })
  it('leaves x-default out when the default locale has no such page', () => {
    expect([...(site('es').urls.get(`${es}/equipo`)?.keys() ?? [])].sort()).toEqual(['ca', 'es'])
  })
  it('gives untranslated pages no alternates, and ignores noindex twins', () => {
    expect(site('en').urls.get(`${en}/careers`)?.size).toBe(0)
    expect(site('en').urls.get(`${en}/piano`)?.size).toBe(0)
    expect(site('es').urls.has(`${es}/piano`)).toBe(false)
  })
  it('leaves drafts out', () => {
    expect([...site('ca').urls.keys()].some((u) => u.includes('esborrany'))).toBe(false)
  })
  it('splits by collection and indexes only the sitemaps that have pages', () => {
    expect(site('en').files.map((f) => f.file)).toEqual([
      'page-sitemap.xml',
      'services-sitemap.xml',
    ])
    expect(site('es').files.map((f) => f.file)).toEqual(['page-sitemap.xml'])
    const index = xml(site('en').index.xml)
    expect(index('sitemapindex').attr('xmlns')).toBe('http://www.sitemaps.org/schemas/sitemap/0.9')
    expect(
      index('sitemap')
        .map((_, s) => `${index(s).find('loc').text()} ${index(s).find('lastmod').text()}`)
        .get(),
    ).toEqual([`${en}/page-sitemap.xml 2026-01-01`, `${en}/services-sitemap.xml 2026-02-01`])
    expect(xml(site('ca').index.xml)('sitemap lastmod').text()).toBe('2026-03-01')
  })
  it('escapes XML', () => {
    expect(site('en').urls.has(`${en}/rock-&-roll`)).toBe(true)
    const file = site('en').files.find((f) => f.file === 'page-sitemap.xml')
    expect(file?.xml).toContain('/rock-&amp;-roll</loc>')
  })
})

describe('all-languages sitemaps (fixture)', () => {
  const built = Object.fromEntries(
    (['en', 'es', 'ca'] as const).map((l) => [l, buildSitemaps(l, fixture, PATH_MODE)]),
  ) as Record<'en' | 'es' | 'ca', ReturnType<typeof buildSitemaps>>
  const urls = new Map(
    Object.values(built).flatMap(({ files }) => files.flatMap((f) => [...parseUrlset(f.xml)])),
  )

  it('links each page to its translations under their /<locale> on the same origin', () => {
    const expected = new Map([
      ['en', `${ORIGIN}/en/gift-card`],
      ['es', `${ORIGIN}/es/tarjeta-regalo`],
      ['ca', `${ORIGIN}/ca/targeta-regal`],
      ['x-default', `${ORIGIN}/en/gift-card`],
    ])
    for (const loc of expected.values()) expect(urls.get(loc)).toEqual(expected)
    expect(urls.get(`${ORIGIN}/en`)?.get('es')).toBe(`${ORIGIN}/es`)
  })
  it('makes every alternate a <loc> listing the same alternates', () => {
    for (const [loc, alts] of urls)
      for (const [lang, href] of alts)
        if (lang !== 'x-default') expect(urls.get(href), `${loc} → ${href}`).toEqual(alts)
  })
  it('gives the parent every language’s sitemaps, and no index', () => {
    const children = Object.values(built).flatMap((b) => b.files)
    const parent = indexLocs(sitemapIndexXml(children))
    expect(parent).toEqual([
      `${ORIGIN}/en/page-sitemap.xml`,
      `${ORIGIN}/en/services-sitemap.xml`,
      `${ORIGIN}/es/page-sitemap.xml`,
      `${ORIGIN}/ca/page-sitemap.xml`,
    ])
    expect(parent.some((l) => l.endsWith(`/${SITEMAP_INDEX}`))).toBe(false)
  })
  it('sends each language’s WordPress sitemap URLs to its own index', () => {
    const rules = legacySitemapRedirects(built.es)
    expect(rules).toContain('/es/sitemap_index.xml  /es/sitemap.xml  301')
    expect(rules).toContain('/es/services-sitemap.xml  /es/sitemap.xml  301')
    expect(rules.some((r) => r.startsWith('/es/page-sitemap.xml '))).toBe(false)
  })
})

describe('sitemap names and legacy redirects', () => {
  const names = Object.values(SITEMAP_NAMES).map((n) => `${n}-sitemap.xml`)
  it('names every collection’s sitemap uniquely, never as the index', () => {
    expect(new Set(names).size).toBe(names.length)
    expect(names).not.toContain(SITEMAP_INDEX)
  })
  it('redirects every legacy sitemap the build does not write to the index, once', () => {
    expect(new Set(LEGACY_SITEMAPS).size).toBe(LEGACY_SITEMAPS.length)
    expect(LEGACY_SITEMAPS).not.toContain(`/${SITEMAP_INDEX}`)
    const rules = legacySitemapRedirects(buildSitemaps('es', fixture))
    expect(rules).toContain('/sitemap_index.xml  /sitemap.xml  301')
    expect(rules).toContain('/post-sitemap.xml  /sitemap.xml  301')
    expect(rules.some((r) => r.startsWith('/page-sitemap.xml '))).toBe(false)
    expect(rules).toHaveLength(LEGACY_SITEMAPS.length - 1)
  })
  it('never shadows a page or a public/ file', () => {
    const paths = new Set(readAllEntries().map((e) => e.path))
    for (const u of LEGACY_SITEMAPS) {
      expect(u).toMatch(/^\/[a-z0-9_-]+\.xml$/)
      expect(paths.has(u), u).toBe(false)
      expect(fs.existsSync(`public${u}`), `public${u}`).toBe(false)
    }
  })
})
