import { describe, expect, it } from 'vitest'
import { buildHreflangMap, checkSlugs, readAllEntries } from '../../scripts/lib/content-fs'
import { pathFor, RESERVED_SLUGS } from '../../src/content/schema'

describe('content collections', () => {
  const all = readAllEntries()
  it('parses every MDX frontmatter against its schema', () => {
    expect(all.length).toBeGreaterThan(0)
    for (const e of all) expect(e.meta.title.length).toBeGreaterThan(0)
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
