import { serviceGrid } from '@content/en/data/home'
import { Button } from '~/components/primitives/Button'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'

const icons = import.meta.glob<PictureSource>('../../assets/images/icons/*.png', {
  eager: true,
  import: 'default',
  query: '?w=130;260&as=picture',
})

export interface ServiceGridProps {
  title?: string
  ctaLabel?: string
  ctaHref?: string
  /** Limit the number of items (defaults to the full homepage list of 12). */
  limit?: number
}

/** "We transcribe any instrument": four-column grid of instrument icons linking to service pages. */
export function ServiceGrid({
  title = 'We transcribe any instrument and musical genre',
  ctaLabel = 'See all services',
  ctaHref = '/services-samples',
  limit,
}: ServiceGridProps) {
  const items = limit ? serviceGrid.slice(0, limit) : serviceGrid
  return (
    <section className="pb-20 pt-12" aria-labelledby="services-title">
      <div className="container-content">
        <SectionHeading id="services-title" rule="grey">
          {title}
        </SectionHeading>
        <ul className="mx-auto mt-10 grid max-w-[1040px] grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {items.map((s) => {
            const img = icons[`../../assets/images/icons/${s.icon}.png`]
            return (
              <li key={s.label} className="text-center">
                <SmartLink href={s.href} className="group inline-flex flex-col items-center">
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="130px"
                      className="h-[130px] w-[130px] transition-transform group-hover:scale-105"
                    />
                  ) : null}
                  <span className="mt-4 block max-w-[220px] text-h4 font-bold leading-[19px] text-[#363636] group-hover:text-accent-deep">
                    {s.label}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
        <div className="mt-12 text-center">
          <Button asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
