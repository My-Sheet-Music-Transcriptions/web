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
    expect(checkProps('Steps', { items: [{ icon: 'nope', text: 'x' }] }).join()).toMatch(
      /items\[0\]\.icon is "nope": use one of .*dollar/,
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
    expect(usage.Hero).toEqual(['home'])
    expect(usage.Steps).toContain('gift-card')
    // the page template renders PageHeader from meta.ts; the homepage has none
    expect(usage.PageHeader).toContain('gift-card')
    expect(usage.PageHeader).not.toContain('home')
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
    expect(index).toContain('  use when: The homepage opening')
    expect(index).toContain('  not for: any other page: PageHeader.')
    expect(index).toContain('  used on: home\n')
    const unused = blockIndex({ ...usage, Section: [] })
    expect(unused).toMatch(/- Section: .*\n(.*\n){2} {2}not used on any page yet/)
  })
})
