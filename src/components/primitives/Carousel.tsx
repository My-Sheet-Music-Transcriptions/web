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
  /** photo (default): cropped photos that slide on by themselves, white arrows over them. gallery: each picture
   * whole on a cream card, arrows on white discs, the pictures as thumbnails under it to pick from; it moves only
   * when asked (a product's pictures). */
  variant?: 'photo' | 'gallery'
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
  variant = 'photo',
  frameClassName,
  imageClassName,
  priority,
}: CarouselProps) {
  const gallery = variant === 'gallery'
  const [paused, setPaused] = useState(false)
  const n = slides.length
  const [i, setI] = useAutoAdvance(n, interval, paused || gallery)
  const go = (d: number) => setI((v) => (v + d + n) % n)
  const arrow = cn(
    'absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center',
    gallery
      ? 'rounded-full bg-white/90 text-ink shadow-card transition-colors hover:bg-white'
      : 'text-white drop-shadow',
  )
  return (
    // biome-ignore lint/a11y/useSemanticElements: the WAI-ARIA carousel pattern is a named group, not a form fieldset
    <div
      role="group"
      className="relative min-w-0"
      aria-roledescription={labels?.carousel}
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={cn('overflow-hidden rounded-card', gallery && 'bg-cream', frameClassName)}
        aria-live="polite"
      >
        <div
          className={cn(
            'flex ease-in-out motion-reduce:transition-none',
            gallery
              ? 'transition-transform duration-500'
              : 'transition-transform duration-[2000ms]',
          )}
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
              className={cn(
                'w-full shrink-0',
                gallery ? 'aspect-square object-contain p-4 md:p-6' : 'object-cover',
                imageClassName,
              )}
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
            className={cn(arrow, gallery ? 'left-3' : 'left-0')}
          >
            <Icon name="chevron-left" size={25} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={labels?.next}
            className={cn(arrow, gallery ? 'right-3' : 'right-0')}
          >
            <Icon name="chevron-right" size={25} />
          </button>
          {gallery ? (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {slides.map((s, k) => (
                <li key={s.image.img.src} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setI(k)}
                    aria-label={labels ? fill(labels.position, { n: k + 1, total: n }) : undefined}
                    aria-current={k === i ? 'true' : undefined}
                    className={cn(
                      'block h-16 w-16 overflow-hidden rounded-[8px] bg-cream p-1 transition-[box-shadow,opacity]',
                      k === i
                        ? 'shadow-[inset_0_0_0_2px_var(--color-accent-deep)]'
                        : 'opacity-70 hover:opacity-100',
                    )}
                  >
                    <Picture
                      image={s.image}
                      alt=""
                      sizes="64px"
                      className="h-full w-full object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {labels ? (
            <p className="sr-only">{fill(labels.position, { n: i + 1, total: n })}</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
