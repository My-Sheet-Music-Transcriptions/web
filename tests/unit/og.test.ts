import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import sharp from 'sharp'
import { afterAll, describe, expect, it } from 'vitest'
import { CONTENT_DIR, type FsEntry, readAllEntries } from '../../scripts/lib/content-fs'
import { buildOgImages } from '../../scripts/lib/og'
import { parseMeta } from '../../src/content/schema'
import { sites } from '../../src/i18n/sites'
import { entryHead, rootHead } from '../../src/seo/head'
import { entryOgImage, OG_SIZE, siteOgImage } from '../../src/seo/og/paths'
import { absoluteUrl, SITE_LOCALE } from '../../src/site'

/**
 * Every page has an og:image, by construction: the <head> only ever links src/seo/og/paths.ts, and the build
 * (scripts/lib/og.ts) writes exactly those files, a Satori card for each page that does not bring its own picture.
 */
const tags = (meta: Record<string, string>[], key: string) =>
  meta.filter((m) => m.property === key || m.name === key).map((m) => m.content)

describe('og:image in the <head>', () => {
  const entries = readAllEntries().filter((e) => e.locale === SITE_LOCALE && !e.meta.draft)
  it.each(entries.map((e) => [e.file, e] as const))('%s links its build image', (_, e) => {
    const { meta } = entryHead(e.locale, e.path)
    const url = absoluteUrl(e.locale, entryOgImage(e))
    expect(tags(meta, 'og:image')).toEqual([url])
    expect(tags(meta, 'twitter:image')).toEqual([url])
    expect(tags(meta, 'og:image:width')).toEqual([String(OG_SIZE.width)])
    expect(tags(meta, 'og:image:height')).toEqual([String(OG_SIZE.height)])
  })
  it('gives every other page (404, error page) the site card from the root route', () => {
    const { meta } = rootHead('/app.css', SITE_LOCALE)
    const url = absoluteUrl(SITE_LOCALE, siteOgImage(SITE_LOCALE))
    expect(tags(meta, 'og:image')).toEqual([url])
    expect(tags(meta, 'twitter:image')).toEqual([url])
  })
})

describe('a page’s own og.image', () => {
  const meta = (src: string) =>
    parseMeta(
      'pages',
      {
        title: 'A page title',
        description: 'A page description, long enough for the meta schema to accept it.',
        translationKey: 'x',
        og: { image: { src, alt: 'A share picture' } },
      },
      'en/pages/x/meta.ts',
    )
  it('is a picture file in the page folder', () => {
    expect(meta('share.jpg').og?.image?.src).toBe('share.jpg')
    expect(meta('Share-1.webp').og?.image?.src).toBe('Share-1.webp')
  })
  it.each(['https://example.com/x.jpg', '/images/x.jpg', '../x.jpg', 'sub/x.jpg', 'x.svg'])(
    'refuses %s',
    (src) => {
      expect(() => meta(src)).toThrow(/a picture file in the page folder/)
    },
  )
  it('exists beside meta.ts and is at least 1200x630, in every page that names one', async () => {
    for (const e of readAllEntries()) {
      const own = e.meta.og?.image
      if (!own) continue
      const file = path.join(CONTENT_DIR, e.dir, own.src)
      expect(fs.existsSync(file), `${e.file}: og.image ${own.src} is not in the folder`).toBe(true)
      const { autoOrient } = await sharp(file).metadata()
      expect(autoOrient.width, file).toBeGreaterThanOrEqual(OG_SIZE.width)
      expect(autoOrient.height, file).toBeGreaterThanOrEqual(OG_SIZE.height)
    }
  })
})

describe('buildOgImages', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'og-'))
  afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }))
  const dirs = {
    publicDir: path.join(tmp, 'public'),
    cacheDir: path.join(tmp, 'cache'),
    contentDir: path.join(tmp, 'content'),
  }
  const entry = (slug: string, og?: { image: { src: string; alt: string } }): FsEntry => {
    const file = `en/pages/${slug}/meta.ts`
    const meta = parseMeta(
      'pages',
      {
        title: `Fixture ${slug}`,
        description: 'A fixture page description, long enough for the meta schema to accept it.',
        translationKey: slug,
        og,
      },
      file,
    )
    return {
      locale: 'en',
      collection: 'pages',
      slug,
      path: `/${slug}`,
      url: `${sites.en.domain}/${slug}`,
      dir: `en/pages/${slug}`,
      file,
      page: `en/pages/${slug}/index.tsx`,
      meta,
    }
  }
  const picture = async (slug: string, width: number, height: number) => {
    const dir = path.join(dirs.contentDir, 'en/pages', slug)
    fs.mkdirSync(dir, { recursive: true })
    await sharp({ create: { width, height, channels: 3, background: '#219ebc' } })
      .jpeg()
      .toFile(path.join(dir, 'share.jpg'))
  }
  const size = async (urlPath: string) => {
    const m = await sharp(path.join(dirs.publicDir, urlPath)).metadata()
    return `${m.format} ${m.width}x${m.height}`
  }

  it('writes the site card and one image per page, and nothing else', async () => {
    await picture('photo', 1600, 1000)
    const card = entry('card')
    const photo = entry('photo', { image: { src: 'share.jpg', alt: 'A share picture' } })
    const stale = path.join(dirs.publicDir, 'og/en/pages/deleted.png')
    fs.mkdirSync(path.dirname(stale), { recursive: true })
    fs.writeFileSync(stale, '')

    expect(await buildOgImages([card, photo], sites.en, dirs)).toBe(3)
    expect(await size(siteOgImage('en'))).toBe('png 1200x630')
    expect(await size(entryOgImage(card))).toBe('png 1200x630')
    expect(await size(entryOgImage(photo))).toBe('jpeg 1200x630')
    expect(fs.existsSync(stale)).toBe(false)
    // A second build takes them all from the cache.
    expect(await buildOgImages([card, photo], sites.en, dirs)).toBe(0)
  }, 30_000)
  it('fails the build on a picture that is missing or smaller than 1200x630', async () => {
    const missing = entry('missing', { image: { src: 'share.jpg', alt: 'A share picture' } })
    await expect(buildOgImages([missing], sites.en, dirs)).rejects.toThrow(/does not exist/)
    await picture('small', 800, 600)
    const small = entry('small', { image: { src: 'share.jpg', alt: 'A share picture' } })
    await expect(buildOgImages([small], sites.en, dirs)).rejects.toThrow(/at least 1200x630/)
  })
})
