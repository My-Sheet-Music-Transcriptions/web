import { createFileRoute, notFound } from '@tanstack/react-router'
import { EntryPage } from '~/components/templates/EntryPage'
import { preloadEntry, resolveEntry } from '~/content'
import { entryHead } from '~/seo/head'

/** Every content-driven page: /pricing, /piano, /faqs/piano, /some-blog-post ... */
export const Route = createFileRoute('/$')({
  loader: async ({ params }) => {
    const entry = resolveEntry(params._splat ?? '')
    if (!entry) throw notFound()
    await preloadEntry(entry)
    return { path: entry.path }
  },
  head: ({ loaderData }) => entryHead(loaderData?.path ?? '/'),
  component: () => <EntryPage path={Route.useLoaderData().path} />,
})
