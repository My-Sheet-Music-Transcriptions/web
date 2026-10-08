import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { tones } from '~/components/primitives/tones'
import { cn } from '~/lib/cn'
import { inlineMarkdown } from '~/lib/light-markdown'
import { useTitleId } from '~/lib/use-title-id'

/** A partner, institution or person: a logo or portrait, a name and where it leads. */
export interface LogoItem {
  name: string
  /** The logo or portrait, from the page folder. */
  image: PictureSource
  /** Where the logo leads (their page, their store). */
  href?: string
  /** A line under the name ("Sibelius notation software"). */
  caption?: string
}

export interface LogoGridProps {
  title?: string
  /** A sentence or two under the title; **bold** and [links](/path) kept. */
  lead?: string
  items: LogoItem[]
  /** logo: wide marks, contained in a box. portrait: round photos. */
  shape?: 'logo' | 'portrait'
  /** Show each name (and caption) under its picture; otherwise the name is the alt text. */
  showNames?: boolean
  /** Items per row from tablet up. */
  columns?: 3 | 4 | 5 | 6
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id. */
  id?: string
}

const cols = { 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' }

/** Who trusts us: partner logos, institutions, or the portraits of the artists we work with. */
export function LogoGrid({
  title,
  lead,
  items,
  shape = 'logo',
  showNames = false,
  columns = 4,
  tone = 'white',
  id,
}: LogoGridProps) {
  const titleId = useTitleId(id)
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-[50px]', tones[tone])}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="container-content">
        {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
        {lead ? (
          <p className="mx-auto mt-2 max-w-3xl text-center text-[18px] leading-relaxed text-ink">
            {inlineMarkdown(lead)}
          </p>
        ) : null}
        <ul className={cn('mt-10 grid grid-cols-2 items-start gap-x-6 gap-y-8', cols[columns])}>
          {items.map((item) => {
            const picture = (
              <Picture
                image={item.image}
                alt={showNames ? '' : item.name}
                sizes={shape === 'portrait' ? '180px' : '240px'}
                className={
                  shape === 'portrait'
                    ? 'mx-auto aspect-square w-full max-w-[180px] rounded-full object-cover'
                    : 'mx-auto h-[90px] w-full max-w-[240px] object-contain'
                }
              />
            )
            const label = showNames ? (
              <span className="mt-4 block text-h4 font-bold text-ink group-hover:text-accent-deep">
                {item.name}
                {item.caption ? (
                  <span className="mt-1 block text-small font-normal text-secondary">
                    {item.caption}
                  </span>
                ) : null}
              </span>
            ) : null
            return (
              <li key={item.name} className="text-center">
                {item.href ? (
                  <SmartLink href={item.href} className="group block">
                    {picture}
                    {label}
                  </SmartLink>
                ) : (
                  <>
                    {picture}
                    {label}
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
