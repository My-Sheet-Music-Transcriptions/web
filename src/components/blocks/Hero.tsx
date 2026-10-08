import { Logo } from '~/components/layout/Logo'
import { Button } from '~/components/primitives/Button'
import type { PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { RatingSource } from '~/content/types'
import { HeroSlideshow } from './HeroSlideshow'

const desktopSlides = import.meta.glob<PictureSource>(
  '../../assets/images/hero/hero-slide-[0-9].webp',
  { eager: true, import: 'default', query: '?w=1000;1600;2000&as=picture' },
)
/** The live site's rotation order. */
const desktopOrder = [1, 6, 2, 4, 3, 5].map(
  (n) => desktopSlides[`../../assets/images/hero/hero-slide-${n}.webp`] as PictureSource,
)
const mobileSlides = import.meta.glob<PictureSource>(
  '../../assets/images/hero/hero-slide-mobile-*.webp',
  { eager: true, import: 'default', query: '?w=480;800&as=picture' },
)

export interface HeroProps {
  /** Headline; `highlight` (default "#1") is rendered in orange. */
  title?: string
  highlight?: string
  lead?: string
  strong?: string
  /** The second line on phones, where the live site words it differently and sets it in regular weight. */
  strongMobile?: string
  ctaLabel?: string
  ctaHref?: string
  /** Rotate the studio photos (every 6 s, paused for reduced-motion users). */
  slideshow?: boolean
  /** The floating rating card (desktop): pass `google` from content/<locale>/data/ratings. */
  rating?: RatingSource
}

/**
 * The brand's opening (the homepage). Desktop: a slow slideshow of studio photos (each cut with the white diagonal that holds
 * the copy), the copy column and the floating Google rating card. Mobile: the photo band above the copy
 * on white, without the button or the card, as on the live site.
 */
export function Hero({
  title = 'Your #1 sheet music transcription service online',
  highlight = '#1',
  lead = 'Get accurate and high-quality sheet music to learn a song, perform, register a composition, educate, or for any music tech application.',
  strong = 'Reliable digital notation services by professional transcribers and music editors.',
  strongMobile = 'Reliable, manual digital notation services by professional transcribers and music editors.',
  ctaLabel = 'Learn more',
  ctaHref = '#how-it-works',
  slideshow = true,
  rating,
}: HeroProps) {
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, null]
  return (
    <section className="relative" aria-labelledby="hero-title">
      {/* Mobile photo band */}
      <div className="relative aspect-[390/261] overflow-hidden lg:hidden">
        <HeroSlideshow
          slides={Object.values(mobileSlides)}
          sizes="100vw"
          position="center"
          rotate={slideshow}
        />
      </div>
      {/* Desktop: the photo slideshow fills the whole section */}
      <div className="absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
        <HeroSlideshow slides={desktopOrder} sizes="100vw" position="left" rotate={slideshow} />
      </div>
      <div className="relative">
        <div className="mx-auto flex max-w-[1440px] flex-col px-[14px] pt-[132px] pb-[77px] lg:min-h-[765px] lg:justify-center lg:px-[86px] lg:py-10">
          <div className="max-w-[459px]">
            <Logo width={340} className="hidden lg:inline-flex" />
            <h1
              id="hero-title"
              className="text-[28px] font-bold leading-[1.4] text-ink lg:mt-5 lg:text-display lg:leading-[46px]"
            >
              {before}
              {after !== null && <span className="lg:text-orange">{highlight}</span>}
              {after}
            </h1>
            <p className="mt-5 text-[20px] font-light leading-[30px] text-secondary lg:font-normal">
              {lead}
            </p>
            <p className="mt-[14px] text-[20px] font-light leading-[30px] text-secondary lg:hidden">
              {strongMobile}
            </p>
            <p className="mt-[14px] hidden text-[20px] font-bold leading-[30px] text-secondary lg:block">
              {strong}
            </p>
            <div className="mt-[34px] hidden lg:block">
              <Button variant="primary" asChild>
                <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
              </Button>
            </div>
          </div>
        </div>
        {rating && (
          <div className="absolute bottom-[25px] right-[120px] z-20 hidden w-[300px] lg:block">
            <RatingCard source={rating} compact />
          </div>
        )}
      </div>
    </section>
  )
}
