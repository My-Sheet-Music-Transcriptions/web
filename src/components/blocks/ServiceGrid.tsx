import { Reveal } from '~/components/motion/Reveal'
import { Icon } from '~/components/primitives/Icon'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { serviceGrid } from '~/content/en/data/home'

const icons = import.meta.glob<PictureSource>('../../assets/images/icons/*.png', {
  eager: true,
  import: 'default',
  query: '?w=88;176&as=picture',
})

export interface ServiceGridProps {
  title?: string
  eyebrow?: string
  ctaLabel?: string
  ctaHref?: string
  /** Limit the number of items (defaults to the full homepage list of 12). */
  limit?: number
}

/** "We transcribe any instrument": a four-column list of services, each row an icon and a name over a hairline. */
export function ServiceGrid({
  title = 'We transcribe any instrument and musical genre',
  eyebrow = 'Services',
  ctaLabel = 'See all services',
  ctaHref = '/services-samples',
  limit,
}: ServiceGridProps) {
  const items = limit ? serviceGrid.slice(0, limit) : serviceGrid
  return (
    <section
      className="border-t border-line py-section lg:py-section-lg"
      aria-labelledby="services-title"
    >
      <div className="container-content">
        <SectionHeading id="services-title" eyebrow={eyebrow}>
          {title}
        </SectionHeading>
        <ul className="mt-10 grid gap-x-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {items.map((s, i) => {
            const img = icons[`../../assets/images/icons/${s.icon}.png`]
            return (
              <Reveal as="li" key={s.label} delay={(i % 4) * 0.04}>
                <SmartLink
                  href={s.href}
                  className="flex items-center gap-3.5 border-b border-line py-3.5 text-[15px] font-semibold text-ink hover:text-primary"
                >
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="44px"
                      className="h-11 w-11 shrink-0 object-contain"
                    />
                  ) : null}
                  {s.label}
                </SmartLink>
              </Reveal>
            )
          })}
        </ul>
        <SmartLink
          href={ctaHref}
          className="group mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:underline"
        >
          {ctaLabel}
          <Icon
            name="arrow-right"
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </SmartLink>
      </div>
    </section>
  )
}
