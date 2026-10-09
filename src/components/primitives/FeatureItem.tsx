import type { CardItem, MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { lightMarkdown } from '~/lib/light-markdown'
import { Card } from './Card'
import { CtaLink } from './CtaLink'
import { Media } from './Media'
import { Picture, type PictureSource } from './Picture'
import { SmartLink } from './SmartLink'

export interface FeatureItemProps {
  item: CardItem
  /** card: a white card. tile: a peach rounded tile. plain: no surface (a step, a column). */
  surface?: 'card' | 'tile' | 'plain'
  /** Centred, or at the start (the default of cards). */
  align?: 'center' | 'start'
  /** The words of the play button: `media` from content/<locale>/data/labels (items with a video). */
  labels?: MediaLabels
  /** The still over the video until it is played. */
  videoPoster?: PictureSource
  /** Extra classes of the picture (Steps hides it where its wide illustration shows). */
  imageClassName?: string
}

const surfaces = {
  card: '',
  tile: 'rounded-[35px] bg-orange-tint p-10 shadow-[0_0_10px_5px_rgb(0_0_0/0.11)]',
  plain: '',
}

/**
 * One item of a grid or a process: its media (an illustrated icon, a picture or a video), a title, a short
 * text in light markdown, a bold line and a link. CardGrid and Steps show their items with it, on one of
 * three surfaces; nothing else draws a feature card.
 */
export function FeatureItem({
  item,
  surface = 'card',
  align = surface === 'card' ? 'start' : 'center',
  labels,
  videoPoster,
  imageClassName,
}: FeatureItemProps) {
  const center = align === 'center'
  // wide icons (the formats strip) sit lower than the square ones
  const wide = item.icon ? item.icon.img.w / item.icon.img.h > 2 : false
  const media = item.video ? (
    <Media
      video={item.video}
      labels={labels}
      videoPoster={videoPoster}
      sizes="560px"
      className="mb-5"
    />
  ) : item.image ? (
    <Picture
      image={item.image}
      alt=""
      sizes={surface === 'card' ? '(min-width: 1025px) 360px, 100vw' : '280px'}
      className={cn(
        'mb-5',
        surface === 'card' ? 'aspect-[3/2] w-full rounded-card object-cover' : 'h-auto',
        imageClassName,
      )}
      style={surface === 'card' ? undefined : { width: item.imageWidth ?? 180 }}
    />
  ) : item.icon ? (
    <Picture
      image={item.icon}
      alt=""
      sizes={surface === 'tile' ? '140px' : '110px'}
      className={cn(
        'mb-4',
        surface === 'tile'
          ? 'h-[123px] w-auto object-contain lg:h-[113px]'
          : wide
            ? 'h-[61px] w-auto md:h-[63px]'
            : 'h-[74px] w-[74px]',
      )}
    />
  ) : null
  const linked = item.href && !item.linkLabel
  const content = (
    <>
      {media}
      {item.title ? (
        <h3 className="text-h3 font-bold text-ink">
          {linked ? (
            <SmartLink href={item.href as string} className="hover:text-accent-deep">
              {item.title}
            </SmartLink>
          ) : (
            item.title
          )}
        </h3>
      ) : null}
      <div className={cn('flex flex-col gap-3 whitespace-pre-line text-ink', item.title && 'mt-3')}>
        {lightMarkdown(item.body)}
      </div>
      {item.emphasis ? <p className="mt-1 font-bold text-ink">{item.emphasis}</p> : null}
      {item.href && item.linkLabel ? (
        <div className="mt-auto pt-6">
          <CtaLink cta={{ label: item.linkLabel, href: item.href }} variant="outline" />
        </div>
      ) : null}
    </>
  )
  const className = cn(
    'flex h-full w-full flex-col',
    center && 'items-center text-center',
    surfaces[surface],
  )
  return surface === 'card' ? (
    <Card shadow="band" className={className}>
      {content}
    </Card>
  ) : (
    <div className={className}>{content}</div>
  )
}
