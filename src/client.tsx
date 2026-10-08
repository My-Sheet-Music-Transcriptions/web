import { StartClient } from '@tanstack/react-start/client'
import { StrictMode, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

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

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <StartClient />
    </StrictMode>,
  )
})
