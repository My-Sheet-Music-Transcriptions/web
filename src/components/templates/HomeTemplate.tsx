import type { TemplateProps } from './index'

/** The homepage is composed entirely of blocks in MDX; the template adds only the main landmark. */
export function HomeTemplate({ children }: TemplateProps) {
  return <main id="main">{children}</main>
}
