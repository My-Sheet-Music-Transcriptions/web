import type { CardItem, MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { lightMarkdown } from '~/lib/light-markdown'
import { Card } from './Card'
import { CtaLink } from './CtaLink'
import { Icon } from './Icon'
import { Media } from './Media'
import { Picture, type PictureSource } from './Picture'
import { SmartLink } from './SmartLink'

export interface FeatureItemProps {
  item: CardItem
  /** card: a white card. tile: a peach rounded tile. plain: no surface (a step, a column). bubble: a sky-tinted speech bubble pointing left (a timeline step). overlay: its picture fills the item, darkened, the words in white over it. */
  surface?: 'card' | 'tile' | 'plain' | 'bubble' | 'overlay'
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
  bubble:
    'relative rounded-card bg-sky-tint p-6 md:p-8 before:absolute before:top-1/2 before:-left-3 before:-translate-y-1/2 before:border-y-[10px] before:border-r-[12px] before:border-y-transparent before:border-r-sky-tint',
  overlay:
    'relative isolate min-h-[400px] justify-center overflow-hidden bg-navy px-8 py-12 text-white after:absolute after:inset-0 after:-z-10 after:bg-black/55 [&_h3]:text-[30px] [&_h3]:leading-[1.15] [&_h3]:text-white',
}

/** A social network's glyph sits on its own colour; every other glyph on the orange accent. */
const glyphDisc: Partial<Record<string, string>> = {
  facebook: 'bg-facebook',
  youtube: 'bg-youtube',
  instagram: 'bg-instagram',
}

/**
 * One item of a grid or a process: its media (an illustrated icon, a picture, a video or a glyph in a disc), a title, a short
 * text in light markdown, a bold line, more words that unfold when clicked (native `<details>`) and a link. CardGrid
 * and Steps show their items with it, on one of five surfaces (a card, a tile, plain, a speech bubble, the words over
 * the picture); nothing else draws a feature card.
 */
export function FeatureItem({
  item,
  surface = 'card',
  align = surface === 'card' || surface === 'bubble' ? 'start' : 'center',
  labels,
  videoPoster,
  imageClassName,
}: FeatureItemProps) {
  const center = align === 'center'
  // wide icons (the formats strip) sit lower than the square ones
  const wide = item.icon ? item.icon.img.w / item.icon.img.h > 2 : false
  const overlay = surface === 'overlay'
  const media =
    overlay && item.image ? (
      <Picture
        image={item.image}
        alt=""
        sizes="(min-width: 1025px) 560px, 100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
    ) : item.video ? (
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
        sizes={
          surface === 'card'
            ? '(min-width: 1025px) 360px, 100vw'
            : `(max-width: 767px) 100vw, ${item.imageWidth ?? 180}px`
        }
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
    ) : item.glyph ? (
      <span
        aria-hidden="true"
        className={cn(
          'mb-4 grid size-[60px] shrink-0 place-items-center rounded-full text-white',
          glyphDisc[item.glyph] ?? 'bg-accent',
        )}
      >
        <Icon name={item.glyph} size={26} />
      </span>
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
      <div
        className={cn(
          'flex flex-col gap-3 whitespace-pre-line',
          overlay ? 'text-white md:max-w-[60%]' : 'text-ink',
          item.title && 'mt-3',
        )}
      >
        {lightMarkdown(item.body)}
      </div>
      {item.emphasis ? <p className="mt-1 font-bold text-ink">{item.emphasis}</p> : null}
      {item.more ? (
        <details className="group unfold mt-5 w-full text-left">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-small font-medium text-ink [&::-webkit-details-marker]:hidden">
            <Icon
              name="plus"
              size={14}
              className="shrink-0 transition-transform group-open:rotate-45"
            />
            {item.more.label}
          </summary>
          <div className="flex flex-col gap-3 pt-4 text-ink">{lightMarkdown(item.more.body)}</div>
        </details>
      ) : null}
      {item.href && item.linkLabel ? (
        <div className={overlay ? 'pt-6' : 'mt-auto pt-6'}>
          <CtaLink
            cta={{ label: item.linkLabel, href: item.href }}
            variant={overlay ? 'ghost' : 'outline'}
            className={
              overlay
                ? 'border border-white font-normal normal-case text-white hover:bg-white/15'
                : undefined
            }
          />
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
