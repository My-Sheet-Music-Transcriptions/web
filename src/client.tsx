import { StartClient } from '@tanstack/react-start/client'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { preloadEntry, resolveEntry } from '~/content'
import { stripLocale } from '~/i18n/routing'
import { LOCALE_ROUTING, localeOf } from '~/site'

/**
 * Hosts and proxies edit the prerendered HTML before it reaches the browser: Netlify, for one, inserts a
 * comment plus a line break into <head>. React hydrates the whole document and skips unexpected elements
 * and comments in <html>, <head> and <body>, but a whitespace text node between their children aborts
 * hydration (error #418) and the page is re-rendered from scratch on the client. Our markup never has
 * whitespace there, so dropping it first makes hydration independent of the host.
 */
function dropWhitespaceNodes(parent: ParentNode) {
  for (const node of Array.from(parent.childNodes))
    if (node.nodeType === Node.TEXT_NODE && !node.nodeValue?.trim()) node.remove()
}

for (const parent of [document.documentElement, document.head, document.body])
  dropWhitespaceNodes(parent)

/**
 * Each page component (a content/ index.tsx) is its own lazy chunk. Route loaders load it before rendering, but the
 * first render in the browser hydrates the prerendered HTML without running them, so the page's chunk is loaded
 * first: hydration then finds the same tree the server rendered instead of suspending and re-rendering the page
 * (which would recreate every image). A path with no entry (404) hydrates straight away.
 */
async function preloadCurrentPage() {
  const { pathname } = window.location
  const path = LOCALE_ROUTING === 'path' ? stripLocale(pathname).path : pathname
  const entry = resolveEntry(localeOf(pathname), path)
  if (entry) await preloadEntry(entry).catch(() => undefined)
}

void preloadCurrentPage().then(() =>
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <StartClient />
      </StrictMode>,
    )
  }),
)
