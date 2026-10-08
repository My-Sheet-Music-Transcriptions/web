import fs from 'node:fs'
import path from 'node:path'
import { catalogue } from '../../src/components/blocks/catalogue'
import { checkProps } from './blocks-lib'

/**
 * Checks and prepares a page mockup (mockups/<slug>/sections.html) for the review artifact, so a
 * mistake shows up as one clear line from `pnpm ds:review` instead of a blank or broken preview.
 * Also used by tests/unit/mockups.test.ts, which keeps every committed mockup valid as blocks change.
 */

export const LAYOUT = ['TopBar', 'Header', 'Footer'] as const
export const COMPONENTS: readonly string[] = [...Object.keys(catalogue), ...LAYOUT]
const IMAGE = /^img\/[\w.-]+\.(png|jpe?g|webp|gif|svg)$/i

export interface PreparedSections {
  /** sections.html with `"img/…"` image props of real blocks turned into picture objects. */
  html: string
  /** One line per problem; empty when the mockup is good to publish. */
  errors: string[]
  /** Section labels top to bottom, `(new)` for proposed blocks. */
  labels: string[]
}

/** Width and height of a PNG, JPEG, WebP, GIF or SVG file, read from its header. */
export function imageSize(file: string): { w: number; h: number } {
  const b = fs.readFileSync(file)
  if (b.toString('ascii', 1, 4) === 'PNG') return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }
  if (b.toString('ascii', 0, 3) === 'GIF') return { w: b.readUInt16LE(6), h: b.readUInt16LE(8) }
  if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
    const kind = b.toString('ascii', 12, 16)
    if (kind === 'VP8X') return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) }
    if (kind === 'VP8L') {
      const bits = b.readUInt32LE(21)
      return { w: 1 + (bits & 0x3fff), h: 1 + ((bits >> 14) & 0x3fff) }
    }
    return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2
    while (i < b.length) {
      const marker = b[i + 1] ?? 0
      const len = b.readUInt16BE(i + 2)
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) }
      i += 2 + len
    }
  }
  const svg = b.toString('utf8')
  const box = svg.match(/viewBox="[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)"/)
  if (box) return { w: Math.round(Number(box[1])), h: Math.round(Number(box[2])) }
  throw new Error(`cannot read the size of ${file}`)
}

/** The wrapper every sections.html starts with (white page, ink text, Montserrat). */
export const WRAPPER_OPEN =
  '<div style="width: 100%; background: #ffffff; color: #444444; font-family: \'Montserrat Variable\', Montserrat, system-ui, sans-serif;">'

/** Entity-decodes a `data-props` attribute value (the bundle's `JSON.parse(dataset.props)` sees the same). */
export const decodeProps = (s: string) =>
  s
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
/** Encodes JSON for a single-quoted `data-props='…'` attribute: `&amp;` and `&#39;`, nothing else. */
export const encodeProps = (s: string) => s.replaceAll('&', '&amp;').replaceAll("'", '&#39;')
const decode = decodeProps
const encode = encodeProps

