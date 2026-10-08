import { useAnimationControls, useInView, useReducedMotion } from 'motion/react'
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
 */
export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const controls = useAnimationControls()
  const reduce = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  useEffect(() => {
    const el = ref.current
    if (reduce || !el) return
    if (el.getBoundingClientRect().top < window.innerHeight) return
    controls.set({ opacity: 0, y: 18 })
    setArmed(true)
  }, [controls, reduce])

  useEffect(() => {
    if (armed && inView)
      controls.start({ opacity: 1, y: 0, transition: { duration: 0.5, delay, ease } })
  }, [armed, inView, controls, delay])

  const Comp = as === 'li' ? m.li : m.div
  return (
    // biome-ignore lint/suspicious/noExplicitAny: one ref for either element type
    <Comp ref={ref as any} animate={controls} className={className}>
      {children}
    </Comp>
  )
}
