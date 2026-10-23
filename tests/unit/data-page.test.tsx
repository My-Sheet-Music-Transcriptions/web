import fs from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { mediaLabels, postLabels, reviewLabels, shareLabels } from '../../content/en/data/labels'
import { decapConfig } from '../../src/admin/config'
import { blocks } from '../../src/components/blocks'
import { cmsBlocks } from '../../src/components/blocks/cms'
import type { PageHeaderProps } from '../../src/components/blocks/PageHeader'
import type { TableProps } from '../../src/components/blocks/Table'
import { BlockPage } from '../../src/content/BlockPage'
import { type CmsBlock, line, prose, select } from '../../src/content/cms-fields'
import { metaFields, postFields, productFields, serviceFields } from '../../src/content/cms-meta'
import { fillWords, resolveBlock, splitDataPage } from '../../src/content/data-page'
import { postParts } from '../../src/content/post-template'
import { LOCALES } from '../../src/i18n/types'

/** Data pages: the page.json format the CMS edits (src/content/data-page.ts) and its renderer. */
describe('splitDataPage', () => {
  it('leaves out what the CMS saved empty, but keeps empty cells in lists', () => {
    const { meta, blocks } = splitDataPage(
      {
        title: 'T',
        updated: '',
        og: null,
        blocks: [
          { type: 'Table', title: '', cta: { label: '', href: '' }, columns: ['A', ''], rows: [] },
        ],
      },
      'x/page.json',
    )
    expect(meta).toEqual({ title: 'T' })
    expect(blocks).toEqual([{ type: 'Table', columns: ['A', ''], rows: [] }])
  })
  it('refuses blocks without a type', () => {
    expect(() => splitDataPage({ blocks: [{ title: 'x' }] }, 'x/page.json')).toThrow(/type/)
  })
  it('checks that a page in content/ opens with the language and collection of its folder', () => {
    const page = { language: 'es', collection: 'pages', title: 'T', blocks: [] }
    expect(splitDataPage(page, 'es/pages/x/page.json').meta).toEqual({ title: 'T' })
    expect(() => splitDataPage(page, 'en/pages/x/page.json')).toThrow(/"language": "en"/)
    expect(() => splitDataPage(page, 'es/services/x/page.json')).toThrow(/"collection": "services"/)
    expect(() => splitDataPage({ title: 'T', blocks: [] }, 'es/pages/x/page.json')).toThrow(
      /language/,
    )
  })
})

describe('blog posts (a fixed layout, src/content/post-template.ts)', () => {
  const post = {
    language: 'es',
    collection: 'posts',
    title: 'Finale vs Sibelius',
    date: '2022-09-15',
    cover: { src: 'cover.jpg', alt: 'Cover' },
    body: 'Intro **bold**.\n\n![A screen](screen.png "The menu"){width=300}\n\n## Next\n\nMore.\n\n{{youtube abc123 "A video"}}\n\n{{audio take.mp3 "A take"}}\n\nThe end.',
  }
  it('cuts the body into an article’s parts: text, then the picture, video or recording after it', () => {
    expect(postParts(post.body)).toEqual([
      {
        body: 'Intro **bold**.',
        image: 'screen.png',
        alt: 'A screen',
        caption: 'The menu',
        imageWidth: 300,
      },
      { body: '## Next\n\nMore.', video: { youtube: 'abc123', title: 'A video' } },
      { audio: { src: 'take.mp3', title: 'A take' } },
      { body: 'The end.' },
    ])
  })
  it('lays every post out the same way from its fields', () => {
    const { meta, blocks } = splitDataPage(post, 'es/posts/finale-vs-sibelius/page.json')
    expect(meta).toEqual({
      title: 'Finale vs Sibelius',
      date: '2022-09-15',
      cover: { src: 'cover.jpg', alt: 'Cover' },
    })
    expect(blocks.map((b) => b.type)).toEqual([
      'PageHeader',
      'Article',
      'ShareLinks',
      'PostList',
      'ContactSection',
    ])
    expect(blocks[0]).toMatchObject({
      title: 'Finale vs Sibelius',
      date: '2022-09-15',
      image: 'cover.jpg',
    })
    expect(blocks[4]).toMatchObject({ form: 'quoteForm', returnTo: '/finale-vs-sibelius' })
    const share = blocks[2] as (typeof blocks)[number]
    expect(fillWords(share, { postLabels }).title).toBe(postLabels.share)
  })
  it('refuses blocks on a post, and a post without its text', () => {
    expect(() => splitDataPage({ ...post, blocks: [] }, 'es/posts/x/page.json')).toThrow(
      /fixed layout/,
    )
    expect(() => splitDataPage({ ...post, body: undefined }, 'es/posts/x/page.json')).toThrow(
      /post\.body: required/,
    )
    expect(() =>
      splitDataPage({ ...post, body: '![A](https://x.test/a.jpg)' }, 'es/posts/x/page.json'),
    ).toThrow(/\(Article\)\.items\[0\]\.image: expected a picture/)
  })
})

