import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { imageSize, prepareSections } from '../../scripts/design-system/review-lib'

/**
 * Every committed mockup (mockups/<slug>/sections.html) must still pass the ds:review checks: known
 * blocks, readable data-props, images present, no external files, layout wrapper. Blocks get renamed
 * and props change; this keeps the previews publishable without anyone remembering to rerun them.
 */
const root = 'mockups'
const slugs = fs.existsSync(root)
  ? fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'sections.html')))
  : []

describe('mockups', () => {
  it.each(slugs)('%s passes the ds:review checks', (slug) => {
    const html = fs.readFileSync(path.join(root, slug, 'sections.html'), 'utf8')
    const { errors, labels } = prepareSections(html, path.join(root, slug, 'img'))
    expect(errors).toEqual([])
    expect(labels.length).toBeGreaterThan(3)
  })

  it('reports every kind of mistake at once', () => {
    const dir = 'content/en/pages/home'
    const bad = `<div>
<div data-msmt="Header"></div>
<div data-msmt="Herro"></div>
<div data-msmt="MediaText" data-props='{"image":"img/nope.jpg","children":"ok"}'></div>
<div data-msmt="Section" data-props='{"children":"It's"}'></div>
<section data-proposed="Steps"><img src="https://example.com/a.png"></section>
<div data-msmt="Footer"></div>
</div>`
    const { errors } = prepareSections(bad, dir)
    expect(errors.join('\n')).toMatch(/unknown block "Herro"/)
    expect(errors.join('\n')).toMatch(/missing image img\/nope.jpg/)
    expect(errors.join('\n')).toMatch(/external file https:\/\/example.com\/a.png/)
    expect(errors.join('\n')).toMatch(/"Steps" already exists/)
    expect(errors.join('\n')).toMatch(/could not be read/)
    expect(errors.join('\n')).toMatch(/start with <div data-msmt="TopBar">/)
  })

  it('turns image paths into picture props with real dimensions', () => {
    const { html, errors } = prepareSections(
      `<div><div data-msmt="TopBar"></div><div data-msmt="Header"></div>
<div data-msmt="MediaText" data-props='{"image":"img/office-8.jpg","alt":"x","children":"It&#39;s fine"}'></div>
<div data-msmt="Footer"></div></div>`,
      'content/en/pages/home',
    )
    expect(errors).toEqual([])
    expect(html).toContain(
      '"image":{"sources":{},"img":{"src":"img/office-8.jpg","w":1000,"h":668}}',
    )
    expect(html).toContain('It&#39;s fine')
  })

  it('reads image headers', () => {
    expect(imageSize('content/en/pages/home/office-8.jpg')).toEqual({ w: 1000, h: 668 })
    expect(imageSize('src/assets/images/icons/audience-all.webp')).toEqual({ w: 735, h: 727 })
    expect(imageSize('content/en/pages/home/hero-slide-1.webp')).toEqual({ w: 1600, h: 806 })
    expect(imageSize('content/en/pages/home/step-1-send-audio.png')).toEqual({ w: 403, h: 403 })
  })
})
