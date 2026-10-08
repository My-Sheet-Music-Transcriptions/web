import { LazyMotion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

const loadFeatures = () => import('./features').then((r) => r.default)

/** The one easing every animation on the site uses (a quick start and a soft landing). */
export const ease = [0.2, 0.7, 0.2, 1] as const

/**
 * Wraps the app (and Storybook, and the design-system bundle) so `m.*` components animate. Motion's
 * features load lazily after hydration; until then elements render at rest. Visitors who ask their
 * device for reduced motion get no movement (opacity changes only).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.22, ease }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  )
}
