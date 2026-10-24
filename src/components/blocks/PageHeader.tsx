import type { ReactNode } from 'react'
import { Logo } from '~/components/layout/Logo'
import type { Slide } from '~/components/primitives/Carousel'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { Icon } from '~/components/primitives/Icon'
import { Media } from '~/components/primitives/Media'
import { Parallax } from '~/components/primitives/Parallax'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import { Slideshow } from '~/components/primitives/Slideshow'
import { tones } from '~/components/primitives/tones'
import { WaveDivider } from '~/components/primitives/WaveDivider'
import type { BrandLogo, MediaLabels, RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'
import { shortDate } from '~/lib/dates'
import { inlineMarkdown } from '~/lib/light-markdown'
import { useLocale } from '~/site'

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
  /** More buttons beside the `cta`, in its style (photo, split): the Catalan homepage's two ways in. */
  links?: Cta[]
  /** Controls under the copy (split), before the buttons: a product's price and add-to-cart (`<AddToCart sku=… />`). */
  actions?: ReactNode
  /** The compact rating card: pass `google` from content/<locale>/data/ratings. */
  rating?: RatingSource
  /** band: light centred title band (default). split: copy beside pictures, on white. photo: the homepage. cover: the title in white over a darkened photo (the blog, a post). */
  variant?: 'band' | 'split' | 'photo' | 'cover'
  /** The date under the title (cover: a post's publication date), YYYY-MM-DD; written as the locale writes dates. */
  date?: string
  /** The picture beside the copy (split), or the icon on the band's lower edge (a service's icon). */
  image?: PictureSource
  /** Alt text of the picture; empty when decorative. */
  alt?: string
  /** Several pictures: a carousel beside the copy (split), the plain photos rotating behind it (photo). */
  images?: Slide[]
  /** The carousel's frame (split): `wide`, 3:2 and cropped (default), or `square`, a gallery: each picture whole
   * on a cream card, with thumbnails (a shop product). */
  frame?: 'wide' | 'square'
  /** The photo faded behind the copy on phones (photo): the locale's `heroPhone` (content/<locale>/data/brand.ts),
   * never chosen per page; the first of `images` when left out. */
  mobileImage?: PictureSource
  /** A part of the title set in orange (photo): "#1". */
  highlight?: string
  /** The brand lockup above the title (photo), or in its place (band, cover: the h1 is then for screen readers only): `~/assets/images/brand/logo-en.svg` with its words. */
  logo?: BrandLogo
  /** The words of the carousel arrows: `media` from content/<locale>/data/labels (with `images`). */
  labels?: MediaLabels
  /** Anchor id. */
  id?: string
}

const eyebrowClass = 'label-caps'

/**
 * The opening of every page, its h1 first. `band`: the centred title and orange rule, on white, or on cream
 * with the service's icon on its edge, the rating card at the right. `split`: the copy left, a picture or
 * carousel right (landing pages). `photo`: the homepage, rotating photos behind the copy, cut by a curve, the
 * lockup, the orange highlight and the rating card. `cover`: the title and the date or lead in white, rising in
 * over a darkened photo that lags on scroll (the blog, a post).
 */
export function PageHeader(props: PageHeaderProps) {
  // The pictures stand still as the page opens; only the rating card, and a cover's copy over its photo, rise
  // into place a beat later. The homepage's photos and a cover's photo lag behind the header as the page
  // scrolls (Parallax). CSS (`entrance` and `parallax` in theme.css), never `reveal`, which would hide the
  // header, the page's largest paint, until the JavaScript loads.
  const { variant = 'band' } = props
  if (variant === 'photo') return <PhotoHeader {...props} />
  if (variant === 'split') return <SplitHeader {...props} />
  if (variant === 'cover') return <CoverHeader {...props} />
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
  logo,
  id,
}: PageHeaderProps) {
  return (
    <header id={id} className="relative">
      {/* A service page's band is a light cream (its icon on the lower edge), every other page's is white */}
      <div
        className={cn(
          'flow-root px-4 pt-section-lg text-center',
          image ? tones.cream : 'bg-white pb-section-lg',
        )}
      >
        {eyebrow ? <p className={cn(eyebrowClass, 'mb-3 text-accent-deep')}>{eyebrow}</p> : null}
        {logo ? (
          <img
            src={logo.image}
            alt={logo.alt}
            width={900}
            height={364}
            className="mx-auto h-auto w-full max-w-narrow"
          />
        ) : null}
        <h1 className={cn('mx-auto max-w-narrow text-display text-ink', logo && 'sr-only')}>
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-narrow text-lead text-ink">{subtitle}</p>
        ) : null}
        {logo ? null : <span aria-hidden="true" className="heading-rule mx-auto" />}
        {lead ? (
          <p className="mx-auto mt-4 max-w-prose text-lead text-ink">{inlineMarkdown(lead)}</p>
        ) : null}
        {cta ? <CtaLink cta={cta} size="lg" className="mt-8" /> : null}
        {/* The icon straddles the band's lower edge: the band stops 48px above the icon's foot, and the empty
            div after the band keeps that room. The band is a flow root so the negative margin stays inside it
            (collapsed through the band's edge, it pulled the spacer up instead and the band reached the icon's
            foot), and it sits on the <picture>, made a block, where it counts */}
        {image ? (
          <Picture
            image={image}
            alt={alt}
            sizes="144px"
            pictureClassName="relative mx-auto mt-10 -mb-12 block w-fit"
            className="h-36 w-auto"
          />
        ) : null}
      </div>
      {image ? <div aria-hidden="true" className="h-12" /> : null}
      {rating ? (
        <CompactRating
          source={rating}
          className="entrance mx-auto mt-8 px-4 lg:absolute lg:top-50 lg:right-1 lg:mt-0 lg:w-75 lg:px-0"
        />
      ) : null}
    </header>
  )
}

