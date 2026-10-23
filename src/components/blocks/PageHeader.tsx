import { Logo } from '~/components/layout/Logo'
import type { Slide } from '~/components/primitives/Carousel'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { Icon } from '~/components/primitives/Icon'
import { Media } from '~/components/primitives/Media'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import { Slideshow } from '~/components/primitives/Slideshow'
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
  /** The colour of the photo header's buttons: primary (teal-blue, the default) or accent (orange, the Catalan homepage). */
  ctaVariant?: 'primary' | 'accent'
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
  /** The carousel's frame (split): `wide`, 3:2 and cropped (default), or `square`, each picture whole (a shop
   * product's gallery). */
  frame?: 'wide' | 'square'
  /** The photo faded behind the copy on phones (photo): the locale's `heroPhone` (content/<locale>/data/brand.ts),
   * never chosen per page; the first of `images` when left out. */
  mobileImage?: PictureSource
  /** A part of the title set in orange (photo): "#1". */
  highlight?: string
  /** The brand lockup above the title (photo), or in its place (band, cover: the h1 is then for screen readers only): `~/assets/images/brand/logo.svg` with its words. */
  logo?: BrandLogo
  /** The words of the carousel arrows: `media` from content/<locale>/data/labels (with `images`). */
  labels?: MediaLabels
  /** Anchor id. */
  id?: string
}

const eyebrowClass = 'text-small font-bold uppercase tracking-wide'

/**
 * The opening of every page, its h1 first. `band`: the centred title and orange rule, on white, or on an orange
 * tint with the service's icon on its edge, the rating card at the right. `split`: the copy
 * left, a picture or carousel right (landing pages). `photo`: the homepage, rotating photos behind the copy,
 * cut by a curve, the lockup, the orange highlight and the rating card. `cover`: the title and the date or lead in
 * white over a darkened photo (the blog, a post).
 */
