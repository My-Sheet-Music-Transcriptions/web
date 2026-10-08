import type { ReactNode } from 'react'
import { Button } from '~/components/primitives/Button'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SmartLink } from '~/components/primitives/SmartLink'
import { cn } from '~/lib/cn'

export interface MediaTextProps {
  /** Heading above the prose (optional). */
  title?: string
  /** Small uppercase label above the heading (optional). */
  eyebrow?: string
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
  /** Background: white (default), cream, peach or surface. */
  tone?: 'white' | 'cream' | 'peach' | 'surface'
  /** Anchor id; also labels the section by its heading. */
  id?: string
  /** Prose (MDX paragraphs). */
  children: ReactNode
}

const tones = { white: 'bg-white', peach: 'bg-peach', cream: 'bg-cream', surface: 'bg-surface' }

/** Prose beside a picture: intro paragraphs with an illustration, a product shot with a caption and a button. */
export function MediaText({
  title,
  eyebrow,
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
      className={cn('py-section', tones[tone])}
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
    >
      <div
        className={cn(
          'container-content flex flex-wrap items-center gap-10 lg:gap-16',
          imageSide === 'left' ? 'flex-row' : 'flex-row-reverse',
        )}
      >
        <figure
          className="mx-auto flex min-w-0 shrink grow-0 basis-auto flex-col gap-3"
          style={{ maxWidth: imageWidth }}
        >
          <Picture
            image={image}
            alt={alt}
            sizes={`(min-width: 768px) ${imageWidth}px, 100vw`}
            className={cn('h-auto w-full', caption && 'rounded-ui')}
          />
          {caption ? (
            <figcaption className="text-caption italic text-muted">{caption}</figcaption>
          ) : null}
        </figure>
        <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-2">
          {eyebrow ? <p className="eyebrow mb-2 text-accent-text">{eyebrow}</p> : null}
          {title ? (
            <h2
              id={id ? `${id}-title` : undefined}
              className="mb-3 text-[30px] leading-[1.1] text-ink md:text-h2"
            >
              {title}
            </h2>
          ) : null}
          <div className="text-body leading-relaxed text-charcoal [&_strong]:text-ink [&_p+p]:mt-4">
            {children}
          </div>
          {cta ? (
            <Button asChild className="mt-6 self-start">
              <SmartLink href={cta.href}>{cta.label}</SmartLink>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
