import { describe, expect, it } from 'vitest'
import { blockProps, checkProps } from '../../scripts/design-system/blocks-lib'
import { catalogue } from '../../src/components/blocks/catalogue'

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
