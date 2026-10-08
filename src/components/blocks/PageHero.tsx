import { cn } from '~/lib/cn'

export interface PageHeroProps {
  title: string
  subtitle?: string
  eyebrow?: string
  /** `navy` (default): brand navy band. `grey`: the near-black ink band for artist and legal pages. */
  tone?: 'grey' | 'navy'
}

/** Page header used by every non-home template: eyebrow, title and optional subtitle on a full-bleed dark band. */
export function PageHero({ title, subtitle, eyebrow, tone = 'navy' }: PageHeroProps) {
  return (
    <header className={cn('py-14 text-white md:py-20', tone === 'navy' ? 'bg-navy' : 'bg-ink')}>
      <div className="container-content">
        {eyebrow ? <p className="eyebrow text-accent-light">{eyebrow}</p> : null}
        <h1 className="mt-3.5 max-w-4xl text-[34px] font-bold leading-[1.08] text-white md:text-display">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/85 md:text-[19px]">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  )
}
