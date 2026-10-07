import type { Decorator } from '@storybook/react-vite'
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

/** Components use TanStack <Link>; stories render them inside a minimal in-memory router. */
function makeRouter(children: ReactNode) {
  const rootRoute = createRootRoute({ component: () => <>{children}</> })
  return createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
}

export const RouterDecorator: Decorator = (Story) => (
  <RouterProvider router={makeRouter(<Story />)} />
)
