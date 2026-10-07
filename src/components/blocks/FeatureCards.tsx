import bg from '~/assets/images/home/included-bg.jpg?w=1000;1600&as=picture'
import { Card } from '~/components/primitives/Card'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { WaveDivider } from '~/components/primitives/WaveDivider'
import { included } from '~/content/en/data/home'

const icons = import.meta.glob<PictureSource>(
  '../../assets/images/icons/{fast-delivery,formats,accuracy}.png',
  { eager: true, import: 'default', query: '?w=150;300&as=picture' },
)

export interface FeatureCardsProps {
  title?: string
}

/** "What's included?": three white cards over a studio photo with wavy edges. */
export function FeatureCards({ title = "What's included?" }: FeatureCardsProps) {
  return (
    <section
      className="relative isolate overflow-hidden py-24 text-white lg:py-32"
      aria-labelledby="included-title"
    >
      <Picture
        image={bg}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        pictureClassName="contents"
      />
      <div className="absolute inset-0 -z-10 bg-black/30" aria-hidden="true" />
      <WaveDivider position="top" />
      <WaveDivider position="bottom" />
      <div className="container-content">
        <h2 id="included-title" className="text-center text-[26px] font-bold text-white md:text-h2">
          {title}
        </h2>
        <ul className="mx-auto mt-10 grid max-w-[1170px] gap-5 md:grid-cols-3">
          {included.map((f) => {
            const img = icons[`../../assets/images/icons/${f.icon}.png`]
            return (
              <li key={f.title}>
                <Card className="flex h-full flex-col items-center px-6 py-8 text-center text-ink">
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="150px"
                      className={f.icon === 'formats' ? 'h-[63px] w-auto' : 'h-[74px] w-[74px]'}
                    />
                  ) : null}
                  <h3 className="mt-5 text-[18px] font-semibold leading-9 text-[#0c0c0c]">
                    {f.title}
                  </h3>
                  <p className="text-small leading-6 text-ink">
                    {f.body}
                    {f.emphasis ? (
                      <>
                        <br />
                        <strong className="font-bold">{f.emphasis}</strong>
                      </>
                    ) : null}
                  </p>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
