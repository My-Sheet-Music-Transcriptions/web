import { Carousel, type Slide } from '~/components/primitives/Carousel'
import { Picture } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { cn } from '~/lib/cn'
import { useTitleId } from '~/lib/use-title-id'

export interface GalleryProps {
  /** The pictures, from the page folder, each with its alt text. */
  images: Slide[]
  /** marquee: a strip that scrolls by on its own (hidden on phones). grid: square tiles. carousel: one at a time. */
  variant?: 'marquee' | 'grid' | 'carousel'
  /** Tiles per row from tablet up (grid). */
  columns?: 3 | 4 | 5 | 6
  title?: string
  /** What the pictures are, for screen readers when there is no title. */
  label?: string
  /** Anchor id. */
  id?: string
}

const cols = { 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' }

/** Pictures without prose: a scrolling strip of sheet music, a grid of team portraits, a carousel. */
export function Gallery({
  images,
  variant = 'marquee',
  columns = 5,
  title,
  label,
  id,
}: GalleryProps) {
  const titleId = useTitleId(id)
  const named = title ? { 'aria-labelledby': titleId } : { 'aria-label': label ?? 'Photos' }
  if (variant === 'marquee')
    return (
      <section id={id} {...named} className="hidden overflow-hidden pt-[107px] pb-[70px] md:block">
        {title ? (
          <SectionHeading id={titleId} className="mb-10">
            {title}
          </SectionHeading>
        ) : null}
        {/* As on the live site: one photo every 8 s, endless (the list is drawn twice and slides by half its
            width); it stops for reduced-motion users and while hovered or focused. */}
        <div className="group mx-[-80px] flex w-max motion-safe:animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex gap-5 pr-5"
              aria-hidden={copy === 1 ? 'true' : undefined}
            >
              {images.map((s) => (
                <li key={s.image.img.src} className="w-[250px] shrink-0">
                  <Picture
                    image={s.image}
                    alt={copy === 0 ? s.alt : ''}
                    sizes="250px"
                    className="h-[374px] w-[250px] rounded-card object-cover"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>
    )
  return (
    <section id={id} {...named} className="scroll-mt-20 py-[50px]">
      <div className="container-content">
        {title ? (
          <SectionHeading id={titleId} className="mb-10">
            {title}
          </SectionHeading>
        ) : null}
        {variant === 'carousel' ? (
          <Carousel
            slides={images}
            label={title ?? label ?? 'Photos'}
            sizes="(min-width: 1140px) 1140px, 100vw"
            imageClassName="aspect-[3/2]"
          />
        ) : (
          <ul className={cn('grid grid-cols-2 gap-4', cols[columns])}>
            {images.map((s) => (
              <li key={s.image.img.src}>
                <figure>
                  <Picture
                    image={s.image}
                    alt={s.alt}
                    sizes="(min-width: 768px) 240px, 50vw"
                    className="aspect-square w-full rounded-card object-cover"
                  />
                  {s.caption ? (
                    <figcaption className="mt-2 text-center text-small font-bold text-ink">
                      {s.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
