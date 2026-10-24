import type { MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { fill } from '~/lib/strings'
import { type Audio, AudioPlayer } from './AudioPlayer'
import { Carousel, type Slide } from './Carousel'
import { type Clip, ClipPlayer } from './Clip'
import { Lightbox } from './Lightbox'
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
  /** How several pictures show: carousel (default), gallery (each whole, with thumbnails: a product) or pair. */
  layout?: 'carousel' | 'gallery' | 'pair'
  /** A video instead of a picture. */
  video?: Video
  /** A recording instead of a picture: an audio player. */
  audio?: Audio
  /** A short silent video (an mp4 of the page folder) that plays in a loop, instead of a picture. */
  clip?: Clip
  /** The picture opens larger when clicked (a score to read, a photo of a gallery); needs `labels`. */
  zoom?: boolean
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
 * The one place that decides how media shows: a video behind its poster and play button, a recording in an
 * audio player, a short looping clip, a carousel or a before/after pair of pictures, or one picture with its
 * caption, which can open larger when clicked (`zoom`). Page headers,
 * MediaText, samples, feature cards and steps all show their media through it.
 */
export function Media({
  image,
  alt = '',
  caption,
  images,
  layout = 'carousel',
  video,
  audio,
  clip,
  zoom,
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
  if (audio)
    return (
      <AudioPlayer
        {...audio}
        playLabel={labels?.listen && fill(labels.listen, { title: audio.title })}
        pauseLabel={labels?.pause}
        className={cn('w-full', className)}
      />
    )
  if (clip) return <ClipPlayer {...clip} className={cn('w-full', className)} />
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
            {s.caption ? <figcaption className="text-h3 text-ink">{s.caption}</figcaption> : null}
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
        variant={layout === 'gallery' ? 'gallery' : 'photo'}
        frameClassName={frameClassName}
        imageClassName={imageClassName}
      />
    )
  const one = image ? { image, alt, caption } : images?.[0]
  if (!one) return null
  const picture = (
    <Picture
      image={one.image}
      alt={one.alt}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', one.caption && 'rounded-card shadow-card', imageClassName)}
    />
  )
  return (
    <figure className={cn('flex flex-col gap-2', className)}>
      {zoom && labels?.enlarge && labels.close ? (
        <Lightbox
          image={one.image}
          alt={one.alt}
          openLabel={fill(labels.enlarge, { alt: one.alt })}
          closeLabel={labels.close}
        >
          {picture}
        </Lightbox>
      ) : (
        picture
      )}
      {one.caption ? (
        <figcaption className="text-small text-muted italic">{one.caption}</figcaption>
      ) : null}
    </figure>
  )
}
