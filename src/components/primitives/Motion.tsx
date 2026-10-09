import { LazyMotion, MotionConfig, type Variants } from 'motion/react'
import * as m from 'motion/react-m'
import type { CSSProperties, ReactNode } from 'react'

const features = () => import('./motion-features').then((r) => r.default)

/**
 * Motion for a whole tree: the animations of the `m` components (loaded after hydration) and reduced motion
 * when the visitor asks for it (no movement, fades only). Mounted once per root: the app, Storybook and the
 * design-system bundle. Without it `m` components never animate, and a revealed block would stay hidden.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={features} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}

/** A revealed block (`reveal`), or a part of it: its pieces come in one after another. */
export const revealGroup: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08 } },
}

/** One piece of a revealed block: it rises 24px and fades in. */
export const revealPiece: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const opening = { duration: 0.2, ease: 'easeOut' } as const
const closing = { duration: 0.15, ease: 'easeIn' } as const

/** A menu panel dropping open under its button, and closing. */
export const dropDown: Variants = {
  open: { opacity: 1, y: 0, display: 'block', transition: opening },
  closed: { opacity: 0, y: -8, transition: closing, transitionEnd: { display: 'none' } },
}

/** A submenu sliding open beside its row, and closing. */
export const dropSide: Variants = {
  open: { opacity: 1, x: 0, display: 'block', transition: opening },
  closed: { opacity: 0, x: -8, transition: closing, transitionEnd: { display: 'none' } },
}

/** A backdrop fading in and out with what it sits behind. */
export const fade: Variants = {
  open: { opacity: 1, transition: opening },
  closed: { opacity: 0, transition: closing },
}

/** A side panel (the phone menu) sliding in from the right edge, and out. */
export const slideIn: Variants = {
  open: { x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  closed: { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
}

const tags = { div: m.div, li: m.li, p: m.p }

export interface RevealItemProps {
  /** The element: `li` for an item of a list, `p`, or `div` (default). */
  as?: keyof typeof tags
  className?: string
  style?: CSSProperties
  children?: ReactNode
  /** Data attributes pass through (`data-live-colour`). */
  [data: `data-${string}`]: string | undefined
}

/**
 * One piece of a block's content that comes in on its own, after the pieces before it, when the block is
 * revealed (`reveal`); a plain element otherwise. A block that splits its content this way (each card of a
 * list) passes `cascade` to its BlockShell. `data-reveal` lets theme.css show it as it is where nothing
 * animates (reduced motion, print, no JavaScript).
 */
export function RevealItem({ as = 'div', ...props }: RevealItemProps) {
  const Tag = tags[as]
  return <Tag data-reveal="" variants={revealPiece} {...props} />
}
