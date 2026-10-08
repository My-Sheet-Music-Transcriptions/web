import type { ReactNode } from 'react'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { cn } from '~/lib/cn'

export interface SectionProps {
  title?: string
  rule?: 'accent' | 'grey' | 'none'
  tone?: 'white' | 'peach' | 'cream'
  width?: 'content' | 'narrow' | 'wide'
  id?: string
  children: ReactNode
}

const tones = { white: 'bg-white', peach: 'bg-peach', cream: 'bg-cream' }
const widths = { content: 'container-content', narrow: 'container-narrow', wide: 'container-wide' }

/** Generic titled section for a page's own prose (`Text`, `Heading`, `List`… from ~/components/typography). */
export function Section({
  title,
  rule = 'accent',
  tone = 'white',
  width = 'content',
  id,
  children,
}: SectionProps) {
  return (
    <section
      className={cn('py-16', tones[tone])}
      aria-labelledby={title && id ? `${id}-title` : undefined}
      id={id}
    >
      <div className={widths[width]}>
        {title ? (
          <SectionHeading id={id ? `${id}-title` : undefined} rule={rule} className="mb-10">
            {title}
          </SectionHeading>
        ) : null}
        <div className="flex flex-col gap-4 text-charcoal">{children}</div>
      </div>
    </section>
  )
}
