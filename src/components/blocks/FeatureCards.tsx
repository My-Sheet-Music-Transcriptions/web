import { Reveal } from '~/components/motion/Reveal'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { included } from '~/content/en/data/home'

const icons = import.meta.glob<PictureSource>(
  '../../assets/images/icons/{fast-delivery,formats,accuracy}.png',
  { eager: true, import: 'default', query: '?w=150;300&as=picture' },
)

export interface FeatureCardsProps {
  title?: string
  eyebrow?: string
}

/** "What's included?": three columns under a hairline (turnaround, formats, accuracy), each with its icon. */
export function FeatureCards({
  title = "What's included?",
  eyebrow = 'Every order',
}: FeatureCardsProps) {
  return (
    <section
      className="border-t border-line py-section lg:py-section-lg"
      aria-labelledby="included-title"
    >
      <div className="container-content">
        <SectionHeading id="included-title" eyebrow={eyebrow}>
          {title}
        </SectionHeading>
        <ul className="mt-10 grid gap-8 md:grid-cols-3 lg:mt-14 lg:gap-10">
          {included.map((f, i) => {
            const img = icons[`../../assets/images/icons/${f.icon}.png`]
            return (
              <Reveal
                as="li"
                key={f.title}
                delay={i * 0.06}
                className="flex flex-col gap-3 border-t border-line pt-6"
              >
                <span className="flex h-14 items-center">
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="120px"
                      className={f.icon === 'formats' ? 'h-12 w-auto' : 'h-14 w-14'}
                    />
                  ) : null}
                </span>
                <h3 className="mt-2 text-h3">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-charcoal">
                  {f.body}
                  {f.emphasis ? (
                    <>
                      <br />
                      <strong className="font-bold text-ink">{f.emphasis}</strong>
                    </>
                  ) : null}
                </p>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
