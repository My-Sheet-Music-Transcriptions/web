import { included } from '@content/en/data/home'
import bg from '~/assets/images/home/included-bg.jpg?w=1000;1600&as=picture'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { WaveDivider } from '~/components/primitives/WaveDivider'
import { cn } from '~/lib/cn'

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
      className="relative isolate my-[50px] overflow-hidden pt-[30px] pb-[113px] text-white md:min-h-[700px] md:pt-[100px] md:pb-[100px]"
      aria-labelledby="included-title"
    >
      <Picture
        image={bg}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        pictureClassName="contents"
      />
      <div className="absolute inset-0 -z-10 bg-[#3a3a3a] opacity-[0.32]" aria-hidden="true" />
      <WaveDivider position="top" width={138} mobileHeight={20} mobileWidth={266} />
      <WaveDivider position="bottom" height={39} width={135} mobileHeight={20} mobileWidth={266} />
      <div className="mx-auto max-w-[1140px] px-[10px] pt-10 md:px-0 md:pt-[50px]">
        <h2
          id="included-title"
          className="text-center text-[28px] font-bold leading-8 text-white md:text-h2 md:leading-8"
        >
          {title}
        </h2>
        <ul className="mt-[60px] grid gap-5 md:grid-cols-3">
          {included.map((f) => {
            const img = icons[`../../assets/images/icons/${f.icon}.png`]
            return (
              <li
                key={f.title}
                className="flex flex-col items-center justify-center rounded-card bg-white p-5 text-center shadow-[0_0_45px_rgb(0_0_0/0.13)] md:min-h-[267px]"
              >
                {img ? (
                  <Picture
                    image={img}
                    alt=""
                    sizes="270px"
                    className={
                      f.icon === 'formats'
                        ? 'h-[61px] w-auto md:h-[63px]'
                        : 'h-[73px] w-[73px] md:h-[74px] md:w-[74px]'
                    }
                  />
                ) : null}
                <h3
                  className={cn(
                    '-mt-[7px] text-[18px] font-semibold text-[#0c0c0c] md:mt-3',
                    f.icon === 'fast-delivery' ? 'leading-[21.6px]' : 'leading-9',
                  )}
                >
                  {f.title}
                </h3>
                <p className="mt-[10px] text-body whitespace-pre-line text-ink">
                  {f.body}
                  {f.emphasis ? (
                    <>
                      <br />
                      <strong className="font-bold">{f.emphasis}</strong>
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
