import { Icon } from '~/components/primitives/Icon'
import { cn } from '~/lib/cn'

export interface QuantityStepperProps {
  value: number
  max: number
  onChange: (value: number) => void
  /** The words of its buttons and its number, for screen readers. */
  labels: { quantity: string; decrease: string; increase: string }
  /** What it counts, for screen readers ("La Oreja de Van Gogh – Songbook"). */
  name?: string
  /** The lowest it goes: 1 beside an add button, 0 in the cart (0 removes the line). */
  min?: number
  className?: string
}

/** A quantity between `min` and `max`: minus and plus buttons around the number. */
export function QuantityStepper({
  value,
  max,
  onChange,
  labels,
  name,
  min = 1,
  className,
}: QuantityStepperProps) {
  const button =
    'inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40'
  return (
    // biome-ignore lint/a11y/useSemanticElements: a group of two buttons and a figure, not a form fieldset
    <div
      role="group"
      aria-label={name ? `${labels.quantity}: ${name}` : labels.quantity}
      className={cn('inline-flex items-center rounded-pill border border-line bg-white', className)}
    >
      <button
        type="button"
        className={button}
        aria-label={labels.decrease}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Icon name="minus" size={16} />
      </button>
      <output aria-live="polite" className="w-8 text-center text-body font-bold text-ink">
        {value}
      </output>
      <button
        type="button"
        className={button}
        aria-label={labels.increase}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  )
}
