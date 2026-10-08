import { createFileRoute, notFound } from '@tanstack/react-router'
import { EntryPage } from '~/components/layout/EntryPage'
import { preloadEntry, resolveEntry } from '~/content'
import { entryHead } from '~/seo/head'
import { localeOf } from '~/site'

export const Route = createFileRoute('/')({
  loader: async ({ location }) => {
    const locale = localeOf(location.publicHref)
    const entry = resolveEntry(locale, '/')
    if (!entry) throw notFound()
    await preloadEntry(entry)
    return { locale, path: entry.path }
  },
  head: ({ loaderData }) => entryHead(loaderData?.locale, loaderData?.path ?? '/'),
  component: () => <EntryPage {...Route.useLoaderData()} />,
})
