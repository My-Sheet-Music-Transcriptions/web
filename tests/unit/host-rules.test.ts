import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { hostRules, pagesIn } from '../../scripts/lib/host-rules'

const es = {
  folder: 'es',
  origins: ['https://www.example.es/', 'https://example.es'],
  pages: ['/', '/precios', '/faqs/envio'],
  files: ['robots.txt', 'sitemap.xml'],
  redirects: ['/sitemap_index.xml  /sitemap.xml  301', ''],
}

describe('host rules of a multi-domain build', () => {
  const rules = hostRules([es])

  it('301s every alias to the primary origin first', () => {
    expect(rules[1]).toBe('https://example.es/*  https://www.example.es/:splat  301!')
  })

  it('rewrites every page to its folder and 301s its trailing slash', () => {
    expect(rules).toContain('https://www.example.es/  /es/index.html  200!')
    expect(rules).toContain('https://www.example.es/precios  /es/precios/index.html  200!')
    expect(rules).toContain('https://www.example.es/precios/  /precios  301!')
    expect(rules).toContain('https://www.example.es/faqs/envio  /es/faqs/envio/index.html  200!')
  })

  it("keeps the locale's own redirects, host-prefixed, before its pages", () => {
    const legacy = rules.indexOf('https://www.example.es/sitemap_index.xml  /sitemap.xml  301')
    expect(legacy).toBeGreaterThan(0)
    expect(legacy).toBeLessThan(rules.indexOf('https://www.example.es/  /es/index.html  200!'))
  })

  it('serves root files from the folder and ends with an unforced 404', () => {
    expect(rules).toContain('https://www.example.es/robots.txt  /es/robots.txt  200!')
    expect(rules.at(-1)).toBe('https://www.example.es/*  /es/404.html  404')
  })

  it('never rewrites the shared paths', () => {
    expect(rules.filter((r) => /\/(assets|og|admin|api)\b/.test(r.split(/\s+/)[0] ?? ''))).toEqual(
      [],
    )
  })
})

describe('pagesIn', () => {
  it('lists index.html folders as pages and root files, leaving out 404 and _redirects', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pages-in-'))
    const files = [
      'index.html',
      '404.html',
      '_redirects',
      'robots.txt',
      'precios/index.html',
      'faqs/x/index.html',
    ]
    for (const f of files) {
      fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true })
      fs.writeFileSync(path.join(dir, f), '')
    }
    expect(pagesIn(dir)).toEqual({ pages: ['/', '/faqs/x', '/precios'], files: ['robots.txt'] })
  })
})
