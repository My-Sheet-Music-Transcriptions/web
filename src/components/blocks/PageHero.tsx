import { cn } from '~/lib/cn'

export interface PageHeroProps {
  title: string
  subtitle?: string
  eyebrow?: string
  /** `navy` (default): brand navy gradient. `grey`: neutral dark slate for artist and legal pages. */
  tone?: 'grey' | 'navy'
}

/** Page header used by every non-home template: eyebrow, title and optional subtitle on a dark gradient. */
export function PageHero({ title, subtitle, eyebrow, tone = 'navy' }: PageHeroProps) {
  return (
    <header
      className={cn(
        'relative isolate overflow-hidden px-5 pb-16 pt-14 text-center text-white md:pb-20 md:pt-20',
        tone === 'navy'
          ? 'bg-[linear-gradient(135deg,var(--color-navy)_0%,var(--color-navy-deep)_100%)]'
          : 'bg-[linear-gradient(135deg,#1f2d36_0%,#12232d_100%)]',
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_80%_0%,rgb(33_158_188/0.25),transparent_60%),radial-gradient(40%_60%_at_10%_100%,rgb(244_153_70/0.18),transparent_60%)]"
      />
      <div className="container-content">
        {eyebrow ? <p className="eyebrow text-accent-light">{eyebrow}</p> : null}
        <h1 className="mx-auto mt-4 max-w-4xl text-[34px] font-bold leading-[1.08] text-white md:text-display">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-white/85 md:text-[19px]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  )
}
