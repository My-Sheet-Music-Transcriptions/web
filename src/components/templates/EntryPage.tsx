import { entryComponent, resolveEntry } from '~/content'
import type { Locale } from '~/i18n/types'
import { templateByName, templates } from './index'

/**
 * Resolves an entry by locale and path and renders it inside the template its meta names. The body comes from the
 * cache the route loader filled, so there is no Suspense boundary: the whole page is in the first HTML flush.
 */
export function EntryPage({ locale, path }: { locale: Locale; path: string }) {
  const entry = resolveEntry(locale, path)
  if (!entry) return null
  const Body = entryComponent(entry)
  const Template = templateByName(templateFor(entry.meta))
  return (
    <Template entry={entry}>
      <Body />
    </Template>
  )
}

function templateFor(meta: { type: string; template?: string }): keyof typeof templates {
  if (meta.type === 'page' && meta.template && meta.template in templates)
    return meta.template as keyof typeof templates
  if (meta.type in templates) return meta.type as keyof typeof templates
  return 'page'
}
