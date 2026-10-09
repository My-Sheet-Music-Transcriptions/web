import fs from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'
import fg from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { resolveSiteLocale } from '../../scripts/lib/site-locale'
import { LEGACY_SITEMAPS } from '../../scripts/lib/sitemap'
import { sites } from '../../src/i18n/sites'

/**
 * SEO conformance over the prerendered output. Every HTML file in dist/client must carry the
 * elements search engines and social networks need. Run after `pnpm build`.
 */
const DIST = path.resolve(process.env.DIST_DIR ?? 'dist/client')
const site = sites[resolveSiteLocale(process.env.SITE_LOCALE)]
const files = fg.sync('**/*.html', { cwd: DIST, ignore: ['assets/**', '_next/**'] }).sort()
const pages = files.map((f) => {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8')
  const $ = cheerio.load(html)
  const route =
    `/${f.replace(/index\.html$/, '').replace(/\.html$/, '')}`.replace(/\/+$/, '') || '/'
  return { file: f, route, html, $ }
})
const is404 = (p: { route: string }) => p.route === '/404'
const indexable = pages.filter(
  (p) => !is404(p) && !/noindex/.test(p.$('meta[name="robots"]').attr('content') ?? ''),
)
/** The sitemap index's children and every URL they list, with its hreflang alternates ("lang href", sorted). */
let sitemapCache: { children: string[]; urls: Map<string, string[]> } | undefined
function sitemaps() {
  if (sitemapCache) return sitemapCache
  const read = (file: string) =>
    cheerio.load(fs.readFileSync(path.join(DIST, file), 'utf8'), { xml: true })
  const index = read('sitemap.xml')
  const children = index('sitemapindex > sitemap > loc')
    .map((_, l) => index(l).text())
    .get()
  const urls = new Map<string, string[]>()
  for (const child of children) {
    const $ = read(child.slice(site.domain.length))
    $('url').each((_, u) => {
      const loc = $(u).find('loc').text()
      const alts = $(u)
        .find('xhtml\\:link')
        .map((_, l) => `${$(l).attr('hreflang')} ${$(l).attr('href')}`)
        .get()
        .sort()
      expect(urls.has(loc), `${loc} listed twice`).toBe(false)
      urls.set(loc, alts)
    })
  }
  sitemapCache = { children, urls }
  return sitemapCache
}
const existsInDist = (urlPath: string) => {
  const clean = urlPath.split(/[?#]/)[0] ?? ''
  if (clean === '/' || clean === '') return true
  const rel = clean.replace(/^\//, '').replace(/\/$/, '')
  return [rel, `${rel}.html`, `${rel}/index.html`].some((c) => fs.existsSync(path.join(DIST, c)))
}

describe('prerendered output', () => {
  it('has at least the homepage and a 404 page', () => {
    expect(pages.length).toBeGreaterThan(0)
    expect(pages.some((p) => p.route === '/')).toBe(true)
    expect(pages.some(is404)).toBe(true)
  })
  it('ships robots.txt pointing at the sitemap index and a sitemap.xml', () => {
    const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8')
    expect(robots).toContain(`Sitemap: ${site.domain}/sitemap.xml`)
    expect(fs.existsSync(path.join(DIST, 'sitemap.xml'))).toBe(true)
  })
  it('does not publish the prerender page list', () => {
    expect(fs.existsSync(path.join(DIST, 'pages.json'))).toBe(false)
  })
})

describe.each(pages.map((p) => [p.route, p] as const))('%s', (_route, p) => {
  const { $ } = p
  it('declares the document language', () => {
    expect($('html').attr('lang')).toBe(site.lang)
  })
  it('has exactly one h1', () => {
    expect($('h1').length).toBe(1)
  })
  it('has a title between 30 and 65 characters', () => {
    const title = $('title').first().text().trim()
    expect(title.length, `title: "${title}"`).toBeGreaterThanOrEqual(30)
    expect(title.length, `title: "${title}"`).toBeLessThanOrEqual(65)
  })
  it('has a meta description between 50 and 160 characters', () => {
    const d = $('meta[name="description"]').attr('content') ?? ''
    if (is404(p)) return
    expect(d.length, `description: "${d}"`).toBeGreaterThanOrEqual(50)
    expect(d.length, `description: "${d}"`).toBeLessThanOrEqual(160)
  })
  it('has a canonical URL on this site', () => {
    if (is404(p)) return
    const c = $('link[rel="canonical"]').attr('href') ?? ''
    expect(c.startsWith(site.domain)).toBe(true)
    expect(c.endsWith('/') && c !== `${site.domain}/`).toBe(false)
  })
  it('has Open Graph and Twitter tags with an image that exists', () => {
    if (is404(p)) return
    for (const prop of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type']) {
      expect($(`meta[property="${prop}"]`).attr('content'), prop).toBeTruthy()
    }
    expect($('meta[name="twitter:card"]').attr('content')).toBe('summary_large_image')
    const img = $('meta[property="og:image"]').attr('content') ?? ''
    expect(img.startsWith(site.domain)).toBe(true)
    expect(existsInDist(img.slice(site.domain.length)), `og:image ${img} not in dist`).toBe(true)
  })
  it('has valid JSON-LD', () => {
    const scripts = $('script[type="application/ld+json"]')
    expect(scripts.length).toBeGreaterThan(0)
    scripts.each((_, s) => {
      const data = JSON.parse($(s).text())
      expect(data['@context']).toBe('https://schema.org')
      expect(data['@type']).toBeTruthy()
    })
  })
  it('has hreflang alternates that are reciprocal and include x-default when translated', () => {
    const alts = $('link[rel="alternate"][hreflang]')
      .map((_, l) => ({ lang: $(l).attr('hreflang'), href: $(l).attr('href') }))
      .get()
    if (alts.length === 0) return
    expect(alts.some((a) => a.lang === 'x-default')).toBe(true)
    expect(alts.some((a) => a.href === $('link[rel="canonical"]').attr('href'))).toBe(true)
    for (const a of alts) {
      const l = Object.values(sites).find((s) => a.href?.startsWith(s.domain))
      expect(l, `hreflang href ${a.href} is not one of our domains`).toBeTruthy()
      if (a.lang !== 'x-default') expect(a.lang).toBe(l?.lang)
    }
  })
  it('gives every image alt text and dimensions', () => {
    $('img').each((_, img) => {
      const el = $(img)
      expect(el.attr('alt'), `img ${el.attr('src')} has no alt attribute`).toBeDefined()
      expect(
        el.attr('width') && el.attr('height'),
        `img ${el.attr('src')} has no width/height`,
      ).toBeTruthy()
    })
  })
  it('references only images and sources that exist in dist', () => {
    // Byte-identical source files make the bundler emit one asset under a single name while the
    // HTML can still reference the other name; this catches that class of 404.
    const missing: string[] = []
    const check = (u: string) => {
      const clean = u.trim().split(' ')[0] ?? ''
      if (!clean.startsWith('/') || clean.startsWith('//')) return
      if (!existsInDist(clean)) missing.push(clean)
    }
    $('img[src]').each((_, el) => check($(el).attr('src') ?? ''))
    $('img[srcset], source[srcset]').each((_, el) => {
      for (const part of ($(el).attr('srcset') ?? '').split(',')) check(part)
    })
    expect(missing, `missing assets in ${p.route}`).toEqual([])
  })
  it('has no broken internal links', () => {
    const broken: string[] = []
    $('a[href]').each((_, a) => {
      // Links to not-yet-ported pages point at the legacy site on purpose (see SmartLink).
      if ($(a).attr('data-legacy-link') !== undefined) return
      const href = $(a).attr('href') ?? ''
      let target = href
      if (href.startsWith(site.domain)) target = href.slice(site.domain.length) || '/'
      if (!target.startsWith('/') || target.startsWith('//')) return
      if (!existsInDist(target)) broken.push(href)
    })
    expect(broken, `broken links in ${p.route}`).toEqual([])
  })
  it('has anchors that point at existing fragments', () => {
    const missing: string[] = []
    $('a[href*="#"]').each((_, a) => {
      const href = $(a).attr('href') ?? ''
      if (/^(https?:)?\/\//.test(href) && !href.startsWith(site.domain)) return
      const [target, fragment] = href.replace(site.domain, '').split('#')
      if (!fragment) return
      // Same-page anchor, or an anchor on another prerendered page (e.g. /#contact from the 404 page).
      let doc = $
      if (target && target !== '' && target !== p.route) {
        const other = pages.find(
          (q) => q.route === (target === '/' ? '/' : target.replace(/\/$/, '')),
        )
        if (!other) return // not ported yet: SmartLink sends it to the legacy site
        doc = other.$
      }
      if (doc(`[id="${fragment}"]`).length === 0) missing.push(href)
    })
    expect(missing, `anchors without a target in ${p.route}`).toEqual([])
  })
  it('is listed in the sitemaps unless noindex, with the hreflang alternates of its head', () => {
    if (is404(p)) return
    const url = `${site.domain}${p.route === '/' ? '/' : p.route}`
    const listed = sitemaps().urls.get(url)
    const noindex = /noindex/.test($('meta[name="robots"]').attr('content') ?? '')
    expect(!!listed, `${url} ${noindex ? 'must not' : 'must'} be in the sitemaps`).toBe(!noindex)
    if (!listed) return
    const head = $('link[rel="alternate"][hreflang]')
      .map((_, l) => `${$(l).attr('hreflang')} ${$(l).attr('href')}`)
      .get()
      .sort()
    expect(listed, `${url}: sitemap alternates vs <head>`).toEqual(head)
  })
  it('links the sitemap index', () => {
    expect($('link[rel="sitemap"]').attr('href')).toBe('/sitemap.xml')
  })
})

describe('sitemaps', () => {
  it('index sitemaps that exist, on this domain', () => {
    const { children } = sitemaps()
    expect(children.length).toBeGreaterThan(0)
    for (const child of children) {
      expect(child, child).toMatch(new RegExp(`^${site.domain}/[a-z_-]+-sitemap\\.xml$`))
      expect(existsInDist(child.slice(site.domain.length)), `${child} not in dist`).toBe(true)
    }
  })
  it('list exactly the indexable pages', () => {
    const listed = [...sitemaps().urls.keys()].sort()
    const expected = indexable.map((p) => `${site.domain}${p.route === '/' ? '/' : p.route}`).sort()
    expect(listed).toEqual(expected)
  })
  it('use the right language codes in alternate refs', () => {
    const allowed = new Set([...Object.values(sites).map((s) => s.lang), 'x-default'])
    for (const [loc, alts] of sitemaps().urls)
      for (const alt of alts) {
        const lang = alt.split(' ')[0] ?? ''
        expect(allowed.has(lang), `unexpected hreflang ${lang} on ${loc}`).toBe(true)
      }
  })
  it('send the WordPress sitemap URLs to the index', () => {
    const rules = fs.readFileSync(path.join(DIST, '_redirects'), 'utf8')
    for (const legacy of LEGACY_SITEMAPS) {
      if (existsInDist(legacy)) continue
      expect(rules, legacy).toMatch(
        new RegExp(`^${legacy.replace(/\./g, '\\.')}\\s+/sitemap\\.xml\\s+301$`, 'm'),
      )
    }
  })
})
