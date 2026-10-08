import fs from 'node:fs'
import path from 'node:path'
import {
  boardHtml,
  type Canvas,
  canvasFilesFor,
  DS_PREFIX,
  freshCanvas,
  layoutBoards,
  mergeCanvas,
  notesText,
  type Option,
  publishSteps,
  pullBoard,
} from './canvas-lib'
import {
  designSystemFiles,
  ensureManifest,
  imageFiles,
  memoFile,
  mockupDir,
  printPublish,
  readPreviewMemo,
  requireDesignSystemUrl,
  writePreviewMemo,
} from './preview-lib'
import { prepareSections } from './review-lib'

/**
 * Design mode of the page skill: the mockup of a page as a Claude Design canvas, and the way back.
 *
 *   pnpm ds:canvas <slug> ["<Title>"] [--canvas <canvas.json read from the artifact>]
 *     Checks mockups/<slug>/sections.html (and every sections.<variant>.html: options shown side by side),
 *     writes dist/design-system/canvas/<slug>/project/{canvas.json, Main.dc.html, Mobile.dc.html, <Variant>*.dc.html,
 *     img/*} and prints the Artifact publish parameters: two calls the first time (create the canvas from the
 *     Design type, then publish the files to its url), one afterwards. The url lives in preview.json → canvas.url.
 *     Pass --canvas with the artifact's current project/canvas.json so moved or renamed artboards are kept.
 *
 *   pnpm ds:canvas <slug> --pull <Board.dc.html read from the artifact>
 *     Turns the artboard back into mockups/<slug>/sections.html (text typed inside real blocks is dropped
 *     with a warning; hand-drawn sections come back as edited) and runs the ds:review checks on it.
 */
const args = process.argv.slice(2)
const flag = (name: string) => {
  const i = args.indexOf(name)
  if (i < 0) return undefined
  const v = args[i + 1]
  args.splice(i, 2)
  return v
}
const pullFile = flag('--pull')
const canvasFile = flag('--canvas')
const [slug, titleArg] = args
if (!slug)
  throw new Error('usage: pnpm ds:canvas <slug> ["<Title>"] [--canvas <file>] | --pull <file>')
const src = mockupDir(slug)
const imgDir = path.join(src, 'img')
const sectionsFile = path.join(src, 'sections.html')

if (pullFile) {
  const memo = readPreviewMemo(slug)
  const { sections, warnings, unmapped } = pullBoard(fs.readFileSync(pullFile, 'utf8'), {
    uploads: memo.canvas?.uploads,
  })
  fs.mkdirSync(src, { recursive: true })
  fs.writeFileSync(sectionsFile, sections)
  for (const w of warnings) console.warn(`[ds:canvas] ${w}`)
  for (const id of unmapped)
    console.warn(
      `[ds:canvas] picture /_blob/${id} is not known: download it into ${imgDir}/ and add "${id}": "<file>" to canvas.uploads in ${memoFile(slug)}, then pull again`,
    )
  const { errors, labels } = prepareSections(sections, imgDir)
  if (errors.length) {
    console.error(
      `[ds:canvas] ${sectionsFile} needs fixing:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
    )
    process.exit(1)
  }
  console.log(`[ds:canvas] ${sectionsFile}: ${labels.length} sections: ${labels.join(', ')}`)
  const variants = fs.readdirSync(src).filter((f) => /^sections\.[^.]+\.html$/.test(f))
  if (variants.length)
    console.log(
      `[ds:canvas] options still in ${src}: ${variants.join(', ')} (delete the ones not chosen)`,
    )
  process.exit(0)
}

if (!fs.existsSync(sectionsFile)) throw new Error(`${sectionsFile} does not exist yet`)
const existing = readPreviewMemo(slug)
const title = titleArg ?? existing.title
if (!title) throw new Error('first run needs a title: pnpm ds:canvas <slug> "<Page name>"')
let memo = writePreviewMemo(slug, { title, path: existing.path ?? `/${slug}` })

const options: Option[] = []
const files = [
  'sections.html',
  ...fs
    .readdirSync(src)
    .filter((f) => /^sections\.[^.]+\.html$/.test(f))
    .sort(),
]
let failed = false
for (const f of files) {
  const { html, errors, labels } = prepareSections(
    fs.readFileSync(path.join(src, f), 'utf8'),
    imgDir,
  )
  if (errors.length) {
    failed = true
    console.error(
      `[ds:canvas] ${path.join(src, f)} needs fixing:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
    )
    continue
  }
  options.push({
    variant: f === 'sections.html' ? '' : f.slice('sections.'.length, -'.html'.length),
    html,
    labels,
  })
}
if (failed) process.exit(1)