function CoverHeader({
  title,
  eyebrow,
  lead,
  date,
  cta,
  image,
  alt = '',
  logo,
  id,
}: PageHeaderProps) {
  const locale = useLocale()
  return (
    <header
      id={id}
      className={cn(
        'relative isolate flex items-center overflow-hidden bg-footer px-4 py-20 text-center text-white',
        // biome-ignore lint/plugin/off-scale: the blog's cover grows with the screen (57vw between 480 and 820px) so its photo shows whole
        logo ? 'min-h-90 md:min-h-[clamp(480px,57vw,820px)]' : 'min-h-70 md:min-h-85',
      )}
    >
      {image ? (
        <Parallax className="absolute inset-0 -z-10">
          <Picture
            image={image}
            alt={alt}
            sizes="100vw"
            priority
            className="absolute inset-0 h-full w-full object-cover"
            pictureClassName="contents"
          />
        </Parallax>
      ) : null}
      <span
        aria-hidden="true"
        className={cn('absolute inset-0 -z-10', logo ? 'bg-footer/35' : 'bg-footer/65')}
      />
      <div className="entrance mx-auto flex max-w-narrow flex-col items-center gap-4">
        {eyebrow ? <p className={cn(eyebrowClass, 'text-accent')}>{eyebrow}</p> : null}
        {logo ? (
          <img
            src={logo.image}
            alt={logo.alt}
            width={664}
            height={268}
            className="h-auto w-4/5 max-w-166"
          />
        ) : null}
        {/* No rule over a photo, as on the live site's covers and the photo bands (BlockShell) */}
        <h1 className={cn('text-display text-white', logo && 'sr-only')}>{title}</h1>
        {date ? (
          <p className="flex items-center gap-2 text-small">
            <Icon name="calendar" size={16} aria-hidden="true" className="text-accent" />
            <time dateTime={date}>{shortDate(date, locale)}</time>
          </p>
        ) : null}
        {lead ? <p className="max-w-prose text-lead">{inlineMarkdown(lead)}</p> : null}
        {cta ? <CtaLink cta={cta} className="mt-2" /> : null}
      </div>
      <WaveDivider position="bottom" height={30} />
    </header>
  )
}

function SplitHeader({
  title,
  subtitle,
  eyebrow,
  lead,
  cta,
  links,
  actions,
  rating,
  image,
  alt = '',
  images,
  frame = 'wide',
  labels,
  id,
}: PageHeaderProps) {
  const several = !!images && images.length > 1
  return (
    <header id={id} className="bg-white">
      <div className="container-content grid items-center gap-10 py-section lg:grid-cols-2">
        <div className="flex flex-col items-start">
          {eyebrow ? <p className={cn(eyebrowClass, 'mb-3 text-accent-deep')}>{eyebrow}</p> : null}
          <h1 className="text-display text-ink">{title}</h1>
          {subtitle ? <p className="mt-4 text-lead font-bold text-ink">{subtitle}</p> : null}
          {lead ? <p className="mt-4 text-lead text-ink">{inlineMarkdown(lead)}</p> : null}
          {actions ? <div className="mt-8">{actions}</div> : null}
          {cta || links?.length ? <Actions cta={cta} links={links} className="mt-8" /> : null}
          {rating ? <CompactRating source={rating} className="entrance mt-8" /> : null}
        </div>
        <Media
          image={image}
          alt={alt}
          images={images}
          layout={frame === 'square' ? 'gallery' : 'carousel'}
          labels={labels}
          label={title}
          priority
          sizes="(min-width: 1025px) 560px, 100vw"
          imageClassName={
            several
              ? frame === 'square'
                ? undefined
                : 'aspect-[3/2]'
              : 'rounded-card object-cover'
          }
        />
      </div>
    </header>
  )
}

