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
    <section className="pt-[154px] md:pb-[72px]" aria-labelledby="services-title">
      <div className="mx-auto max-w-[1140px] md:px-[10px]">
        <SectionHeading id="services-title">{title}</SectionHeading>
        <ul className="mx-auto mt-5 grid max-w-[1120px] grid-cols-2 items-start gap-y-[30px] md:grid-cols-4">
          {items.map((s) => {
            const img = icons[`../../assets/images/icons/${s.icon}.png`]
            return (
              <li key={s.label} className="p-[10px] text-center">
                <SmartLink href={s.href} className="group inline-flex flex-col items-center">
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="137px"
                      className="h-[137px] w-[137px] transition-transform group-hover:scale-105 md:h-[130px] md:w-[130px]"
                    />
                  ) : null}
                  <span className="mt-[14px] mb-4 block text-h4 font-bold leading-[19.2px] text-[#363636] group-hover:text-accent-deep">
                    {s.label}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
        <div className="mt-[33px] text-center md:mt-[34px]">
          <Button asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
