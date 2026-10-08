import { useState } from 'react'
import { cn } from '~/lib/cn'
import { Icon } from './Icon'
import { Picture, type PictureSource } from './Picture'

/** A YouTube video as content: its id, what it shows and an optional line under it. */
export interface Video {
  /** The YouTube video id (the 11 characters after `v=`). */
  youtube: string
  /** What the video shows; names the player and the play button. */
  title: string
  /** A line under the video ("Play to compare with the sheet music"). */
  caption?: string
}

export interface VideoEmbedProps extends Video {
  /** The still shown until the visitor plays it; a dark frame without one. */
  poster?: PictureSource
  /** What the play button says to screen readers ("Play the video: …"); the title without it. */
  playLabel?: string
  className?: string
}

/**
 * A YouTube video behind a click: the page shows a downloaded poster and a play button, and only a click
 * loads the player (youtube-nocookie.com). Nothing is requested from a third party before that click.
 */
export function VideoEmbed({
  youtube,
  title,
  caption,
  poster,
  playLabel,
  className,
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)
  return (
    <figure className={cn('flex flex-col gap-2.5', className)}>
      <div className="relative aspect-video overflow-hidden rounded-card bg-footer">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 h-full w-full"
          >
            {poster ? (
              <Picture
                image={poster}
                alt=""
                sizes="(min-width: 768px) 560px, 100vw"
                className="h-full w-full object-cover"
                pictureClassName="contents"
              />
            ) : null}
            <span className="absolute top-1/2 left-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-[#cc0000] text-white shadow-float transition-transform group-hover:scale-110">
              <Icon name="play" size={28} />
            </span>
            <span className="sr-only">{playLabel ?? title}</span>
          </button>
        )}
      </div>
      {caption ? (
        <figcaption className="text-center text-body font-bold text-ink">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
