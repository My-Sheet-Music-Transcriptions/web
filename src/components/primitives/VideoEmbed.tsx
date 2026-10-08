import { useState } from 'react'
import { cn } from '~/lib/cn'
import { Icon } from './Icon'
import { Picture, type PictureSource } from './Picture'

export interface VideoEmbedProps {
  /** The YouTube video id (the 11 characters after `v=`). */
  youtube: string
  /** What the video shows; names the player and the play button. */
  title: string
  /** The still shown until the visitor plays it (a file in the page folder, never YouTube's). */
  poster: PictureSource
  className?: string
}

/**
 * A YouTube video behind a click: the page shows the downloaded poster and a play button, and only a click
 * loads the player (youtube-nocookie.com). Nothing is requested from a third party before that click.
 */
export function VideoEmbed({ youtube, title, poster, className }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className={cn('relative aspect-video overflow-hidden rounded-card bg-footer', className)}>
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
          <Picture
            image={poster}
            alt=""
            sizes="(min-width: 768px) 560px, 100vw"
            className="h-full w-full object-cover"
            pictureClassName="contents"
          />
          <span className="absolute top-1/2 left-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-[#cc0000] text-white shadow-float transition-transform group-hover:scale-110">
            <Icon name="play" size={28} />
          </span>
          <span className="sr-only">Play the video: {title}</span>
        </button>
      )}
    </div>
  )
}
