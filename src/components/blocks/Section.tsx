import type { ReactNode } from 'react'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { tones } from '~/components/primitives/tones'
import { cn } from '~/lib/cn'
import { useTitleId } from '~/lib/use-title-id'

export interface SectionProps {
  title?: string
  rule?: 'accent' | 'grey' | 'none'
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'peach' | 'cream'
  width?: 'content' | 'narrow' | 'wide'
  /** A row of buttons under the prose (jump links to the sections below, related pages). */
  links?: Cta[]
  /** Anchor id. */
  id?: string
  children: ReactNode
}

const widths = { content: 'container-content', narrow: 'container-narrow', wide: 'container-wide' }

/** Generic titled section for a page's own prose (`Text`, `Heading`, `List`… from ~/components/typography). */
export function Section({
  title,
  rule = 'accent',
  tone = 'white',
  width = 'content',
  links,
  id,
  children,
}: SectionProps) {
  const titleId = useTitleId(id)
  return (
    <section
      className={cn('scroll-mt-20 py-16', tones[tone])}
      aria-labelledby={title ? titleId : undefined}
      id={id}
    >
      <div className={widths[width]}>
        {title ? (
          <SectionHeading id={titleId} rule={rule} className="mb-10">
            {title}
          </SectionHeading>
        ) : null}
        <div className="flex flex-col gap-4 text-charcoal">{children}</div>
        {links?.length ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {links.map((l) => (
              <CtaLink key={l.href} cta={l} variant="outline" />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
