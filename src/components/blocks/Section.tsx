import type { ReactNode } from 'react'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { cn } from '~/lib/cn'

export interface SectionProps {
  title?: string
  eyebrow?: string
  rule?: 'accent' | 'grey' | 'none'
  tone?: 'white' | 'peach' | 'cream' | 'surface'
  width?: 'content' | 'narrow' | 'wide'
  id?: string
  children: ReactNode
}

const tones = { white: 'bg-white', peach: 'bg-peach', cream: 'bg-cream', surface: 'bg-surface' }
const widths = { content: 'container-content', narrow: 'container-narrow', wide: 'container-wide' }

/** Generic titled section for prose or ad-hoc layouts in MDX. */
export function Section({
  title,
  eyebrow,
  rule = 'accent',
  tone = 'white',
  width = 'content',
  id,
  children,
}: SectionProps) {
  return (
    <section
      className={cn('py-section', tones[tone])}
      aria-labelledby={title && id ? `${id}-title` : undefined}
      id={id}
    >
      <div className={widths[width]}>
        {title ? (
          <SectionHeading
            id={id ? `${id}-title` : undefined}
            eyebrow={eyebrow}
            rule={rule}
            className="mb-10"
          >
            {title}
          </SectionHeading>
        ) : null}
        {children}
      </div>
    </section>
  )
}
