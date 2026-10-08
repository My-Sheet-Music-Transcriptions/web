import fs from 'node:fs'
import path from 'node:path'
import { CONTENT_DIR, readAllEntries } from '../lib/content-fs'
import { mockupFromEntry } from './mockup-lib'
import { mockupDir, readPreviewMemo, writePreviewMemo } from './preview-lib'
import { prepareSections } from './review-lib'

/**
 * Edit mode of the page skill: the mockup of an existing page, generated from its index.tsx and meta.ts.
 *   pnpm ds:mockup <slug> | <locale>/<collection>/<slug> [--force]
 * Writes mockups/<slug>/sections.html (mockups/<locale>-<slug>/ outside English), copies the page's pictures
 * into img/ and fills preview.json (title, path, locale, source) without touching a title, url or canvas it
 * already has. Refuses to overwrite a sections.html that exists unless --force: a mockup may be a preview
 * someone approved. Then runs the ds:review checks on what it wrote.
 */
const args = process.argv.slice(2)
const force = args.includes('--force')
const target = args.find((a) => !a.startsWith('--'))
if (!target)
  throw new Error('usage: pnpm ds:mockup <slug> | <locale>/<collection>/<slug> [--force]')

const all = readAllEntries()
const parts = target.split('/')
const matches =
  parts.length === 3
    ? all.filter((e) => e.locale === parts[0] && e.collection === parts[1] && e.slug === parts[2])
    : all.filter((e) => e.slug === target)
if (!matches.length)
  throw new Error(`no page "${target}" under ${CONTENT_DIR}/ (try <locale>/<collection>/<slug>)`)
if (matches.length > 1)
  throw new Error(
    `"${target}" is ambiguous: ${matches.map((e) => `${e.locale}/${e.collection}/${e.slug}`).join(', ')}`,
  )
const entry = matches[0]
if (!entry) throw new Error('unreachable')

const pageDir = path.join(CONTENT_DIR, entry.dir)
const result = mockupFromEntry({
  file: entry.page,
  path: entry.path,
  meta: entry.meta as typeof entry.meta & { template?: string; hero?: { title: string } },
  source: fs.readFileSync(path.join(CONTENT_DIR, entry.page), 'utf8'),
})
const slug = entry.locale === 'en' ? entry.slug : `${entry.locale}-${entry.slug}`
const dir = mockupDir(slug)
const sectionsFile = path.join(dir, 'sections.html')
if (fs.existsSync(sectionsFile) && !force)
  throw new Error(
    `${sectionsFile} exists: it may be an approved preview. Rerun with --force to overwrite it`,
  )

const imgDir = path.join(dir, 'img')
for (const img of result.images) {
  const from = path.join(pageDir, img)
  if (!fs.existsSync(from))
    throw new Error(`cannot mockup: ${from} (imported by the page) does not exist`)
  fs.mkdirSync(imgDir, { recursive: true })
  fs.copyFileSync(from, path.join(imgDir, img))
}
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(sectionsFile, result.sections)
const memo = readPreviewMemo(slug)
writePreviewMemo(slug, {
  title: memo.title ?? result.title,
  path: result.path,
  locale: entry.locale,
  source: `${entry.locale}/${entry.collection}/${entry.slug}`,
})

for (const w of result.warnings) console.warn(`[ds:mockup] ${w}`)
const { errors, labels } = prepareSections(result.sections, imgDir)
if (errors.length) {
  console.error(
    `[ds:mockup] ${sectionsFile} needs fixing:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
  )
  process.exit(1)
}
console.log(
  `[ds:mockup] ${sectionsFile} from ${CONTENT_DIR}/${entry.page}: ${labels.length} sections: ${labels.join(', ')}${result.images.length ? `; pictures: ${result.images.join(', ')}` : ''}`,
)
console.log(`[ds:mockup] next: pnpm ds:review ${slug}`)
