import { cn } from '~/lib/cn'

export interface PageHeroProps {
  title: string
  subtitle?: string
  eyebrow?: string
  tone?: 'grey' | 'navy'
}

/** Dark page header used by every non-home template: title, optional subtitle, short orange rule. */
export function PageHero({ title, subtitle, eyebrow, tone = 'grey' }: PageHeroProps) {
  return (
    <header
      className={cn(
        'px-4 pb-20 pt-16 text-center text-white',
        tone === 'navy' ? 'bg-navy' : 'bg-[#434343]',
      )}
    >
      {eyebrow ? (
        <p className="text-small font-bold uppercase tracking-wide text-accent-light">{eyebrow}</p>
      ) : null}
      <h1 className="mx-auto max-w-4xl text-[32px] font-bold leading-tight text-white md:text-display">
        {title}
      </h1>
      {subtitle ? (
        <p className="mx-auto mt-4 max-w-3xl text-[18px] leading-relaxed">{subtitle}</p>
      ) : null}
      <span aria-hidden="true" className="mx-auto mt-6 block h-px w-[150px] bg-accent" />
    </header>
  )
}
