import { audiences } from '@content/en/data/home'
import { Card } from '~/components/primitives/Card'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'

const icons = import.meta.glob<PictureSource>('../../assets/images/home/audience-*.{png,webp}', {
  eager: true,
  import: 'default',
  query: '?w=130;260&as=picture',
})

export interface AudienceCardsProps {
  title?: string
}

/** "Who do we work for?": four peach cards, each linking to an audience landing page. */
export function AudienceCards({ title = 'Who do we work for?' }: AudienceCardsProps) {
  return (
    <section className="py-[90px]" aria-labelledby="audience-title">
      <div className="mx-auto max-w-[1440px] px-4">
        <SectionHeading id="audience-title">{title}</SectionHeading>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => {
            const key = Object.keys(icons).find((k) => k.includes(`/${a.icon}.`))
            const img = key ? icons[key] : undefined
            return (
              <li key={a.href}>
                <Card
                  tone="peach"
                  className="flex h-full flex-col items-center px-6 pb-8 pt-7 text-center"
                >
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="110px"
                      className="h-[110px] w-auto object-contain"
                    />
                  ) : null}
                  <h3 className="mt-5 text-h3 leading-10 text-[#272727]">
                    <SmartLink href={a.href} className="hover:text-accent-deep">
                      {a.title}
                    </SmartLink>
                  </h3>
                  <p className="mt-2 text-small leading-6 text-ink">{a.body}</p>
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
