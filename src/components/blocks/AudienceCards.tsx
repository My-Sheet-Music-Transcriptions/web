import { Icon } from '~/components/primitives/Icon'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { audiences } from '~/content/en/data/home'

const icons = import.meta.glob<PictureSource>('../../assets/images/home/audience-*.{png,webp}', {
  eager: true,
  import: 'default',
  query: '?w=130;260&as=picture',
})

export interface AudienceCardsProps {
  title?: string
  eyebrow?: string
}

/** "Who do we work for?": four white cards on the cool surface, each linking to an audience landing page. */
export function AudienceCards({
  title = 'Who do we work for?',
  eyebrow = 'For every musician',
}: AudienceCardsProps) {
  return (
    <section className="bg-surface py-section lg:py-section-lg" aria-labelledby="audience-title">
      <div className="container-wide">
        <SectionHeading id="audience-title" eyebrow={eyebrow} rule="none">
          {title}
        </SectionHeading>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => {
            const key = Object.keys(icons).find((k) => k.includes(`/${a.icon}.`))
            const img = key ? icons[key] : undefined
            return (
              <li key={a.href}>
                <SmartLink
                  href={a.href}
                  aria-labelledby={`audience-${a.icon}`}
                  className="group flex h-full flex-col rounded-card border border-line bg-white p-7 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                >
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="96px"
                      className="h-[96px] w-auto self-start object-contain"
                    />
                  ) : null}
                  <h3 id={`audience-${a.icon}`} className="mt-6 text-h3 group-hover:text-primary">
                    {a.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-charcoal">{a.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-small font-bold text-primary">
                    Learn more
                    <Icon
                      name="arrow-right"
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
