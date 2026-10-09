import type { MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { fill } from '~/lib/strings'
import { Carousel, type Slide } from './Carousel'
import { Picture, type PictureSource } from './Picture'
import { type Video, VideoEmbed } from './VideoEmbed'

/** What a block can show beside or above its words: one picture, several, or a video. */
export interface MediaContent {
  /** The picture (imported with `?w=…&as=picture`). */
  image?: PictureSource
  /** Alt text of the picture; empty for a purely decorative one. */
  alt?: string
  /** Caption under the picture (optional). */
  caption?: string
  /** Several pictures instead of one: a carousel, or a pair side by side (before and after). */
  images?: Slide[]
  /** How several pictures show: carousel (default) or pair. */
  layout?: 'carousel' | 'pair'
  /** A video instead of a picture. */
  video?: Video
  /** The words of the carousel arrows and the play button: `media` from content/<locale>/data/labels. */
  labels?: MediaLabels
  /** The still shown over the video until it is played (`~/assets/images/brand/video-poster.jpg`). */
  videoPoster?: PictureSource
}

export interface MediaProps extends MediaContent {
  /** The `sizes` of the pictures. */
  sizes: string
  /** What a carousel shows, for screen readers; the first picture's alt text without it. */
  label?: string
  /** The media opens the page: its (first) picture loads first. */
  priority?: boolean
  /** Extra classes of the carousel frame (a bleed past the column). */
  frameClassName?: string
  /** Extra classes of each picture (an aspect ratio, a size). */
  imageClassName?: string
  className?: string
}

/**
 * The one place that decides how media shows: a video behind its poster and play button, a carousel or a
 * before/after pair of pictures, or one picture with its caption. Page headers, MediaText, feature cards and
 * steps all show their media through it.
 */
export function Media({
  image,
  alt = '',
  caption,
  images,
  layout = 'carousel',
  video,
  labels,
  videoPoster,
  sizes,
  label,
  priority,
  frameClassName,
  imageClassName,
  className,
}: MediaProps) {
  if (video)
    return (
      <VideoEmbed
        {...video}
        poster={videoPoster}
        playLabel={labels && fill(labels.play, { title: video.title })}
        className={cn('w-full', className)}
      />
    )
  if (images && images.length > 1 && layout === 'pair')
    return (
      <div className={cn('grid grid-cols-2 gap-4', className)}>
        {images.map((s) => (
          <figure key={s.image.img.src} className="flex flex-col items-center gap-2">
            <Picture
              image={s.image}
              alt={s.alt}
              sizes="(min-width: 768px) 240px, 50vw"
              priority={priority}
              className="w-full rounded-card shadow-card"
            />
            {s.caption ? (
              <figcaption className="text-h3 font-bold text-ink">{s.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    )
  if (images && images.length > 1)
    return (
      <Carousel
        slides={images}
        label={label ?? images[0]?.alt ?? ''}
        labels={labels}
        sizes={sizes}
        priority={priority}
        frameClassName={frameClassName}
        imageClassName={imageClassName}
      />
    )
  const one = image ? { image, alt, caption } : images?.[0]
  if (!one) return null
  return (
    <figure className={cn('flex flex-col gap-2.5', className)}>
      <Picture
        image={one.image}
        alt={one.alt}
        sizes={sizes}
        priority={priority}
        className={cn('h-auto w-full', one.caption && 'rounded-card shadow-card', imageClassName)}
      />
      {one.caption ? (
        <figcaption className="text-[13px] italic leading-[1.5] text-muted">
          {one.caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
