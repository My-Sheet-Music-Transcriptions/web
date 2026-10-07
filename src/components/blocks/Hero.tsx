import heroOverlay from '~/assets/images/home/hero.png?w=800;1440;2200&as=picture'
import { Logo } from '~/components/layout/Logo'
import { Button } from '~/components/primitives/Button'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { ratings } from '~/content/en/data/home'
import { HeroSlideshow } from './HeroSlideshow'
import { RatingCard } from './StatsBanner'

const desktopSlides = import.meta.glob<PictureSource>(
  '../../assets/images/home/hero-slide-[0-9].webp',
  { eager: true, import: 'default', query: '?w=1000;1600;2000&as=picture' },
)
const mobileSlides = import.meta.glob<PictureSource>(
  '../../assets/images/home/hero-slide-mobile-*.webp',
  { eager: true, import: 'default', query: '?w=480;800&as=picture' },
)

export interface HeroProps {
  /** Headline; `highlight` (default "#1") is rendered in orange. */
  title?: string
  highlight?: string
  lead?: string
  strong?: string
  ctaLabel?: string
  ctaHref?: string
  /** Rotate the studio photos (every 6 s, paused for reduced-motion users). */
  slideshow?: boolean
}

/**
 * Homepage hero. Layers, back to front: a slow slideshow of studio photos, the staff-lines overlay
 * whose transparent diagonal reveals the photo on the right, then the copy column and the floating
 * Google rating card (desktop). On mobile the photo band sits above a dark copy panel.
 */
export function Hero({
  title = 'Your #1 sheet music transcription service online',
  highlight = '#1',
  lead = 'Get accurate and high-quality sheet music to learn a song, perform, register a composition, educate, or for any music tech application.',
  strong = 'Reliable digital notation services by professional transcribers and music editors.',
  ctaLabel = 'Learn more',
  ctaHref = '#how-it-works',
  slideshow = true,
}: HeroProps) {
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, null]
  const google = ratings.find((r) => r.id === 'google')
  return (
    <section className="relative" aria-labelledby="hero-title">
      {/* Mobile photo band */}
      <div className="relative h-[260px] overflow-hidden lg:hidden">
        <HeroSlideshow
          slides={Object.values(mobileSlides)}
          sizes="100vw"
          position="center"
          rotate={slideshow}
        />
      </div>
      {/* Desktop: photo slideshow + overlay fill the whole section */}
      <div className="absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
        <HeroSlideshow
          slides={Object.values(desktopSlides)}
          sizes="100vw"
          position="left"
          rotate={slideshow}
        />
        <Picture
          image={heroOverlay}
          alt=""
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          pictureClassName="contents"
        />
      </div>
      <div className="relative bg-[#3f3f3f] text-white lg:bg-transparent lg:text-ink">
        <div className="mx-auto flex max-w-[1440px] flex-col px-6 py-10 lg:min-h-[765px] lg:justify-center lg:px-[85px] lg:py-16">
          <div className="max-w-[440px]">
            <Logo width={340} className="hidden lg:inline-flex" />
            <h1
              id="hero-title"
              className="mt-0 text-[30px] font-bold leading-[1.15] text-white lg:mt-8 lg:text-display lg:text-ink"
            >
              {before}
              {after !== null && (
                <span className="text-accent-light lg:text-orange">{highlight}</span>
              )}
              {after}
            </h1>
            <p className="mt-6 text-[17px] leading-7 lg:text-[18px] lg:text-ink">{lead}</p>
            <p className="mt-4 text-[17px] font-bold leading-7 lg:text-[18px] lg:text-ink">
              {strong}
            </p>
            <div className="mt-8">
              <Button variant="primary" asChild>
                <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
              </Button>
            </div>
          </div>
        </div>
        {google && (
          <div className="absolute bottom-[-130px] right-[120px] z-20 hidden w-[300px] lg:block">
            <RatingCard source={google} compact />
          </div>
        )}
      </div>
    </section>
  )
}
