import { createRootRoute, HeadContent, Outlet, redirect, Scripts } from '@tanstack/react-router'
import { type ReactNode, useEffect } from 'react'
import { DefaultCatchBoundary } from '~/components/layout/DefaultCatchBoundary'
import { NotFound } from '~/components/layout/NotFound'
import { SiteShell } from '~/components/layout/SiteShell'
import { DEFAULT_LOCALE, isLocalized, localeFromPathname, localizePath } from '~/i18n/routing'
import { rootHead } from '~/seo/head'
import { LOCALE_ROUTING, localeOf, SITE_LOCALE, useSite } from '~/site'
import appCss from '~/styles/app.css?url'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    // Path-mode previews: every page lives under /<locale>; "/" and other bare paths go to the default locale.
    const href = location.publicHref
    if (LOCALE_ROUTING === 'path' && isLocalized(href) && !localeFromPathname(href))
      throw redirect({ href: localizePath(DEFAULT_LOCALE, href) })
  },
  loader: ({ location }) => ({ locale: localeOf(location.publicHref) }),
  head: ({ loaderData }) => rootHead(appCss, loaderData?.locale ?? SITE_LOCALE),
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
  const site = useSite()
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