export function PageHeader(props: PageHeaderProps) {
  // The text and pictures stand still; as the page opens only the rating card rises into place, a beat later,
  // and the homepage's photos lag behind their curve as the page scrolls. CSS (`entrance` and
  // `parallax` in theme.css), never `reveal`, which would hide the header, the page's largest paint, until
  // the JavaScript loads.
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
      {/* A service page's band is tinted orange (the live site's 11% accent), every other page's is white */}
      <div
        className={cn(
          'px-4 pt-[110px] text-center',
          image
            ? 'bg-accent/11 [--color-primary:var(--color-primary-deep)] [--color-accent-deep:var(--color-accent-hover)]'
            : 'bg-white pb-[110px]',
        )}
      >
        {eyebrow ? <p className={cn(eyebrowClass, 'text-accent-deep')}>{eyebrow}</p> : null}
        {logo ? (
          <img
            src={logo.image}
            alt={logo.alt}
            width={900}
            height={364}
            className="mx-auto h-auto w-[min(900px,100%)]"
          />
        ) : null}
        <h1
          className={cn(
            'mx-auto max-w-[900px] text-[36px] leading-tight font-bold text-ink',
            logo && 'sr-only',
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-[900px] text-[20px] leading-[30px] text-ink">
            {subtitle}
          </p>
        ) : null}
        {logo ? null : (
          <span aria-hidden="true" className="mx-auto mt-5 block h-px w-[180px] bg-accent" />
        )}
        {lead ? (
          <p className="mx-auto mt-6 max-w-3xl text-[18px] leading-relaxed text-ink">
            {inlineMarkdown(lead)}
          </p>
        ) : null}
        {cta ? <CtaLink cta={cta} className="mt-8" /> : null}
        {/* The icon straddles the band's lower edge: the band stops 53px above the icon's foot, and the empty
            div after the band keeps that room */}
        {image ? (
          <Picture
            image={image}
            alt={alt}
            sizes="155px"
            className="relative mx-auto mt-[46px] -mb-[53px] block h-[155px] w-auto md:h-[135px]"
          />
        ) : null}
      </div>
      {image ? <div aria-hidden="true" className="h-[53px]" /> : null}
      {rating ? (
        <CompactRating
          source={rating}
          className="entrance mx-auto mt-8 px-4 lg:absolute lg:top-[200px] lg:right-[5px] lg:mt-0 lg:w-[300px] lg:px-0"
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
        logo
          ? 'min-h-[360px] md:min-h-[clamp(480px,57vw,820px)]'
          : 'min-h-[280px] md:min-h-[340px]',
      )}
    >
      {image ? (
        <Picture
          image={image}
          alt={alt}
          sizes="100vw"
          priority
          className="absolute inset-0 -z-10 h-full w-full object-cover"
          pictureClassName="contents"
        />
      ) : null}
      <span
        aria-hidden="true"
        className={cn('absolute inset-0 -z-10', logo ? 'bg-footer/35' : 'bg-footer/65')}
      />
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4">
        {eyebrow ? <p className={cn(eyebrowClass, 'text-accent-light')}>{eyebrow}</p> : null}
        {logo ? (
          <img
            src={logo.image}
            alt={logo.alt}
            width={664}
            height={268}
            className="h-auto w-[min(664px,80vw)]"
          />
        ) : null}
        <h1
          className={cn(
            'text-[32px] leading-tight font-bold text-white md:text-[40px]',
            logo && 'sr-only',
          )}
        >
          {title}
        </h1>
        {logo ? null : <span aria-hidden="true" className="block h-px w-[120px] bg-accent" />}
        {date ? (
          <p className="flex items-center gap-2 text-small">
            <Icon name="calendar" size={16} aria-hidden="true" className="text-accent-light" />
            <time dateTime={date}>{shortDate(date, locale)}</time>
          </p>
        ) : null}
        {lead ? (
          <p className="max-w-3xl text-[17px] leading-relaxed">{inlineMarkdown(lead)}</p>
        ) : null}
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
      <div className="container-content grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2">
        <div className="flex flex-col items-start">
          {eyebrow ? <p className={cn(eyebrowClass, 'text-accent-deep')}>{eyebrow}</p> : null}
          <h1 className="text-[32px] font-bold leading-tight text-ink md:text-display">{title}</h1>
          {subtitle ? <p className="mt-4 text-[20px] font-bold text-ink">{subtitle}</p> : null}
          {lead ? (
            <p className="mt-5 text-[20px] leading-[30px] text-secondary">{inlineMarkdown(lead)}</p>
          ) : null}
          {cta || links?.length ? <Actions cta={cta} links={links} className="mt-8" /> : null}
          {rating ? <CompactRating source={rating} className="entrance mt-8" /> : null}
        </div>
        <Media
          image={image}
          alt={alt}
          images={images}
          labels={labels}
          label={title}
          priority
          sizes="(min-width: 1025px) 560px, 100vw"
          imageClassName={
            several
              ? frame === 'square'
                ? 'aspect-square bg-white object-contain'
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
  ctaVariant = 'primary',
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
          The header's height, padding, copy width, type and logo all scale with the viewport between 768 and
          1440 (the live site's design width, where every clamp lands on its design pixel), so the curve keeps
          the same proportions on a tablet or a laptop */}
      <div
        className="absolute inset-0 hidden overflow-hidden mask-cover mask-left mask-no-repeat md:block"
        style={{ maskImage: photoCut, WebkitMaskImage: photoCut }}
      >
        <div className="parallax absolute inset-0">
          <Slideshow slides={photos} sizes="100vw" />
        </div>
      </div>
      <div className="relative">
        <div
          className={cn(
            'mx-auto flex max-w-[1440px] flex-col px-[14px] md:min-h-[clamp(520px,53.2vw,765px)] md:justify-center md:px-[clamp(24px,6.05vw,86px)] md:py-10',
            'min-h-[100svh] justify-center px-5 pt-[120px] pb-[140px] md:pt-10 md:pb-10',
          )}
        >
          <div className="max-w-[459px] md:max-w-[clamp(300px,32vw,459px)]">
            {logo ? (
              <Logo
                logo={logo}
                width={340}
                className="inline-flex w-full max-w-[340px] md:w-[clamp(220px,23.7vw,340px)] [&>img]:h-auto [&>img]:w-full"
              />
            ) : null}
            <h1 className="mt-8 text-[28px] font-bold leading-[1.4] text-ink md:mt-5 md:text-[clamp(28px,2.8vw,40px)] md:leading-[1.15]">
              {before}
              {after !== null && <span className="text-orange">{highlight}</span>}
              {after}
            </h1>
            {lead ? (
              <p className="mt-5 text-[20px] font-light leading-[30px] text-secondary md:text-[clamp(16px,1.4vw,20px)] md:font-normal md:leading-normal">
                {inlineMarkdown(lead)}
              </p>
            ) : null}
            {subtitle ? (
              <p className="mt-[14px] text-[20px] font-light leading-[30px] text-secondary md:text-[clamp(16px,1.4vw,20px)] md:font-bold md:leading-normal">
                {subtitle}
              </p>
            ) : null}
            {cta || links?.length ? (
              <Actions
                cta={cta}
                links={links}
                variant={ctaVariant}
                className="mt-[34px] flex-col items-start md:flex-row md:items-center"
              />
            ) : null}
          </div>
        </div>
        {rating ? (
          <div className="entrance absolute right-[clamp(24px,8.4vw,120px)] bottom-[25px] z-20 hidden w-[clamp(240px,20.9vw,300px)] md:block">
            <CompactRating source={rating} />
          </div>
        ) : null}
      </div>
    </header>
  )
}

/** The header's buttons: the `cta`, then the `links` beside it, all in one style. */
function Actions({
  cta,
  links = [],
  variant,
  className,
}: Pick<PageHeaderProps, 'cta' | 'links'> & {
  variant?: 'primary' | 'accent'
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-4', className)}>
      {cta ? <CtaLink cta={cta} variant={variant} /> : null}
      {links.map((l) => (
        <CtaLink key={l.href} cta={l} variant={variant} />
      ))}
    </div>
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
