import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { RevealItem } from '~/components/primitives/Motion'
import type { Stat } from '~/content/types'

export interface StatsProps extends ShellProps {
  /** The figures, as written ("25%", "$4,000M"), each with what it measures. */
  items: Stat[]
}

/** A row of big teal figures that back a claim, each above its one-line label, under an optional heading. */
export function Stats({ items, ...shell }: StatsProps) {
  return (
    <BlockShell {...shell} cascade>
      <dl className="grid gap-8 text-center md:grid-cols-3">
        {items.map((s) => (
          <RevealItem key={s.label} className="flex flex-col-reverse items-center gap-3">
            <dt className="max-w-[300px] text-body text-ink">{s.label}</dt>
            <dd className="text-[46px] font-bold leading-none text-primary">{s.value}</dd>
          </RevealItem>
        ))}
      </dl>
    </BlockShell>
  )
}
