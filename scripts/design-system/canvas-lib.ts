import * as cheerio from 'cheerio'
import { catalogue } from '../../src/components/blocks/catalogue'
import { LAYOUT_HEIGHTS, type PreviewMemo } from './preview-lib'
import { decodeProps, encodeProps, parseBlocks } from './review-lib'

/**
 * Pure pieces of `pnpm ds:canvas`: a page mockup (mockups/<slug>/sections.html) as the files of a Claude
 * Design canvas (one desktop and one phone artboard per sections file, the real blocks rendered by the
 * design-system bundle installed on the canvas), and the way back from an artboard to sections.html.
 * The file shapes follow the Design artifact type's instructions and are treated as fixed here.
 */

/** The Design artifact type a new canvas is created from (`type_url` + `title`, nothing else). */
export const DESIGN_TYPE_URL = 'https://claude.ai/artifact/QKN21svewxgyPb6SYRqWnd'
/** Where the design system is installed inside the canvas (`project/ds/<namespace>/…`). */
export const DS_NAMESPACE = 'msmt'
export const DS_PREFIX = `project/ds/${DS_NAMESPACE}/`
export const DS_TITLE = 'My Sheet Music Transcriptions'
export const DESKTOP = 1440
export const PHONE = 390
const COLUMN_GAP = 80
const ROW_GAP = 120
const HELMET =
  '<helmet><style>body{margin:0;background:#ffffff} a{color:#1a7f97}a:hover{color:#023047}</style></helmet>'

/** Estimated page height at `width`: a seed for the frame; `expand: "fill"` pages resize in the editor. */
export function estimateHeight(labels: string[], width: number): number {
  let h = 0
  for (const label of labels) {
    if (label.endsWith(' (new)')) h += 600
    else
      h +=
        (catalogue as Record<string, { previewHeight?: number }>)[label]?.previewHeight ??
        LAYOUT_HEIGHTS[label] ??
        400
  }
  if (width < 768) h *= 1.6
  return Math.max(900, Math.round(h / 10) * 10)
}

