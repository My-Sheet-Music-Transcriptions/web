import { Carousel, type Slide } from '~/components/primitives/Carousel'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import type { RatingSource } from '~/content/types'
import { cn } from '~/lib/cn'
import { inlineMarkdown } from '~/lib/light-markdown'

export interface PageHeaderProps {
  /** The page's h1: the words people searched for. */
  title: string
  /** One line under the title. */
  subtitle?: string
  /** A short line above the title. */
  eyebrow?: string
  /** A sentence or two under the title; **bold** and [links](/path) kept. */
  lead?: string
  /** The page's main action, under the copy. */
  cta?: Cta
  /** The compact rating card: pass `google` from content/<locale>/data/ratings. */
  rating?: RatingSource
  /** band: dark centred title band (default). split: copy left and pictures right, on white (landing pages). */
  variant?: 'band' | 'split'
  /** The picture beside the copy (split), or beside the rating card under the band (an instrument icon). */
  image?: PictureSource
  /** Alt text of the picture; empty when decorative. */
  alt?: string
  /** Two or more pictures beside the copy, as a carousel (split). */
  images?: Slide[]
  /** Background of the band. */
  tone?: 'grey' | 'navy'
  /** Anchor id. */
  id?: string
}

/**
 * The opening of every page but the homepage: its h1 with an optional eyebrow, subtitle, lead and button.
 * `band` is the dark centred title band (templates render it from meta.ts), with the rating card and an
 * icon under it when given; `split` sets the copy beside a picture or carousel, as landing pages open.
 */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  lead,
  cta,
  rating,
  variant = 'band',
  image,
  alt = '',
  images,
  tone = 'grey',
  id,
}: PageHeaderProps) {
  if (variant === 'split') {
    const slides = images ?? (image ? [{ image, alt }] : [])
    return (
      <header id={id} className="bg-white">
        <div className="container-content grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2">
          <div className="flex flex-col items-start">
            {eyebrow ? (
              <p className="text-small font-bold uppercase tracking-wide text-accent-deep">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-[32px] font-bold leading-tight text-ink md:text-display">
              {title}
            </h1>
            {subtitle ? <p className="mt-4 text-[20px] font-bold text-ink">{subtitle}</p> : null}
            {lead ? (
              <p className="mt-5 text-[20px] leading-[30px] text-secondary">
                {inlineMarkdown(lead)}
              </p>
            ) : null}
            {cta ? <CtaLink cta={cta} className="mt-8" /> : null}
            {rating ? (
              <div className="mt-8 w-full max-w-[300px]">
                <RatingCard source={rating} compact />
              </div>
            ) : null}
          </div>
          {slides.length > 1 ? (
            <Carousel
              slides={slides}
              label={title}
              sizes="(min-width: 1025px) 560px, 100vw"
              interval={6}
              imageClassName="aspect-[3/2]"
            />
          ) : slides[0] ? (
            <Picture
              image={slides[0].image}
              alt={slides[0].alt}
              priority
              sizes="(min-width: 1025px) 560px, 100vw"
              className="w-full rounded-card object-cover"
            />
          ) : null}
        </div>
      </header>
    )
  }
  return (
    <header id={id}>
      <div
        className={cn(
          'px-4 pb-20 pt-16 text-center text-white',
          tone === 'navy' ? 'bg-navy' : 'bg-[#434343]',
        )}
      >
        {eyebrow ? (
          <p className="text-small font-bold uppercase tracking-wide text-accent-light">
            {eyebrow}
          </p>
        ) : null}
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
          {rating ? (
            <div className="w-full max-w-[300px]">
              <RatingCard source={rating} compact />
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}