describe('checking stored blocks against their CMS fields', () => {
  const page = (blocks: unknown[]) => ({ title: 'T', blocks })
  const problems = (blocks: unknown[]) => {
    try {
      splitDataPage(page(blocks), 'x/page.json')
      return ''
    } catch (e) {
      return (e as Error).message
    }
  }
  it('accepts what the CMS saves', () => {
    expect(
      problems([
        { type: 'PageHeader', title: 'Hi', cta: { label: 'Go', href: '#x' } },
        { type: 'PictureGrid', columns: 4, items: [{ image: 'a.jpg', alt: 'A' }] },
        { type: 'Table', columns: ['A'], rows: [{ cells: ['x'] }] },
      ]),
    ).toBe('')
  })
  it('names every problem: unknown blocks and fields, missing and wrong values, half a button', () => {
    const message = problems([
      { type: 'Hero' },
      { type: 'PageHeader', colour: 'not offered' },
      { type: 'Section', tone: 'blue', cta: { label: 'Go' } },
      { type: 'PictureGrid', columns: 9, items: [{ image: 'https://x.com/a.jpg' }] },
      { type: 'PricingCards', title: 'P', tiers: 'myPrices' },
      {
        type: 'Samples',
        items: [{ title: 'S', image: 'a.png', alt: 'A', audio: { src: 'a.wav.exe', title: 'A' } }],
      },
    ])
    expect(message).toMatch(/blocks\[0\]: "Hero" is not a CMS block/)
    expect(message).toMatch(/blocks\[1\] \(PageHeader\)\.colour: not a field here/)
    expect(message).toMatch(/blocks\[1\] \(PageHeader\)\.title: required/)
    expect(message).toMatch(/blocks\[2\] \(Section\)\.tone: expected one of white, cream, peach/)
    expect(message).toMatch(/blocks\[2\] \(Section\)\.cta\.href: required/)
    expect(message).toMatch(
      /blocks\[3\] \(PictureGrid\)\.columns: expected a whole number from 2 to 6/,
    )
    expect(message).toMatch(/blocks\[3\] \(PictureGrid\)\.items\[0\]\.image: expected a picture/)
    expect(message).toMatch(
      /blocks\[4\] \(PricingCards\)\.tiers: expected one of pricingTiers, pianoPricing/,
    )
    expect(message).toMatch(/blocks\[5\] \(Samples\)\.items\[0\]\.audio\.src: expected a recording/)
  })
  it('lets the CMS preview render a block still being filled in', () => {
    expect(() => splitDataPage(page([{ type: 'PageHeader' }]), 'x', { check: false })).not.toThrow()
  })
})

/** Resolvers that mark what they were asked for. */
const marks = {
  picture: (f: string) => `<${f}>`,
  file: (f: string) => `[${f}]`,
  data: (f: string, n: string) => `{${f}.${n}}`,
}

