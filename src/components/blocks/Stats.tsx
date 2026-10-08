import { SectionHeading } from '~/components/primitives/SectionHeading'
import { tones } from '~/components/primitives/tones'
import type { Stat } from '~/content/types'
import { cn } from '~/lib/cn'
import { inlineMarkdown } from '~/lib/light-markdown'
import { useTitleId } from '~/lib/use-title-id'

export interface StatsProps {
  title?: string
  /** A sentence under the title; **bold** and [links](/path) kept. */
  lead?: string
  /** The figures, as written ("25%", "$4,000M"), each with what it measures. */
  items: Stat[]
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id. */
  id?: string
}

/** A row of big figures that back a claim (market numbers, results), each with its one-line label. */
export function Stats({ title, lead, items, tone = 'white', id }: StatsProps) {
  const titleId = useTitleId(id)
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-[50px]', tones[tone])}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="container-content">
        {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
        {lead ? (
          <p className="mx-auto mt-2 max-w-3xl text-center text-[18px] leading-relaxed text-ink">
            {inlineMarkdown(lead)}
          </p>
        ) : null}
        <dl className="mt-10 grid gap-8 text-center md:grid-cols-3">
          {items.map((s) => (
            <div key={s.label} className="flex flex-col-reverse items-center gap-3">
              <dt className="max-w-[300px] text-body text-ink">{s.label}</dt>
              <dd className="text-[46px] font-bold leading-none text-primary">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
