import type { ComponentType, ReactNode } from 'react'
import type { Entry } from '~/content'
import { HomeTemplate } from './HomeTemplate'
import { PageTemplate } from './PageTemplate'

export interface TemplateProps {
  entry: Entry
  children: ReactNode
}

/** Templates by name. Frontmatter `template` (pages) or `type` (other collections) selects one. */
export const templates = {
  home: HomeTemplate,
  page: PageTemplate,
  landing: PageTemplate,
} satisfies Record<string, ComponentType<TemplateProps>>

export type TemplateName = keyof typeof templates

export function templateByName(name: string): ComponentType<TemplateProps> {
  return (templates as Record<string, ComponentType<TemplateProps>>)[name] ?? templates.page
}