describe('resolveBlock', () => {
  it('resolves picture fields at any depth, and nothing else', () => {
    const block = {
      type: 'MediaText',
      image: 'a.jpg',
      alt: 'b.jpg',
      images: [{ image: 'c.png', alt: 'C' }],
    }
    expect(resolveBlock(block, marks)).toEqual({
      type: 'MediaText',
      image: '<a.jpg>',
      alt: 'b.jpg',
      images: [{ image: '<c.png>', alt: 'C' }],
    })
  })
  it('resolves recordings and the lists picked by name, in tabs too', () => {
    const block = {
      type: 'Samples',
      tabs: [
        {
          label: 'USD',
          items: [
            {
              title: 'Easy',
              audio: { src: 'easy.mp3', title: 'Easy' },
              image: 'score.png',
              alt: 'S',
            },
          ],
        },
      ],
    }
    expect(resolveBlock(block, marks)).toEqual({
      type: 'Samples',
      tabs: [
        {
          label: 'USD',
          items: [
            {
              title: 'Easy',
              audio: { src: '[easy.mp3]', title: 'Easy' },
              image: '<score.png>',
              alt: 'S',
            },
          ],
        },
      ],
    })
    expect(
      resolveBlock({ type: 'PricingCards', title: 'P', tiers: 'pianoPricing' }, marks),
    ).toEqual({ type: 'PricingCards', title: 'P', tiers: '{services.pianoPricing}' })
    expect(resolveBlock({ type: 'RatingBanner', sources: 'nope' }, marks).sources).toBe('nope')
  })
  it('turns a FAQ’s stored groups into FaqGroups: the shared ones by name, the page’s own as written', () => {
    const block = {
      type: 'FaqList',
      groups: [
        { shared: 'generalFaq' },
        { title: 'Piano', id: 'piano', items: [{ question: 'Q?', answer: 'A.' }] },
        { title: 'Empty' },
      ],
    }
    expect(resolveBlock(block, marks).groups).toEqual([
      '{faqs.generalFaq}',
      { title: 'Piano', id: 'piano', items: [{ question: 'Q?', answer: 'A.' }] },
      { title: 'Empty', id: undefined, items: [] },
    ])
  })
  it('sets a preset’s own props over the writer’s', () => {
    expect(resolveBlock({ type: 'PictureStrip', label: 'L', variant: 'grid' }, marks)).toEqual({
      type: 'PictureStrip',
      label: 'L',
      variant: 'marquee',
      shape: 'photo',
    })
  })
  it('turns stored table rows into cells, and [label](href) into link cells', () => {
    const block = {
      type: 'Table',
      columns: ['Position', ''],
      rows: [{ cells: ['Music Editor', '[Apply](/job/music-editor)'] }],
    }
    expect(resolveBlock(block, marks).rows).toEqual([
      ['Music Editor', { label: 'Apply', href: '/job/music-editor' }],
    ])
  })
})

