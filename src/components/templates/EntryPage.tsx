import { Suspense } from 'react'
import { entryComponent, resolveEntry } from '~/content'
import { mdxComponents } from '~/content/mdx-components'
import { templateByName, templates } from './index'

/** Resolves an entry by path and renders it inside the template its frontmatter names. */
export function EntryPage({ path }: { path: string }) {
  const entry = resolveEntry(path)
  if (!entry) return null
  const Body = entryComponent(entry)
  const Template = templateByName(templateFor(entry.meta))
  return (
    <Template entry={entry}>
      <Suspense fallback={null}>
        <Body components={mdxComponents} />
      </Suspense>
    </Template>
  )
}

function templateFor(meta: { type: string; template?: string }): keyof typeof templates {
  if (meta.type === 'page' && meta.template && meta.template in templates)
    return meta.template as keyof typeof templates
  if (meta.type in templates) return meta.type as keyof typeof templates
  return 'page'
}
