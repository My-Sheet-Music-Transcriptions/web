import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  blockSummary,
  boardFiles,
  boardHtml,
  type Canvas,
  canvasFilesFor,
  DESIGN_TYPE_URL,
  DS_PREFIX,
  estimateHeight,
  freshCanvas,
  layoutBoards,
  mergeCanvas,
  notesText,
  publishSteps,
  pullBoard,
} from '../../scripts/design-system/canvas-lib'
import { designSystemFiles, mergeMemo } from '../../scripts/design-system/preview-lib'
import { prepareSections } from '../../scripts/design-system/review-lib'

/**
 * Design mode: a mockup becomes the artboards of a Design canvas and comes back unchanged, and republishing
 * never undoes what people did on the canvas (moved frames, renamed boards, extra notes).
 */
const giftCard = fs.readFileSync('mockups/gift-card/sections.html', 'utf8')
const imgDir = 'mockups/gift-card/img'
const dsUrl = 'https://claude.ai/artifact/DS'

describe('artboards', () => {
  const prepared = prepareSections(giftCard, imgDir)
  const html = boardHtml(prepared.html, { title: 'Gift card', width: 1440, height: 3000 })

  it('keeps the Design Component skeleton in order', () => {
    const order = [
      '<script src="./support.js"></script>',
      'href="ds/msmt/components/fonts.css"',
      'href="ds/msmt/components/bundle.css"',
      'src="ds/msmt/components/bundle.js"',
      '<x-dc>',
      '<helmet>',
      '</helmet>',
      '<div style="width: 100%;',
      '</x-dc>',
      '<script type="text/x-dc" data-dc-script data-props=\'{"$preview":{"width":1440,"height":3000}}\'>',
      'MSMT.renderAll()',
    ]
    let at = -1
    for (const piece of order) {
      const i = html.indexOf(piece, at + 1)
      expect(i, piece).toBeGreaterThan(at)
      at = i
    }
    const page = html.slice(html.indexOf('<x-dc>'), html.indexOf('</x-dc>'))
    expect(page).not.toMatch(/<script/i)
    expect(page).toContain("data-props='")
    expect(page).toContain('"image":{"sources":{},"img":{"src":"img/mascot.png"')
  })

  it('refuses scripts and stray x-dc ends', () => {
    expect(() =>
      boardHtml('<div><script></script></div>', { title: 't', width: 1, height: 1 }),
    ).toThrow()
    expect(() => boardHtml('<div></x-dc></div>', { title: 't', width: 1, height: 1 })).toThrow()
  })

  it('estimates heights from the catalogue', () => {
    expect(
      estimateHeight(['TopBar', 'Header', 'PageHero', 'Steps', 'Foo (new)', 'Footer'], 1440),
    ).toBe(60 + 120 + 340 + 760 + 600 + 820)
    expect(estimateHeight(['TopBar', 'Header', 'Footer'], 390)).toBe(1600)
    expect(estimateHeight([], 1440)).toBe(900)
  })

  it('names and lays out the boards of every option', () => {
    expect(boardFiles('')).toEqual({ desktop: 'Main.dc.html', phone: 'Mobile.dc.html' })
    expect(boardFiles('warm tone')).toEqual({
      desktop: 'Warm-tone.dc.html',
      phone: 'Warm-tone-mobile.dc.html',
    })
    expect(() => boardFiles('main')).toThrow()
    const boards = layoutBoards('Gift card', [
      { variant: '', html: '', labels: ['TopBar', 'Header', 'Footer'] },
      { variant: 'b', html: '', labels: ['TopBar', 'Header', 'Footer'] },
    ])
    expect(boards.map((b) => b.file)).toEqual([
      'Main.dc.html',
      'Mobile.dc.html',
      'B.dc.html',
      'B-mobile.dc.html',
    ])
    expect(boards[0]).toMatchObject({ x: 0, y: 0, w: 1440, title: 'Gift card / 1440' })
    expect(boards[1]).toMatchObject({ x: 1520, y: 0, w: 390, title: 'Gift card / 390' })
    expect(boards[2]?.y).toBe(1600 + 120)
    expect(boards[3]?.title).toBe('Gift card · b / 390')
  })

  it('writes the sticky note from the labels', () => {
    const text = notesText([
      { variant: '', html: '', labels: ['TopBar', 'Header', 'PieceList (new)', 'Footer'] },
    ])
    expect(text).toContain('1. TopBar')
    expect(text).toContain('3. NEW PieceList')
    expect(text).toContain('NEW = a block or prop that does not exist yet')
  })
})

