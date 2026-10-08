import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { ensureManifest, mockupDir, mockupPageHtml, readPreviewMemo } from './preview-lib'
import { prepareSections } from './review-lib'
import {
  compareWithMockup,
  launchChromium,
  PAGE_SECTIONS,
  printReports,
  type ShotReport,
  shoot,
  shootMockup,
  WIDTHS,
} from './shot-lib'

/**
 * Looks at a page before anyone else does: renders it in headless Chromium at 1440, 768 and 390 px and
 * writes pictures to dist/design-system/shot/<slug>/ (the whole page per width, and one picture per
 * section, small enough to read), then reports script errors, files or pictures that did not load,
 * anything wider than the screen, blocks that rendered nothing and placeholders left. Exits 1 on problems.
 *
 *   pnpm ds:shot <slug>                the mockup: sections.html and every sections.<variant>.html, rendered
 *                                      with the local design-system export (what the preview will show)
 *   pnpm ds:shot <slug> --built        the real page in dist/client (after `SITE_LOCALE=<locale> pnpm build`
 *                                      or `pnpm build`), served on a free port
 *   pnpm ds:shot <slug> --url <url>    any page already served, e.g. `pnpm dev` at
 *                                      http://localhost:3000/en/gift-card (edits show without a rebuild)
 *   --width 390[,768]                  only these widths (faster while fixing one layout)
 *
 * `pnpm ds:review` runs the mockup check itself before printing the publish parameters.
 */
const args = process.argv.slice(2)
const flag = (name: string) => {
  const i = args.indexOf(name)
  return i >= 0 ? (args[i + 1] ?? '') : undefined
}
const slug = args.find(
  (a, i) => !a.startsWith('--') && !['--url', '--width'].includes(args[i - 1] ?? ''),
)
if (!slug) throw new Error('usage: pnpm ds:shot <slug> [--built | --url <url>] [--width 390,768]')
const widths = flag('--width')
  ? (flag('--width') as string).split(',').map(Number).filter(Boolean)
  : [...WIDTHS]
const out = path.join('dist/design-system/shot', slug)
const memo = readPreviewMemo(slug)

async function freePort(): Promise<number> {
  return new Promise((resolve) => {
    const s = net.createServer().listen(0, '127.0.0.1', () => {
      const { port } = s.address() as net.AddressInfo
      s.close(() => resolve(port))
    })
  })
}

/** The real page from dist/client, served by scripts/serve-dist.ts for as long as `run` takes. */
async function withBuiltSite<T>(run: (origin: string) => Promise<T>): Promise<T> {
  if (!fs.existsSync('dist/client/index.html') && !fs.existsSync('dist/client/en/index.html'))
    throw new Error('no build in dist/client: run SITE_LOCALE=<locale> pnpm build first')
  const port = await freePort()
  const server = spawn('pnpm', ['exec', 'tsx', 'scripts/serve-dist.ts', '--port', String(port)], {
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  try {
    await new Promise<void>((resolve, reject) => {
      server.stdout.on('data', (d: Buffer) => {
        if (d.toString().includes('serving')) resolve()
      })
      server.on('exit', () => reject(new Error('serve-dist exited before serving')))
    })
    return await run(`http://127.0.0.1:${port}`)
  } finally {
    server.kill()
  }
}

let reports: ShotReport[]
const url = flag('--url')
if (url !== undefined || args.includes('--built')) {
  const browser = await launchChromium()
  try {
    const shootPage = (u: string) =>
      shoot(browser, [{ label: 'page', url: u, sections: PAGE_SECTIONS }], out, widths)
    if (url) {
      reports = await shootPage(url)
    } else {
      // Path-mode builds (`pnpm build`) put every locale under /<locale>; domain-mode builds have no prefix.
      const locale = memo.locale ?? 'en'
      const prefix = fs.existsSync(path.join('dist/client', locale, 'index.html'))
        ? `/${locale}`
        : ''
      const pagePath = memo.path ?? `/${slug}`
      reports = await withBuiltSite((origin) =>
        shootPage(`${origin}${prefix}${pagePath === '/' ? '' : pagePath}`),
      )
    }
  } finally {
    await browser.close()
  }
  for (const line of compareWithMockup(out, reports)) console.log(`[ds:shot] ${line}`)
} else {
  const src = mockupDir(slug)
  const files = fs.existsSync(src)
    ? fs.readdirSync(src).filter((f) => /^sections(\.[^.]+)?\.html$/.test(f))
    : []
  if (!files.includes('sections.html')) throw new Error(`${src}/sections.html does not exist yet`)
  ensureManifest('ds:shot')
  const pages: Record<string, string> = {}
  const problems: string[] = []
  fs.mkdirSync(out, { recursive: true })
  for (const f of files.sort()) {
    const label = f === 'sections.html' ? 'main' : f.slice('sections.'.length, -'.html'.length)
    const { html, errors } = prepareSections(
      fs.readFileSync(path.join(src, f), 'utf8'),
      path.join(src, 'img'),
    )
    problems.push(...errors.map((e) => `${f}: ${e}`))
    const file = path.join(out, `${label}.html`)
    fs.writeFileSync(file, mockupPageHtml(memo.title ?? slug, html))
    pages[label] = file
  }
  if (problems.length) {
    console.error(
      `[ds:shot] the mockup needs fixing first:\n${problems.map((p) => `  - ${p}`).join('\n')}`,
    )
    process.exit(1)
  }
  reports = await shootMockup(slug, pages, out, widths)
}
if (!printReports('ds:shot', reports)) process.exitCode = 1