const dsUrl = requireDesignSystemUrl()
const manifest = ensureManifest('ds:canvas')
const root = path.join('dist/design-system/canvas', slug)
const proj = path.join(root, 'project')
fs.rmSync(proj, { recursive: true, force: true })
fs.mkdirSync(proj, { recursive: true })

const boards = layoutBoards(title, options)
const byOption = new Map(options.map((o) => [o.variant, o]))
for (const b of boards) {
  const variant = b.title.startsWith(`${title} · `)
    ? b.title.slice(title.length + 3).replace(/ \/ \d+$/, '')
    : ''
  const option = byOption.get(variant)
  if (!option) throw new Error(`no option for board ${b.file}`)
  fs.writeFileSync(
    path.join(proj, b.file),
    boardHtml(option.html, { title: b.title, width: b.w, height: b.h }),
  )
}
if (fs.existsSync(imgDir)) {
  fs.mkdirSync(path.join(proj, 'img'), { recursive: true })
  for (const f of fs.readdirSync(imgDir))
    fs.copyFileSync(path.join(imgDir, f), path.join(proj, 'img', f))
}

const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
const fresh = freshCanvas({ title, boards, notes: notesText(options), dsUrl, now })
let previous: Canvas | undefined
const notes: string[] = []
if (canvasFile) {
  previous = JSON.parse(fs.readFileSync(canvasFile, 'utf8')) as Canvas
  if (previous.v !== 3) throw new Error(`${canvasFile} is not a v3 canvas.json`)
} else if (memo.canvas?.url) {
  notes.push(
    `the canvas exists (${memo.canvas.url}) but no --canvas file was given: Artifact read its project/canvas.json and pass it, or artboards people moved or renamed go back to the defaults`,
  )
}
const canvas = mergeCanvas(previous, fresh)
fs.writeFileSync(path.join(proj, 'canvas.json'), `${JSON.stringify(canvas, null, 2)}\n`)
memo = writePreviewMemo(slug, { canvas: { ...memo.canvas, boards: boards.map((b) => b.file) } })

const publishFiles: Record<string, unknown> = {
  ...canvasFilesFor(boards),
  ...Object.fromEntries(
    Object.keys(imageFiles('', imgDir)).map((f) => [`project/img/${f}`, `project/img/${f}`]),
  ),
  ...designSystemFiles(DS_PREFIX, manifest, dsUrl),
}
const steps = publishSteps(memo, {
  title,
  root,
  filePath: path.resolve(proj, 'canvas.json'),
  files: publishFiles,
  description: '<one sentence: what the page is for>',
})
printPublish(
  'ds:canvas',
  [
    `${root}: ${options.length} option(s), ${boards.length} artboards: ${boards.map((b) => b.file).join(', ')}`,
    ...options.map(
      (o) => `${o.variant ? `option "${o.variant}"` : 'sections.html'}: ${o.labels.join(', ')}`,
    ),
    ...notes,
    memo.canvas?.url
      ? `updates the existing canvas ${memo.canvas.url} (Artifact read its project/canvas.json first if this session has not published it)`
      : `first publish: call 1 creates the canvas; write its url to ${memoFile(slug)} as canvas.url, rerun this script and make call 2 with the printed parameters`,
  ],
  steps,
)