describe('canvas.json', () => {
  const boards = layoutBoards('Gift card', [
    { variant: '', html: '', labels: ['TopBar', 'Header', 'Footer'] },
  ])
  const fresh = freshCanvas({
    title: 'Gift card',
    boards,
    notes: 'Sections',
    dsUrl,
    now: '2026-10-08T00:00:00Z',
  })

  it('has the v3 shape with the design system installed', () => {
    expect(fresh.v).toBe(3)
    expect(fresh.createdOnFiles).toEqual({ v: 1, at: '2026-10-08T00:00:00Z' })
    expect(Object.keys(fresh.boards)).toEqual(['Main.dc.html', 'Mobile.dc.html'])
    expect(fresh.boards['Main.dc.html']).toMatchObject({
      x: 0,
      y: 0,
      w: 1440,
      expand: 'fill',
      title: 'Gift card / 1440',
    })
    expect(fresh.order).toEqual(['Main.dc.html', 'Mobile.dc.html'])
    expect(fresh.notes.blocks).toMatchObject({ x: -480, fill: 'orange', text: 'Sections' })
    expect(fresh.designSystems).toEqual([
      {
        title: 'My Sheet Music Transcriptions',
        namespace: 'msmt',
        artifact: dsUrl,
        version: null,
        copiedAt: '2026-10-08T00:00:00Z',
      },
    ])
  })

  it('keeps what people changed on the canvas and refreshes only its own keys', () => {
    const existing: Canvas = {
      ...structuredClone(fresh),
      createdOnFiles: { v: 1, at: '2026-01-01T00:00:00Z' },
      title: 'Gift card (renamed)',
      launch: { view: 'focused', file: 'Main.dc.html' },
      pages: [{ id: 'flows', name: 'Flows' }],
      boards: {
        'Main.dc.html': { x: 200, y: 50, w: 1200, h: 4200, title: 'Desktop idea', expand: 'fill' },
        'Mobile.dc.html': {
          x: 1700,
          y: 50,
          w: 390,
          h: 6000,
          title: 'Gift card / 390',
          expand: 'fill',
        },
        'Tablet.dc.html': { x: 0, y: 7000, w: 768, h: 2000 },
      },
      order: ['Tablet.dc.html', 'Mobile.dc.html', 'Main.dc.html'],
      notes: {
        blocks: { x: -600, y: 10, w: 420, maxH: 900, fill: 'green', text: 'old' },
        todo: { x: 0, y: -300, text: 'Ask about the price', kind: 'title1' },
      },
      designSystems: [
        {
          title: 'Other',
          namespace: 'other',
          artifact: 'https://claude.ai/artifact/X',
          version: null,
          copiedAt: 'x',
        },
        {
          title: 'MSMT',
          namespace: 'msmt',
          artifact: 'https://claude.ai/artifact/OLD',
          version: '1',
          copiedAt: 'y',
        },
      ],
      extra: { kept: true },
    }
    const merged = mergeCanvas(existing, fresh)
    expect(merged.createdOnFiles.at).toBe('2026-01-01T00:00:00Z')
    expect(merged.title).toBe('Gift card (renamed)')
    expect(merged.launch).toEqual({ view: 'focused', file: 'Main.dc.html' })
    expect(merged.pages).toEqual([{ id: 'flows', name: 'Flows' }])
    expect(merged.boards['Main.dc.html']).toEqual({
      x: 200,
      y: 50,
      w: 1440,
      h: 4200,
      title: 'Desktop idea',
      expand: 'fill',
    })
    expect(merged.boards['Mobile.dc.html']).toMatchObject({
      x: 1700,
      h: 6000,
      title: 'Gift card / 390',
    })
    expect(merged.boards['Tablet.dc.html']).toEqual({ x: 0, y: 7000, w: 768, h: 2000 })
    expect(merged.order).toEqual(['Tablet.dc.html', 'Mobile.dc.html', 'Main.dc.html'])
    expect(merged.notes.blocks).toMatchObject({ x: -600, fill: 'green', text: 'Sections' })
    expect(merged.notes.todo).toEqual(existing.notes.todo)
    expect(merged.designSystems[0]).toEqual(existing.designSystems[0])
    expect(merged.designSystems[1]).toMatchObject({
      namespace: 'msmt',
      artifact: dsUrl,
      version: '1',
      copiedAt: 'y',
    })
    expect(merged.extra).toEqual({ kept: true })
    expect(Object.keys(merged).slice(0, 5)).toEqual([
      'v',
      'createdOnFiles',
      'title',
      'launch',
      'pages',
    ])
  })

  it('adds boards the canvas does not have yet', () => {
    const existing: Canvas = {
      ...structuredClone(fresh),
      boards: {},
      order: [],
      notes: {},
      designSystems: [],
    }
    const merged = mergeCanvas(existing, fresh)
    expect(merged.boards).toEqual(fresh.boards)
    expect(merged.order).toEqual(fresh.order)
    expect(merged.notes.blocks).toEqual(fresh.notes.blocks)
    expect(merged.designSystems).toEqual(fresh.designSystems)
  })
})