/** One artboard: a self-contained Design Component page mounting the real blocks (`title` as the board is named). */
export function boardHtml(
  preparedHtml: string,
  opts: { title: string; width: number; height: number },
): string {
  if (/<script\b/i.test(preparedHtml) || preparedHtml.includes('</x-dc>'))
    throw new Error('sections.html must not contain <script> or </x-dc>')
  const preview = JSON.stringify({ $preview: { width: opts.width, height: opts.height } })
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${opts.title}</title>
<script src="./support.js"></script>
<link rel="stylesheet" href="ds/${DS_NAMESPACE}/components/fonts.css">
<link rel="stylesheet" href="ds/${DS_NAMESPACE}/components/bundle.css">
<script src="ds/${DS_NAMESPACE}/components/bundle.js"></script>
</head>
<body>
<x-dc>
${HELMET}
${preparedHtml.trim()}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='${preview}'>
class Component extends DCLogic {
  componentDidMount() { if (window.MSMT) window.MSMT.renderAll(); }
  renderVals() { return {}; }
}
</script>
</body>
</html>
`
}

/** A mockup rendered on the canvas: the main sections.html or one `sections.<variant>.html`. */
export interface Option {
  /** "" for sections.html, else the variant name as in the file name. */
  variant: string
  /** `prepareSections(...).html` */
  html: string
  labels: string[]
}

export interface BoardSpec {
  file: string
  x: number
  y: number
  w: number
  h: number
  title: string
}

/** Artboard file stem of an option: Main / Mobile, or <Variant> / <Variant>-mobile. */
export function boardFiles(variant: string): { desktop: string; phone: string } {
  if (!variant) return { desktop: 'Main.dc.html', phone: 'Mobile.dc.html' }
  const stem = variant.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
  if (!stem || /^(main|mobile)$/i.test(stem))
    throw new Error(
      `variant "${variant}" needs a name other than main/mobile, letters and digits only`,
    )
  const cap = stem[0]?.toUpperCase() + stem.slice(1)
  return { desktop: `${cap}.dc.html`, phone: `${cap}-mobile.dc.html` }
}

/** Desktop + phone frame per option, one row per option, 80 px between frames, 120 between rows. */
export function layoutBoards(title: string, options: Option[]): BoardSpec[] {
  const out: BoardSpec[] = []
  let y = 0
  for (const o of options) {
    const files = boardFiles(o.variant)
    const name = o.variant ? `${title} · ${o.variant}` : title
    const hd = estimateHeight(o.labels, DESKTOP)
    const hp = estimateHeight(o.labels, PHONE)
    out.push({ file: files.desktop, x: 0, y, w: DESKTOP, h: hd, title: `${name} / ${DESKTOP}` })
    out.push({
      file: files.phone,
      x: DESKTOP + COLUMN_GAP,
      y,
      w: PHONE,
      h: hp,
      title: `${name} / ${PHONE}`,
    })
    y += Math.max(hd, hp) + ROW_GAP
  }
  return out
}

/** The orange sticky beside the artboards: the sections of every option, top to bottom. */
export function notesText(options: Option[]): string {
  const parts = options.map((o) => {
    const head = o.variant
      ? `Option "${o.variant}", sections top to bottom:`
      : 'Sections, top to bottom (= page order):'
    const list = o.labels
      .map((l, i) => `${i + 1}. ${l.endsWith(' (new)') ? `NEW ${l.slice(0, -6)}` : l}`)
      .join('\n')
    return `${head}\n${list}`
  })
  if (options.some((o) => o.labels.some((l) => l.endsWith(' (new)'))))
    parts.push(
      'NEW = a block or prop that does not exist yet: drawn by hand here, built for real on approval.',
    )
  return parts.join('\n\n')
}

export interface Canvas {
  v: 3
  createdOnFiles: { v: 1; at: string }
  title: string
  launch: { view: string; file?: string; page?: string }
  pages: unknown[]
  boards: Record<string, Record<string, unknown>>
  order: string[]
  notes: Record<string, Record<string, unknown>>
  designSystems: Record<string, unknown>[]
  [key: string]: unknown
}

export function freshCanvas(opts: {
  title: string
  boards: BoardSpec[]
  notes: string
  dsUrl: string
  now: string
}): Canvas {
  const boards: Canvas['boards'] = {}
  for (const b of opts.boards)
    boards[b.file] = { x: b.x, y: b.y, w: b.w, h: b.h, title: b.title, expand: 'fill' }
  return {
    v: 3,
    createdOnFiles: { v: 1, at: opts.now },
    title: opts.title,
    launch: { view: 'canvas' },
    pages: [],
    boards,
    order: opts.boards.map((b) => b.file),
    notes: { blocks: { x: -480, y: 0, w: 420, maxH: 900, fill: 'orange', text: opts.notes } },
    designSystems: [
      {
        title: DS_TITLE,
        namespace: DS_NAMESPACE,
        artifact: opts.dsUrl,
        version: null,
        copiedAt: opts.now,
      },
    ],
  }
}

const OWN_TITLE = new RegExp(` / (${DESKTOP}|${PHONE})$`)

/**
 * Brings an existing canvas.json up to date without undoing what people did in the editor: the script owns
 * each of its boards' `w`/`expand` (and `title` while it still looks like one it wrote), the sticky's text
 * and the design-system record's address; positions, heights, renamed titles, extra boards, notes, pages
 * and every unknown key stay.
 */
export function mergeCanvas(existing: Canvas | undefined, fresh: Canvas): Canvas {
  if (!existing) return fresh
  const boards: Canvas['boards'] = { ...existing.boards }
  for (const [file, b] of Object.entries(fresh.boards)) {
    const old = existing.boards[file]
    if (!old) {
      boards[file] = b
      continue
    }
    const title = typeof old.title === 'string' && !OWN_TITLE.test(old.title) ? old.title : b.title
    boards[file] = { ...old, w: b.w, expand: b.expand, title }
  }
  const order = [...existing.order, ...fresh.order.filter((f) => !existing.order.includes(f))]
  const notes: Canvas['notes'] = { ...existing.notes }
  const sticky = fresh.notes.blocks as Record<string, unknown>
  notes.blocks = existing.notes.blocks ? { ...existing.notes.blocks, text: sticky.text } : sticky
  const ours = fresh.designSystems[0] as Record<string, unknown>
  let found = false
  const designSystems = existing.designSystems.map((d) => {
    if (d.namespace !== DS_NAMESPACE) return d
    found = true
    return { ...d, artifact: ours.artifact }
  })
  if (!found) designSystems.push(ours)
  const { v, createdOnFiles, title, launch, pages, ...rest } = existing
  return {
    v,
    createdOnFiles,
    title,
    launch,
    pages,
    boards,
    order,
    notes,
    designSystems,
    ...Object.fromEntries(
      Object.entries(rest).filter(
        ([k]) => !['boards', 'order', 'notes', 'designSystems'].includes(k),
      ),
    ),
  }
}

/** The Artifact calls that publish the canvas: create it first when the memo has no canvas url yet. */
export function publishSteps(
  memo: PreviewMemo,
  opts: {
    title: string
    root: string
    filePath: string
    files: Record<string, unknown>
    description: string
  },
): Record<string, unknown>[] {
  const publish = {
    url: memo.canvas?.url ?? '<the url returned by call 1>',
    root: opts.root,
    file_path: opts.filePath,
    files: opts.files,
    description: opts.description,
  }
  if (memo.canvas?.url) return [publish]
  return [{ type_url: DESIGN_TYPE_URL, title: opts.title, auto_open: 'after_first_write' }, publish]
}

export interface Pulled {
  sections: string
  warnings: string[]
  /** `/_blob/<id>` pictures with no entry in preview.json → canvas.uploads. */
  unmapped: string[]
}

const BLOB = /(?:^|\/)_blob\/([0-9a-f]{32})(?:[?#].*)?$/

/** An artboard (as the Design editor saved it) back to the sections.html it was built from. */
export function pullBoard(
  boardHtml: string,
  opts: { uploads?: Record<string, string> } = {},
): Pulled {
  const warnings: string[] = []
  const unmapped: string[] = []
  const start = boardHtml.indexOf('</helmet>')
  const end = boardHtml.lastIndexOf('</x-dc>')
  if (start < 0 || end < 0)
    throw new Error('not a canvas artboard: no <helmet> … </x-dc> around the page')
  const fragment = boardHtml.slice(start + '</helmet>'.length, end).trim()

  const toImgRef = (src: string): string => {
    if (/^img\/[\w.-]+$/.test(src)) return src
    const m = BLOB.exec(src)
    if (m) {
      const file = opts.uploads?.[m[1] as string]
      if (file) return `img/${file}`
      unmapped.push(m[1] as string)
      return src
    }
    warnings.push(
      `picture "${src}" is not under img/: download it into img/ and point the page at it`,
    )
    return src
  }
  const unpicture = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(unpicture)
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>
      const img = o.img as Record<string, unknown> | undefined
      if ('sources' in o && img && typeof img.src === 'string') return toImgRef(img.src)
      return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, unpicture(x)]))
    }
    return v
  }

  const $ = cheerio.load(fragment, null, false)
  const encoded: string[] = []
  $('[data-msmt]').each((_, el) => {
    const $el = $(el)
    if ($el.html()?.trim()) {
      $el.empty()
      warnings.push(
        `${$el.attr('data-msmt')}: what was typed inside the block was dropped (the real block renders from its data-props; ask for the change instead)`,
      )
    }
  })
  $('[data-props]').each((_, el) => {
    const $el = $(el)
    const raw = $el.attr('data-props') ?? ''
    let props: unknown
    try {
      props = JSON.parse(decodeProps(raw))
    } catch {
      warnings.push(
        `${$el.attr('data-msmt') ?? $el.attr('data-proposed')}: data-props left as is (not valid JSON)`,
      )
      return
    }
    if ($el.is('[data-msmt]')) props = unpicture(props)
    encoded.push(encodeProps(JSON.stringify(props)))
    $el.attr('data-props', `__PROPS_${encoded.length - 1}__`)
  })
  $('[data-proposed] img[src]').each((_, el) => {
    const $el = $(el)
    $el.attr('src', toImgRef($el.attr('src') ?? ''))
  })
  let sections = $.html().trim()
  sections = sections.replace(
    /data-props="__PROPS_(\d+)__"/g,
    (_, i: string) => `data-props='${encoded[Number(i)]}'`,
  )
  if (!sections.startsWith('<div style='))
    warnings.push('the page no longer starts with the usual wrapper <div style="…">')
  if (!sections.endsWith('\n')) sections += '\n'
  return { sections, warnings, unmapped }
}

/** Names and props of the blocks, for comparing two sections files structurally. */
export function blockSummary(sections: string) {
  return parseBlocks(sections).map(({ name, proposed, props }) => ({ name, proposed, props }))
}

/** `files` entries for the artboards themselves (root-relative, the root being the canvas folder). */
export function canvasFilesFor(boards: BoardSpec[]): Record<string, string> {
  return Object.fromEntries(boards.map((b) => [`project/${b.file}`, `project/${b.file}`]))
}
