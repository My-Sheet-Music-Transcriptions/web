import fs from 'node:fs'
import path from 'node:path'
import { readArtifactRecord } from './lib'

/**
 * Builds the HTML review artifact of a page mockup from mockups/<slug>/sections.html:
 *   dist/design-system/review/<slug>/index.html   the review shell (viewport switch, block labels, comments)
 *   dist/design-system/review/<slug>/page.html    the mockup itself, rendered by the design-system bundle
 *   dist/design-system/review/<slug>/files.json   the `files` map for the Artifact publish (bundle + assets
 *                                                 copied server-side from the Design System artifact, images)
 *   pnpm ds:review <slug> "<Title>" [/path]
 */
const [slug, title, pagePath = `/${slug}`] = process.argv.slice(2)
if (!slug || !title) throw new Error('usage: pnpm ds:review <slug> "<Title>" [/path]')
const src = path.join('mockups', slug)
const sections = fs.readFileSync(path.join(src, 'sections.html'), 'utf8')
const out = path.join('dist/design-system/review', slug)
fs.mkdirSync(out, { recursive: true })

const shell = fs
  .readFileSync('src/design-system/review/shell.html', 'utf8')
  .replaceAll('__TITLE__', title)
  .replaceAll('__PATH__', pagePath)
fs.writeFileSync(path.join(out, 'index.html'), shell)
fs.writeFileSync(
  path.join(out, 'page.html'),
  fs
    .readFileSync('src/design-system/review/page.html', 'utf8')
    .replaceAll('__TITLE__', title)
    .replace('<!-- __SECTIONS__ -->', sections),
)

// files map: page, images under mockups/<slug>/img, and the design-system files from the artifact
const record = readArtifactRecord()
if (!record.url)
  throw new Error('src/design-system/artifact.json has no url: publish the design system first')
const manifest = JSON.parse(fs.readFileSync('dist/design-system/manifest.json', 'utf8')) as {
  files: string[]
}
const files: Record<string, unknown> = { 'page.html': `${out}/page.html` }
const imgDir = path.join(src, 'img')
if (fs.existsSync(imgDir))
  for (const f of fs.readdirSync(imgDir)) files[`img/${f}`] = path.join(imgDir, f)
for (const f of manifest.files) {
  if (
    f === 'tokens.json' ||
    /^(components\/(bundle\.(js|css)|fonts\.css|assets\/)|fonts\/)/.test(f)
  )
    files[`ds/${f}`] = { artifact: record.url, path: `project/${f}` }
}
const missing = [...sections.matchAll(/src="img\/([^"]+)"/g)]
  .map((m) => m[1])
  .filter((f) => !files[`img/${f}`])
if (missing.length)
  throw new Error(`sections.html references missing images: ${missing.join(', ')}`)
fs.writeFileSync(path.join(out, 'files.json'), `${JSON.stringify(files, null, 2)}\n`)
const labels = [...sections.matchAll(/data-(msmt|proposed)="([^"]+)"/g)].map(
  (m) => `${m[2]}${m[1] === 'proposed' ? ' (new)' : ''}`,
)
console.log(`[ds:review] ${out}: ${labels.length} sections: ${labels.join(', ')}`)
console.log(
  `[ds:review] publish: file_path=${path.resolve(out, 'index.html')} files=${out}/files.json (${Object.keys(files).length} entries)`,
)
