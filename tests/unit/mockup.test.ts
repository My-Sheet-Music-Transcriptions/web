import fs from 'node:fs'
import type * as estree from 'estree'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import {
  evalLiteral,
  flattenChildren,
  type MockupEntry,
  mockupFromEntry,
  rendersPageHero,
} from '../../scripts/design-system/mockup-lib'
import { parseBlocks, prepareSections } from '../../scripts/design-system/review-lib'
import { readAllEntries } from '../../scripts/lib/content-fs'

/**
 * ds:mockup turns an existing page into the mockup the page skill previews from. The committed gift-card
 * mockup is the acceptance test: generated from the page it must be the same mockup, block for block.
 */
const entries = readAllEntries()
const entryOf = (slug: string): MockupEntry => {
  const e = entries.find((x) => x.locale === 'en' && x.slug === slug)
  if (!e) throw new Error(`no en/${slug}`)
  return { file: e.file, path: e.path, meta: e.meta as MockupEntry['meta'], body: e.body }
}
const page = (body: string, meta: Partial<MockupEntry['meta']> = {}): MockupEntry => ({
  file: 'en/pages/x/index.mdx',
  path: '/x',
  meta: { type: 'page', title: 'X page title', template: 'page', ...meta },
  body,
})
const expr = (code: string): estree.Node => {
  const tree = unified().use(remarkParse).use(remarkMdx).parse(`<B a={${code}} />`)
  const el = tree.children[0] as { attributes: { value: { data: { estree: estree.Program } } }[] }
  const stmt = el.attributes[0]?.value.data.estree.body[0] as estree.ExpressionStatement
  return stmt.expression
}
const summary = (html: string) => parseBlocks(html).map(({ name, props }) => ({ name, props }))

describe('ds:mockup reproduces the committed gift-card mockup', () => {
  const result = mockupFromEntry(entryOf('gift-card'))

  it('block for block, prop for prop', () => {
    const committed = fs.readFileSync('mockups/gift-card/sections.html', 'utf8')
    expect(summary(result.sections)).toEqual(summary(committed))
    expect(result.sections).toBe(committed)
  })

  it('names the pictures, the path and the title', () => {
    expect(result.images).toEqual(['gift-card.png', 'mascot.png'])
    expect(result.path).toBe('/gift-card')
    expect(result.title).toBe('Gift a transcription!')
    expect(result.warnings).toEqual([expect.stringMatching(/returnTo/)])
    expect(prepareSections(result.sections, 'mockups/gift-card/img').errors).toEqual([])
  })
})

describe('the homepage', () => {
  it('has no PageHero and keeps the prose children', () => {
    const result = mockupFromEntry(entryOf('home'))
    const names = result.blocks.map((b) => b.name)
    expect(names.slice(0, 3)).toEqual(['TopBar', 'Header', 'Hero'])
    expect(names).not.toContain('PageHero')
    expect(names.at(-1)).toBe('Footer')
    const pricing = result.blocks.find((b) => b.name === 'PricingTiers')?.props?.children as string
    expect(pricing).toMatch(/^\*\*There are pricing options for every budget\.\*\* The more/)
    expect(pricing.split('\n\n')).toHaveLength(4)
    expect(result.images).toEqual([])
    expect(prepareSections(result.sections, 'mockups/none/img').errors).toEqual([])
  })
})

describe('evalLiteral', () => {
  const imports = { mascot: 'mascot.png' }
  it('accepts literals, objects, arrays and image imports', () => {
    expect(evalLiteral(expr("{ label: 'x', href: '#y' }"), imports)).toEqual({
      label: 'x',
      href: '#y',
    })
    expect(evalLiteral(expr("[{ icon: 'a' }, 2, true, null]"), imports)).toEqual([
      { icon: 'a' },
      2,
      true,
      null,
    ])
    expect(evalLiteral(expr('`plain`'), imports)).toBe('plain')
    expect(evalLiteral(expr('-3'), imports)).toBe(-3)
    expect(evalLiteral(expr('!false'), imports)).toBe(true)
    expect(evalLiteral(expr('undefined'), imports)).toBeUndefined()
    expect(evalLiteral(expr('mascot'), imports)).toBe('img/mascot.png')
    expect(evalLiteral(expr("{ 'quoted-key': 1, n }"), { n: 'n.png' })).toEqual({
      'quoted-key': 1,
      n: 'img/n.png',
    })
  })
  it.each([
    'fn()',
    'a.b',
    'cond ? 1 : 2',
    '{ ...x }',
    // biome-ignore lint/suspicious/noTemplateCurlyInString: a template literal with an expression is the case under test
    '`${a}`',
    'unknownName',
    '<b />',
    '[1, ...rest]',
    '/re/',
  ])('rejects %s', (code) => {
    expect(() => evalLiteral(expr(code), imports)).toThrow(/cannot mockup/)
  })
})

