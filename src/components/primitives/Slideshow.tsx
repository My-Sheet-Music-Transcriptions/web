import { cn } from '~/lib/cn'
import { useAutoAdvance } from '~/lib/use-auto-advance'
import { Picture, type PictureSource } from './Picture'

export interface SlideshowProps {
  /** The photos, in rotation order; the first one is server-rendered and loads first. */
  slides: PictureSource[]
  sizes: string
  /** Seconds between photos. */
  interval?: number
}

/**
 * Cross-fading photos that fill their (positioned) parent: the background of the homepage header. Decorative:
 * hidden from screen readers. Rotation starts after hydration and never runs for reduced-motion visitors.
 */
export function Slideshow({ slides, sizes, interval = 6 }: SlideshowProps) {
  const [active] = useAutoAdvance(slides.length, interval)
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {slides.map((img, i) => (
        <Picture
          key={img.img.src}
          image={img}
          alt=""
          sizes={sizes}
          priority={i === 0}
          loading={i === 0 ? 'eager' : 'lazy'}
          className={cn(
            'absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000',
            i === active ? 'opacity-100' : 'opacity-0',
          )}
          pictureClassName="contents"
        />
      ))}
    </div>
  )
}
