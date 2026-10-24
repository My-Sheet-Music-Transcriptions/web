import { useCallback, useSyncExternalStore } from 'react'
import { cn } from '~/lib/cn'
import { Button } from './Button'
import { RevealItem } from './Motion'

/**
 * The tab each set of labels is on, shared by every block of the page that offers the same tabs: choosing
 * "USD" on one pricing chart switches the other charts of the page too, so a page has one currency switch
 * however many blocks draw it.
 */
const chosen = new Map<string, number>()
const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** The active tab of a set of labels and its setter, shared across the page's blocks with the same labels. */
export function useTabs(labels: string[]): [number, (index: number) => void] {
  const key = labels.join('\u0000')
  const active = useSyncExternalStore(
    subscribe,
    () => chosen.get(key) ?? 0,
    () => 0,
  )
  const setActive = useCallback(
    (index: number) => {
      chosen.set(key, index)
      for (const listener of listeners) listener()
    },
    [key],
  )
  return [active, setActive]
}

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
 * with it, through `useTabs`, so the same tabs on one page move together; nothing else draws a tab row.
 */
export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <RevealItem className={cn('mb-heading-gap flex flex-wrap justify-center gap-3', className)}>
      {tabs.map((label, i) => (
        <Button
          key={label}
          variant="secondary"
          aria-pressed={i === active}
          onClick={() => onChange(i)}
          className="min-w-14"
        >
          {label}
        </Button>
      ))}
    </RevealItem>
  )
}
