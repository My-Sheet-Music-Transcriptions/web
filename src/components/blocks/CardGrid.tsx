import { useState } from 'react'
import { Card } from '~/components/primitives/Card'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { PhotoBand } from '~/components/primitives/PhotoBand'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { tones } from '~/components/primitives/tones'
import type { CardItem } from '~/content/types'
import { cn } from '~/lib/cn'
import { inlineMarkdown, lightMarkdown } from '~/lib/light-markdown'
import { useTitleId } from '~/lib/use-title-id'

/** One set of cards to switch to, e.g. the same services priced in another currency. */
export interface CardTab {
  label: string
  items: CardItem[]
}

export interface CardGridProps {
  title?: string
  /** A sentence under the title; **bold** and [links](/path) kept. */
  lead?: string
  /** The cards: a list from content/<locale>/data (audiences, included) or written in the page. */
  items?: CardItem[]
  /** Instead of items: sets of cards behind buttons (one per currency, per audience…). */
  tabs?: CardTab[]
  /** Cards per row from desktop up. */
  columns?: 2 | 3 | 4
  /** card: white card with a soft shadow. tile: peach rounded tile (audiences). plain: no surface. */
  surface?: 'card' | 'tile' | 'plain'
  /** photo: white cards over a full-bleed photo band with wavy edges ("What's included?"). */
  background?: 'none' | 'photo'
  /** The photo behind `background="photo"` (`~/assets/images/bands/included-bg.jpg` is the studio every page uses). */
  image?: PictureSource
  /** Background without a photo: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Button under the cards. */
  cta?: Cta
  /** Anchor id. */
  id?: string
}

const cols = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

/**
 * A grid of cards, each an icon or picture with a title and a short text: who we work for, what is
 * included, why choose us, services with their prices. One block for every "cards in a row" section.
 */