/** Opening tags with their quoted attributes (a `>` inside a quoted data-props value is fine). */
const TAG = /<([a-z][\w-]*)((?:\s+[\w:-]+(?:=(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*\/?>/gi
const ATTR = /([\w:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g

function attrs(raw: string) {
  const out: Record<string, string> = {}
  for (const m of raw.matchAll(ATTR)) out[m[1] as string] = m[2] ?? m[3] ?? m[4] ?? ''
  return out
}

export interface Block {
  name: string
  proposed: boolean
  /** Parsed `data-props`; undefined when the tag has none. */
  props?: unknown
  /** Set when `data-props` is not valid JSON. */
  propsError?: string
  /** The opening tag as written. */
  tag: string
}

/** The block tags of a sections.html, top to bottom, with their props decoded (no validation). */
export function parseBlocks(html: string): Block[] {
  const out: Block[] = []
  for (const m of html.matchAll(TAG)) {
    const a = attrs(m[2] ?? '')
    const name = a['data-msmt'] ?? a['data-proposed']
    if (!name) continue
    const block: Block = { name, proposed: a['data-proposed'] !== undefined, tag: m[0] }
    if (a['data-props'] !== undefined) {
      try {
        block.props = JSON.parse(decodeProps(a['data-props']))
      } catch (e) {
        block.propsError = (e as Error).message
      }
    }
    out.push(block)
  }
  return out
}

/** Validates sections.html and resolves image props; `imgDir` is mockups/<slug>/img. */
export function prepareSections(sections: string, imgDir: string): PreparedSections {
  const errors: string[] = []
  const labels: string[] = []
  const real: string[] = []
  const have = (f: string) => fs.existsSync(path.join(imgDir, f))

  if (/<script\b/i.test(sections))
    errors.push('no <script> in sections.html (the bundle renders the blocks)')
  if (sections.includes('{{'))
    errors.push('a template placeholder ({{ … }}) is left in sections.html')
  // Links to other sites are fine; anything loaded at runtime (images, fonts, styles) is not.
  const external = /(?:\bsrc(?:set)?=["']?|url\(["']?|<link[^>]*href=["']?)(https?:\/\/[^"')\s]+)/gi
  for (const m of sections.matchAll(external))
    errors.push(`external file ${m[1]}: download it into img/ instead`)

  const html = sections.replace(TAG, (tag, _name: string, raw: string) => {
    const a = attrs(raw)
    const src = a.src
    if (src?.startsWith('img/') && !have(src.slice(4))) errors.push(`missing image ${src}`)
    const name = a['data-msmt'] ?? a['data-proposed']
    if (!name) return tag
    const proposed = a['data-proposed'] !== undefined
    labels.push(proposed ? `${name} (new)` : name)
    if (!proposed) {
      real.push(name)
      if (!COMPONENTS.includes(name))
        errors.push(
          `unknown block "${name}": use one of ${COMPONENTS.join(', ')}, or draw it as data-proposed`,
        )
    } else if (COMPONENTS.includes(name) && !LAYOUT.includes(name as (typeof LAYOUT)[number]))
      errors.push(`"${name}" already exists: use data-msmt="${name}" instead of drawing it`)
    const known = !proposed && COMPONENTS.includes(name)
    if (a['data-props'] === undefined) {
      if (known) errors.push(...checkProps(name, {}))
      return tag
    }
    let props: unknown
    try {
      props = JSON.parse(decode(a['data-props']))
    } catch (e) {
      errors.push(
        `${name}: data-props is not valid JSON (${(e as Error).message}); write apostrophes as &#39; and wrap the attribute in single quotes`,
      )
      return tag
    }
    if (proposed) return tag
    if (known) errors.push(...checkProps(name, props))
    const resolve = (v: unknown): unknown => {
      if (typeof v === 'string' && IMAGE.test(v)) {
        if (!have(v.slice(4))) {
          errors.push(`${name}: missing image ${v}`)
          return v
        }
        // an SVG (a logo) stays a URL; anything else becomes a picture with its size
        if (/\.svg$/i.test(v)) return v
        return { sources: {}, img: { src: v, ...imageSize(path.join(imgDir, v.slice(4))) } }
      }
      if (Array.isArray(v)) return v.map(resolve)
      if (v && typeof v === 'object')
        return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x)]))
      return v
    }
    const json = encode(JSON.stringify(resolve(props)))
    return tag.replace(/data-props=(?:'[^']*'|"[^"]*")/, `data-props='${json}'`)
  })

  const marked = sections.match(/\sdata-(?:msmt|proposed)=/g)?.length ?? 0
  if (marked !== labels.length)
    errors.push(
      `${marked - labels.length} block tag(s) could not be read: usually a raw apostrophe inside data-props='…' (write it as &#39;)`,
    )
  if (real[0] !== 'TopBar' || real[1] !== 'Header')
    errors.push('start with <div data-msmt="TopBar"></div> then <div data-msmt="Header"></div>')
  if (real.at(-1) !== 'Footer' || labels.at(-1) !== 'Footer')
    errors.push('end with <div data-msmt="Footer"></div>')
  return { html, errors, labels }
}
