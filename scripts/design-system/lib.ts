import { execSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

/** Shared pieces of the design-system export: asset groups, the artifact record and the index file. */

export const OUT = path.resolve('dist/design-system')
export const PROJ = path.join(OUT, 'project')
export const COMP = path.join(PROJ, 'components')
export const ARTIFACT_FILE = 'src/design-system/artifact.json'

export interface AssetRecord {
  blob: string
  size: number
  type: string
  sha256: string
}

/** Committed record of the published artifact: its URL and the asset-store ids of every upload. */
export interface ArtifactRecord {
  url: string | null
  title: string
  namespace: string
  createdOnFiles: { v: 1; at: string }
  publishedBy: string
  /** Commit the artifact was last published from (`pnpm ds:index --published`). */
  publishedFrom: string | null
  publishedAt?: string | null
  /** Hash of every source the artifact is built from at the last publish; tests fail when it drifts. */
  sourceHash?: string | null
  /** keyed `<Group>/<file name>` */
  assets: Record<string, AssetRecord>
}

export interface Upload {
  group: string
  tile: string
  name: string
  path: string
  size: number
  type: string
  sha256: string
  blob?: string
}

export interface AssetGroupSpec {
  tile: 'l' | 'm' | 's' | 'xs'
  readme: string
  files: string[]
}

const MIME: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

const icons = (dir: string, keep: (f: string) => boolean = () => true) =>
  fs
    .readdirSync(dir)
    .filter((f) => /\.(png|svg|jpe?g|webp)$/.test(f) && keep(f))
    .sort()
    .map((f) => `${dir}/${f}`)

/** The asset groups of the artifact (first folder under assets/), their tile size and README. */
export function assetGroupSpecs(): Record<string, AssetGroupSpec> {
  return {
    Brand: {
      tile: 'l',
      readme:
        '# Brand\n\nThe lockup `logo.svg` (orange "my" + ink wordmark) is the only logo; keep its proportions and never recolour it. Minimum width 160px on light backgrounds; the footer uses the same file on `footer` because the wordmark carries enough contrast there. `favicon.svg` is the orange mark alone; `apple-touch-icon.png` the same on white.\n',
      files: [
        'src/assets/images/brand/logo.svg',
        'src/assets/images/brand/favicon.svg',
        'src/assets/images/brand/apple-touch-icon.png',
      ],
    },
    'Instrument icons': {
      tile: 'm',
      readme:
        '# Instrument icons\n\nFlat colour illustrations used by `ServiceGrid` and `PricingTiers`, always on a `cream` or `peach-deep` disc. Shown at 56–80px; do not place them on dark backgrounds or recolour them.\n',
      files: icons(
        'src/assets/images/icons',
        (f) => !/^(accuracy|formats|fast-delivery|pricing-|star-rating)/.test(f),
      ),
    },
    'Feature icons': {
      tile: 'm',
      readme:
        '# Feature icons\n\nThe three "why us" illustrations (`FeatureCards`), the two pricing-tier icons that differ from the instrument set, and the Google star-rating mark. Same rules as instrument icons.\n',
      files: [
        'accuracy.png',
        'formats.png',
        'fast-delivery.png',
        'pricing-piano.png',
        'pricing-melodic.png',
        'star-rating.svg',
      ].map((f) => `src/assets/images/icons/${f}`),
    },
    'Software logos': {
      tile: 's',
      readme:
        '# Software logos\n\nNotation-software and partner logos shown in the footer strip (`Footer`) at 32px tall, greyscale-free, on the dark footer. Third-party marks: use them only in that strip and in the formats section.\n',
      files: icons('src/assets/images/logos'),
    },
    Flags: {
      tile: 'xs',
      readme:
        '# Flags\n\nRound language flags for the domain switcher (`TopBar`, `Footer`), 24px, each linking to its sister domain. Order: EN, ES, FR, DE, JA, CA.\n',
      files: icons('src/assets/images/flags'),
    },
  }
}

export const sha256 = (file: string) =>
  crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')

export function readArtifactRecord(): ArtifactRecord {
  return JSON.parse(fs.readFileSync(ARTIFACT_FILE, 'utf8')) as ArtifactRecord
}

/** Every upload with its current hash and, when the committed record still matches, its blob id. */
export function uploads(record: ArtifactRecord): Upload[] {
  return Object.entries(assetGroupSpecs()).flatMap(([group, g]) =>
    g.files.map((file) => {
      const name = path.basename(file)
      const hash = sha256(file)
      const known = record.assets[`${group}/${name}`]
      return {
        group,
        tile: g.tile,
        name,
        path: file,
        size: fs.statSync(file).size,
        type: MIME[path.extname(file)] ?? 'application/octet-stream',
        sha256: hash,
        blob: known && known.sha256 === hash ? known.blob : undefined,
      }
    }),
  )
}

/**
 * Everything the published artifact is built from: the same files Storybook renders. When any of them
 * changes, the artifact is stale until `publish-design-system` runs (tests/unit/design-system-sync.test.ts).
 */
export function designSystemSources(): string[] {
  const list = (dir: string, keep: (f: string) => boolean) =>
    fs.existsSync(dir)
      ? fs
          .readdirSync(dir)
          .filter(keep)
          .map((f) => path.join(dir, f))
      : []
  const code = (f: string) => /\.(tsx?|css|html)$/.test(f) && !/\.stories\.tsx$/.test(f)
  const assets = (f: string) => /\.(png|jpe?g|webp|svg)$/.test(f)
  return [
    'src/styles/theme.css',
    'src/styles/app.css',
    ...list('src/components/blocks', code),
    ...list('src/components/primitives', code),
    ...list('src/components/typography', code),
    ...list('src/components/layout', code),
    ...list('src/design-system/export', code),
    'src/design-system/theme-parse.ts',
    ...list('content/en/data', code),
    ...list('src/i18n/sites', code),
    'src/i18n/types.ts',
    ...list('src/assets/images/home', assets),
    ...list('src/assets/images/brand', assets),
    ...list('src/assets/images/icons', assets),
    ...list('src/assets/images/logos', assets),
    ...list('src/assets/images/flags', assets),
    'vite.ds.config.ts',
    'scripts/design-system/export.ts',
    'scripts/design-system/lib.ts',
  ]
    .filter((f) => fs.existsSync(f))
    .sort()
}

/** Short content hash over designSystemSources(). */
export function designSystemSourceHash(): string {
  const h = crypto.createHash('sha256')
  for (const f of designSystemSources()) {
    h.update(f)
    h.update('\0')
    h.update(fs.readFileSync(f))
    h.update('\0')
  }
  return h.digest('hex').slice(0, 16)
}

/** Records the publish that just happened (commit + source hash) in src/design-system/artifact.json. */
export function recordPublish() {
  const record = readArtifactRecord()
  record.publishedFrom = gitSha()
  record.publishedAt = new Date().toISOString()
  record.sourceHash = designSystemSourceHash()
  fs.writeFileSync(ARTIFACT_FILE, `${JSON.stringify(record, null, 2)}\n`)
  return record
}

export function gitSha(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

export function walk(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
}

/**
 * Writes project/design-system.json (the artifact's index), the asset-group READMEs and
 * dist/design-system/manifest.json (what to upload). Uploads without a blob id are listed as pending
 * and left out of the index until `src/design-system/artifact.json` records them.
 */
export function writeIndex(note: string) {
  const record = readArtifactRecord()
  const specs = assetGroupSpecs()
  const ups = uploads(record)
  const groups = Object.keys(specs)
  const assetGroups: Record<string, unknown> = {}
  for (const group of groups) {
    const spec = specs[group] as AssetGroupSpec
    const dir = path.join(PROJ, 'assets', group)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'README.md'), spec.readme)
    const mine = ups.filter((u) => u.group === group && u.blob)
    assetGroups[group] = {
      name: group,
      tile: spec.tile,
      order: mine.map((u) => u.name),
      files: Object.fromEntries(
        mine.map((u) => [u.name, { name: u.name, blob: u.blob, size: u.size, type: u.type }]),
      ),
    }
  }
  const index = {
    v: 3,
    layout: 'files',
    createdOnFiles: record.createdOnFiles,
    title: record.title,
    namespace: record.namespace,
    libraries: [],
    sections: {},
    groups,
    assetGroups,
    blobs: {},
    docs: { readme: 'project/README.md', sections: [] },
    lastChange: {
      by: record.publishedBy,
      at: new Date().toISOString(),
      via: `Claude Code · My-Sheet-Music-Transcriptions/web@${gitSha()}`,
      note,
    },
  }
  fs.writeFileSync(path.join(PROJ, 'design-system.json'), `${JSON.stringify(index, null, 2)}\n`)
  const manifest = {
    url: record.url,
    root: 'dist/design-system/project',
    generatedAt: new Date().toISOString(),
    files: walk(PROJ).map((f) => path.relative(PROJ, f).split(path.sep).join('/')),
    uploads: ups,
    pendingUploads: ups.filter((u) => !u.blob).map((u) => u.path),
    sourceHash: designSystemSourceHash(),
    publishedSourceHash: record.sourceHash ?? null,
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  return manifest
}
