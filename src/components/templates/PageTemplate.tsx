import { PageHero } from '~/components/blocks/PageHero'
import type { TemplateProps } from './index'

/** Generic content page: dark hero with the title, then the page component (blocks). */
export function PageTemplate({ entry, children }: TemplateProps) {
  const hero =
    'hero' in entry.meta && entry.meta.hero ? entry.meta.hero : { title: entry.meta.title }
  return (
    <main id="main">
      <PageHero title={hero.title} subtitle={hero.subtitle} eyebrow={hero.eyebrow} />
      {children}
    </main>
  )
}
