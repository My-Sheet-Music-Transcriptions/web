import fs from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio'
import fg from 'fast-glob'
import { describe, expect, it } from 'vitest'
import { resolveSiteLocale } from '../../scripts/lib/site-locale'
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
  it('ships robots.txt pointing at the sitemap and a sitemap.xml', () => {
    const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8')
    expect(robots).toContain(`Sitemap: ${site.domain}/sitemap.xml`)
    expect(fs.existsSync(path.join(DIST, 'sitemap.xml'))).toBe(true)
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
  it('is listed in the sitemap unless noindex', () => {
    if (is404(p)) return
    const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
    const url = `${site.domain}${p.route === '/' ? '/' : p.route}`
    const listed = sitemap.includes(`<loc>${url}</loc>`) || sitemap.includes(`<loc>${url}/</loc>`)
    const noindex = /noindex/.test($('meta[name="robots"]').attr('content') ?? '')
    expect(listed, `${url} ${noindex ? 'must not' : 'must'} be in sitemap.xml`).toBe(!noindex)
  })
})

describe('sitemap', () => {
  it('only lists pages that exist in dist', () => {
    const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? '')
    expect(locs.length).toBeGreaterThan(0)
    for (const loc of locs) {
      expect(loc.startsWith(site.domain), loc).toBe(true)
      expect(
        existsInDist(loc.slice(site.domain.length) || '/'),
        `${loc} in sitemap but not in dist`,
      ).toBe(true)
    }
    expect(indexable.length).toBeLessThanOrEqual(locs.length)
  })
  it('uses the right language codes in alternate refs', () => {
    const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
    const langs = new Set([...sitemap.matchAll(/hreflang="([^"]+)"/g)].map((m) => m[1]))
    const allowed = new Set([...Object.values(sites).map((s) => s.lang), 'x-default'])
    for (const l of langs) expect(allowed.has(l as string), `unexpected hreflang ${l}`).toBe(true)
  })
})