describe('flattenChildren', () => {
  const children = (md: string) =>
    flattenChildren(unified().use(remarkParse).use(remarkMdx).parse(md).children, 'T')
  it('keeps paragraphs and bold, flattens the rest', () => {
    expect(
      children('Line one\ncontinues *here* with [a link](/x) and `code`.\n\n**Bold** end.'),
    ).toBe('Line one continues here with a link and code.\n\n**Bold** end.')
    expect(children('- first item\n- second **item**\n\n> quoted')).toBe(
      'first item\n\nsecond **item**\n\nquoted',
    )
    expect(children('## Heading\n\n---\n\ntext')).toBe('Heading\n\ntext')
    expect(children('')).toBeUndefined()
  })
  it('refuses what a mockup cannot show', () => {
    expect(() => children('Text <Steps /> more')).toThrow(/nested components/)
    expect(() => children('![alt](./pic.png)')).toThrow(/pictures are props/)
    expect(() => children('{1 + 1}')).toThrow(/expression/)
  })
})

describe('composing the page', () => {
  it('renders the hero from the frontmatter, or the title', () => {
    expect(rendersPageHero({ type: 'page', template: 'home' })).toBe(false)
    for (const template of ['page', 'landing', 'pricing', undefined])
      expect(rendersPageHero({ type: 'page', template })).toBe(true)
    expect(rendersPageHero({ type: 'service' })).toBe(true)
    const plain = mockupFromEntry(page('<Section title="Hi">Text</Section>'))
    expect(plain.blocks[2]).toEqual({ name: 'PageHero', props: { title: 'X page title' } })
    const withHero = mockupFromEntry(
      page('<Section title="Hi">Text</Section>', {
        hero: { title: 'H1', subtitle: 'Sub', eyebrow: 'Eye' },
      }),
    )
    expect(withHero.blocks[2]).toEqual({
      name: 'PageHero',
      props: { title: 'H1', subtitle: 'Sub', eyebrow: 'Eye' },
    })
    expect(withHero.title).toBe('H1')
  })

  it('the templates agree with rendersPageHero', () => {
    expect(fs.readFileSync('src/components/templates/PageTemplate.tsx', 'utf8')).toContain(
      '<PageHero',
    )
    expect(fs.readFileSync('src/components/templates/HomeTemplate.tsx', 'utf8')).not.toContain(
      '<PageHero',
    )
  })

  it('wraps stray prose in a Section with a warning', () => {
    const r = mockupFromEntry(
      page('Some intro text.\n\n<Steps title="S" steps={[]} />\n\nMore **bold** text.'),
    )
    expect(r.blocks.map((b) => b.name)).toEqual([
      'TopBar',
      'Header',
      'PageHero',
      'Section',
      'Steps',
      'Section',
      'Footer',
    ])
    expect(r.blocks[3]?.props).toEqual({ children: 'Some intro text.' })
    expect(r.warnings.filter((w) => /prose outside a block/.test(w))).toHaveLength(2)
  })

  it('handles boolean attributes, image imports and returnTo', () => {
    const r = mockupFromEntry(
      page(
        'import pic from \'./pic.jpg?w=480&as=picture\'\nimport unused from \'./other.png\'\n\n<MediaText image={pic} alt="A" caption />\n\n<ContactSection returnTo="/x" id="c" />',
      ),
    )
    expect(r.blocks[3]).toEqual({
      name: 'MediaText',
      props: { image: 'img/pic.jpg', alt: 'A', caption: true },
    })
    expect(r.blocks[4]).toEqual({ name: 'ContactSection', props: { id: 'c' } })
    expect(r.images).toEqual(['pic.jpg'])
    expect(r.warnings).toEqual([
      expect.stringMatching(/returnTo/),
      expect.stringMatching(/"unused" \(other.png\) is not used/),
    ])
  })

  it('refuses what cannot be shown faithfully', () => {
    expect(() => mockupFromEntry(page('<Header />'))).toThrow(/layout comes with every page/)
    expect(() => mockupFromEntry(page('<PageHero title="x" />'))).toThrow(
      /already renders the hero/,
    )
    expect(() => mockupFromEntry(page('<Nope />'))).toThrow(/unknown block <Nope>/)
    expect(() => mockupFromEntry(page('<Steps {...props} />'))).toThrow(/spread/)
    expect(() => mockupFromEntry(page('<Steps steps={items} />'))).toThrow(
      /unknown identifier "items".*line 1/,
    )
    expect(() => mockupFromEntry(page("import { x } from './a.ts'\n\n<Steps />"))).toThrow(
      /only "import x from/,
    )
    expect(() => mockupFromEntry(page('export const a = 1\n\n<Steps />'))).toThrow(/export/)
    expect(() => mockupFromEntry(page('{1 + 1}\n\n<Steps />'))).toThrow(/expression/)
    expect(
      mockupFromEntry(page('{/* a comment */}\n\n<Steps />')).blocks.map((b) => b.name),
    ).toContain('Steps')
  })

  it('warns when ContactSection is not last', () => {
    const r = mockupFromEntry(page('<ContactSection />\n\n<Steps steps={[]} />'))
    expect(r.warnings).toEqual([expect.stringMatching(/ContactSection is not the last block/)])
  })
})
