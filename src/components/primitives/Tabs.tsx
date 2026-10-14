import { cn } from '~/lib/cn'
import { RevealItem } from './Motion'

export interface TabsProps {
  /** The tabs' words, in order ("USD", "EUR"; "$", "€"). */
  tabs: string[]
  /** The index of the tab shown. */
  active: number
  onChange: (index: number) => void
  className?: string
}

/**
 * The row of pill buttons that switches a block's content between sets (the same cards or samples in
 * another currency): the active one filled, the others outlined. CardGrid and Samples switch their `tabs`
 * with it; nothing else draws a tab row.
 */
export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <RevealItem className={cn('mb-8 flex flex-wrap justify-center gap-3', className)}>
      {tabs.map((label, i) => (
        <button
          key={label}
          type="button"
          aria-pressed={i === active}
          onClick={() => onChange(i)}
          className={cn(
            'min-w-14 rounded-pill border-2 border-primary px-5 py-2 font-bold transition-colors',
            i === active ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-primary/10',
          )}
        >
          {label}
        </button>
      ))}
    </RevealItem>
  )
}
