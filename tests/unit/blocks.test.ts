import { describe, expect, it } from 'vitest'
import {
  blockIndex,
  blockProps,
  blockUsage,
  checkProps,
} from '../../scripts/design-system/blocks-lib'
import { catalogue, ROLES } from '../../src/components/blocks/catalogue'

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
    expect(errors).toMatch(/needs "alt"/)
    expect(checkProps('Steps', { steps: [{ icon: 'nope', text: 'x' }] }).join()).toMatch(
      /steps\[0\]\.icon is "nope": use one of .*dollar/,
    )
    expect(checkProps('PageHero', {})).toEqual(['PageHero needs "title" (string)'])
  })
})

describe('block index', () => {
  const usage = blockUsage()
  const index = blockIndex(usage)

  it('finds where each block is used from the pages themselves', () => {
    expect(usage.Hero).toEqual(['home'])
    expect(usage.Steps).toContain('gift-card')
    // PageHero is the meta.ts `hero`, not a tag in the page
    expect(usage.PageHero).toContain('gift-card')
    expect(usage.PageHero).not.toContain('home')
  })

  it('lists every block once, grouped by role in page order', () => {
    for (const n of names) expect(index.match(new RegExp(`^- ${n}: `, 'gm'))).toHaveLength(1)
    const headings = [...index.matchAll(/^## (\w+): /gm)].map((m) => m[1])
    expect(headings).toEqual(Object.keys(ROLES))
    const at = (n: string) => index.indexOf(`- ${n}: `)
    expect(at('PageHero')).toBeLessThan(at('ReviewCards'))
    expect(at('ReviewCards')).toBeLessThan(at('ContactSection'))
  })

  it('says when to use a block, when not, and where it is used', () => {
    expect(index).toContain('  use when: The homepage opening')
    expect(index).toContain('  not for: any other page: PageHero.')
    expect(index).toContain('  used on: home\n')
    expect(index).toMatch(/- Section: .*\n(.*\n){2} {2}not used on any page yet/)
  })
})
