import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { type ReactNode, useEffect } from 'react'
import { DefaultCatchBoundary } from '~/components/layout/DefaultCatchBoundary'
import { NotFound } from '~/components/layout/NotFound'
import { SiteShell } from '~/components/layout/SiteShell'
import { rootHead } from '~/seo/head'
import { site } from '~/site'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  head: () => rootHead(appCss),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
  component: () => (
    <SiteShell>
      <Outlet />
    </SiteShell>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  // Lets tests wait for interactivity (`html[data-hydrated]`).
  useEffect(() => {
    document.documentElement.dataset.hydrated = 'true'
  }, [])
  return (
    <html lang={site.lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
