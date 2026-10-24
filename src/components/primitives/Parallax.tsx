import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'

export interface ParallaxProps {
  /** `top` (default): the picture of a page's header, lagging behind it over the first screen of scrolling.
   * `band`: a picture mid-page (a photo band), lagging behind its band as the band crosses the screen. */
  range?: 'top' | 'band'
  /** Where the frame sits, usually `absolute inset-0` and a `-z-*` behind the copy. */
  className?: string
  /** Hidden from screen readers: a decorative picture. */
  'aria-hidden'?: 'true'
  /** The picture, filling the layer (`absolute inset-0 h-full w-full object-cover`). */
  children: ReactNode
}

/**
 * A picture that scrolls more slowly than the page behind something that does not (parallax): a frame that clips
 * it and a layer that slides inside, moved by the scroll in CSS (`parallax`, `parallax-band` in theme.css). The
 * compositor runs it, no JavaScript; still under reduced motion, on paper and where browsers lack scroll timelines.
 * Every parallax on the site is one of these: the homepage's photos, the cover headers and the photo bands.
 */
export function Parallax({ range = 'top', className, children, ...rest }: ParallaxProps) {
  return (
    <div className={cn('overflow-clip', range === 'band' && 'parallax-frame', className)} {...rest}>
      <div
        className={cn(
          'absolute inset-x-0',
          range === 'band' ? 'parallax-band' : 'parallax inset-y-0',
        )}
      >
        {children}
      </div>
    </div>
  )
}
