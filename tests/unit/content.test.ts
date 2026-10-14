import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import {
  buildHreflangMap,
  CONTENT_DIR,
  checkSlugs,
  readAllEntries,
  readDataPageSource,
  readMetaSource,
} from '../../scripts/lib/content-fs'
import { parseTsx, where } from '../../scripts/lib/ts-literal'
import { resolveBlock, splitDataPage } from '../../src/content/data-page'
import { pathFor, RESERVED_SLUGS } from '../../src/content/schema'

describe('content collections', () => {
  const all = readAllEntries()
  it('parses every meta.ts (beside its index.tsx) and page.json against its schema', () => {
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
      `import type { PageMetaInput } from '~/content/schema'\n\nexport default { ${ok}, updated: '2026-01-01' } satisfies PageMetaInput\n`,
      file,
    )
    expect(meta).toMatchObject({ title: 'A page title', type: 'page', updated: '2026-01-01' })
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
  it.each(
    readAllEntries()
      .filter((e) => e.kind === 'tsx')
      .map((e) => e.page),
  )('%s', (page) => {
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

describe('data pages (page.json, edited in the CMS)', () => {
  const data = readAllEntries().filter((e) => e.kind === 'data')
  it.each(data.map((e) => e.page))(
    '%s matches the CMS fields of its blocks and names pictures of its folder and data of its locale',
    (page) => {
      // splitDataPage checks every block against its CMS fields (src/components/blocks/cms.ts).
      const { blocks: list } = splitDataPage(
        JSON.parse(fs.readFileSync(`${CONTENT_DIR}/${page}`, 'utf8')),
        page,
      )
      const missing: string[] = []
      const locale = page.split('/')[0]
      for (const block of list) {
        const inFolder = (what: string) => (name: string) => {
          if (!fs.existsSync(`${CONTENT_DIR}/${path.posix.dirname(page)}/${name}`))
            missing.push(`${block.type}: ${what} "${name}" is not in the page folder`)
        }
        resolveBlock(block, {
          picture: inFolder('picture'),
          file: inFolder('recording'),
          data(file, name) {
            const source = `${CONTENT_DIR}/${locale}/data/${file}.ts`
            if (
              !fs.existsSync(source) ||
              !new RegExp(`export const ${name}\\b`).test(fs.readFileSync(source, 'utf8'))
            )
              missing.push(`${block.type}: "${name}" is not exported by ${locale}/data/${file}.ts`)
          },
        })
      }
      expect(missing).toEqual([])
    },
  )
  it('refuses a page.json without a blocks list', () => {
    expect(() => readDataPageSource('{"title":"T"}', 'en/pages/x/page.json')).toThrow(/blocks/)
    expect(() => readDataPageSource('{', 'en/pages/x/page.json')).toThrow(/invalid JSON/)
  })
  it('validates its meta against the collection schema', () => {
    expect(() => readDataPageSource('{"title":"T","blocks":[]}', 'en/pages/x/page.json')).toThrow(
      /Invalid meta/,
    )
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
