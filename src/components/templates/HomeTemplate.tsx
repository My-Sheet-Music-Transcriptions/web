import type { TemplateProps } from './index'

/**
 * The homepage is composed entirely of blocks; the template adds only the main landmark,
 * clipped sideways so blocks sliding in from the edges (Reveal) never widen the page.
 */
export function HomeTemplate({ children }: TemplateProps) {
  return (
    <main id="main" className="overflow-x-clip">
      {children}
    </main>
  )
}
