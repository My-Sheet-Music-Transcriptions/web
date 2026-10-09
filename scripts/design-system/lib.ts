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
  /**
   * Commit the artifact was last published from (`pnpm ds:index --published`). Informational only: a
   * branch commit vanishes when its PR is squash-merged, so never look it up or reason from it. The
   * record is `publishedVersion` + `exportHash`.
   */
  publishedFrom: string | null
  publishedAt?: string | null
  /**
   * Version of the artifact the last publish created (shown by an Artifact files listing). Page previews
   * copy the design-system files from this exact version, so a later publish from another branch cannot
   * change what a preview renders.
   */
  publishedVersion?: string | null
  /**
   * Hash of the export output (dist/design-system/project, see exportHash()) at the last publish.
   * `pnpm ds:index --check` compares a fresh export against it: equal means the artifact is in sync.
   */
  exportHash?: string | null
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
        '# Instrument icons\n\nFlat colour illustrations of instruments and services, used by `PictureGrid`, `PricingCards` and the service page header (by file name, e.g. `piano`). Shown at 56–180px; do not place them on dark backgrounds or recolour them.\n',
      files: icons(
        'src/assets/images/icons',
        (f) => !/^(accuracy|formats|fast-delivery|pricing-|audience-)/.test(f),
      ),
    },
    'Feature icons': {
      tile: 'm',
      readme:
        '# Feature icons\n\nThe three "what is included" illustrations and the four audience illustrations (`CardGrid`), and the two pricing-tier icons that differ from the instrument set. Same rules as instrument icons.\n',
      files: [
        'accuracy.png',
        'formats.png',
        'fast-delivery.png',
        'pricing-piano.png',
        'pricing-melodic.png',
        'audience-business.png',
        'audience-artists.png',
        'audience-educators.png',
        'audience-all.webp',
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

/** Files of the export that carry a timestamp or note; hashed with those fields removed. */
const VOLATILE: Record<string, (text: string) => string> = {
  'design-system.json': (text) => {
    const index = JSON.parse(text) as Record<string, unknown>
    delete index.lastChange
    return JSON.stringify(index)
  },
}

/**
 * Short content hash of the export output: every file under `project/` (the artifact's files), with the
 * volatile fields of the index left out. Two exports of the same sources hash the same (Vite's asset
 * names are content hashes), so the hash says whether the published artifact renders what the repo
 * renders, without listing which sources feed the export.
 */
export function exportHash(dir: string = PROJ): string {
  if (!fs.existsSync(dir)) throw new Error(`${dir} is missing: run pnpm ds:export first`)
  const h = crypto.createHash('sha256')
  for (const f of walk(dir).sort()) {
    const rel = path.relative(dir, f).split(path.sep).join('/')
    const normalise = VOLATILE[rel]
    h.update(rel)
    h.update('\0')
    h.update(normalise ? normalise(fs.readFileSync(f, 'utf8')) : fs.readFileSync(f))
    h.update('\0')
  }
  return h.digest('hex').slice(0, 16)
}

/**
 * Records the publish that just happened (artifact version, export hash, commit, time) in
 * src/design-system/artifact.json. `version` is the artifact version the publish created, as the
 * Artifact files listing prints it.
 */
export function recordPublish(version: string) {
  if (!/^[\w.-]{4,64}$/.test(version))
    throw new Error(`"${version}" does not look like an artifact version (e.g. 1791471138-a631)`)
  const record = readArtifactRecord()
  record.publishedFrom = gitSha()
  record.publishedAt = new Date().toISOString()
  record.publishedVersion = version
  record.exportHash = exportHash()
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
    exportHash: exportHash(),
    publishedExportHash: record.exportHash ?? null,
    publishedVersion: record.publishedVersion ?? null,
  }
  fs.writeFileSync(path.join(OUT, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  return manifest
}
