import type { TemplateProps } from './index'

/** A landing page: no header from meta; the page opens with its own split PageHeader block. */
export function LandingTemplate({ children }: TemplateProps) {
  return <main id="main">{children}</main>
}
