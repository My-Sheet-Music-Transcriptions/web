import fs from 'node:fs'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import {
  buildHreflangMap,
  CONTENT_DIR,
  checkSlugs,
  readAllEntries,
  readMetaSource,
} from '../../scripts/lib/content-fs'
import { parseTsx, where } from '../../scripts/lib/ts-literal'
import { pathFor, RESERVED_SLUGS } from '../../src/content/schema'

describe('content collections', () => {
  const all = readAllEntries()
  it('parses every meta.ts against its schema, beside its index.tsx', () => {
    expect(all.length).toBeGreaterThan(0)
    for (const e of all) {
      expect(e.meta.title.length).toBeGreaterThan(0)
      expect(fs.existsSync(`${CONTENT_DIR}/${e.page}`), e.page).toBe(true)
    }
  })
  it('has no slug collisions or reserved slugs', () => {
    expect(checkSlugs(all)).toEqual([])
  })
  it('builds a hreflang map keyed by translationKey', () => {
    const map = buildHreflangMap(all)
    expect(map.home?.en).toBe('/')
  })
  it('keeps descriptions within meta-description bounds', () => {
    for (const e of all) {
      expect(e.meta.description.length, e.file).toBeGreaterThanOrEqual(50)
      expect(e.meta.description.length, e.file).toBeLessThanOrEqual(160)
    }
  })
})

describe('meta.ts is plain data', () => {
  const file = 'en/pages/x/meta.ts'
  const ok = `title: 'A page title', description: '${'A description long enough for the schema. '.repeat(2)}', translationKey: 'x'`
  it('accepts a literal with type imports, satisfies and as const', () => {
    const meta = readMetaSource(
      `import type { PageMetaInput } from '~/content/schema'\n\nexport default { ${ok}, hero: { title: 'H' } } satisfies PageMetaInput\n`,
      file,
    )
    expect(meta).toMatchObject({ title: 'A page title', template: 'page', hero: { title: 'H' } })
    expect(readMetaSource(`export default { ${ok} } as const`, file).title).toBe('A page title')
  })
  it.each([
    ["import { x } from './x'\nexport default { title: 'T' }", /may only import types/],
    ["const t = 'T'\nexport default { title: t }", /only "export default/],
    ["export default { title: String('T') }", /only literals.*line 1/],
    ['export default { title: process.env.T }', /only literals/],
    ['const meta = {}\nexport default meta', /only "export default/],
    // biome-ignore lint/suspicious/noTemplateCurlyInString: a template literal with an expression is the case under test
    ['export default { title: `T${1}` }', /template string/],
    ['', /no "export default/],
  ])('rejects %s', (source, error) => {
    expect(() => readMetaSource(source, file)).toThrow(error)
  })
  it('validates against the collection schema', () => {
    expect(() => readMetaSource("export default { title: 'T' }", file)).toThrow(/Invalid meta/)
  })
})

/** Text semantics come from ~/components/typography (one look, readable by the mockup tooling). */
const RAW_TEXT_TAGS = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'li',
  'a',
  'blockquote',
  'hr',
]

describe('pages write text with the typography components', () => {
  it.each(readAllEntries().map((e) => e.page))('%s', (page) => {
    const sf = parseTsx(fs.readFileSync(`${CONTENT_DIR}/${page}`, 'utf8'), page)
    const raw: string[] = []
    const visit = (n: ts.Node) => {
      const tag = ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n) ? n.tagName : undefined
      if (tag && ts.isIdentifier(tag) && RAW_TEXT_TAGS.includes(tag.text))
        raw.push(
          `<${tag.text}>${where(n)}: use Text, Heading, List/ListItem, TextLink, Quote or Divider`,
        )
      ts.forEachChild(n, visit)
    }
    visit(sf)
    expect(raw).toEqual([])
  })
})

describe('pathFor', () => {
  const routes = { faqPrefix: 'faqs' }
  it('maps home to the root and prefixes FAQs and reviews', () => {
    expect(pathFor('pages', 'home', routes)).toBe('/')
    expect(pathFor('pages', 'pricing', routes)).toBe('/pricing')
    expect(pathFor('faqs', 'piano', routes)).toBe('/faqs/piano')
    expect(pathFor('reviews', 'ana-b', routes)).toBe('/review/ana-b')
    expect(pathFor('posts', 'hello', routes)).toBe('/hello')
  })
  it('reserves route names content may not use', () => {
    expect(RESERVED_SLUGS).toContain('api')
    expect(RESERVED_SLUGS).toContain('og')
  })
})
