import type { MDXComponents } from 'mdx/types'
import type { ComponentType } from 'react'
import { lazy } from 'react'
import type { Locale } from '~/i18n/types'
import { site } from '~/site'
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
const frontmatters = import.meta.glob<Record<string, unknown>>(
  './*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*.mdx',
  { eager: true, import: 'frontmatter' },
)
const bodies = import.meta.glob<MdxModule>(
  './*/{pages,services,posts,faqs,artists,musicians,partners,reviews}/*.mdx',
)

const FILE_RE = /^\.\/([a-z]{2})\/([a-z]+)\/([a-z0-9-]+)\.mdx$/

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
      throw new Error(`Content file does not match <locale>/<collection>/<slug>.mdx: ${file}`)
    const meta = parseFrontmatter(parsed.collection, fm, file)
    return { ...parsed, file, meta, path: pathFor(parsed.collection, parsed.slug, site.routes) }
  })
  .filter((e) => !e.meta.draft || import.meta.env.DEV)

/** Entries of the active locale only. */
export const entries: Entry[] = allEntries.filter((e) => e.locale === site.locale)

const byPath = new Map(entries.map((e) => [e.path, e]))

export function resolveEntry(path: string): Entry | undefined {
  const clean = path === '' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return byPath.get(clean)
}

export function listEntries<C extends Collection>(collection: C): Entry[] {
  return entries.filter((e) => e.collection === collection)
}

const lazyCache = new Map<string, ComponentType<{ components?: MDXComponents }>>()

/** Lazily-loaded MDX body for an entry; cached so SSR and client share one component identity. */
export function entryComponent(entry: Entry) {
  let C = lazyCache.get(entry.file)
  if (!C) {
    const loader = bodies[entry.file]
    if (!loader) throw new Error(`No MDX module for ${entry.file}`)
    C = lazy(async () => ({ default: (await loader()).default }))
    lazyCache.set(entry.file, C)
  }
  return C
}

/** Warms the module cache (used by route loaders so SSR renders synchronously). */
export async function preloadEntry(entry: Entry): Promise<void> {
  const loader = bodies[entry.file]
  if (loader) await loader()
}
