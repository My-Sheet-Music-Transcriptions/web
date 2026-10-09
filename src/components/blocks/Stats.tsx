import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import type { Stat } from '~/content/types'

export interface StatsProps extends ShellProps {
  /** The figures, as written ("25%", "$4,000M"), each with what it measures. */
  items: Stat[]
}

/** A row of big figures that back a claim (market numbers, results), each with its one-line label. */
export function Stats({ items, ...shell }: StatsProps) {
  return (
    <BlockShell {...shell}>
      <dl className="grid gap-8 text-center md:grid-cols-3">
        {items.map((s) => (
          <div key={s.label} className="flex flex-col-reverse items-center gap-3">
            <dt className="max-w-[300px] text-body text-ink">{s.label}</dt>
            <dd className="text-[46px] font-bold leading-none text-primary">{s.value}</dd>
          </div>
        ))}
      </dl>
    </BlockShell>
  )
}
