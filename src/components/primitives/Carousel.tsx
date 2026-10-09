import { useState } from 'react'
import type { MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { fill } from '~/lib/strings'
import { useAutoAdvance } from '~/lib/use-auto-advance'
import { Icon } from './Icon'
import { Picture, type PictureSource } from './Picture'

/** One picture of a carousel or gallery, with its alt text ('' when decorative). */
export interface Slide {
  image: PictureSource
  alt: string
  /** A line under the picture where the block shows one ("Before", "After", a name). */
  caption?: string
}

export interface CarouselProps {
  slides: Slide[]
  /** What the photos are, for screen readers ("Office photos"). */
  label: string
  /** The words of the arrows and of the position, for screen readers. */
  labels?: Pick<MediaLabels, 'previous' | 'next' | 'position' | 'carousel'>
  /** The `sizes` of each picture. */
  sizes: string
  /** Seconds between slides (paused while hovered or focused, and for reduced-motion users). */
  interval?: number
  /** Extra classes of the visible frame (e.g. a bleed past the column). */
  frameClassName?: string
  /** Extra classes of each picture (its aspect ratio). */
  imageClassName?: string
  /** Load the first picture first (the carousel opens the page). */
  priority?: boolean
}

/**
 * Photo carousel with arrows that slides on by itself, as the live site's Elementor carousels do (a 2 s
 * slide every `interval` seconds). Only the visible photo is announced; it is a named group, not a landmark,
 * so it can sit inside a section labelled with the same words.
 */
export function Carousel({
  slides,
  label,
  labels,
  sizes,
  interval = 10,
  frameClassName,
  imageClassName,
  priority,
}: CarouselProps) {
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const [i, setI] = useAutoAdvance(n, interval, paused)
  const go = (d: number) => setI((v) => (v + d + n) % n)
  const arrow =
    'absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white drop-shadow'
  return (
    // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA carousel pattern is a named group, not a form fieldset
    <div
      role="group"
      className="relative"
      aria-roledescription={labels?.carousel}
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={cn('overflow-hidden rounded-card', frameClassName)} aria-live="polite">
        <div
          className="flex transition-transform duration-[2000ms] ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {slides.map((s, k) => (
            <Picture
              key={s.image.img.src}
              image={s.image}
              alt={k === i ? s.alt : ''}
              aria-hidden={k === i ? undefined : 'true'}
              sizes={sizes}
              priority={priority && k === 0}
              className={cn('w-full shrink-0 object-cover', imageClassName)}
              pictureClassName="contents"
            />
          ))}
        </div>
      </div>
      {n > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={labels?.previous}
            className={`${arrow} left-0`}
          >
            <Icon name="chevron-left" size={25} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels?.next}
            className={`${arrow} right-0`}
          >
            <Icon name="chevron-right" size={25} />
          </button>
          {labels ? (
            <p className="sr-only">{fill(labels.position, { n: i + 1, total: n })}</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
