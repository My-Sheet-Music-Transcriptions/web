import { createRouter, type RouterHistory } from '@tanstack/react-router'
import { DefaultCatchBoundary } from '~/components/layout/DefaultCatchBoundary'
import { NotFound } from '~/components/layout/NotFound'
import { localePrefixRewrite } from '~/i18n/routing'
import { LOCALE_ROUTING } from '~/site'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  // The rewrite reads the router's current history (Start swaps in a per-request one on the server).
  let self: { history: RouterHistory } | undefined
  const router = createRouter({
    routeTree,
    // Preload route code + loader data when a link is hovered/focused.
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 30_000,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    // Path-mode previews: /<locale>/... in the address bar, locale-free paths inside the router.
    rewrite:
      LOCALE_ROUTING === 'path'
        ? localePrefixRewrite(() => self?.history.location.pathname ?? '/')
        : undefined,
  })
  self = router
  return router
}
