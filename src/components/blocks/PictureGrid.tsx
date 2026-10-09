import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { RevealItem } from '~/components/primitives/Motion'
import { Picture } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { PictureItem } from '~/content/types'
import { cn } from '~/lib/cn'
import { gridCols } from '~/lib/grid'

export interface PictureGridProps extends ShellProps {
  /** The pictures: a list from content/<locale>/data (allServices) or written in the page. */
  items: PictureItem[]
  /** icon: illustrated icons (services). logo: wide marks in a box. portrait: round photos. photo: square photos. */
  shape?: 'icon' | 'logo' | 'portrait' | 'photo'
  /** grid (default), or marquee: a strip of tall photos that scrolls by on its own (hidden on phones). */
  variant?: 'grid' | 'marquee'
  /** Pictures per row from desktop up (two on phones). */
  columns?: 2 | 3 | 4 | 5 | 6
  /** Show only the first n items. */
  limit?: number
  /** What the pictures are, for screen readers, when there is no title. */
  label?: string
}

const pictures = {
  icon: {
    sizes: '137px',
    className:
      'mx-auto h-[137px] w-[137px] transition-transform group-hover:scale-105 md:h-[130px] md:w-[130px]',
  },
  logo: { sizes: '240px', className: 'mx-auto h-[90px] w-full max-w-[240px] object-contain' },
  portrait: {
    sizes: '180px',
    className: 'mx-auto aspect-square w-full max-w-[180px] rounded-full object-cover',
  },
  photo: {
    sizes: '(min-width: 768px) 240px, 50vw',
    className: 'aspect-square w-full rounded-card object-cover',
  },
}

/**
 * Pictures in a row, each with its name: the instruments and services we transcribe (icons that link),
 * partner logos, the musicians who trust us (portraits), our team or our books (photos), or the strip of
 * sheet music photos that scrolls by on the homepage.
 */
export function PictureGrid({
  items,
  shape = 'icon',
  variant = 'grid',
  columns = 4,
  limit,
  label,
  ...shell
}: PictureGridProps) {
  const shown = limit ? items.slice(0, limit) : items
  if (variant === 'marquee')
    return (
      <BlockShell
        {...shell}
        label={label}
        width="full"
        spacing="loose"
        className="hidden overflow-hidden md:block"
      >
        {/* As on the live site: one photo every 8 s, endless (the list is drawn twice and slides by half its
            width); it stops for reduced-motion visitors and while hovered or focused. */}
        <div className="group mx-[-80px] flex w-max motion-safe:animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex gap-5 pr-5"
              aria-hidden={copy === 1 ? 'true' : undefined}
            >
              {shown.map((item) => (
                <li key={keyOf(item)} className="w-[250px] shrink-0">
                  <Picture
                    image={item.image}
                    alt={copy === 0 ? (item.alt ?? item.name ?? '') : ''}
                    sizes="250px"
                    className="h-[374px] w-[250px] rounded-card object-cover"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </BlockShell>
    )
  const p = pictures[shape]
  return (
    <BlockShell {...shell} label={label} cascade>
      <ul
        className={cn(
          gridCols(columns, { tablet: Math.min(columns, 4) as 4, phone: 2 }),
          'items-start gap-x-6 gap-y-8',
        )}
      >
        {shown.map((item) => {
          const content = (
            <>
              <Picture
                image={item.image}
                alt={item.alt ?? ''}
                sizes={p.sizes}
                className={p.className}
              />
              {item.name ? (
                <span className="mt-4 block text-h4 font-bold text-ink group-hover:text-accent-deep">
                  {item.name}
                  {item.caption ? (
                    <span className="mt-1 block text-small font-normal text-secondary">
                      {item.caption}
                    </span>
                  ) : null}
                </span>
              ) : item.caption ? (
                <span className="mt-2 block text-small font-bold text-ink">{item.caption}</span>
              ) : null}
            </>
          )
          return (
            <RevealItem as="li" key={keyOf(item)} className="text-center">
              {item.href ? (
                <SmartLink href={item.href} className="group block">
                  {content}
                </SmartLink>
              ) : (
                content
              )}
            </RevealItem>
          )
        })}
      </ul>
    </BlockShell>
  )
}

const keyOf = (item: PictureItem) =>
  `${item.href ?? ''}${item.name ?? item.alt ?? ''}${item.image.img.src}`
