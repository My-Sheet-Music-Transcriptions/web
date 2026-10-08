import { iconPicture } from '~/assets/icons'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { Picture } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { IconLink } from '~/content/types'
import { cn } from '~/lib/cn'
import { useTitleId } from '~/lib/use-title-id'

export interface IconGridProps {
  title?: string
  /** The links: a list from content/<locale>/data (serviceGrid, allServices). */
  items: IconLink[]
  /** Show only the first n items. */
  limit?: number
  /** Items per row from tablet up (two on phones). */
  columns?: 4 | 5 | 6
  /** Button under the grid ("See all services"). */
  cta?: Cta
  /** Anchor id. */
  id?: string
}

const cols = { 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-4 lg:grid-cols-6' }

/** A grid of illustrated icons, each linking to its page: the instruments and services we transcribe. */
export function IconGrid({ title, items, limit, columns = 4, cta, id }: IconGridProps) {
  const titleId = useTitleId(id)
  const shown = limit ? items.slice(0, limit) : items
  return (
    <section
      id={id}
      className={cn('md:pb-[72px]', title ? 'pt-[154px]' : 'pt-[50px]')}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="mx-auto max-w-[1140px] md:px-[10px]">
        {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
        <ul
          className={cn(
            'mx-auto mt-5 grid max-w-[1120px] grid-cols-2 items-start gap-y-[30px]',
            cols[columns],
          )}
        >
          {shown.map((s) => {
            const img = iconPicture(s.icon)
            return (
              <li key={s.href + s.label} className="p-[10px] text-center">
                <SmartLink href={s.href} className="group inline-flex flex-col items-center">
                  {img ? (
                    <Picture
                      image={img}
                      alt=""
                      sizes="137px"
                      className="h-[137px] w-[137px] transition-transform group-hover:scale-105 md:h-[130px] md:w-[130px]"
                    />
                  ) : null}
                  <span className="mt-[14px] mb-4 block text-h4 font-bold leading-[19.2px] text-[#363636] group-hover:text-accent-deep">
                    {s.label}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
        {cta ? (
          <div className="mt-[33px] text-center md:mt-[34px]">
            <CtaLink cta={cta} />
          </div>
        ) : null}
      </div>
    </section>
  )
}
