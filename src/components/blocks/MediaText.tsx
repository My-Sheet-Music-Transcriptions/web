import type { ReactNode } from 'react'
import { Button } from '~/components/primitives/Button'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { cn } from '~/lib/cn'

export interface MediaTextProps {
  /** Heading above the prose (optional). */
  title?: string
  /** The picture (imported with `?w=…&as=picture`). */
  image: PictureSource
  /** Alt text of the picture; empty for a purely decorative one. */
  alt: string
  /** Which side the picture sits on at desktop width (stacks on phones). */
  imageSide?: 'left' | 'right'
  /** Maximum width of the picture in px at desktop width. */
  imageWidth?: number
  /** Caption under the picture (optional). */
  caption?: string
  /** Call to action under the prose (optional). */
  cta?: { label: string; href: string }
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id; also labels the section by its heading. */
  id?: string
  /** Prose: `<Text>` paragraphs from ~/components/typography. */
  children: ReactNode
}

const tones = { white: 'bg-white', peach: 'bg-peach', cream: 'bg-cream' }

/** Prose beside a picture: intro paragraphs with an illustration, a product shot with a caption and a button. */
export function MediaText({
  title,
  image,
  alt,
  imageSide = 'right',
  imageWidth = 480,
  caption,
  cta,
  tone = 'white',
  id,
  children,
}: MediaTextProps) {
  return (
    <section
      className={cn('py-12 md:py-16', tones[tone])}
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
    >
      <div
        className={cn(
          'container-content flex flex-wrap items-center gap-10',
          imageSide === 'left' ? 'flex-row' : 'flex-row-reverse',
        )}
      >
        <figure
          className="mx-auto flex min-w-0 shrink grow-0 basis-auto flex-col gap-2.5"
          style={{ maxWidth: imageWidth }}
        >
          <Picture
            image={image}
            alt={alt}
            sizes={`(min-width: 768px) ${imageWidth}px, 100vw`}
            className={cn('h-auto w-full', caption && 'rounded-card shadow-card')}
          />
          {caption ? (
            <figcaption className="text-[13px] italic leading-[1.5] text-muted">
              {caption}
            </figcaption>
          ) : null}
        </figure>
        <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-2">
          {title ? (
            <h2 id={id ? `${id}-title` : undefined} className="mb-2 text-h2 text-ink">
              {title}
            </h2>
          ) : null}
          <div className="my-4 flex flex-col gap-4 text-ink">{children}</div>
          {cta ? (
            <Button asChild className="mt-4 self-start">
              <SmartLink href={cta.href}>{cta.label}</SmartLink>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
