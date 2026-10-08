import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '~/app/NotFound'
import { pageTitle } from '~/seo/head'
import { getSiteConfig, localeOf, SITE_LOCALE } from '~/site'

/** Prerendered to /404.html so the static host serves it for unknown paths (with a real 404 status). */
export const Route = createFileRoute('/404')({
  loader: ({ location }) => ({ locale: localeOf(location.publicHref) }),
  head: ({ loaderData }) => {
    const site = getSiteConfig(loaderData?.locale ?? SITE_LOCALE)
    return {
      meta: [
        { title: pageTitle(site.strings.notFound.title, site.locale) },
        {
          name: 'description',
          content: site.strings.notFound.body,
        },
        { name: 'robots', content: 'noindex, nofollow' },
      ],
    }
  },
  component: NotFound,
})
