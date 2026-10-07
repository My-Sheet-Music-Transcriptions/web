import type { MDXComponents } from 'mdx/types'
import type { ComponentType } from 'react'
import { lazy } from 'react'
import { getSiteConfig } from '~/i18n/sites'
import type { Locale } from '~/i18n/types'
import { SITE_LOCALES } from '~/site'
import { COLLECTIONS, type Collection, type EntryMeta, parseFrontmatter, pathFor } from './schema'

export interface Entry {
  locale: Locale
  collection: Collection
  slug: string
  path: string
  meta: EntryMeta
  file: string
}

type MdxModule = {
  default: ComponentType<{ components?: MDXComponents }>
  frontmatter: Record<string, unknown>
}

// Frontmatter is read eagerly (tiny), bodies lazily (one chunk per page).
// A page is a folder: <locale>/<collection>/<slug>/index.mdx with its images beside it (co-location).
// The flat <slug>.mdx form is accepted for pages without assets.
const frontmatters = import.meta.glob<Record<string, unknown>>(
  [
    './*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*/index.mdx',
    './*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*.mdx',
  ],
  { eager: true, import: 'frontmatter' },
)
const bodies = import.meta.glob<MdxModule>([
  './*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*/index.mdx',
  './*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*.mdx',
])

const FILE_RE = /^\.\/([a-z]{2})\/([a-z]+)\/([a-z0-9-]+)(?:\/index)?\.mdx$/

function parseFile(file: string): { locale: Locale; collection: Collection; slug: string } | null {
  const m = FILE_RE.exec(file)
  if (!m) return null
  const [, locale, collection, slug] = m
  if (!(COLLECTIONS as readonly string[]).includes(collection as string)) return null
  return { locale: locale as Locale, collection: collection as Collection, slug: slug as string }
}

const allEntries: Entry[] = Object.entries(frontmatters)
  .map(([file, fm]) => {
    const parsed = parseFile(file)
    if (!parsed)
      throw new Error(
        `Content file does not match <locale>/<collection>/<slug>/index.mdx (or <slug>.mdx): ${file}`,
      )
    const meta = parseFrontmatter(parsed.collection, fm, file)
    return {
      ...parsed,
      file,
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

export function listEntries<C extends Collection>(locale: Locale, collection: C): Entry[] {
  return entries.filter((e) => e.locale === locale && e.collection === collection)
}

type BodyComponent = ComponentType<{ components?: MDXComponents }>
const bodyCache = new Map<string, BodyComponent>()
const lazyCache = new Map<string, BodyComponent>()

/**
 * The MDX body of an entry. Route loaders call `preloadEntry` first, so this returns the real component and
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
  if (!loader) throw new Error(`No MDX module for ${entry.file}`)
  const C = (await loader()).default
  bodyCache.set(entry.file, C)
  return C
}

/** Loads the body into the synchronous cache; every route loader awaits it before rendering. */
export async function preloadEntry(entry: Entry): Promise<void> {
  await loadBody(entry)
}
