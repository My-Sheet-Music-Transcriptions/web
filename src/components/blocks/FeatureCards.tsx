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

/** "What's included?": three white feature cards (turnaround, formats, accuracy) on the warm cream band. */
export function FeatureCards({
  title = "What's included?",
  eyebrow = 'Every order',
}: FeatureCardsProps) {
  return (
    <section className="bg-cream py-section lg:py-section-lg" aria-labelledby="included-title">
      <div className="container-content">
        <SectionHeading id="included-title" eyebrow={eyebrow} rule="none">
          {title}
        </SectionHeading>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {included.map((f) => {
            const img = icons[`../../assets/images/icons/${f.icon}.png`]
            return (
              <li
                key={f.title}
                className="flex h-full flex-col rounded-card border border-white bg-white p-7 shadow-card lg:p-8"
              >
                <span className="flex h-16 items-center">
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="120px"
                      className={f.icon === 'formats' ? 'h-[52px] w-auto' : 'h-[64px] w-[64px]'}
                    />
                  ) : null}
                </span>
                <h3 className="mt-6 text-h3">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-charcoal">
                  {f.body}
                  {f.emphasis ? (
                    <>
                      <br />
                      <strong className="font-bold text-ink">{f.emphasis}</strong>
                    </>
                  ) : null}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
