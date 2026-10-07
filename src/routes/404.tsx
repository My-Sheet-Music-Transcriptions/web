import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '~/components/layout/NotFound'
import { pageTitle } from '~/seo/head'
import { site } from '~/site'

/** Prerendered to /404.html so the static host serves it for unknown paths (with a real 404 status). */
export const Route = createFileRoute('/404')({
  head: () => ({
    meta: [
      { title: pageTitle(site.strings.notFoundTitle ?? 'Page not found') },
      {
        name: 'description',
        content:
          site.strings.notFoundBody ?? 'The page you are looking for does not exist or has moved.',
      },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: NotFound,
})
