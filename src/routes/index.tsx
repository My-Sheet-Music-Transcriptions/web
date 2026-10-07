import { createFileRoute, notFound } from '@tanstack/react-router'
import { EntryPage } from '~/components/templates/EntryPage'
import { preloadEntry, resolveEntry } from '~/content'
import { entryHead } from '~/seo/head'

export const Route = createFileRoute('/')({
  loader: async () => {
    const entry = resolveEntry('/')
    if (!entry) throw notFound()
    await preloadEntry(entry)
    return { path: entry.path }
  },
  head: ({ loaderData }) => entryHead(loaderData?.path ?? '/'),
  component: () => <EntryPage path={Route.useLoaderData().path} />,
})
