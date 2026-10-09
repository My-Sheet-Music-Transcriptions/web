import { Logo } from '~/components/layout/Logo'
import type { Slide } from '~/components/primitives/Carousel'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { Media } from '~/components/primitives/Media'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import { Slideshow } from '~/components/primitives/Slideshow'
import type { BrandLogo, MediaLabels, RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'
import { inlineMarkdown } from '~/lib/light-markdown'

export interface PageHeaderProps {
  /** The page's h1: the words people searched for. */
  title: string
  /** A short line above the title. */
  eyebrow?: string
  /** One line under the title (in bold after the lead on the homepage). */
  subtitle?: string
  /** A sentence or two under the title; **bold** and [links](/path) kept. */
  lead?: string
  /** The page's main action, under the copy. */
  cta?: Cta
  /** The compact rating card: pass `google` from content/<locale>/data/ratings. */
  rating?: RatingSource
  /** band: dark centred title band (default). split: copy beside pictures, on white. photo: the homepage. */
  variant?: 'band' | 'split' | 'photo'
  /** The picture beside the copy (split), or beside the rating card under the band (a service's icon). */
  image?: PictureSource
  /** Alt text of the picture; empty when decorative. */
  alt?: string
  /** Several pictures: a carousel beside the copy (split), the plain photos rotating behind it (photo). */
  images?: Slide[]
  /** The photos above the copy on phones (photo); `images` when left out. */
  mobileImages?: Slide[]
  /** A part of the title set in orange from desktop up (photo): "#1". */
  highlight?: string
  /** The brand lockup above the title (photo): `~/assets/images/brand/logo.svg` with its words. */
  logo?: BrandLogo
  /** The words of the carousel arrows: `media` from content/<locale>/data/labels (with `images`). */
  labels?: MediaLabels
  /** Anchor id. */
  id?: string
}

const eyebrowClass = 'text-small font-bold uppercase tracking-wide'

/**
 * The opening of every page, its h1 first. `band`: the dark centred title band with an orange rule, then the
 * instrument icon and the compact rating card when given (service pages). `split`: white, the copy and button
 * left, a picture or carousel right (landing pages). `photo`: the homepage, rotating studio photos behind the
 * copy, cut by a curve that leaves the copy on white (above it on phones), the brand lockup, the orange
 * highlight and the floating rating card.
 */
export function PageHeader(props: PageHeaderProps) {
  const { variant = 'band' } = props
  if (variant === 'photo') return <PhotoHeader {...props} />
  if (variant === 'split') return <SplitHeader {...props} />
  return <BandHeader {...props} />
}

function BandHeader({
  title,
  subtitle,
  eyebrow,
  lead,
  cta,
  rating,
  image,
  alt = '',
  id,
}: PageHeaderProps) {
  return (
    <header id={id}>
      <div className="bg-[#434343] px-4 pt-16 pb-20 text-center text-white">
        {eyebrow ? <p className={cn(eyebrowClass, 'text-accent-light')}>{eyebrow}</p> : null}
        <h1 className="mx-auto max-w-4xl text-[32px] font-bold leading-tight text-white md:text-display">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-3xl text-[18px] leading-relaxed">{subtitle}</p>
        ) : null}
        <span aria-hidden="true" className="mx-auto mt-6 block h-px w-[150px] bg-accent" />
        {lead ? (
          <p className="mx-auto mt-6 max-w-3xl text-[18px] leading-relaxed [&_a]:text-accent-light">
            {inlineMarkdown(lead)}
          </p>
        ) : null}
        {cta ? <CtaLink cta={cta} className="mt-8" /> : null}
      </div>
      {rating || image ? (
        <div className="container-content flex flex-wrap items-center justify-center gap-10 py-10">
          {image ? (
            <Picture image={image} alt={alt} sizes="180px" className="h-[180px] w-auto" />
          ) : null}
          {rating ? <CompactRating source={rating} /> : null}
        </div>
      ) : null}
    </header>
  )
}