describe('publishing', () => {
  const boards = layoutBoards('Gift card', [
    { variant: '', html: '', labels: ['TopBar', 'Header', 'Footer'] },
  ])

  it('copies only the rendering files of the design system into the canvas', () => {
    const manifest = {
      files: [
        'design-system.json',
        'README.md',
        'tokens.json',
        'components/bundle.js',
        'components/bundle.css',
        'components/fonts.css',
        'components/index.d.ts',
        'components/Hero/preview.html',
        'components/assets/a.webp',
        'fonts/m.woff2',
      ],
    }
    const files = {
      ...canvasFilesFor(boards),
      ...designSystemFiles(DS_PREFIX, manifest, { url: dsUrl, version: null }),
    }
    expect(Object.keys(files)).toEqual([
      'project/Main.dc.html',
      'project/Mobile.dc.html',
      'project/ds/msmt/tokens.json',
      'project/ds/msmt/components/bundle.js',
      'project/ds/msmt/components/bundle.css',
      'project/ds/msmt/components/fonts.css',
      'project/ds/msmt/components/assets/a.webp',
      'project/ds/msmt/fonts/m.woff2',
    ])
    expect(files['project/ds/msmt/components/bundle.js']).toEqual({
      artifact: dsUrl,
      path: 'project/components/bundle.js',
    })
    const pinned = designSystemFiles(DS_PREFIX, manifest, {
      url: dsUrl,
      version: '1791471138-a631',
    })
    expect(pinned['project/ds/msmt/components/bundle.js']).toEqual({
      artifact: dsUrl,
      path: 'project/components/bundle.js',
      ver: '1791471138-a631',
    })
  })

  it('creates the canvas first when there is none, else publishes to it', () => {
    const opts = {
      title: 'Gift card',
      root: 'r',
      filePath: '/r/project/canvas.json',
      files: {},
      description: 'd',
    }
    const first = publishSteps({}, opts)
    expect(first).toHaveLength(2)
    expect(first[0]).toEqual({
      type_url: DESIGN_TYPE_URL,
      title: 'Gift card',
      auto_open: 'after_first_write',
    })
    expect(first[1]).toMatchObject({
      root: 'r',
      file_path: '/r/project/canvas.json',
      description: 'd',
    })
    const later = publishSteps({ canvas: { url: 'https://claude.ai/artifact/C' } }, opts)
    expect(later).toHaveLength(1)
    expect(later[0]).toMatchObject({ url: 'https://claude.ai/artifact/C', root: 'r' })
    expect(later[0]).not.toHaveProperty('type_url')
  })

  it('merges the preview memo without losing keys', () => {
    const merged = mergeMemo(
      { path: '/x', url: 'u', canvas: { url: 'c' }, custom: 1 },
      { title: 'T', path: undefined, pr: { number: 1, url: 'p', branch: 'b' } },
    )
    expect(Object.keys(merged)).toEqual(['title', 'url', 'canvas', 'pr', 'custom'])
    expect(merged.canvas).toEqual({ url: 'c' })
  })
})

