import { type ReactNode, useState } from 'react'
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
const slides = Object.entries(photos).map(([k, img]) => ({
  id: k,
  img,
  alt: k.includes('transcriber')
    ? 'A transcriber at work in the My Sheet Music Transcriptions office'
    : 'The customer service team in the My Sheet Music Transcriptions office',
}))

export interface AboutTeaserProps {
  title?: string
  /** Rich text (MDX children) shown next to the photo carousel. */
  children?: ReactNode
  ctaLabel?: string
  ctaHref?: string
}

/** "Who are we?": office photo carousel beside the team introduction. */
export function AboutTeaser({
  title = 'Who are we?',
  children,
  ctaLabel = 'Read more about us',
  ctaHref = '/about-us',
}: AboutTeaserProps) {
  const [i, setI] = useState(0)
  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length)
  const current = slides[i]
  return (
    <section className="py-16" aria-labelledby="about-title">
      <div className="container-content">
        <SectionHeading id="about-title">{title}</SectionHeading>
        <div className="mx-auto mt-12 grid max-w-[1100px] items-center gap-10 lg:grid-cols-2">
          <section className="relative" aria-roledescription="carousel" aria-label="Office photos">
            <div aria-live="polite" className="overflow-hidden rounded-card">
              {current ? (
                <Picture
                  image={current.img}
                  alt={current.alt}
                  sizes="(min-width: 1025px) 540px, 100vw"
                  className="aspect-[3/2] w-full object-cover"
                />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow-card hover:bg-white"
            >
              <Icon name="chevron-left" size={22} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-ink shadow-card hover:bg-white"
            >
              <Icon name="chevron-right" size={22} />
            </button>
            <p className="sr-only">
              Photo {i + 1} of {slides.length}
            </p>
          </section>
          <div className="space-y-4 text-small leading-6 text-ink [&_p]:my-0 [&_strong]:font-bold [&_p+p]:mt-4">
            {children}
          </div>
        </div>
        <div className="mt-12 text-center">
          <Button asChild>
            <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  )
}
