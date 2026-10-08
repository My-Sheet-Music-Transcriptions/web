import { iconPicture } from '~/assets/icons'
import { PageHeader } from '~/components/blocks/PageHeader'
import { googleRating } from '~/content/data'
import type { TemplateProps } from './index'

/**
 * A service page (services collection): the PageHeader band with the h1, the subtitle, the service's icon
 * and the Google rating card, from meta.ts; then the page component (samples, included, pricing, FAQ…).
 */
export function ServiceTemplate({ entry, children }: TemplateProps) {
  const meta = entry.meta
  const service = meta.type === 'service' ? meta : undefined
  return (
    <main id="main">
      <PageHeader
        title={service?.hero?.title ?? meta.title}
        subtitle={service?.hero?.subtitle}
        image={iconPicture(service?.icon)}
        rating={service?.hero?.rating === false ? undefined : googleRating(entry.locale)}
      />
      {children}
    </main>
  )
}
