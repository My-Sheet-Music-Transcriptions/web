import { useInView, useReducedMotion } from 'motion/react'
import * as m from 'motion/react-m'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { ease } from './MotionProvider'

interface RevealProps {
  /** Element to render: a list item inside grids of columns, a div otherwise. */
  as?: 'div' | 'li'
  /** Delay in seconds, for staggering siblings (index × 0.06 reads well). */
  delay?: number
  className?: string
  children?: ReactNode
}

/**
 * Rises into place when it scrolls into view. Server HTML and anything already on screen at load stay
 * as they are (no hidden content without JavaScript, no delayed first paint); only elements below the
 * fold are tucked away after hydration and revealed as they arrive. Off for reduced motion.
 *
 * The state is declarative (`animate` names a variant) rather than imperative controls: Motion's
 * features load after hydration, and a `controls.set()` issued before they arrive is silently dropped,
 * whereas the current `animate` value is applied as soon as they mount.
 */
export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
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
    hidden: { opacity: 0, y: 18, transition: { duration: 0 } },
    shown: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease } },
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
