import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  blockIndex,
  blockProps,
  blockUsage,
  checkProps,
} from '../../scripts/design-system/blocks-lib'
import { CATEGORIES, catalogue } from '../../src/components/blocks/catalogue'

/**
 * `pnpm ds:blocks` and the prop checks of `pnpm ds:review` read each block's `<Name>Props` interface from
 * its source. Every block must keep that interface readable, and its catalogue defaults (the documented
 * example) must pass the same checks a mockup does.
 */
const names = Object.keys(catalogue) as (keyof typeof catalogue)[]

describe('block props', () => {
  it.each(names)('%s has a readable props interface its defaults satisfy', (name) => {
    const block = blockProps(name)
    expect(block?.props.length).toBeGreaterThan(0)
    const doc = catalogue[name] as { defaults: object; children?: string }
    const props = { ...doc.defaults, ...(doc.children ? { children: doc.children } : {}) }
    expect(checkProps(name, props)).toEqual([])
  })

  it('reads the props a block inherits (ShellProps from BlockShell, MediaContent from Media)', () => {
    const block = blockProps('MediaText')
    const props = block?.props.map((p) => p.name) ?? []
    for (const name of [
      'title',
      'eyebrow',
      'lead',
      'id',
      'tone',
      'cta',
      'image',
      'layout',
      'children',
    ])
      expect(props).toContain(name)
    expect(block?.types.Tone).toBe("'white' | 'cream' | 'peach'")
    // a member the block declares itself wins over the inherited one (a required title)
    expect(blockProps('Testimonials')?.props.find((p) => p.name === 'title')?.optional).toBe(false)
  })

  it('names the wrong prop, the missing one and the allowed values', () => {
    const errors = checkProps('MediaText', {
      image: 'img/a.jpg',
      side: 'left',
      tone: 'blue',
      cta: { label: 'Go' },
      children: 'Text',
    }).join('\n')
    expect(errors).toMatch(/has no prop "side": it takes .*imageSide/)
    expect(errors).toMatch(/tone is "blue": use one of white, cream, peach/)
    expect(errors).toMatch(/cta needs "href"/)
    expect(checkProps('Steps', { items: [{ glyph: 'nope', body: 'x' }] }).join()).toMatch(
      /items\[0\]\.glyph is "nope": use one of .*dollar/,
    )
    expect(checkProps('PageHeader', {})).toEqual(['PageHeader needs "title" (string)'])
    // item shapes from ~/content/types are checked too
    expect(checkProps('CardGrid', { items: [{ title: 'x' }] }).join()).toMatch(
      /items\[0\] needs "body"/,
    )
  })
})

describe('block index', () => {
  const usage = blockUsage()
  const index = blockIndex(usage)

  it('finds where each block is used from the pages themselves', () => {
    expect(usage.Steps).toContain('gift-card')
    // every page writes its own PageHeader, the homepage too (variant="photo")
    expect(usage.PageHeader).toContain('gift-card')
    expect(usage.PageHeader).toContain('home')
    expect(usage.PictureGrid).toContain('home')
  })

  it('lists every block once, grouped by category in page order', () => {
    for (const n of names) expect(index.match(new RegExp(`^- ${n}: `, 'gm'))).toHaveLength(1)
    const headings = [...index.matchAll(/^## ([^:]+): /gm)].map((m) => m[1])
    expect(headings).toEqual(Object.values(CATEGORIES).map((c) => c.label))
    const at = (n: string) => index.indexOf(`- ${n}: `)
    expect(at('PageHeader')).toBeLessThan(at('Testimonials'))
    expect(at('Testimonials')).toBeLessThan(at('ContactSection'))
  })

  it('says when to use a block, when not, and where it is used', () => {
    expect(index).toContain('  use when: The first block of every page')
    expect(index).toContain('  not for: pictures with only a name or a link: PictureGrid.')
    expect(index).toMatch(/- PageHeader: (.*\n){3} {2}used on: .*\bhome\b/)
    const unused = blockIndex({ ...usage, Section: [] })
    expect(unused).toMatch(/- Section: .*\n(.*\n){2} {2}not used on any page yet/)
  })
})

/**
 * The rules of the `component` skill (.claude/skills/component/SKILL.md) a test can see: every block is a
 * BlockShell around its own content, and block props speak one vocabulary.
 */
describe('blocks stay on one shell and one vocabulary', () => {
  const source = (name: string) => fs.readFileSync(`src/components/blocks/${name}.tsx`, 'utf8')

  it.each(names.filter((n) => n !== 'PageHeader'))(
    '%s renders BlockShell and builds no shell by hand',
    (name) => {
      const s = source(name)
      expect(s).toMatch(/<BlockShell\b/)
      expect(s, 'a hand-made section').not.toMatch(/<section\b/)
      expect(s, 'a hand-made heading').not.toMatch(/SectionHeading|useTitleId|<h2\b/)
      expect(s, 'a hand-made container').not.toMatch(
        /container-(?:content|narrow|wide)|max-w-\[1140px\]/,
      )
      expect(s, 'a hand-made tone').not.toMatch(/from '~\/components\/primitives\/tones'/)
    },
  )

  /** Words that once meant what the vocabulary now says one way (CLAUDE.md, the component skill). */
  const retired = [
    'surface',
    'background',
    'imagesLayout',
    'preset',
    'strong',
    'strongMobile',
    'showNames',
    'slideshow',
    'text',
  ]
  /** Words only one block may use, for what only it shows. */
  const own: Record<string, string[]> = {
    subtitle: ['PageHeader'],
    shape: ['PictureGrid'],
    layout: ['MediaText'],
  }

  it.each(names)('%s props and item fields use the shared words', (name) => {
    const block = blockProps(name)
    const fields = [
      ...(block?.props ?? []),
      ...Object.values(block?.types ?? {}).flatMap((t) => (Array.isArray(t) ? t : [])),
    ]
    for (const f of fields)
      expect(retired, `${name}: "${f.name}" is a retired synonym`).not.toContain(f.name)
    for (const p of block?.props ?? []) {
      const only = own[p.name]
      if (only) expect(only, `${name}.${p.name}`).toContain(name)
      if (p.name === 'tone') expect(p.type, `${name}.tone`).toBe('Tone')
    }
  })
})
