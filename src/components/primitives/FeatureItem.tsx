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
  /** card: a white card. plain: no surface (a step, a column). overlay: its picture fills the item, darkened, the words in white over it. */
  surface?: 'card' | 'plain' | 'overlay'
  /** Centred, or at the start (the default of cards). */
  align?: 'center' | 'start'
  /** The words of the play button: `media` from content/<locale>/data/labels (items with a video). */
  labels?: MediaLabels
  /** The still over the video until it is played. */
  videoPoster?: PictureSource
  /** Extra classes of the picture (Steps hides it where its wide illustration shows). */
  imageClassName?: string
  /** The step's number before the title, in the accent colour ("1."), when the title opens with one (Steps). */
  number?: string
}

const surfaces = {
  card: '',
  plain: '',
  overlay:
    'relative isolate min-h-100 justify-center overflow-hidden rounded-card bg-navy p-card-pad text-white after:absolute after:inset-0 after:-z-10 after:bg-black/50 md:p-8 [&_h3]:text-h2 [&_h3]:text-white',
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
 * and Steps show their items with it, on one of three surfaces (a card, plain, the words over the picture); nothing
 * else draws a feature card.
 */
export function FeatureItem({
  item,
  surface = 'card',
  align = surface === 'card' ? 'start' : 'center',
  labels,
  videoPoster,
  imageClassName,
  number,
}: FeatureItemProps) {
  const center = align === 'center'
  // wide icons (the formats strip) are shorter than the square ones
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
        className="mb-4"
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
          'mb-4',
          surface === 'card' ? 'aspect-[3/2] w-full rounded-card object-cover' : 'h-auto',
          imageClassName,
        )}
        style={surface === 'card' ? undefined : { width: item.imageWidth ?? 180 }}
      />
    ) : item.icon ? (
      <Picture
        image={item.icon}
        alt=""
        sizes="110px"
        className={cn('mb-4 w-auto object-contain', wide ? 'h-16' : 'h-18')}
      />
    ) : item.glyph ? (
      <span
        aria-hidden="true"
        className={cn(
          'mb-4 grid size-14 shrink-0 place-items-center rounded-full text-white',
          glyphDisc[item.glyph] ?? 'bg-accent',
        )}
      >
        <Icon name={item.glyph} size={24} />
      </span>
    ) : null
  const linked = item.href && !item.linkLabel
  const content = (
    <>
      {media}
      {item.title ? (
        <h3 className="text-h3 text-ink">
          {number ? <span className="text-accent-deep">{number} </span> : null}
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
          'flex flex-col gap-3 whitespace-pre-line text-body',
          overlay ? 'text-white md:max-w-3/5' : 'text-ink',
          item.title && 'mt-3',
        )}
      >
        {lightMarkdown(item.body)}
      </div>
      {item.emphasis ? <p className="mt-2 font-bold text-ink">{item.emphasis}</p> : null}
      {item.more ? (
        <details className="group unfold mt-4 w-full text-left">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-small font-semibold text-ink [&::-webkit-details-marker]:hidden">
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
            variant={overlay ? 'secondary' : 'ghost'}
            className={overlay ? 'border-white text-white hover:bg-white/15' : undefined}
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
    <Card className={className}>{content}</Card>
  ) : (
    <div className={className}>{content}</div>
  )
}
