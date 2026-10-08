import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { ease } from './MotionProvider'

/** Where the element comes from (the hidden state it animates out of). */
const effects = {
  /** Rises from below: headings, cards, steps. */
  rise: { opacity: 0, y: 32 },
  /** Slides in from the left: the first column of a two-column section. */
  left: { opacity: 0, x: -56 },
  /** Slides in from the right: the second column, a strip arriving. */
  right: { opacity: 0, x: 56 },
  /** Grows into place: figures, small tiles. */
  scale: { opacity: 0, scale: 0.9, y: 16 },
  /** Opacity only. */
  fade: { opacity: 0 },
}
export type RevealEffect = keyof typeof effects

interface RevealProps {
  /** Element to render: a list item inside grids of columns, a div otherwise. */
  as?: 'div' | 'li'
  /** Entrance: rise (default), left, right, scale or fade. */
  effect?: RevealEffect
  /** Delay in seconds, for staggering siblings (index × 0.1 reads well). */
  delay?: number
  className?: string
  children?: ReactNode
}

/**
 * Animates into place (rise, slide from either side, scale or fade) when it scrolls into view. Server
 * HTML and anything already on screen at load stay as they are (no hidden content without JavaScript,
 * no delayed first paint); only elements below the fold are tucked away after hydration and revealed
 * as they arrive. Off for reduced motion.
 *
 * The state is declarative (`animate` names a variant) rather than imperative controls: Motion's
 * features load after hydration, and a `controls.set()` issued before they arrive is silently dropped,
 * whereas the current `animate` value is applied as soon as they mount.
 */
export function Reveal({
  as = 'div',
  effect = 'rise',
  delay = 0,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [state, setState] = useState<'rest' | 'hidden' | 'shown'>('rest')
  const inView = useInView(ref, { once: true, amount: 0.15 })

  useEffect(() => {
    const el = ref.current
    if (reduce || !el) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    setState('hidden')
  }, [reduce])

  useEffect(() => {
    if (state === 'hidden' && inView) setState('shown')
  }, [state, inView])

  const variants = {
    hidden: { ...effects[effect], transition: { duration: 0 } },
    shown: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.8, delay, ease } },
  }
  const Comp = as === 'li' ? m.li : m.div
  return (
    <Comp
      // biome-ignore lint/suspicious/noExplicitAny: one ref for either element type
      ref={ref as any}
      variants={variants}
      initial={false}
      animate={state === 'rest' ? undefined : state}
      className={className}
    >
      {children}
    </Comp>
  )
}