describe('pulling an artboard back', () => {
  it('returns the sections it was built from', () => {
    const prepared = prepareSections(giftCard, imgDir)
    const board = boardHtml(prepared.html, { title: 'Gift card', width: 1440, height: 3000 })
    const { sections, warnings, unmapped } = pullBoard(board)
    expect(warnings).toEqual([])
    expect(unmapped).toEqual([])
    expect(blockSummary(sections)).toEqual(blockSummary(giftCard))
    expect(sections).toContain('Let’s keep music alive')
    expect(prepareSections(sections, imgDir).errors).toEqual([])
  })

  it('tolerates what the editor does: double quotes, rendered DOM, uploaded pictures', () => {
    const board = `<!doctype html><html><head><script src="./support.js"></script></head><body>
<x-dc>
<helmet><style>body{margin:0}</style></helmet>
<div style="width: 100%; background: #ffffff;">
  <div data-msmt="TopBar"></div>
  <div data-msmt="Header"><header class="rendered"><nav>Services</nav></header></div>
  <div data-msmt="PageHero" data-props="{&quot;title&quot;:&quot;Gift a transcription!&quot;,&quot;subtitle&quot;:&quot;It&#39;s here&quot;}"></div>
  <div data-msmt="MediaText" data-props='{"image":{"sources":{},"img":{"src":"img/mascot.png","w":1,"h":1}},"children":"Hi"}'></div>
  <section data-proposed="PieceList" data-props='{"count":2}' style="padding: 50px 16px;"><h2>Pieces</h2><img src="/_blob/0123456789abcdef0123456789abcdef" alt="a"><img src="https://claude.ai/_blob/ffffffffffffffffffffffffffffffff" alt="b"></section>
  <div data-msmt="Footer"></div>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":1440,"height":3000}}'>class Component extends DCLogic {}</script>
</body></html>`
    const { sections, warnings, unmapped } = pullBoard(board, {
      uploads: { '0123456789abcdef0123456789abcdef': 'photo.jpg' },
    })
    expect(warnings).toEqual([
      expect.stringMatching(/^Header: what was typed inside the block was dropped/),
    ])
    expect(unmapped).toEqual(['ffffffffffffffffffffffffffffffff'])
    expect(sections).toContain('<div data-msmt="Header"></div>')
    expect(sections).toContain(
      `data-props='{"title":"Gift a transcription!","subtitle":"It&#39;s here"}'`,
    )
    expect(sections).toContain(`data-props='{"image":"img/mascot.png","children":"Hi"}'`)
    expect(sections).toContain('<img src="img/photo.jpg" alt="a">')
    expect(sections).toContain('src="https://claude.ai/_blob/ffffffffffffffffffffffffffffffff"')
    expect(sections).toContain(`data-props='{"count":2}'`)
    expect(blockSummary(sections).map((b) => b.name)).toEqual([
      'TopBar',
      'Header',
      'PageHero',
      'MediaText',
      'PieceList',
      'Footer',
    ])
  })

  it('refuses something that is not an artboard', () => {
    expect(() => pullBoard('<div>nope</div>')).toThrow(/not a canvas artboard/)
  })
})