function SplitHeader({
  title,
  subtitle,
  eyebrow,
  lead,
  cta,
  rating,
  image,
  alt = '',
  images,
  labels,
  id,
}: PageHeaderProps) {
  const several = !!images && images.length > 1
  return (
    <header id={id} className="bg-white">
      <div className="container-content grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2">
        <div className="flex flex-col items-start">
          {eyebrow ? <p className={cn(eyebrowClass, 'text-accent-deep')}>{eyebrow}</p> : null}
          <h1 className="text-[32px] font-bold leading-tight text-ink md:text-display">{title}</h1>
          {subtitle ? <p className="mt-4 text-[20px] font-bold text-ink">{subtitle}</p> : null}
          {lead ? (
            <p className="mt-5 text-[20px] leading-[30px] text-secondary">{inlineMarkdown(lead)}</p>
          ) : null}
          {cta ? <CtaLink cta={cta} className="mt-8" /> : null}
          {rating ? <CompactRating source={rating} className="mt-8" /> : null}
        </div>
        <Media
          image={image}
          alt={alt}
          images={images}
          labels={labels}
          label={title}
          priority
          sizes="(min-width: 1025px) 560px, 100vw"
          imageClassName={several ? 'aspect-[3/2]' : 'rounded-card object-cover'}
        />
      </div>
    </header>
  )
}

/**
 * The curve that cuts the photos beside the copy (photo, from desktop up), traced from the live site's slides:
 * one cubic in the 1600×806 frame they were cut for. As a mask sized and anchored like the photos (`cover`,
 * left), it meets the copy where the slides' own cut did, and any plain photo gets it.
 */
const photoCut = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="806"><path d="M976 0C935 78 831 483 459 806H1600V0Z"/></svg>',
)}")`

function PhotoHeader({
  title,
  highlight,
  lead,
  subtitle,
  cta,
  images = [],
  mobileImages,
  rating,
  logo,
  id,
}: PageHeaderProps) {
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, null]
  const photos = images.map((s) => s.image)
  return (
    <header id={id} className="relative">
      {/* Phones: the photos above the copy */}
      <div className="relative aspect-[390/261] overflow-hidden lg:hidden">
        <Slideshow slides={mobileImages?.map((s) => s.image) ?? photos} sizes="100vw" />
      </div>
      {/* From desktop up: the photos fill the whole header, cut by the curve that leaves the copy on white */}
      <div
        className="absolute inset-0 hidden overflow-hidden mask-cover mask-left mask-no-repeat lg:block"
        style={{ maskImage: photoCut, WebkitMaskImage: photoCut }}
      >
        <Slideshow slides={photos} sizes="100vw" position="left" />
      </div>
      <div className="relative">
        <div className="mx-auto flex max-w-[1440px] flex-col px-[14px] pt-[132px] pb-[77px] lg:min-h-[765px] lg:justify-center lg:px-[86px] lg:py-10">
          <div className="max-w-[459px]">
            {logo ? <Logo logo={logo} width={340} className="hidden lg:inline-flex" /> : null}
            <h1 className="text-[28px] font-bold leading-[1.4] text-ink lg:mt-5 lg:text-display lg:leading-[46px]">
              {before}
              {after !== null && <span className="lg:text-orange">{highlight}</span>}
              {after}
            </h1>
            {lead ? (
              <p className="mt-5 text-[20px] font-light leading-[30px] text-secondary lg:font-normal">
                {inlineMarkdown(lead)}
              </p>
            ) : null}
            {subtitle ? (
              <p className="mt-[14px] text-[20px] font-light leading-[30px] text-secondary lg:font-bold">
                {subtitle}
              </p>
            ) : null}
            {cta ? (
              <div className="mt-[34px] hidden lg:block">
                <CtaLink cta={cta} variant="primary" />
              </div>
            ) : null}
          </div>
        </div>
        {rating ? (
          <CompactRating
            source={rating}
            className="absolute right-[120px] bottom-[25px] z-20 hidden lg:block"
          />
        ) : null}
      </div>
    </header>
  )
}

/** The compact rating card every header variant shows. */
function CompactRating({ source, className }: { source: RatingSource; className?: string }) {
  return (
    <div className={cn('w-full max-w-[300px]', className)}>
      <RatingCard source={source} compact />
    </div>
  )
}
