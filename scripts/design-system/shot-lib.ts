import fs from 'node:fs'
import http from 'node:http'
import type { AddressInfo } from 'node:net'
import path from 'node:path'
import { type Browser, chromium } from 'playwright'
import sharp from 'sharp'
import { chromiumExecutable } from '../lib/chromium'
import { PROJ } from './lib'
import { mockupDir } from './preview-lib'

/**
 * The local render check behind `pnpm ds:shot` and `pnpm ds:review`: renders a page in headless Chromium at
 * the preview's three widths, saves a full-page picture and one picture per section, and reports what a
 * person would notice first (a script error, a missing file or picture, a page wider than the screen, a
 * block that rendered nothing, placeholders left). A mockup renders with the local design-system export
 * (dist/design-system/project), exactly as the published preview renders with the artifact's copy.
 */

export const WIDTHS = [1440, 768, 390] as const

export const MOCKUP_SECTIONS = '[data-msmt],[data-proposed]'
/** Layout slots that render nothing on purpose (TopBar was retired in the 2026 header). */
export const EMPTY_BY_DESIGN = ['TopBar']
/** Sections of a real page: the site header, each top-level block in <main>, the footer. */
export const PAGE_SECTIONS = 'body header:not(main *), main > *, body footer:not(main *)'

export interface ShotTarget {
  /** Short name for the files, e.g. "main", "warm", "page". */
  label: string
  url: string
  /** CSS selector of the sections to picture one by one. */
  sections: string
}

export interface SectionShot {
  name: string
  height: number
  file: string
}

export interface ShotReport {
  label: string
  width: number
  height: number
  full: string
  sections: SectionShot[]
  /** Problems that make the render wrong (the check fails on these). */
  errors: string[]
  /** Things to mention or fix, but not wrong (placeholders). */
  notes: string[]
}

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

/**
 * Where a mockup page's URL paths live on disk: `ds/…` is the local design-system export (the published
 * preview copies the same files from the artifact), `img/…` the mockup's pictures, anything else `pages`.
 */
export function mockupFile(
  urlPath: string,
  imgDir: string,
  pages: Record<string, string>,
): string | null {
  const clean = decodeURIComponent(urlPath.split('?')[0] ?? '').replace(/^\/+/, '')
  const within = (root: string, rel: string) => {
    const f = path.resolve(root, rel)
    return f.startsWith(path.resolve(root) + path.sep) ? f : null
  }
  if (clean.startsWith('ds/')) return within(PROJ, clean.slice(3))
  if (clean.startsWith('img/')) return within(imgDir, clean.slice(4))
  return pages[clean] ?? null
}

/** Serves rendered mockup pages (name → file) with their design system and pictures on a free port. */
export async function serveMockup(
  imgDir: string,
  pages: Record<string, string>,
): Promise<{ origin: string; close: () => Promise<void> }> {
  const server = http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
      res.writeHead(204)
      res.end()
      return
    }
    const file = mockupFile(req.url ?? '/', imgDir, pages)
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('Not found')
      return
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
    fs.createReadStream(file).pipe(res)
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  }
}

/** No Chromium could start: the one case where a caller may skip the render instead of failing. */
export class NoChromiumError extends Error {}

/** Launches the Chromium scripts/lib/chromium.ts resolves, or explains in one line why it cannot. */
export async function launchChromium(): Promise<Browser> {
  try {
    return await chromium.launch({ executablePath: chromiumExecutable() })
  } catch (e) {
    throw new NoChromiumError(
      `no Chromium to render with (${String(e).split('\n')[0]}): set CHROME_PATH or run pnpm exec playwright install chromium`,
    )
  }
}

const slugify = (s: string) => s.replace(/[^\w-]+/g, '-').replace(/^-|-$/g, '') || 'section'

