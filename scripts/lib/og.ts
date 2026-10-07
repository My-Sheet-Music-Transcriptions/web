import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import type { SiteConfig } from '../../src/i18n/types'
import { ogTemplate } from '../../src/seo/og/template'
import type { FsEntry } from './content-fs'

// Satori's ESM entry mixes require() with top-level await (harfbuzz wasm) and fails on Node 22;
// the CommonJS build works, so it is loaded through createRequire.
type SatoriFn = (
  element: unknown,
  options: {
    width: number
    height: number
    fonts: { name: string; data: Buffer; weight: 400 | 700 | 800; style: 'normal' }[]
  },
) => Promise<string>
const require = createRequire(import.meta.url)
const satoriModule = require('satori') as SatoriFn | { default: SatoriFn }
const satori: SatoriFn = typeof satoriModule === 'function' ? satoriModule : satoriModule.default

const FONT_DIR = path.resolve('node_modules/@fontsource/montserrat/files')
const CACHE = path.resolve('.cache/og')

function fonts() {
  return [400, 700, 800].map((weight) => ({
    name: 'Montserrat',
    weight: weight as 400 | 700 | 800,
    style: 'normal' as const,
    data: fs.readFileSync(path.join(FONT_DIR, `montserrat-latin-${weight}-normal.woff`)),
  }))
}

export function ogPathFor(entry: { locale: string; collection: string; slug: string }): string {
  return `/og/${entry.locale}/${entry.collection}/${entry.slug}.png`
}

/** Renders one 1200x630 PNG per entry into public/og, cached by a hash of the inputs. */
export async function buildOgImages(entries: FsEntry[], site: SiteConfig): Promise<number> {
  fs.mkdirSync(CACHE, { recursive: true })
  const logo = fs.readFileSync(path.resolve('src/assets/images/brand/logo.svg'), 'utf8')
  const logoData = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`
  const loadedFonts = fonts()
  let made = 0
  for (const e of entries) {
    const title = e.meta.og?.title ?? e.meta.title
    const subtitle = e.meta.og?.description ?? e.meta.description
    const kind = e.collection
    const hash = createHash('sha1')
      .update(JSON.stringify({ title, subtitle, kind, brand: site.brand, v: 2 }))
      .digest('hex')
    const out = path.join('public', ogPathFor(e))
    const cached = path.join(CACHE, `${hash}.png`)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    if (fs.existsSync(cached)) {
      fs.copyFileSync(cached, out)
      continue
    }
    const svg = await satori(ogTemplate({ title, subtitle, kind, brand: site.brand, logoData }), {
      width: 1200,
      height: 630,
      fonts: loadedFonts,
    })
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
    fs.writeFileSync(cached, png)
    fs.copyFileSync(cached, out)
    made++
  }
  return made
}
