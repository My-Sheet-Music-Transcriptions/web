import { Button } from '~/components/primitives/Button'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { serviceGrid } from '~/content/en/data/home'

const icons = import.meta.glob<PictureSource>('../../assets/images/icons/*.png', {
  eager: true,
  import: 'default',
  query: '?w=130;260&as=picture',
})

export interface ServiceGridProps {
  title?: string
  eyebrow?: string
  ctaLabel?: string
  ctaHref?: string
  /** Limit the number of items (defaults to the full homepage list of 12). */
  limit?: number
}

/** "We transcribe any instrument": grid of instrument tiles linking to service pages. */
export function ServiceGrid({
  title = 'We transcribe any instrument and musical genre',
  eyebrow = 'Services',
  ctaLabel = 'See all services',
  ctaHref = '/services-samples',
  limit,
}: ServiceGridProps) {
  const items = limit ? serviceGrid.slice(0, limit) : serviceGrid
  return (
    <section className="py-section lg:py-section-lg" aria-labelledby="services-title">
      <div className="container-content">
        <SectionHeading id="services-title" eyebrow={eyebrow} rule="none">
          {title}
        </SectionHeading>
        <ul className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((s) => {
            const img = icons[`../../assets/images/icons/${s.icon}.png`]
            return (
              <li key={s.label}>
                <SmartLink
                  href={s.href}
                  className="group flex h-full flex-col items-center rounded-card border border-line bg-white px-4 py-6 text-center transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                >
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="88px"
                      className="h-[88px] w-[88px] object-contain transition-transform group-hover:scale-105"
                    />
                  ) : null}
                  <span className="mt-4 block text-h4 font-bold text-ink group-hover:text-primary">
                    {s.label}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
        <div className="mt-10 text-center">
          <Button variant="outline" asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
