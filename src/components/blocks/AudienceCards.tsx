import { audiences } from '@content/en/data/home'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'

const icons = import.meta.glob<PictureSource>('../../assets/images/icons/audience-*.{png,webp}', {
  eager: true,
  import: 'default',
  query: '?w=130;260&as=picture',
})

export interface AudienceCardsProps {
  title?: string
}

/** "Who do we work for?": four rounded peach cards, each linking to an audience landing page. */
export function AudienceCards({ title = 'Who do we work for?' }: AudienceCardsProps) {
  return (
    <section className="pt-[50px] pb-5 md:pt-[90px]" aria-labelledby="audience-title">
      <div className="mx-auto max-w-[1440px] px-[10px] pt-[10px]">
        <SectionHeading
          id="audience-title"
          className="[&_h2]:text-[26px] [&_h2]:leading-[26px] md:[&_h2]:text-h2 md:[&_h2]:leading-8"
        >
          {title}
        </SectionHeading>
        <ul className="mx-auto mt-[30px] grid max-w-[1402px] gap-[30px] px-[10px] md:grid-cols-2 lg:grid-cols-4 lg:px-0">
          {audiences.map((a) => {
            const key = Object.keys(icons).find((k) => k.includes(`/${a.icon}.`))
            const img = key ? icons[key] : undefined
            return (
              <li
                key={a.href}
                className="flex flex-col items-center rounded-[35px] bg-orange-tint p-10 text-center shadow-[0_0_10px_5px_rgb(0_0_0/0.11)]"
              >
                {img ? (
                  <Picture
                    image={img}
                    alt=""
                    sizes="140px"
                    className="h-[123px] w-auto object-contain lg:h-[113px]"
                  />
                ) : null}
                <h3 className="mt-[14px] text-h3 leading-10 text-[#272727]">
                  <SmartLink href={a.href} className="hover:text-accent-deep">
                    {a.title}
                  </SmartLink>
                </h3>
                <p className="text-body text-ink">{a.body}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
