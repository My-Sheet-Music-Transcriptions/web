import bg from '~/assets/images/home/stats-bg.jpg?w=900;1282&as=picture'
import { Reveal } from '~/components/motion/Reveal'
import { Picture } from '~/components/primitives/Picture'
import { Stars } from '~/components/primitives/Stars'
import { counter, ratings } from '~/content/en/data/home'
import type { RatingSource } from '~/content/types'

export interface StatsBannerProps {
  title?: string
  eyebrow?: string
  counterValue?: number
  counterLabel?: string
}

/** Full-bleed navy band over a dimmed piano photo: big counter and the three ratings in hairline columns. */
export function StatsBanner({
  title = 'The highest-rated online sheet music transcribers',
  eyebrow = 'Trusted since 2011',
  counterValue = counter.value,
  counterLabel = counter.label,
}: StatsBannerProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-navy py-section text-white lg:py-section-lg"
      aria-labelledby="stats-title"
    >
      <Picture
        image={bg}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_42%] opacity-[0.18]"
        pictureClassName="contents"
      />
      <div className="container-content grid items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow text-accent-light">{eyebrow}</p>
          <h2
            id="stats-title"
            className="mt-3.5 text-[28px] font-bold leading-[1.12] text-white md:text-[36px]"
          >
            {title}
          </h2>
          <p className="mt-7">
            <span className="block text-[56px] font-bold leading-none tabular-nums tracking-tight md:text-counter">
              {counterValue.toLocaleString('en-US')}
            </span>
            <span className="mt-2.5 block text-body text-white/80">{counterLabel}</span>
          </p>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-3 sm:gap-0">
          {ratings.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 0.06}>
              <Rating source={r} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** One rating: label, stars or count, count label and a link, set off by a hairline. */
export function Rating({ source }: { source: RatingSource }) {
  return (
    <div className="grid h-full content-start gap-2 border-t border-white/20 pt-4 sm:border-l sm:border-t-0 sm:px-6 sm:pt-1">
      <p className="text-[15px] font-bold">{source.label}</p>
      {source.score ? (
        <Stars rating={5} size={16} label={`${source.score} out of 5 stars`} />
      ) : (
        <p className="text-[30px] font-bold leading-none tabular-nums tracking-tight">
          {source.count}
        </p>
      )}
      <p className="text-[14px] text-white/75">{source.countLabel}</p>
      {source.href && source.linkLabel ? (
        <a
          href={source.href}
          rel="noopener"
          className="text-[14px] font-semibold underline underline-offset-[3px] hover:text-accent-light"
        >
          {source.linkLabel}
        </a>
      ) : null}
    </div>
  )
}
