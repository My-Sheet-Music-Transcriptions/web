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
  eyebrow?: string
  /** Rich text (MDX children) shown next to the photo carousel. */
  children?: ReactNode
  ctaLabel?: string
  ctaHref?: string
}

/** "Who are we?": office photo carousel beside the left-aligned team introduction. */
export function AboutTeaser({
  title = 'Who are we?',
  eyebrow = 'The team',
  children,
  ctaLabel = 'Read more about us',
  ctaHref = '/about-us',
}: AboutTeaserProps) {
  const [i, setI] = useState(0)
  const go = (d: number) => setI((v) => (v + d + slides.length) % slides.length)
  const current = slides[i]
  return (
    <section className="py-section lg:py-section-lg" aria-labelledby="about-title">
      <div className="container-content grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <section className="relative" aria-roledescription="carousel" aria-label="Office photos">
          <div aria-live="polite" className="overflow-hidden rounded-panel shadow-card">
            {current ? (
              <Picture
                image={current.img}
                alt={current.alt}
                sizes="(min-width: 1025px) 560px, 100vw"
                className="aspect-[3/2] w-full object-cover"
              />
            ) : null}
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-white/90 text-ink shadow-card backdrop-blur hover:bg-white"
            >
              <Icon name="chevron-left" size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill bg-white/90 text-ink shadow-card backdrop-blur hover:bg-white"
            >
              <Icon name="chevron-right" size={20} />
            </button>
          </div>
          <p className="sr-only">
            Photo {i + 1} of {slides.length}
          </p>
        </section>
        <div>
          <SectionHeading id="about-title" eyebrow={eyebrow} rule="none" align="left">
            {title}
          </SectionHeading>
          <div className="mt-6 space-y-4 text-body leading-relaxed text-charcoal [&_p]:my-0 [&_strong]:font-bold [&_strong]:text-ink [&_p+p]:mt-4">
            {children}
          </div>
          <div className="mt-8">
            <Button variant="outline" asChild>
              <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
