import { counter, ratings, responseTime } from '@content/en/data/home'
import { Button } from '~/components/primitives/Button'
import type { PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { Stars } from '~/components/primitives/Stars'
import { useSite } from '~/site'
import { HeroSlideshow } from './HeroSlideshow'

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
 * Homepage hero on white: headline with its orange highlight, two lines of copy and two buttons beside the
 * studio photo slideshow, then a row of three trust facts (Google rating, transcriptions delivered,
 * response time) separated by hairlines. Stacks on phones. On load (CSS only, so it runs before hydration)
 * the copy rises in line by line and the photo frame wipes open; nothing moves for reduced motion.
 */
export function Hero({
  title = 'Your #1 sheet music transcription service online',
  highlight = '#1',
  lead = 'Get accurate and high-quality sheet music to learn a song, perform, register a composition, educate, or for any music tech application.',
  strong = 'Reliable digital notation services by professional transcribers and music editors.',
  ctaLabel = 'How it works',
  ctaHref = '#how-it-works',
  slideshow = true,
}: HeroProps) {
  const site = useSite()
  const [before, after] =
    highlight && title.includes(highlight) ? title.split(highlight) : [title, null]
  const google = ratings.find((r) => r.id === 'google')
  const facebook = ratings.find((r) => r.id === 'facebook')
  return (
    <section className="pb-14 pt-10 lg:pb-20 lg:pt-[72px]" aria-labelledby="hero-title">
      <div className="container-content">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h1
              id="hero-title"
              className="text-[38px] font-bold leading-[1.06] text-ink motion-safe:animate-appear md:text-[50px] lg:text-display"
            >
              {before}
              {after !== null && <span className="text-accent-deep">{highlight}</span>}
              {after}
            </h1>
            <p className="mt-5 max-w-[34em] text-[17px] leading-relaxed text-charcoal motion-safe:animate-appear motion-safe:[animation-delay:100ms] md:mt-6 md:text-[19px]">
              {lead}
            </p>
            <p className="mt-3.5 max-w-[34em] text-[17px] font-semibold leading-relaxed text-ink motion-safe:animate-appear motion-safe:[animation-delay:180ms]">
              {strong}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-appear motion-safe:[animation-delay:260ms]">
              <Button asChild>
                <SmartLink href={site.routes.contactAnchor}>{site.strings.requestCta}</SmartLink>
              </Button>
              <Button variant="outline" asChild>
                <SmartLink href={ctaHref}>{ctaLabel}</SmartLink>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-ui motion-safe:animate-unveil lg:aspect-[5/4]">
            <div className="absolute inset-0 motion-safe:animate-settle">
              <HeroSlideshow
                slides={Object.values(slides)}
                sizes="(min-width: 1025px) 580px, (min-width: 768px) 720px, 100vw"
                position="center"
                rotate={slideshow}
              />
            </div>
          </div>
        </div>
        <dl className="mt-10 grid border-t border-line motion-safe:animate-appear motion-safe:[animation-delay:420ms] md:grid-cols-3 lg:mt-14">
          {google ? (
            <div className="border-b border-line py-4 md:border-b-0 md:pr-6 md:pt-5">
              <dt className="sr-only">Rating</dt>
              <dd className="flex items-center gap-2 text-[20px] font-bold text-ink md:text-[22px]">
                <Stars rating={5} size={16} label={`${google.score} out of 5 stars`} />
                {google.score} on Google
              </dd>
              <dd className="text-[14px] text-muted">
                {google.countLabel}
                {facebook ? `, ${facebook.score} on Facebook too` : ''}
              </dd>
            </div>
          ) : null}
          <div className="border-b border-line py-4 md:border-b-0 md:border-l md:px-6 md:pt-5">
            <dt className="sr-only">Transcriptions</dt>
            <dd className="text-[20px] font-bold tabular-nums text-ink md:text-[22px]">
              {counter.value.toLocaleString('en-US')}
            </dd>
            <dd className="text-[14px] text-muted">{counter.label}</dd>
          </div>
          <div className="border-line py-4 md:border-l md:pl-6 md:pt-5">
            <dt className="sr-only">Response time</dt>
            <dd className="text-[20px] font-bold text-ink md:text-[22px]">{responseTime.value}</dd>
            <dd className="text-[14px] text-muted">{responseTime.label}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
