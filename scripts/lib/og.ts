import { createHash } from 'node:crypto'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import type { SiteConfig } from '../../src/i18n/types'
import { entryOgImage, OG_SIZE, siteOgImage } from '../../src/seo/og/paths'
import { ogTemplate } from '../../src/seo/og/template'
import { CONTENT_DIR, type FsEntry } from './content-fs'

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
const TEMPLATE = path.resolve('src/seo/og/template.tsx')
const LOGO = path.resolve('src/assets/images/brand/logo.svg')

function fonts() {
  return [400, 700, 800].map((weight) => ({
    name: 'Montserrat',
    weight: weight as 400 | 700 | 800,
    style: 'normal' as const,
    data: fs.readFileSync(path.join(FONT_DIR, `montserrat-latin-${weight}-normal.woff`)),
  }))
}

type Card = { title: string; subtitle: string; kind: string }
/** One og:image to write: a Satori card, or a page's own picture to crop. */
type Job = { out: string } & ({ card: Card } | { picture: string })

export interface OgDirs {
  /** Where the images go (served from the site root). */
  publicDir?: string
  /** Rendered images by input hash, kept across builds. */
  cacheDir?: string
  /** Where page folders are, for a page's own picture. */
  contentDir?: string
}

/**
 * Writes every og:image of a locale into public/og/<locale>, exactly the files the <head> links (src/seo/og/paths.ts):
 * the site card, and per entry its own picture (`og.image`, cropped to 1200x630) or else a Satori card from its
 * (og) title and description. The folder is rebuilt from scratch, so it holds nothing else; images are cached by a
 * hash of their inputs, the template and the logo included. Throws, failing the build, when a picture is missing or
 * too small. Returns how many images were made (not taken from the cache).
 */
export async function buildOgImages(
  entries: FsEntry[],
  site: SiteConfig,
  { publicDir = 'public', cacheDir = '.cache/og', contentDir = CONTENT_DIR }: OgDirs = {},
): Promise<number> {
  const jobs: Job[] = [
    { out: siteOgImage(site.locale), card: { title: site.siteName, subtitle: '', kind: 'site' } },
    ...entries.map((e): Job => {
      const out = entryOgImage(e)
      const own = e.meta.og?.image
      if (own) return { out, picture: path.join(contentDir, e.dir, own.src) }
      const card = {
        title: e.meta.og?.title ?? e.meta.title,
        subtitle: e.meta.og?.description ?? e.meta.description,
        kind: e.collection,
      }
      return { out, card }
    }),
  ]
  for (const j of jobs)
    if ('picture' in j && !fs.existsSync(j.picture))
      throw new Error(
        `og.image: ${j.picture} does not exist (meta.ts names a picture in its folder)`,
      )

  fs.rmSync(path.join(publicDir, 'og', site.locale), { recursive: true, force: true })
  fs.mkdirSync(cacheDir, { recursive: true })
  const logo = fs.readFileSync(LOGO, 'utf8')
  const logoData = `data:image/svg+xml;base64,${Buffer.from(logo).toString('base64')}`
  const design = fs.readFileSync(TEMPLATE, 'utf8') + logo
  let loadedFonts: ReturnType<typeof fonts> | undefined
  let made = 0
  for (const j of jobs) {
    const hash = createHash('sha1')
    if ('card' in j) hash.update(JSON.stringify({ ...j.card, brand: site.brand, design }))
    else hash.update('crop 1').update(fs.readFileSync(j.picture))
    const cached = path.join(cacheDir, `${hash.digest('hex')}${path.extname(j.out)}`)
    if (!fs.existsSync(cached)) {
      if ('card' in j) {
        loadedFonts ??= fonts()
        const svg = await satori(ogTemplate({ ...j.card, brand: site.brand, logoData }), {
          ...OG_SIZE,
          fonts: loadedFonts,
        })
        const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_SIZE.width } })
          .render()
          .asPng()
        fs.writeFileSync(cached, png)
      } else {
        fs.writeFileSync(cached, await cropPicture(j.picture))
      }
      made++
    }
    const out = path.join(publicDir, j.out)
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.copyFileSync(cached, out)
  }
  return made
}

/** A page's own picture as a 1200x630 JPEG (centre crop); refuses one smaller than that rather than blow it up. */
async function cropPicture(file: string): Promise<Buffer> {
  const { autoOrient } = await sharp(file).metadata()
  if (autoOrient.width < OG_SIZE.width || autoOrient.height < OG_SIZE.height)
    throw new Error(
      `og.image: ${file} is ${autoOrient.width}x${autoOrient.height}; a share picture must be at least ${OG_SIZE.width}x${OG_SIZE.height}`,
    )
  return sharp(file)
    .rotate()
    .resize(OG_SIZE.width, OG_SIZE.height, { fit: 'cover' })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()
}
