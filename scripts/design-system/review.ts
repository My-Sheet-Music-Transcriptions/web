import fs from 'node:fs'
import path from 'node:path'
import {
  designSystemFiles,
  ensureManifest,
  imageFiles,
  memoFile,
  mockupDir,
  printPublish,
  readPreviewMemo,
  requireDesignSystem,
  writePreviewMemo,
} from './preview-lib'
import { prepareSections } from './review-lib'

/**
 * Builds the HTML review artifact of a page mockup from mockups/<slug>/sections.html:
 *   dist/design-system/review/<slug>/index.html   the review shell (viewport switch, block labels, comments)
 *   dist/design-system/review/<slug>/page.html    the mockup itself, rendered by the design-system bundle
 *   dist/design-system/review/<slug>/files.json   the `files` map for the Artifact publish (bundle + assets
 *                                                 copied server-side from the Design System artifact, images)
 *   pnpm ds:review <slug> ["<Title>"] [/path]
 *
 * Checks the mockup first (known blocks, valid data-props, images present, no external files) and
 * fails with one line per problem. Runs `pnpm ds:export` itself when dist/design-system is missing.
 * Title, path and the preview's artifact URL are remembered in mockups/<slug>/preview.json, so later
 * runs (also in another session) need only the slug and update the same artifact.
 */
const [slug, titleArg, pathArg] = process.argv.slice(2)
if (!slug) throw new Error('usage: pnpm ds:review <slug> ["<Title>"] [/path]')
const src = mockupDir(slug)
const sectionsFile = path.join(src, 'sections.html')
if (!fs.existsSync(sectionsFile)) throw new Error(`${sectionsFile} does not exist yet`)

const existing = readPreviewMemo(slug)
const title = titleArg ?? existing.title
if (!title) throw new Error('first run needs a title: pnpm ds:review <slug> "<Page name>" [/path]')
const pagePath = pathArg ?? existing.path ?? `/${slug}`
const memo = writePreviewMemo(slug, { title, path: pagePath })

const imgDir = path.join(src, 'img')
const { html, errors, labels } = prepareSections(fs.readFileSync(sectionsFile, 'utf8'), imgDir)
if (errors.length) {
  console.error(
    `[ds:review] ${sectionsFile} needs fixing:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
  )
  process.exit(1)
}

const ds = requireDesignSystem()
const manifest = ensureManifest('ds:review')

const out = path.join('dist/design-system/review', slug)
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(
  path.join(out, 'index.html'),
  fs
    .readFileSync('src/design-system/review/shell.html', 'utf8')
    .replaceAll('__TITLE__', title)
    .replaceAll('__PATH__', pagePath),
)
fs.writeFileSync(
  path.join(out, 'page.html'),
  fs
    .readFileSync('src/design-system/review/page.html', 'utf8')
    .replaceAll('__TITLE__', title)
    .replace('<!-- __SECTIONS__ -->', html),
)

// files map: page, images under mockups/<slug>/img, and the design-system files from the artifact
const files: Record<string, unknown> = {
  'page.html': `${out}/page.html`,
  ...imageFiles('img/', imgDir),
  ...designSystemFiles('ds/', manifest, ds),
}
fs.writeFileSync(path.join(out, 'files.json'), `${JSON.stringify(files, null, 2)}\n`)

const publish = {
  ...(memo.url ? { url: memo.url } : {}),
  file_path: path.resolve(out, 'index.html'),
  files,
  ...(memo.url ? {} : { icon: 'page' }),
  capabilities: { comments: { composer_only: true } },
  description: '<one sentence: what the page is for>',
}
printPublish(
  'ds:review',
  [
    `${out}: ${labels.length} sections: ${labels.join(', ')}`,
    memo.url
      ? `updates the existing preview ${memo.url} (Artifact read it first if this session has not published it)`
      : `first publish: afterwards add "url": "<the artifact link>" to ${memoFile(slug)}`,
  ],
  [publish],
)
