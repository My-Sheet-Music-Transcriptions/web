import { Logo } from '~/components/layout/Logo'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import type { PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import type { BrandLogo, RatingSource } from '~/content/types'
import { HeroSlideshow } from './HeroSlideshow'

export interface HeroProps {
  /** The headline (h1). */
  title: string
  /** A substring of the title set in orange on desktop ("#1"). */
  highlight?: string
  /** The sentence under the headline. */
  lead: string
  /** The bold second line (desktop). */
  strong: string
  /** The second line on phones, where the live site words it differently and sets it in regular weight. */
  strongMobile?: string
  /** The button under the copy (desktop). */
  cta: Cta
  /** The studio photos behind the copy on desktop, in rotation order; from the page folder. */
  images: PictureSource[]
  /** The photos of the band above the copy on phones; the desktop ones when left out. */
  mobileImages?: PictureSource[]
  /** Rotate the photos (every 6 s, paused for reduced-motion users). */
  slideshow?: boolean
  /** The floating rating card (desktop): pass `google` from content/<locale>/data/ratings. */
  rating?: RatingSource
  /** The brand lockup above the headline (desktop): `~/assets/images/brand/logo.svg` with its words. */
  logo?: BrandLogo
}

/**
 * The brand's opening (the homepage). Desktop: a slow slideshow of studio photos (each cut with the white diagonal that holds
 * the copy), the copy column and the floating Google rating card. Mobile: the photo band above the copy
 * on white, without the button or the card, as on the live site.
 */
export function Hero({
  title,
  highlight,
  lead,
  strong,
  strongMobile,
  cta,
  images,
  mobileImages,
  slideshow = true,
  rating,
  logo,
}: HeroProps) {
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, null]
  return (
    <section className="relative" aria-labelledby="hero-title">
      {/* Mobile photo band */}
      <div className="relative aspect-[390/261] overflow-hidden lg:hidden">
        <HeroSlideshow
          slides={mobileImages ?? images}
          sizes="100vw"
          position="center"
          rotate={slideshow}
        />
      </div>
      {/* Desktop: the photo slideshow fills the whole section */}
      <div className="absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
        <HeroSlideshow slides={images} sizes="100vw" position="left" rotate={slideshow} />
      </div>
      <div className="relative">
        <div className="mx-auto flex max-w-[1440px] flex-col px-[14px] pt-[132px] pb-[77px] lg:min-h-[765px] lg:justify-center lg:px-[86px] lg:py-10">
          <div className="max-w-[459px]">
            {logo ? <Logo logo={logo} width={340} className="hidden lg:inline-flex" /> : null}
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
              {strongMobile ?? strong}
            </p>
            <p className="mt-[14px] hidden text-[20px] font-bold leading-[30px] text-secondary lg:block">
              {strong}
            </p>
            <div className="mt-[34px] hidden lg:block">
              <CtaLink cta={cta} variant="primary" />
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