/** Renders every target at every width into `outDir` (all at once) and reports per target and width. */
export async function shoot(
  browser: Browser,
  targets: ShotTarget[],
  outDir: string,
  widths: readonly number[] = WIDTHS,
): Promise<ShotReport[]> {
  fs.mkdirSync(outDir, { recursive: true })
  for (const { label } of targets)
    for (const f of fs.readdirSync(outDir))
      if (f.startsWith(`${label}-`) && f.endsWith('.png')) fs.rmSync(path.join(outDir, f))
  const reports = await Promise.all(
    targets.flatMap((target) => widths.map((width) => shootOne(browser, target, width, outDir))),
  )
  for (const { label } of targets)
    fs.writeFileSync(
      path.join(outDir, `${label}.json`),
      `${JSON.stringify(
        reports.filter((r) => r.label === label),
        null,
        2,
      )}\n`,
    )
  return reports
}

/**
 * The real page against its mockup: a page much taller or shorter than the approved mockup at the same
 * width lost or gained something on the way (reads `main.json`, written by the last mockup render).
 */
export function compareWithMockup(outDir: string, reports: ShotReport[]): string[] {
  const file = path.join(outDir, 'main.json')
  if (!fs.existsSync(file)) return []
  const mockup = JSON.parse(fs.readFileSync(file, 'utf8')) as ShotReport[]
  return reports.flatMap((r) => {
    const m = mockup.find((x) => x.width === r.width)
    if (!m) return []
    const diff = (r.height - m.height) / m.height
    const line = `@ ${r.width}px the page is ${r.height}px tall, the mockup ${m.height}px`
    return Math.abs(diff) > 0.05
      ? [`✗ ${line} (${Math.round(diff * 100)}%): compare ${r.full} with ${m.full}`]
      : [`· ${line}`]
  })
}

async function shootOne(
  browser: Browser,
  target: ShotTarget,
  width: number,
  outDir: string,
): Promise<ShotReport> {
  // Reduced motion: Motion's scroll-ins render in their final state, so nothing is caught mid-fade.
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
  })
  try {
    // tsx (esbuild keepNames) wraps named functions in __name(); the code passed to evaluate needs it too.
    await context.addInitScript('globalThis.__name = (f) => f')
    const page = await context.newPage()
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(`script error: ${e.message.split('\n')[0]}`))
    page.on('console', (m) => {
      const where = m.location().url
      if (m.type() === 'error')
        errors.push(`console error: ${m.text().split('\n')[0]}${where ? ` (${where})` : ''}`)
    })
    page.on('requestfailed', (r) => errors.push(`could not load ${r.url()}`))
    page.on('response', (r) => {
      if (r.status() >= 400) errors.push(`${r.status()} for ${r.url()}`)
    })
    await page.goto(target.url, { waitUntil: 'networkidle' })
    // The preview page hides its own scrollbar (the shell sizes the frame); a full-page picture needs it.
    await page.addStyleTag({ content: 'html,body{overflow-y:visible!important}' })
    await page.evaluate(() => document.fonts.ready)
    const facts = await page.evaluate((selector) => {
      const vw = document.documentElement.clientWidth
      const label = (el: Element) =>
        el.getAttribute('data-msmt') ??
        el.getAttribute('data-proposed') ??
        (el.id ? `${el.tagName.toLowerCase()}#${el.id}` : el.tagName.toLowerCase())
      const sections = [...document.querySelectorAll(selector)].map((el) => {
        const r = el.getBoundingClientRect()
        return {
          name: label(el),
          top: Math.round(r.top + window.scrollY),
          height: Math.round(r.height),
        }
      })
      // What sticks out to the right, named by its section; content clipped by an ancestor does not count.
      const wide = new Set<string>()
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.right <= vw + 1) continue
        if (getComputedStyle(el).position === 'fixed') continue
        let clipped = false
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement)
          if (/(hidden|clip|auto|scroll)/.test(getComputedStyle(p).overflowX)) clipped = true
        if (clipped) continue
        const section = el.closest(selector)
        wide.add(section ? label(section) : label(el))
      }
      const broken = [...document.images]
        .filter((i) => i.complete && i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src)
      return {
        height: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth - vw,
        wide: [...wide],
        sections,
        broken,
        placeholders: (document.body.innerText.match(/\[PLACEHOLDER[^\]]*\]/g) ?? []).length,
      }
    }, target.sections)

    if (facts.overflow > 0 || facts.wide.length)
      errors.push(
        `wider than the ${width}px screen${facts.overflow > 0 ? ` by ${facts.overflow}px` : ''}: ${facts.wide.join(', ') || 'unknown element'}`,
      )
    for (const src of facts.broken) errors.push(`picture did not load: ${src}`)
    for (const s of facts.sections)
      if (s.height === 0 && !EMPTY_BY_DESIGN.includes(s.name))
        errors.push(`${s.name} rendered nothing (height 0)`)
    if (!facts.sections.length) errors.push(`no sections found (${target.sections})`)
    const notes = facts.placeholders ? [`${facts.placeholders} [PLACEHOLDER] left`] : []

    // One full-page picture; the section pictures are cut from it (one capture instead of one per section).
    const base = `${target.label}-${width}`
    const full = path.join(outDir, `${base}.png`)
    const png = await page.screenshot({ path: full, fullPage: true })
    const { height: imageHeight = 0 } = await sharp(png).metadata()
    const sections: SectionShot[] = []
    for (const [i, s] of facts.sections.entries()) {
      const top = Math.max(0, Math.min(s.top, imageHeight - 1))
      const height = Math.min(s.height, imageHeight - top)
      if (height <= 0) continue
      const file = path.join(
        outDir,
        `${base}-${String(i + 1).padStart(2, '0')}-${slugify(s.name)}.png`,
      )
      await sharp(png).extract({ left: 0, top, width, height }).toFile(file)
      sections.push({ name: s.name, height: s.height, file })
    }
    return {
      label: target.label,
      width,
      height: facts.height,
      full,
      sections,
      errors: [...new Set(errors)],
      notes,
    }
  } finally {
    await context.close()
  }
}

