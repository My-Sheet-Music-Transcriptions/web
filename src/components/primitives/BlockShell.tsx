import { useInView } from 'motion/react'
import * as m from 'motion/react-m'
import { type ReactNode, useRef } from 'react'
import { cn } from '~/lib/cn'
import { inlineMarkdown } from '~/lib/light-markdown'
import { useTitleId } from '~/lib/use-title-id'
import { type Cta, CtaLink } from './CtaLink'
import { RevealItem, revealGroup } from './Motion'
import { Picture, type PictureSource } from './Picture'
import { SectionHeading } from './SectionHeading'
import { type Tone, tones } from './tones'
import { WaveDivider } from './WaveDivider'

/** The heading area every block takes: its title, the lines above and under it, its anchor and its entrance. */
export interface HeadingProps {
  /** The section's heading (h2). */
  title?: string
  /** A short line above the heading ("High School"). */
  eyebrow?: string
  /** A sentence or two under the heading; **bold** and [links](/path) kept. */
  lead?: string
  /** Anchor id (`how-it-works` for `#how-it-works`). */
  id?: string
  /** Comes in as it scrolls into view: the heading, then the content (card by card in a list), then the buttons rise and fade in. */
  reveal?: boolean
}

/** What every block on a plain background takes: its heading area, its background and its closing button. */
export interface ShellProps extends HeadingProps {
  /** Background: white (default), cream or peach. */
  tone?: Tone
  /** The filled button that closes the block. */
  cta?: Cta
}

/** The pieces the shell hands to a block that places them itself (a heading beside a picture). */
export interface ShellParts {
  heading: ReactNode
  actions: ReactNode
}

export interface BlockShellProps extends ShellProps {
  /** Outline buttons beside the `cta` (jump links, related pages). */
  links?: Cta[]
  /** A full-bleed photo behind the block: the photo band (grey veil, white wavy edges, white heading). */
  image?: PictureSource
  /** Vertical padding: tight 32px, normal 50px (default), loose 50px on phones and 90px from tablet up. */
  spacing?: 'tight' | 'normal' | 'loose'
  /** The container: narrow 900px, content 1140px (default), wide 1200px, or full (the header's 1440px). */
  width?: 'narrow' | 'content' | 'wide' | 'full'
  /** Heading and buttons centred (default), or at the start of the column. */
  align?: 'center' | 'start'
  /** The short rule under the heading (on every section but photo bands). */
  rule?: boolean
  /** What the section is, for screen readers, when it has no title. */
  label?: string
  /** Extra classes of the section (a background texture, hidden on phones). */
  className?: string
  /**
   * With `reveal`, the content's own pieces (`RevealItem`: each card of a list) come in one after another,
   * instead of the content as one piece.
   */
  cascade?: boolean
  /**
   * The block's content, under the heading. A function gets the heading and the buttons to place them itself
   * (MediaText sets its heading beside the picture), and the shell then renders neither.
   */
  children?: ReactNode | ((parts: ShellParts) => ReactNode)
}

/** A revealed block starts once its top passes the lowest sixth of the screen, and only the first time. */
const viewport = { once: true, margin: '0px 0px -15% 0px' } as const

const spacings = {
  tight: 'py-8',
  normal: 'py-[50px]',
  loose: 'py-[50px] md:py-[90px]',
}
const widths = {
  narrow: 'container-narrow',
  content: 'container-content',
  wide: 'container-wide',
  full: 'mx-auto w-full max-w-[1440px] px-4 lg:px-5',
}

/**
 * The frame of every block: a `<section>` labelled by its heading, the tone, the container, the heading area
 * (eyebrow, h2 with its short rule, lead), the content and the closing buttons (`cta` filled, `links`
 * outline). With an `image` it is the photo band: the photo darkened by a 32% grey veil, white wavy edges
 * and a white heading. With `reveal` it comes in as it scrolls into view (Motion): heading, content and
 * buttons rise and fade in one after another. Blocks render their content inside it and never rebuild any of
 * this by hand.
 */
export function BlockShell({
  title,
  eyebrow,
  lead,
  id,
  tone = 'white',
  cta,
  links,
  image,
  spacing = 'normal',
  width = 'content',
  align = 'center',
  rule = !image,
  label,
  className,
  reveal,
  cascade,
  children,
}: BlockShellProps) {
  const titleId = useTitleId(id)
  // `animate` (not `whileInView`): pieces that mount later (another tab's cards) inherit "shown" and come in too.
  const section = useRef<HTMLElement>(null)
  const seen = useInView(section, viewport)
  const light = !!image
  const center = align === 'center'
  const heading =
    title || eyebrow || lead ? (
      <RevealItem
        className={cn('flex flex-col', center ? 'items-center text-center' : 'items-start')}
      >
        {eyebrow ? (
          <p
            className={cn(
              'mb-2 text-small font-bold uppercase tracking-wide',
              light ? 'text-accent-light' : 'text-accent-deep',
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <SectionHeading id={titleId} rule={rule} align={align} tone={light ? 'light' : 'dark'}>
            {title}
          </SectionHeading>
        ) : null}
        {lead ? (
          <p
            className={cn(
              'max-w-3xl text-[18px] leading-relaxed',
              title && !rule && 'mt-4',
              light ? 'text-white' : 'text-ink',
            )}
          >
            {inlineMarkdown(lead)}
          </p>
        ) : null}
      </RevealItem>
    ) : null
  const actions =
    cta || links?.length ? (
      <RevealItem
        className={cn('flex flex-wrap gap-4', center ? 'justify-center' : 'justify-start')}
      >
        {cta ? <CtaLink cta={cta} /> : null}
        {links?.map((l) => (
          <CtaLink key={l.href} cta={l} variant="outline" />
        ))}
      </RevealItem>
    ) : null

  return (
    <m.section
      {...(reveal && {
        ref: section,
        initial: 'hidden',
        animate: seen ? 'shown' : 'hidden',
        variants: revealGroup,
      })}
      id={id}
      className={cn(
        'scroll-mt-20',
        image
          ? 'relative isolate my-[50px] overflow-hidden py-[100px] text-white md:py-[110px]'
          : [spacings[spacing], tones[tone]],
        className,
      )}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : label}
    >
      {image ? (
        <>
          <Picture
            image={image}
            alt=""
            sizes="100vw"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            pictureClassName="contents"
          />
          <div className="absolute inset-0 -z-10 bg-[#3a3a3a] opacity-[0.32]" aria-hidden="true" />
          <WaveDivider position="top" width={138} mobileHeight={20} mobileWidth={266} />
          <WaveDivider position="bottom" width={135} mobileHeight={20} mobileWidth={266} />
        </>
      ) : null}
      <div className={widths[width]}>
        {typeof children === 'function' ? (
          children({ heading, actions })
        ) : (
          <>
            {heading}
            {children ? (
              cascade ? (
                <m.div variants={revealGroup} className={cn(heading && 'mt-10')}>
                  {children}
                </m.div>
              ) : (
                <RevealItem className={cn(heading && 'mt-10')}>{children}</RevealItem>
              )
            ) : null}
            {actions ? <div className={cn((heading || children) && 'mt-10')}>{actions}</div> : null}
          </>
        )}
      </div>
    </m.section>
  )
}
