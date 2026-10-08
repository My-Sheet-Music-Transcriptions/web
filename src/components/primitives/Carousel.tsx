import { useEffect, useState } from 'react'
import { cn } from '~/lib/cn'
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
  /** The `sizes` of each picture. */
  sizes: string
  /** Seconds between slides (paused while hovered or focused, and for reduced-motion users). */
  interval?: number
  /** Extra classes of the visible frame (e.g. a bleed past the column). */
  frameClassName?: string
  /** Extra classes of each picture (its aspect ratio). */
  imageClassName?: string
}

/**
 * Photo carousel with arrows that slides on by itself, as the live site's Elementor carousels do (a 2 s
 * slide every `interval` seconds). Only the visible photo is announced; it is a named group, not a landmark,
 * so it can sit inside a section labelled with the same words.
 */
export function Carousel({
  slides,
  label,
  sizes,
  interval = 10,
  frameClassName,
  imageClassName,
}: CarouselProps) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const go = (d: number) => setI((v) => (v + d + n) % n)
  useEffect(() => {
    if (paused || n < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((v) => (v + 1) % n), interval * 1000)
    return () => clearInterval(id)
  }, [paused, n, interval])
  const arrow =
    'absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white drop-shadow'
  return (
    // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA carousel pattern is a named group, not a form fieldset
    <div
      role="group"
      className="relative"
      aria-roledescription="carousel"
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
            aria-label="Previous photo"
            className={`${arrow} left-0`}
          >
            <Icon name="chevron-left" size={25} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className={`${arrow} right-0`}
          >
            <Icon name="chevron-right" size={25} />
          </button>
          <p className="sr-only">
            Photo {i + 1} of {n}
          </p>
        </>
      ) : null}
    </div>
  )
}
