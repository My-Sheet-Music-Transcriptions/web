import { createRouter } from '@tanstack/react-router'
import { DefaultCatchBoundary } from '~/components/layout/DefaultCatchBoundary'
import { NotFound } from '~/components/layout/NotFound'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    // Preload route code + loader data when a link is hovered/focused.
    defaultPreload: 'intent',
    defaultPreloadDelay: 50,
    defaultPreloadStaleTime: 30_000,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
  })
}
