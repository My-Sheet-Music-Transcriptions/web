import { PageHeader } from '~/components/blocks/PageHeader'
import { googleRating } from '~/content/data'
import type { TemplateProps } from './index'

/** Generic content page: the dark PageHeader band from meta.ts (`hero`, or the title), then the page component. */
export function PageTemplate({ entry, children }: TemplateProps) {
  const hero =
    'hero' in entry.meta && entry.meta.hero ? entry.meta.hero : { title: entry.meta.title }
  return (
    <main id="main">
      <PageHeader
        title={hero.title ?? entry.meta.title}
        subtitle={'subtitle' in hero ? hero.subtitle : undefined}
        eyebrow={'eyebrow' in hero ? hero.eyebrow : undefined}
        lead={'lead' in hero ? hero.lead : undefined}
        cta={'cta' in hero ? hero.cta : undefined}
        rating={'rating' in hero && hero.rating ? googleRating(entry.locale) : undefined}
      />
      {children}
    </main>
  )
}
