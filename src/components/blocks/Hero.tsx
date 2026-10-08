import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import type { PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { Stars } from '~/components/primitives/Stars'
import { counter, ratings } from '~/content/en/data/home'
import { useSite } from '~/site'
import { HeroSlideshow } from './HeroSlideshow'
import { RatingCard } from './StatsBanner'

const slides = import.meta.glob<PictureSource>('../../assets/images/home/hero-slide-*.webp', {
  eager: true,
  import: 'default',
  query: '?w=480;720;1000&as=picture',
})

export interface HeroProps {
  /** Headline; `highlight` (default "#1") is rendered in orange. */
  title?: string
  highlight?: string
  lead?: string
  strong?: string
  /** Secondary (outlined) button; the main button is the site's "Request your sheet music" CTA. */
  ctaLabel?: string
  ctaHref?: string
  /** Rotate the studio photos (every 6 s, paused for reduced-motion users). */
  slideshow?: boolean
}

/**
 * Homepage hero: a two-column split on a soft gradient. Left, the Google rating chip, the headline with
 * its orange highlight, two lines of copy and two buttons; right, the studio photo slideshow in a
 * rounded frame with the floating Google rating card and the delivery counter. Stacks on phones.
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
  const site = useSite()
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, null]
  const google = ratings.find((r) => r.id === 'google')
  return (
    <section className="relative isolate overflow-hidden bg-surface" aria-labelledby="hero-title">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_0%_0%,rgb(26_127_151/0.10),transparent_60%),radial-gradient(50%_60%_at_100%_100%,rgb(244_153_70/0.14),transparent_60%)]"
      />
      <div className="container-wide grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16 lg:py-24">
        <div className="max-w-[600px]">
          {google ? (
            <a
              href={google.href}
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-pill border border-line bg-white py-1.5 pl-2 pr-4 text-small font-semibold text-ink shadow-card"
            >
              <Icon name="google" size={18} className="text-google" />
              <Stars rating={5} size={14} label={`${google.score} out of 5 stars`} />
              {google.score} on Google · {google.count} reviews
            </a>
          ) : null}
          <h1
            id="hero-title"
            className="mt-6 text-[38px] font-bold leading-[1.08] text-ink md:text-[48px] lg:text-display"
          >
            {before}
            {after !== null && <span className="text-accent-deep">{highlight}</span>}
            {after}
          </h1>
          <p className="mt-6 text-[17px] leading-relaxed text-charcoal md:text-[19px]">{lead}</p>
          <p className="mt-4 text-[17px] font-semibold leading-relaxed text-ink md:text-[18px]">
            {strong}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <SmartLink href={site.routes.contactAnchor}>{site.strings.requestCta}</SmartLink>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
            </Button>
          </div>
        </div>

        <div className="relative lg:pb-12 lg:pl-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-panel shadow-float lg:aspect-[5/4]">
            <HeroSlideshow
              slides={Object.values(slides)}
              sizes="(min-width: 1025px) 640px, (min-width: 768px) 720px, 100vw"
              position="center"
              rotate={slideshow}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent"
            />
            <p className="absolute bottom-5 left-5 right-5 text-right text-white lg:bottom-6 lg:right-6">
              <span className="block text-[34px] font-bold leading-none tabular-nums tracking-tight">
                {counter.value.toLocaleString('en-US')}
              </span>
              <span className="mt-1 block text-small font-medium text-white/90">
                {counter.label}
              </span>
            </p>
          </div>
          {google ? (
            <div className="absolute -bottom-2 -left-2 z-10 hidden w-[240px] lg:block">
              <RatingCard source={google} compact />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
