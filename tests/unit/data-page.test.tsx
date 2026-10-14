import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { mediaLabels, reviewLabels } from '../../content/en/data/labels'
import { BlockPage } from '../../src/content/BlockPage'
import { mapPictures, splitDataPage } from '../../src/content/data-page'

/** Data pages: the page.json format the CMS edits (src/content/data-page.ts) and its renderer. */
describe('splitDataPage', () => {
  it('leaves out what the CMS saved empty, but keeps empty cells in lists', () => {
    const { meta, blocks } = splitDataPage(
      {
        title: 'T',
        updated: '',
        og: null,
        blocks: [{ type: 'Section', title: '', cta: { label: '', href: '' }, columns: ['A', ''] }],
      },
      'x/page.json',
    )
    expect(meta).toEqual({ title: 'T' })
    expect(blocks).toEqual([{ type: 'Section', columns: ['A', ''] }])
  })
  it('refuses blocks without a type', () => {
    expect(() => splitDataPage({ blocks: [{ title: 'x' }] }, 'x/page.json')).toThrow(/type/)
  })
})

describe('mapPictures', () => {
  it('resolves every image field, at any depth, and nothing else', () => {
    const block = {
      type: 'MediaText',
      image: 'a.jpg',
      alt: 'b.jpg',
      images: [{ image: 'c.png', alt: 'C' }],
    }
    expect(mapPictures(block, (f) => `<${f}>`)).toEqual({
      type: 'MediaText',
      image: '<a.jpg>',
      alt: 'b.jpg',
      images: [{ image: '<c.png>', alt: 'C' }],
    })
  })
})

describe('BlockPage', () => {
  const words = { mediaLabels, reviewLabels }
  it('renders bodies as light markdown and link cells as links', () => {
    const html = renderToStaticMarkup(
      <BlockPage
        words={words}
        blocks={[
          {
            type: 'Table',
            columns: ['Position', ''],
            rows: [{ cells: ['Music Editor', '[Apply](/job/music-editor)'] }],
            body: 'Open **now**.',
          },
        ]}
      />,
    )
    expect(html).toContain('<strong>now</strong>')
    expect(html).toMatch(/<a [^>]*href="[^"]*\/job\/music-editor"[^>]*>Apply<\/a>/)
  })
  it('names an unknown block', () => {
    expect(() =>
      renderToStaticMarkup(<BlockPage words={words} blocks={[{ type: 'Nope' }]} />),
    ).toThrow(/Unknown block "Nope"/)
  })
})
