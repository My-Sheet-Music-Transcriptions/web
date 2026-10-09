import type { ComponentType } from 'react'
import { lazy } from 'react'
import { getSiteConfig } from '~/i18n/sites'
import type { Locale } from '~/i18n/types'
import { SITE_LOCALES } from '~/site'
import { COLLECTIONS, type Collection, type EntryMeta, parseMeta, pathFor } from './schema'

export interface Entry {
  locale: Locale
  collection: Collection
  slug: string
  path: string
  meta: EntryMeta
  /** The page component's module key, /content/<locale>/<collection>/<slug>/index.tsx */
  file: string
}

type BodyComponent = ComponentType

// A page is a folder content/<locale>/<collection>/<slug>/ (outside src/: the content managers' folder) with
// meta.ts (read eagerly: tiny plain data) and index.tsx (read lazily: one chunk per page), its pictures beside them.
// Root-absolute patterns: Vite resolves them against the project root.
const metas = import.meta.glob<unknown>(
  '/content/*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*/meta.ts',
  { eager: true, import: 'default' },
)
const bodies = import.meta.glob<{ default: BodyComponent }>(
  '/content/*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*/index.tsx',
)

const FILE_RE = /^\/content\/([a-z]{2})\/([a-z]+)\/([a-z0-9-]+)\/meta\.ts$/

function parseFile(file: string): { locale: Locale; collection: Collection; slug: string } | null {
  const m = FILE_RE.exec(file)
  if (!m) return null
  const [, locale, collection, slug] = m
  if (!(COLLECTIONS as readonly string[]).includes(collection as string)) return null
  return { locale: locale as Locale, collection: collection as Collection, slug: slug as string }
}

const allEntries: Entry[] = Object.entries(metas)
  .map(([file, data]) => {
    const parsed = parseFile(file)
    if (!parsed)
      throw new Error(
        `Content file does not match content/<locale>/<collection>/<slug>/meta.ts: ${file}`,
      )
    const meta = parseMeta(parsed.collection, data, file)
    return {
      ...parsed,
      file: file.replace(/meta\.ts$/, 'index.tsx'),
      meta,
      path: pathFor(parsed.collection, parsed.slug, getSiteConfig(parsed.locale).routes),
    }
  })
  .filter((e) => !e.meta.draft || import.meta.env.DEV)

/** Entries of the locales this build serves (one in production, all in a path-mode preview). */
export const entries: Entry[] = allEntries.filter((e) => SITE_LOCALES.includes(e.locale))

const byPath = new Map(entries.map((e) => [`${e.locale}:${e.path}`, e]))

/** The entry at a locale-free path ("/", "pricing", "/faqs/piano/") in a locale. */
export function resolveEntry(locale: Locale, path: string): Entry | undefined {
  const clean = path === '' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return byPath.get(`${locale}:${clean}`)
}

const bodyCache = new Map<string, BodyComponent>()
const lazyCache = new Map<string, BodyComponent>()

/**
 * The page component of an entry. Route loaders call `preloadEntry` first, so this returns the real component and
 * the page renders synchronously on the server and the client (no Suspense boundary, no flash of layout).
 * The lazy fallback only covers a render that skipped the loader (e.g. a story); it suspends once.
 */
export function entryComponent(entry: Entry): BodyComponent {
  const ready = bodyCache.get(entry.file)
  if (ready) return ready
  let C = lazyCache.get(entry.file)
  if (!C) {
    C = lazy(async () => ({ default: await loadBody(entry) }))
    lazyCache.set(entry.file, C)
  }
  return C
}

async function loadBody(entry: Entry): Promise<BodyComponent> {
  const cached = bodyCache.get(entry.file)
  if (cached) return cached
  const loader = bodies[entry.file]
  if (!loader) throw new Error(`No page component for ${entry.file}`)
  const C = (await loader()).default
  bodyCache.set(entry.file, C)
  return C
}

/** Loads the body into the synchronous cache; every route loader awaits it before rendering. */
export async function preloadEntry(entry: Entry): Promise<void> {
  await loadBody(entry)
}
