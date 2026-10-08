import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { readArtifactRecord } from './lib'

/**
 * Shared pieces of the page-preview scripts (ds:review, ds:canvas, ds:mockup, page:status): the
 * mockups/<slug>/preview.json memo, the design-system export manifest and the `files` maps of an Artifact
 * publish. Kept separate from lib.ts (the export itself) so the two can change independently.
 */

/** What mockups/<slug>/preview.json remembers about a page in flight. Unknown keys are preserved. */
export interface PreviewMemo {
  /** Page name as the user says it. */
  title?: string
  /** Locale-free public path, e.g. "/gift-card". */
  path?: string
  /** Locale of the page (default en). */
  locale?: string
  /** URL of the HTML review artifact. */
  url?: string
  /** `<locale>/<collection>/<slug>` of the page this mockup was generated from (ds:mockup). */
  source?: string
  /** The Design canvas of the page, when design mode was used. */
  canvas?: {
    url?: string
    /** Artboard files the script owns, e.g. ["Main.dc.html", "Mobile.dc.html"]. */
    boards?: string[]
    /** Asset-store id → file name under img/, for pictures uploaded to the canvas by hand. */
    uploads?: Record<string, string>
  }
  /** The draft PR carrying the real page. */
  pr?: { number: number; url: string; branch: string }
  [key: string]: unknown
}

const ORDER = ['title', 'path', 'locale', 'url', 'source', 'canvas', 'pr']

export const mockupDir = (slug: string) => path.join('mockups', slug)
export const memoFile = (slug: string) => path.join(mockupDir(slug), 'preview.json')

export function readPreviewMemo(slug: string): PreviewMemo {
  const file = memoFile(slug)
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as PreviewMemo) : {}
}

/** `{ ...existing, ...patch }` with undefined values dropped and the known keys first. */
export function mergeMemo(existing: PreviewMemo, patch: Partial<PreviewMemo>): PreviewMemo {
  const merged: PreviewMemo = { ...existing, ...patch }
  for (const k of Object.keys(merged)) if (merged[k] === undefined) delete merged[k]
  const keys = [
    ...ORDER.filter((k) => k in merged),
    ...Object.keys(merged).filter((k) => !ORDER.includes(k)),
  ]
  return Object.fromEntries(keys.map((k) => [k, merged[k]])) as PreviewMemo
}

/** Writes the memo, keeping every key the patch does not name. */
export function writePreviewMemo(slug: string, patch: Partial<PreviewMemo>): PreviewMemo {
  const merged = mergeMemo(readPreviewMemo(slug), patch)
  fs.mkdirSync(mockupDir(slug), { recursive: true })
  fs.writeFileSync(memoFile(slug), `${JSON.stringify(merged, null, 2)}\n`)
  return merged
}

export interface Manifest {
  files: string[]
  /** Hash of this export (lib.ts exportHash()). */
  exportHash?: string
  /** Hash recorded at the last publish; equal to exportHash when the artifact is in sync. */
  publishedExportHash?: string | null
  /** Artifact version of the last publish, the one previews copy the design-system files from. */
  publishedVersion?: string | null
}

export const MANIFEST_FILE = 'dist/design-system/manifest.json'

/** The design-system export manifest; runs `pnpm ds:export` first when there is no export yet. */
export function ensureManifest(tag: string): Manifest {
  if (!fs.existsSync(MANIFEST_FILE)) {
    console.log(`[${tag}] no design-system export yet: running pnpm ds:export`)
    try {
      execSync('pnpm ds:export', { stdio: 'pipe' })
    } catch (e) {
      console.error(String((e as { stdout?: Buffer }).stdout ?? e))
      throw new Error('pnpm ds:export failed')
    }
  }
  return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as Manifest
}

/** The published design system a preview copies its files from: the artifact URL and the pinned version. */
export interface DesignSystemRef {
  url: string
  /** Artifact version of the last publish; null in a record from before versions were pinned. */
  version: string | null
}

export function requireDesignSystem(): DesignSystemRef {
  const record = readArtifactRecord()
  if (!record.url)
    throw new Error('src/design-system/artifact.json has no url: publish the design system first')
  return { url: record.url, version: record.publishedVersion ?? null }
}

/** The export files a rendered mockup needs: tokens, the bundle, fonts and the bundle's images. */
export const DS_FILE = /^(tokens\.json$|components\/(bundle\.(js|css)|fonts\.css|assets\/)|fonts\/)/

/** One `files` entry copying a published file of another artifact, pinned to a version when known. */
export interface ArtifactCopy {
  artifact: string
  path: string
  ver?: string
}

/**
 * `files` entries copying the design system from its artifact, keyed `<prefix><export path>`. Pinned to
 * the version recorded at the last publish (`ver`), so what a preview renders does not change when
 * someone republishes the design system from another branch.
 */
export function designSystemFiles(
  prefix: string,
  manifest: Manifest,
  ds: DesignSystemRef,
): Record<string, ArtifactCopy> {
  const out: Record<string, ArtifactCopy> = {}
  for (const f of manifest.files)
    if (DS_FILE.test(f))
      out[`${prefix}${f}`] = {
        artifact: ds.url,
        path: `project/${f}`,
        ...(ds.version ? { ver: ds.version } : {}),
      }
  return out
}

/** `files` entries for every picture in `imgDir`, keyed `<prefix><file>`. */
export function imageFiles(prefix: string, imgDir: string): Record<string, string> {
  const out: Record<string, string> = {}
  if (!fs.existsSync(imgDir)) return out
  for (const f of fs.readdirSync(imgDir).sort()) out[`${prefix}${f}`] = path.join(imgDir, f)
  return out
}

/** Preview heights of the layout components (same numbers as the export's layout docs). */
export const LAYOUT_HEIGHTS: Record<string, number> = { TopBar: 60, Header: 120, Footer: 820 }

/** Prints the notes, then the Artifact publish parameters, one JSON object per step. */
export function printPublish(tag: string, lines: string[], steps: Record<string, unknown>[]) {
  for (const l of lines) console.log(`[${tag}] ${l}`)
  if (steps.length === 1) {
    console.log(
      `[${tag}] Artifact publish parameters (pass as is, with a real description):\n${JSON.stringify(steps[0])}`,
    )
    return
  }
  for (const [i, step] of steps.entries())
    console.log(`[${tag}] Artifact call ${i + 1} of ${steps.length}:\n${JSON.stringify(step)}`)
}
