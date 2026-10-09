import { entryComponent, resolveEntry } from '~/content'
import type { Locale } from '~/i18n/types'

/**
 * Resolves an entry by locale and path and renders its page component inside the main landmark. There are no
 * templates: a page is blocks only, and opens with its own `PageHeader` (or `Hero` on the homepage). The body
 * comes from the cache the route loader filled, so there is no Suspense boundary: the whole page is in the first
 * HTML flush.
 */
export function EntryPage({ locale, path }: { locale: Locale; path: string }) {
  const entry = resolveEntry(locale, path)
  if (!entry) return null
  const Body = entryComponent(entry)
  return (
    <main id="main">
      <Body />
    </main>
  )
}
