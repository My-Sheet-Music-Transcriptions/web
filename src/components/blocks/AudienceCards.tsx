import { Reveal } from '~/components/motion/Reveal'
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

/** "Who do we work for?": four columns under a hairline, each with its illustration and a link to its page. */
export function AudienceCards({
  title = 'Who do we work for?',
  eyebrow = 'For every musician',
}: AudienceCardsProps) {
  return (
    <section className="py-section lg:py-section-lg" aria-labelledby="audience-title">
      <div className="container-content">
        <SectionHeading id="audience-title" eyebrow={eyebrow}>
          {title}
        </SectionHeading>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {audiences.map((a, i) => {
            const key = Object.keys(icons).find((k) => k.includes(`/${a.icon}.`))
            const img = key ? icons[key] : undefined
            return (
              <Reveal
                as="li"
                key={a.href}
                delay={i * 0.06}
                className="flex flex-col gap-3 border-t border-line pt-6"
              >
                {img ? (
                  <Picture
                    image={img}
                    alt=""
                    sizes="96px"
                    className="h-[72px] w-auto self-start object-contain"
                  />
                ) : null}
                <h3 className="mt-2 text-h3">{a.title}</h3>
                <p className="flex-1 text-[15px] leading-relaxed text-charcoal">{a.body}</p>
                <SmartLink
                  href={a.href}
                  className="group inline-flex items-center gap-1.5 self-start text-[15px] font-semibold text-primary hover:underline"
                >
                  Learn more<span className="sr-only"> about {a.title}</span>
                  <Icon
                    name="arrow-right"
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </SmartLink>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