describe('Decap configuration', () => {
  interface Collection {
    name: string
    folder?: string
    path?: string
    filter?: { field: string; value: string }
    fields?: { name: string; default?: string; widget?: string }[]
    files?: { name: string; file: string; fields: { name: string }[] }[]
  }
  const collections = decapConfig.collections as unknown as Collection[]
  const pages = collections.find((c) => c.name === 'pages')
  const blocksField = pages?.fields?.find((f) => f.name === 'blocks') as unknown as {
    types: {
      name: string
      fields: { name: string; required: boolean; fields?: { required: boolean }[] }[]
    }[]
  }
  it('offers every block of the catalogue, in its order, then presets of them', () => {
    const names = Object.keys(cmsBlocks)
    expect(names.filter((n) => n in blocks)).toEqual(Object.keys(blocks))
    for (const [name, entry] of Object.entries(cmsBlocks))
      if (!(name in blocks))
        expect(Object.keys(blocks)).toContain((entry as { block?: string }).block)
  })
  it('offers exactly the CMS blocks, with their fields', () => {
    expect(blocksField.types.map((t) => t.name)).toEqual(Object.keys(cmsBlocks))
    for (const t of blocksField.types)
      expect(t.fields.map((f) => f.name)).toEqual(
        Object.keys(cmsBlocks[t.name as keyof typeof cmsBlocks].fields),
      )
  })
  it('keeps a required prop required, and an optional button optional all the way down', () => {
    const header = blocksField.types.find((t) => t.name === 'PageHeader')
    expect(header?.fields.find((f) => f.name === 'title')?.required).toBe(true)
    const cta = header?.fields.find((f) => f.name === 'cta')
    expect(cta?.required).toBe(false)
    expect(cta?.fields?.every((f) => !f.required)).toBe(true)
  })
  it('has four entries in the sidebar: Site, Pages, Services and Blog', () => {
    expect(collections.map((c) => c.name)).toEqual([
      'site',
      'pages',
      'services',
      'posts',
      'products',
    ])
  })
  it('files every language’s pages of a kind in one collection, by their language', () => {
    for (const name of ['pages', 'services', 'posts', 'products']) {
      const c = collections.find((x) => x.name === name)
      expect(c?.folder).toBe('content')
      expect(c?.path).toBe(`{{language}}/${name}/{{slug}}/page`)
      expect(c?.filter).toEqual({ field: 'collection', value: name })
      expect(c?.fields?.find((f) => f.name === 'collection')?.default).toBe(name)
    }
  })
  it('lists in Site the homepage, the menu, the redirects and the shop settings of each language that has them', () => {
    const site = collections.find((c) => c.name === 'site')
    expect(site?.files?.map((f) => f.name)).toEqual(
      LOCALES.flatMap((l) => [
        ...(fs.existsSync(`content/${l}/pages/home/page.json`) ? [`home-${l}`] : []),
        ...(fs.existsSync(`content/${l}/data/menu.json`) ? [`menu-${l}`] : []),
        ...(fs.existsSync(`content/${l}/data/redirects.json`) ? [`redirects-${l}`] : []),
        ...(fs.existsSync(`content/${l}/data/shop.json`) ? [`shop-${l}`] : []),
      ]),
    )
    expect(site?.files?.map((f) => f.name)).toEqual(
      expect.arrayContaining(['home-en', 'menu-en', 'home-es', 'menu-es']),
    )
    for (const f of site?.files ?? [])
      expect(f.file).toMatch(
        /^content\/\w+\/(pages\/home\/page|data\/(menu|redirects|shop))\.json$/,
      )
  })
  it('opens every page with its language, the meta fields (then a service’s own), then its blocks', () => {
    for (const c of collections)
      for (const [name, fields] of c.fields
        ? [[c.name, c.fields] as const]
        : (c.files ?? []).map((f) => [f.name, f.fields] as const))
        if (
          !name.startsWith('menu-') &&
          !name.startsWith('redirects-') &&
          !name.startsWith('shop-') &&
          name !== 'posts'
        )
          expect(fields.map((f) => f.name)).toEqual([
            ...(c.fields ? ['language', 'collection'] : []),
            ...Object.keys(metaFields),
            ...(name === 'services' ? Object.keys(serviceFields) : []),
            ...(name === 'products' ? Object.keys(productFields) : []),
            'blocks',
          ])
  })
  it('opens a post with what every post needs, its text in a rich text editor, and no blocks', () => {
    const post = collections.find((c) => c.name === 'posts')?.fields ?? []
    const names = post.map((f) => f.name)
    expect(names.slice(0, 6)).toEqual(['language', 'collection', 'title', 'date', 'cover', 'body'])
    expect(names).toEqual(
      expect.arrayContaining([...Object.keys(metaFields), ...Object.keys(postFields)]),
    )
    expect(names).toHaveLength(3 + Object.keys(metaFields).length + Object.keys(postFields).length)
    expect(names).not.toContain('blocks')
    expect(post.find((f) => f.name === 'body')?.widget).toBe('richtext')
  })
})

describe('CMS fields are typed by the block’s props', () => {
  // Each @ts-expect-error marks a line that must not compile: tsc in `pnpm check` fails when one does.
  const T = line('T', { required: true })
  it('refuses fields that do not fit', () => {
    const header = (fields: CmsBlock<PageHeaderProps>['fields']) => fields
    // @ts-expect-error a required prop (title) needs a required field
    header({ title: line('Title') })
    // @ts-expect-error a field must offer values of the prop's type (variant is band | split | photo)
    header({ title: T, variant: select('V', ['band', 'grid']) })
    // @ts-expect-error a field the block has no prop for
    header({ title: T, colour: line('C') })
    // @ts-expect-error a body (children) on a block that takes none
    header({ title: T, body: prose('B') })
    const table = (fields: CmsBlock<TableProps>['fields']) => fields
    // @ts-expect-error every required prop needs a field (Table's columns and rows)
    table({ title: T })
    expect(header({ title: T }).title).toBe(T)
  })
})

describe('BlockPage', () => {
  const words = { mediaLabels, reviewLabels, shareLabels, postLabels }
  it('renders a resolved block, its body as light markdown', () => {
    const table = {
      type: 'Table',
      columns: ['Position', ''],
      rows: [{ cells: ['Music Editor', '[Apply](/job/music-editor)'] }],
      body: 'Open **now**.',
    }
    const html = renderToStaticMarkup(
      <BlockPage words={words} blocks={[resolveBlock(table, marks)]} />,
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
