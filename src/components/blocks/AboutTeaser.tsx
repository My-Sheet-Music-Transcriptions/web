import { type ReactNode, useEffect, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'

const photos = import.meta.glob<PictureSource>('../../assets/images/home/office-*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=560;1000&as=picture',
})
/** The live site's order. */
const order = ['8', '14', '12', 'transcriber', '11', '10', '9']
const slides = order.flatMap((n) => {
  const id = `../../assets/images/home/office-${n}.jpg`
  const img = photos[id]
  if (!img) return []
  return [
    {
      id,
      img,
      alt:
        n === 'transcriber'
          ? 'A transcriber at work in the My Sheet Music Transcriptions office'
          : 'The customer service team in the My Sheet Music Transcriptions office',
    },
  ]
})

export interface AboutTeaserProps {
  title?: string
  /** Rich text (`<p>` children) shown next to the photo carousel. */
  children?: ReactNode
  ctaLabel?: string
  ctaHref?: string
}

/**
 * "Who are we?": office photo carousel beside the team introduction. As on the live site the photos slide
 * on every 10 s (paused while hovered or focused, and for reduced-motion users), and on desktop the photo
 * reaches 124px past its column towards the page edge.
 */
export function AboutTeaser({
  title = 'Who are we?',
  children,
  ctaLabel = 'Read more about us',
  ctaHref = '/about-us',
}: AboutTeaserProps) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length)
  useEffect(() => {
    if (paused || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 10000)
    return () => clearInterval(id)
  }, [paused])
  const arrow =
    'absolute top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center text-white drop-shadow'
  return (
    <section className="py-[50px]" aria-labelledby="about-title">
      <div className="mx-auto max-w-[1140px]">
        <SectionHeading id="about-title">{title}</SectionHeading>
        <div className="mt-[30px] grid items-center gap-10 px-5 py-[10px] lg:grid-cols-2">
          <section
            className="relative"
            aria-roledescription="carousel"
            aria-label="Office photos"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="overflow-hidden rounded-card lg:ml-[-124px]" aria-live="polite">
              <div
                className="flex transition-transform duration-[2000ms] ease-in-out motion-reduce:transition-none"
                style={{ transform: `translateX(-${i * 100}%)` }}
              >
                {slides.map((s, n) => (
                  <Picture
                    key={s.id}
                    image={s.img}
                    alt={n === i ? s.alt : ''}
                    aria-hidden={n === i ? undefined : 'true'}
                    sizes="(min-width: 1025px) 654px, 100vw"
                    className="aspect-[654/437] w-full shrink-0 object-cover"
                    pictureClassName="contents"
                  />
                ))}
              </div>
            </div>
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
              Photo {i + 1} of {slides.length}
            </p>
          </section>
          <div className="flex flex-col gap-[14.4px] text-secondary">{children}</div>
        </div>
        <div className="mt-[65px] text-center md:mt-[49px]">
          <Button asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
