import fs from 'node:fs'
import type ts from 'typescript'
import { describe, expect, it } from 'vitest'
import {
  evalLiteral,
  flattenChildren,
  type MockupEntry,
  mockupFromEntry,
  rendersPageHeader,
} from '../../scripts/design-system/mockup-lib'
import { parseBlocks, prepareSections } from '../../scripts/design-system/review-lib'
import { CONTENT_DIR, readAllEntries } from '../../scripts/lib/content-fs'
import { parseTsx, readModuleLiterals } from '../../scripts/lib/ts-literal'

/**
 * ds:mockup turns an existing page into the mockup the page skill previews from. The committed gift-card
 * mockup is the acceptance test: generated from the page it must be the same mockup, block for block.
 */
const entries = readAllEntries()
const entryOf = (slug: string): MockupEntry => {
  const e = entries.find((x) => x.locale === 'en' && x.slug === slug)
  if (!e) throw new Error(`no en/${slug}`)
  return {
    file: e.page,
    path: e.path,
    meta: e.meta as MockupEntry['meta'],
    source: fs.readFileSync(`${CONTENT_DIR}/${e.page}`, 'utf8'),
  }
}
/** A page component returning `jsx` in a fragment, after `head` (imports, statements). */
const page = (
  jsx: string,
  meta: Partial<MockupEntry['meta']> = {},
  head = "import { Text } from '~/components/typography'",
): MockupEntry => ({
  file: 'en/pages/x/index.tsx',
  path: '/x',
  meta: { type: 'page', title: 'X page title', template: 'page', ...meta },
  source: `${head}\n\nexport default function Page() {\n  return (\n    <>\n${jsx}\n    </>\n  )\n}\n`,
})
const expr = (code: string): ts.Expression => {
  const sf = parseTsx(`const x = <B a={${code}} />`)
  const decl = (sf.statements[0] as ts.VariableStatement).declarationList.declarations[0]
  const el = decl?.initializer as ts.JsxSelfClosingElement
  const init = (el.attributes.properties[0] as ts.JsxAttribute).initializer as ts.JsxExpression
  return init.expression as ts.Expression
}
const jsxChildren = (jsx: string): readonly ts.JsxChild[] => {
  const sf = parseTsx(`const x = <T>${jsx}</T>`)
  const decl = (sf.statements[0] as ts.VariableStatement).declarationList.declarations[0]
  if (!decl?.initializer) throw new Error('no JSX')
  return (decl.initializer as ts.JsxElement).children
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
  it('has no PageHeader, keeps the prose children and resolves the data', () => {
    const result = mockupFromEntry(entryOf('home'))
    const names = result.blocks.map((b) => b.name)
    expect(names.slice(0, 3)).toEqual(['TopBar', 'Header', 'Hero'])
    expect(names).not.toContain('PageHeader')
    expect(names.at(-1)).toBe('Footer')
    const pricing = result.blocks.find((b) => b.name === 'PricingCards')?.props ?? {}
    const children = pricing.children as string
    expect(children).toMatch(/^\*\*There are pricing options for every budget\.\*\* The more/)
    expect(children.split('\n\n')).toHaveLength(4)
    expect((pricing.tiers as { from: string }[]).map((t) => t.from)).toEqual([
      '$19 USD',
      '$30 USD',
      '$15 USD',
    ])
    expect(result.images).toContain('office-8.jpg')
    expect(result.warnings).toEqual([])
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

describe('data imports', () => {
  const ratings = `import type { RatingSource } from '~/content/types'

export const google = { id: 'google', count: '854' } satisfies Partial<RatingSource>
const customers = { id: 'customers', count: '26,330' }
export const ratings = [google, customers] as const
`
  it('reads a data module statically, consts naming the consts above them', () => {
    expect(readModuleLiterals(ratings, 'ratings.ts')).toEqual({
      google: { id: 'google', count: '854' },
      customers: { id: 'customers', count: '26,330' },
      ratings: [
        { id: 'google', count: '854' },
        { id: 'customers', count: '26,330' },
      ],
    })
  })
  it.each([
    ["import { x } from './x'", /only import types/],
    ['export function f() {}', /only "export const/],
    ['export let a = 1', /only "export const/],
    ['export const a = f()', /f\(\)/],
  ])('refuses %s', (code, error) => {
    expect(() => readModuleLiterals(code, 'x.ts')).toThrow(error)
  })
  it('resolves fields of known values, never of unknown ones', () => {
    const known = { k: { b: [1, 2] } }
    expect(evalLiteral(expr('k.b'), {}, '', known)).toEqual([1, 2])
    expect(evalLiteral(expr('k.b[1]'), {}, '', known)).toBe(2)
    expect(evalLiteral(expr("k['b']"), {}, '', known)).toEqual([1, 2])
    expect(() => evalLiteral(expr('k.c'), {}, '', known)).toThrow(/not a field/)
    expect(() => evalLiteral(expr('k.b[i]'), {}, '', known)).toThrow(/computed index/)
  })
  it('puts imported data into the block props', () => {
    const reader = (locale: string, file: string) => {
      expect([locale, file]).toEqual(['en', 'ratings'])
      return ratings
    }
    const r = mockupFromEntry(
      page(
        '<Section title={g.id}>Text</Section>\n<Steps items={ratings} />',
        {},
        "import { ratings, google as g } from '@content/en/data/ratings'",
      ),
      reader,
    )
    expect(r.blocks.find((b) => b.name === 'Section')?.props?.title).toBe('google')
    expect(r.blocks.find((b) => b.name === 'Steps')?.props).toEqual({
      items: [
        { id: 'google', count: '854' },
        { id: 'customers', count: '26,330' },
      ],
    })
    const other = mockupFromEntry(
      page(
        '<Section title="x">{"a"}</Section>',
        {},
        "import { google } from '@content/es/data/ratings'",
      ),
      () => ratings,
    )
    expect(other.warnings).toContainEqual(expect.stringMatching(/another locale/))
    expect(() =>
      mockupFromEntry(
        page(
          '<Section title="x">a</Section>',
          {},
          "import { nope } from '@content/en/data/ratings'",
        ),
        () => ratings,
      ),
    ).toThrow(/has no "nope"/)
  })
})

describe('flattenChildren', () => {
  const children = (jsx: string) => flattenChildren(jsxChildren(jsx), 'T')
  it('keeps paragraphs and bold, flattens the rest', () => {
    expect(
      children(`
        <Text>
          Line one
          continues <em>here</em> with <TextLink href="/x">a link</TextLink>{' '}
          and <i>more</i>.
        </Text>
        <Text><strong>Bold</strong> end.</Text>`),
    ).toBe('Line one continues here with a link and more.\n\n**Bold** end.')
    expect(
      children(
        '<List><ListItem>first item</ListItem><ListItem>second <strong>item</strong></ListItem></List><Quote><Text>quoted</Text></Quote>',
      ),
    ).toBe('first item\n\nsecond **item**\n\nquoted')
    expect(children('<Heading>Heading</Heading><Divider /><Text>text</Text>')).toBe(
      'Heading\n\ntext',
    )
    expect(children('Bare text, <strong>bold</strong>{/* a comment */}')).toBe(
      'Bare text, **bold**',
    )
    expect(children('')).toBeUndefined()
  })
  it('refuses what a mockup cannot show', () => {
    expect(() => children('<Text>Text <Steps /> more</Text>')).toThrow(/nested components/)
    expect(() => children('<Text><Picture src={pic} /></Text>')).toThrow(/pictures are props/)
    expect(() => children('<Text>{1 + 1}</Text>')).toThrow(/expression/)
    expect(() => children('<p>raw</p>')).toThrow(/typography components/)
    expect(() => children('<Text>a &amp; b</Text>')).toThrow(/HTML entity/)
    expect(() => children('<Text>a <Text>b</Text></Text>')).toThrow(/paragraph of its own/)
    expect(() => children('<List><Text>x</Text></List>')).toThrow(/ListItem/)
  })
})

describe('composing the page', () => {
  it('renders the header from the meta, or the title', () => {
    expect(rendersPageHeader({ type: 'page', template: 'home' })).toBe(false)
    expect(rendersPageHeader({ type: 'page', template: 'landing' })).toBe(false)
    for (const template of ['page', 'pricing', undefined])
      expect(rendersPageHeader({ type: 'page', template })).toBe(true)
    expect(rendersPageHeader({ type: 'service' })).toBe(true)
    const plain = mockupFromEntry(page('<Section title="Hi">Text</Section>'))
    expect(plain.blocks[3]).toEqual({ name: 'Section', props: { title: 'Hi', children: 'Text' } })
    expect(plain.blocks[2]).toEqual({ name: 'PageHeader', props: { title: 'X page title' } })
    const withHero = mockupFromEntry(
      page('<Section title="Hi">Text</Section>', {
        hero: { title: 'H1', subtitle: 'Sub', eyebrow: 'Eye', rating: true },
      }),
      () => "export const google = { id: 'google', count: '854' }",
    )
    expect(withHero.blocks[2]).toEqual({
      name: 'PageHeader',
      props: {
        title: 'H1',
        subtitle: 'Sub',
        eyebrow: 'Eye',
        rating: { id: 'google', count: '854' },
      },
    })
    expect(withHero.title).toBe('H1')
    const landing = mockupFromEntry(
      page('<PageHeader title="L" variant="split" />', { template: 'landing' }),
    )
    expect(landing.blocks[2]).toEqual({
      name: 'PageHeader',
      props: { title: 'L', variant: 'split' },
    })
  })

  it('the templates agree with rendersPageHeader', () => {
    const read = (t: string) => fs.readFileSync(`src/components/templates/${t}.tsx`, 'utf8')
    expect(read('PageTemplate')).toContain('<PageHeader')
    expect(read('ServiceTemplate')).toContain('<PageHeader')
    expect(read('HomeTemplate')).not.toContain('<PageHeader')
    expect(read('LandingTemplate')).not.toContain('<PageHeader')
  })

  it('wraps stray prose in a Section with a warning', () => {
    const r = mockupFromEntry(
      page(
        '<Text>Some intro text.</Text>\n<Steps title="S" steps={[]} />\n<Text>More <strong>bold</strong> text.</Text>',
      ),
    )
    expect(r.blocks.map((b) => b.name)).toEqual([
      'TopBar',
      'Header',
      'PageHeader',
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
        '<MediaText image={pic} alt="A" caption />\n<ContactSection returnTo="/x" id="c" />',
        {},
        "import pic from './pic.jpg?w=480&as=picture'\nimport unused from './other.png'",
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
    expect(() => mockupFromEntry(page('<PageHeader title="x" />'))).toThrow(
      /already renders the header/,
    )
    expect(() => mockupFromEntry(page('<Nope />'))).toThrow(/unknown block <Nope>/)
    expect(() => mockupFromEntry(page('<Steps {...props} />'))).toThrow(/spread/)
    expect(() => mockupFromEntry(page('<Steps steps={items} />'))).toThrow(
      /unknown identifier "items".*line 6:/,
    )
    expect(() => mockupFromEntry(page('<Steps />', {}, "import { x } from './a.ts'"))).toThrow(
      /only blocks from/,
    )
    expect(() => mockupFromEntry(page('<Steps />', {}, 'export const a = 1'))).toThrow(/an export/)
    expect(() => mockupFromEntry(page('<Steps />', {}, 'const a = 1'))).toThrow(
      /only imports and the default export/,
    )
    expect(() => mockupFromEntry(page('{1 + 1}\n<Steps />'))).toThrow(/expression/)
    expect(() => mockupFromEntry(page('<p>raw</p>'))).toThrow(/typography components/)
    expect(() => mockupFromEntry(page('<Foo.Bar />'))).toThrow(/plain component names/)
    expect(
      mockupFromEntry(page('{/* a comment */}\n<Steps />')).blocks.map((b) => b.name),
    ).toContain('Steps')
  })

  it('reads the page component in either form, and nothing else', () => {
    const arrow: MockupEntry = {
      ...page(''),
      source: 'export default () => (\n  <>\n    <Steps />\n  </>\n)\n',
    }
    expect(mockupFromEntry(arrow).blocks.map((b) => b.name)).toContain('Steps')
    const single: MockupEntry = {
      ...page(''),
      source: 'export default function P() {\n  return <Steps />\n}\n',
    }
    expect(mockupFromEntry(single).blocks.map((b) => b.name)).toContain('Steps')
    expect(() => mockupFromEntry({ ...page(''), source: 'const x = 1\n' })).toThrow()
    expect(() => mockupFromEntry({ ...page(''), source: '' })).toThrow(/no default export/)
    expect(() =>
      mockupFromEntry({
        ...page(''),
        source: 'export default function P() {\n  const a = 1\n  return <Steps />\n}\n',
      }),
    ).toThrow(/may only "return/)
  })

  it('warns when ContactSection is not last', () => {
    const r = mockupFromEntry(page('<ContactSection />\n<Steps steps={[]} />'))
    expect(r.warnings).toEqual([expect.stringMatching(/ContactSection is not the last block/)])
  })
})