/**
 * The curve that cuts the photos beside the copy (photo, from desktop up), traced from the live site's slides:
 * one cubic in the 1600×806 frame they were cut for. As a mask sized and anchored as that frame (`cover`, left),
 * it meets the copy where the slides' own cut did, and any plain photo gets it. The photos under it stay
 * centred, so a narrow desktop crops both sides of the photo rather than its right, where the subject is.
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
  links,
  images = [],
  mobileImage,
  rating,
  logo,
  id,
}: PageHeaderProps) {
  const backdrop = mobileImage ?? images[0]?.image
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, null]
  const photos = images.map((s) => s.image)
  return (
    <header id={id} className="relative">
      {/* Phones: one photo faded behind the lockup, the copy and the buttons, a wave under it */}
      <div className="absolute inset-0 overflow-hidden md:hidden">
        {backdrop ? (
          <Picture
            image={backdrop}
            alt=""
            sizes="100vw"
            priority
            className="h-full w-full object-cover opacity-10"
            pictureClassName="absolute inset-0"
          />
        ) : null}
        <WaveDivider position="bottom" height={25} />
      </div>
      {/* From tablets up: the photos fill the whole header, cut by the curve that leaves the copy on white. The
          curve stays put and the photos lag behind it as the page scrolls.
          The header's height, padding, copy width and logo scale with the viewport between 768 and 1440 (the
          frame the curve was traced in, where every clamp lands on its design pixel), so the curve keeps the
          same proportions on a tablet or a laptop: the one place the site measures in vw */}
      <div
        className="absolute inset-0 hidden overflow-hidden mask-cover mask-left mask-no-repeat md:block"
        style={{ maskImage: photoCut, WebkitMaskImage: photoCut }}
      >
        <Parallax className="absolute inset-0">
          <Slideshow slides={photos} sizes="100vw" />
        </Parallax>
      </div>
      <div className="relative">
        <div
          className={cn(
            'container-page flex min-h-svh flex-col justify-center pt-30 pb-36 md:py-10 md:justify-center',
            // biome-ignore lint/plugin/off-scale: the header's height and side padding follow the curve's frame (768→1440)
            'md:min-h-[clamp(520px,53.2vw,765px)] md:px-[clamp(24px,6.05vw,86px)]',
          )}
        >
          {/* biome-ignore lint/plugin/off-scale: the copy's column ends where the curve begins (459px at 1440) */}
          <div className="max-w-115 md:max-w-[clamp(300px,32vw,459px)]">
            {logo ? (
              <Logo
                logo={logo}
                width={340}
                // biome-ignore lint/plugin/off-scale: the lockup's width follows the curve's frame (340px at 1440)
                className="inline-flex w-full max-w-85 md:w-[clamp(220px,23.7vw,340px)] [&>img]:h-auto [&>img]:w-full"
              />
            ) : null}
            <h1 className="mt-8 text-display text-ink md:mt-5">
              {before}
              {after !== null && <span className="text-accent-deep">{highlight}</span>}
              {after}
            </h1>
            {lead ? <p className="mt-4 text-lead text-ink">{inlineMarkdown(lead)}</p> : null}
            {subtitle ? <p className="mt-4 text-lead font-bold text-ink">{subtitle}</p> : null}
            {cta || links?.length ? (
              <Actions
                cta={cta}
                links={links}
                className="mt-8 flex-col items-start md:flex-row md:items-center"
              />
            ) : null}
          </div>
        </div>
        {rating ? (
          // biome-ignore lint/plugin/off-scale: the rating card sits in the curve's frame (120px from the right, 300px wide at 1440)
          <div className="entrance absolute right-[clamp(24px,8.4vw,120px)] bottom-6 z-20 hidden w-[clamp(240px,20.9vw,300px)] md:block">
            <CompactRating source={rating} />
          </div>
        ) : null}
      </div>
    </header>
  )
}

/** The header's buttons: the `cta`, then the `links` beside it, all filled (one colour for every header, in every language). */
function Actions({
  cta,
  links = [],
  className,
}: Pick<PageHeaderProps, 'cta' | 'links'> & { className?: string }) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {cta ? <CtaLink cta={cta} size="lg" /> : null}
      {links.map((l) => (
        <CtaLink key={l.href} cta={l} size="lg" />
      ))}
    </div>
  )
}

/** The compact rating card every header variant shows. */
function CompactRating({ source, className }: { source: RatingSource; className?: string }) {
  return (
    <div className={cn('w-full max-w-75', className)}>
      <RatingCard source={source} compact />
    </div>
  )
}
