import { useEffect, useRef } from 'react'
import { cn } from '~/lib/cn'

/** A short silent video as content: an mp4 in the page folder (a screen recording) and what it shows. */
export interface Clip {
  /** The URL of the video (`import pay from './pay.mp4'`). */
  src: string
  /** What the video shows; names the player for screen readers. */
  title: string
  /** A line under the video. */
  caption?: string
}

export interface ClipPlayerProps extends Clip {
  className?: string
}

/**
 * A short silent video that plays on its own, in a loop, like an animated picture (the steps of a how-to), with
 * the browser's controls to pause it. It loads only its first frame until it plays, and stays still for visitors
 * who ask for reduced motion.
 */
export function ClipPlayer({ src, title, caption, className }: ClipPlayerProps) {
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = video.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.play().catch(() => {
      // Autoplay refused (data saver, a browser setting): the controls are there.
    })
  }, [])
  return (
    <figure className={cn('flex flex-col gap-2.5', className)}>
      <video
        ref={video}
        src={src}
        aria-label={title}
        muted
        loop
        playsInline
        controls
        preload="metadata"
        className="block aspect-video h-auto w-full rounded-card bg-white object-contain shadow-card"
      />
      {caption ? (
        <figcaption className="text-[13px] italic leading-[1.5] text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
