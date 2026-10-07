import { useEffect, useState } from 'react'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { cn } from '~/lib/cn'

/** Cross-fading background photos. The first slide is server-rendered; rotation starts after hydration. */
export function HeroSlideshow({
  slides,
  sizes,
  position,
  rotate,
  interval = 6000,
}: {
  slides: PictureSource[]
  sizes: string
  position: 'left' | 'center'
  rotate: boolean
  interval?: number
}) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (!rotate || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), interval)
    return () => clearInterval(id)
  }, [rotate, slides.length, interval])
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
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
            position === 'left' ? 'object-left' : 'object-center',
            i === active ? 'opacity-100' : 'opacity-0',
          )}
          pictureClassName="contents"
        />
      ))}
    </div>
  )
}