export function CardGrid({
  title,
  lead,
  items = [],
  tabs,
  columns = 3,
  surface = 'card',
  background = 'none',
  image,
  tone = 'white',
  cta,
  id,
}: CardGridProps) {
  const titleId = useTitleId(id)
  const [tab, setTab] = useState(0)
  const shown = tabs ? (tabs[tab]?.items ?? []) : items

  if (background === 'photo' && image)
    return (
      <PhotoBand image={image} title={title ?? ''} titleId={titleId} id={id} preset="cards">
        <ul className={cn('mt-[60px] grid gap-5 md:grid-cols-3', cols[columns])}>
          {shown.map((item) => (
            <li
              key={item.title}
              className="flex flex-col items-center justify-center rounded-card bg-white p-5 text-center shadow-band md:min-h-[267px]"
            >
              <CardIcon item={item} sizes="270px" />
              <h3 className="-mt-[7px] text-[18px] font-semibold leading-9 text-[#0c0c0c] md:mt-3">
                {item.title}
              </h3>
              <p className="mt-[10px] text-body whitespace-pre-line text-ink">
                {inlineMarkdown(item.body)}
                {item.emphasis ? (
                  <>
                    <br />
                    <strong className="font-bold">{item.emphasis}</strong>
                  </>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
        {cta ? <CtaLink cta={cta} className="mt-[60px]" /> : null}
      </PhotoBand>
    )

  if (surface === 'tile')
    return (
      <section
        id={id}
        className={cn('pt-[50px] pb-5 md:pt-[90px]', tones[tone])}
        aria-labelledby={title ? titleId : undefined}
      >
        <div className="mx-auto max-w-[1440px] px-[10px] pt-[10px]">
          {title ? (
            <SectionHeading
              id={titleId}
              className="[&_h2]:text-[26px] [&_h2]:leading-[26px] md:[&_h2]:text-h2 md:[&_h2]:leading-8"
            >
              {title}
            </SectionHeading>
          ) : null}
          <ul
            className={cn(
              'mx-auto mt-[30px] grid max-w-[1402px] gap-[30px] px-[10px] md:grid-cols-2 lg:px-0',
              cols[columns],
            )}
          >
            {shown.map((item) => (
              <li
                key={item.title}
                className="flex flex-col items-center rounded-[35px] bg-orange-tint p-10 text-center shadow-[0_0_10px_5px_rgb(0_0_0/0.11)]"
              >
                <CardIcon
                  item={item}
                  sizes="140px"
                  className="h-[123px] w-auto object-contain lg:h-[113px]"
                />
                <h3 className="mt-[14px] text-h3 leading-10 text-[#272727]">
                  {item.href ? (
                    <SmartLink href={item.href} className="hover:text-accent-deep">
                      {item.title}
                    </SmartLink>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="text-body text-ink">{inlineMarkdown(item.body)}</p>
              </li>
            ))}
          </ul>
          {cta ? (
            <div className="mt-10 text-center">
              <CtaLink cta={cta} />
            </div>
          ) : null}
        </div>
      </section>
    )

  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-[50px]', tones[tone])}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="container-content">
        {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
        {lead ? (
          <p className="mx-auto mt-2 max-w-3xl text-center text-[18px] leading-relaxed text-ink">
            {inlineMarkdown(lead)}
          </p>
        ) : null}
        {tabs ? (
          <div className="mt-8 flex justify-center gap-3">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                aria-pressed={i === tab}
                onClick={() => setTab(i)}
                className={cn(
                  'min-w-14 rounded-pill border-2 border-primary px-5 py-2 font-bold',
                  i === tab ? 'bg-primary text-white' : 'bg-white text-primary',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : null}
        <ul className={cn('mt-10 grid gap-6 md:grid-cols-2', cols[columns])}>
          {shown.map((item) => {
            const body = (
              <>
                {item.image ? (
                  <Picture
                    image={item.image}
                    alt=""
                    sizes="(min-width: 1025px) 360px, 100vw"
                    className="mb-5 aspect-[3/2] w-full rounded-card object-cover"
                  />
                ) : (
                  <CardIcon item={item} sizes="110px" className="mb-4 h-[90px] w-auto" />
                )}
                <h3 className="text-h3 font-bold text-ink">
                  {item.href && !item.linkLabel ? (
                    <SmartLink href={item.href} className="hover:text-accent-deep">
                      {item.title}
                    </SmartLink>
                  ) : (
                    item.title
                  )}
                </h3>
                <div className="mt-3 flex flex-col gap-3 text-ink">{lightMarkdown(item.body)}</div>
                {item.emphasis ? <p className="mt-3 font-bold text-ink">{item.emphasis}</p> : null}
                {item.href && item.linkLabel ? (
                  <div className="mt-auto pt-6">
                    <CtaLink cta={{ label: item.linkLabel, href: item.href }} variant="outline" />
                  </div>
                ) : null}
              </>
            )
            return (
              <li key={item.title} className="flex">
                {surface === 'card' ? (
                  <Card shadow="band" className="flex w-full flex-col">
                    {body}
                  </Card>
                ) : (
                  <div className="flex w-full flex-col items-center text-center">{body}</div>
                )}
              </li>
            )
          })}
        </ul>
        {cta ? (
          <div className="mt-10 text-center">
            <CtaLink cta={cta} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

/** The card's picture: its own image, or the named icon (wide icons, like the formats strip, sit lower). */
function CardIcon({
  item,
  sizes,
  className,
}: {
  item: CardItem
  sizes: string
  className?: string
}) {
  const img = item.image ?? item.icon
  if (!img) return null
  const wide = img.img.w / img.img.h > 2
  return (
    <Picture
      image={img}
      alt=""
      sizes={sizes}
      className={
        className ??
        (wide ? 'h-[61px] w-auto md:h-[63px]' : 'h-[73px] w-[73px] md:h-[74px] md:w-[74px]')
      }
    />
  )
}