/**
 * Renders mockup pages of `slug` (label → rendered page.html file) with the local design system and the
 * mockup's pictures, into `outDir`.
 */
export async function shootMockup(
  slug: string,
  pages: Record<string, string>,
  outDir: string,
  widths: readonly number[] = WIDTHS,
): Promise<ShotReport[]> {
  const served = await serveMockup(
    path.join(mockupDir(slug), 'img'),
    Object.fromEntries(Object.entries(pages).map(([label, file]) => [`${label}.html`, file])),
  )
  try {
    const browser = await launchChromium()
    try {
      const targets = Object.keys(pages).map((label) => ({
        label,
        url: `${served.origin}/${label}.html`,
        sections: MOCKUP_SECTIONS,
      }))
      return await shoot(browser, targets, outDir, widths)
    } finally {
      await browser.close()
    }
  } finally {
    await served.close()
  }
}

/** One block of lines per target and width; returns whether every render was clean. */
export function printReports(tag: string, reports: ShotReport[]): boolean {
  let ok = true
  for (const r of reports) {
    const status = r.errors.length ? 'PROBLEMS' : 'ok'
    console.log(
      `[${tag}] ${r.label} @ ${r.width}px: ${status}, ${r.height}px tall, ${r.sections.length} sections → ${r.full}`,
    )
    for (const e of r.errors) console.log(`[${tag}]   ✗ ${e}`)
    for (const n of r.notes) console.log(`[${tag}]   · ${n}`)
    if (r.errors.length) ok = false
  }
  const dir = reports[0] && path.dirname(reports[0].full)
  if (dir)
    console.log(
      `[${tag}] pictures: ${dir}/<label>-<width>.png (whole page) and <label>-<width>-<nn>-<section>.png (one per section, readable at full size)`,
    )
  return ok
}
