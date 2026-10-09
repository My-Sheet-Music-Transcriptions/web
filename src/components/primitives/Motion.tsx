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

/** A figure of a revealed block ticking up (Ticker): its digits roll in one after another, left to right. */
export const tickerGroup: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: 0.2, staggerChildren: 0.12 } },
}

/**
 * One digit of a Ticker: its column of digits, from 0 up to it (`custom`), rolls up until it shows, slowing down
 * calmly onto it.
 */
export const tickerDigit: Variants = {
  hidden: (digit: number) => ({ y: `${(digit / (digit + 1)) * 100}%` }),
  shown: { y: '0%', transition: { duration: 1.8, ease: [0.33, 1, 0.68, 1] } },
}

/** The stars of a rating in a revealed block: they pop in one after another as their card settles. */
export const starsGroup: Variants = {
  hidden: {},
  shown: { transition: { delayChildren: 0.25, staggerChildren: 0.08 } },
}

/** A star or an icon popping in: it grows from half its size with a slight overshoot and fades in. */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  shown: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
}

/** One piece of a revealed block coming in from the left (a speech bubble): it slides 16px and fades in. */
export const revealSide: Variants = {
  hidden: { opacity: 0, x: -16 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/** A line of a revealed block drawing itself downwards (a timeline): it grows from its top over 0.4 s. */
export const drawDown: Variants = {
  hidden: { scaleY: 0 },
  shown: { scaleY: 1, transition: { duration: 0.4, ease: 'easeOut' } },
}

/** The lines behind a revealed block (the staff lines behind Testimonials): drawn one after another. */
export const drawGroup: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.12 } },
}

/**
 * One of those lines painting itself from its start, unhurried at both ends, like a pen across the page. Only
 * the stroke's dashes change (`pathLength`), never the layout. `custom` is the share of the line the section
 * shows (a line can run on past its edge): that share is drawn over 1.8 s, the rest, unseen, at once.
 */
export const drawLine: Variants = {
  hidden: { pathLength: 0 },
  shown: (shown = 1) => ({
    pathLength: shown,
    transition: { duration: 1.8, ease: [0.65, 0, 0.35, 1] },
    transitionEnd: { pathLength: 1 },
  }),
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

/** How a piece comes in: rising (default), popping, sliding in from the left, or drawn downwards (a line). */
const presets = { rise: revealPiece, pop, side: revealSide, draw: drawDown }

export interface RevealItemProps {
  /** The element: `li` for an item of a list, `p`, or `div` (default). */
  as?: keyof typeof tags
  /** How it comes in: `rise` (default), `pop` (an icon), `side` (from the left), `draw` (a line, from its top). */
  preset?: keyof typeof presets
  /** An anchor (a FAQ group). */
  id?: string
  /** Hidden from screen readers: a decoration (a timeline's line). */
  'aria-hidden'?: 'true'
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
export function RevealItem({ as = 'div', preset = 'rise', ...props }: RevealItemProps) {
  const Tag = tags[as]
  return <Tag data-reveal="" variants={presets[preset]} {...props} />
}

export interface RevealGroupProps {
  /** The element: `li` for an item of a list, or `div` (default). */
  as?: 'div' | 'li'
  className?: string
  children?: ReactNode
}

/**
 * An item of a revealed block whose own pieces come in one after another (a sample's title, video, arrow and
 * score; a step's line, icon and bubble): its `RevealItem` children follow each other, 0.08 s apart, once
 * the items before it have come in. It never hides itself, so it carries no `data-reveal`.
 */
export function RevealGroup({ as = 'div', ...props }: RevealGroupProps) {
  const Tag = tags[as]
  return <Tag variants={revealGroup} {...props} />
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * A figure that ticks up like an odometer when its block is revealed (`reveal`): each digit's column rolls up
 * from 0 to it, one after another, slowing down onto it; separators stay put. Still where nothing animates (a
 * block that is not revealed, reduced motion, print, no JavaScript: the columns carry `data-reveal`). CSS draws
 * the rolling digits (`content: attr()`), so the page's text, crawlers and screen readers get the figure once,
 * as written.
 */
export function Ticker({ children, className }: { children: string; className?: string }) {
  return (
    <m.span variants={tickerGroup} className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="inline-flex">
        {[...children].map((char, i) =>
          DIGITS.includes(char) ? (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: a figure's characters are positional
              key={i}
              data-char={char}
              className="relative overflow-hidden before:invisible before:content-[attr(data-char)]"
            >
              <m.span
                data-reveal=""
                custom={Number(char)}
                variants={tickerDigit}
                className="absolute inset-x-0 bottom-0 flex flex-col items-center"
              >
                {DIGITS.slice(0, Number(char) + 1).map((d) => (
                  <span key={d} data-char={d} className="before:content-[attr(data-char)]" />
                ))}
              </m.span>
            </span>
          ) : (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: a figure's characters are positional
              key={i}
              data-char={char}
              className="before:content-[attr(data-char)]"
            />
          ),
        )}
      </span>
    </m.span>
  )
}
