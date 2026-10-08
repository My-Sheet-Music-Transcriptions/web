import type { ReactNode } from 'react'
import { Carousel, type Slide } from '~/components/primitives/Carousel'
import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { tones } from '~/components/primitives/tones'
import { type Video, VideoEmbed } from '~/components/primitives/VideoEmbed'
import { cn } from '~/lib/cn'
import { useTitleId } from '~/lib/use-title-id'

export interface MediaTextProps {
  /** Heading of the section (optional). */
  title?: string
  /** A short line above the heading ("High School"). */
  eyebrow?: string
  /** The picture (imported with `?w=…&as=picture`). */
  image?: PictureSource
  /** Alt text of the picture; empty for a purely decorative one. */
  alt?: string
  /** Several pictures instead of one: a carousel, or a pair side by side (before and after). */
  images?: Slide[]
  /** How several pictures show. */
  imagesLayout?: 'carousel' | 'pair'
  /** A video instead of a picture. */
  video?: Video
  /** Which side the media sits on at desktop width (stacks on phones). */
  imageSide?: 'left' | 'right'
  /** Maximum width of the media in px at desktop width (start layout). */
  imageWidth?: number
  /** Caption under the picture (optional). */
  caption?: string
  /** Call to action under the prose (optional). */
  cta?: Cta
  /** start: heading beside the media, button under the prose. center: heading centred above, button centred below. */
  align?: 'start' | 'center'
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id. */
  id?: string
  /** Prose: `<Text>` paragraphs from ~/components/typography. */
  children: ReactNode
}

/**
 * Prose beside media: a picture, a carousel, a before/after pair or a video. The free-form middle of a page:
 * a product with its caption and button, a use case, who we are.
 */
export function MediaText({
  title,
  eyebrow,
  image,
  alt = '',
  images,
  imagesLayout = 'carousel',
  video,
  imageSide = 'right',
  imageWidth = 480,
  caption,
  cta,
  align = 'start',
  tone = 'white',
  id,
  children,
}: MediaTextProps) {
  const titleId = useTitleId(id)
  const labelled = title ? titleId : undefined

  if (align === 'center')
    return (
      <section
        id={id}
        className={cn('scroll-mt-20 py-[50px]', tones[tone])}
        aria-labelledby={labelled}
      >
        <div className="mx-auto max-w-[1140px]">
          {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
          <div
            className={cn(
              'mt-[30px] grid items-center gap-10 px-5 py-[10px] lg:grid-cols-2',
              imageSide === 'right' && 'lg:[&>*:first-child]:order-2',
            )}
          >
            <Media
              {...{ image, alt, images, imagesLayout, video, caption }}
              label={title ? `Photos: ${title}` : 'Photos'}
              sizes="(min-width: 1025px) 654px, 100vw"
              frameClassName={imageSide === 'left' ? 'lg:ml-[-124px]' : 'lg:mr-[-124px]'}
              imageClassName="aspect-[654/437]"
            />
            <div className="flex flex-col gap-[14.4px] text-secondary">{children}</div>
          </div>
          {cta ? (
            <div className="mt-[65px] text-center md:mt-[49px]">
              <CtaLink cta={cta} />
            </div>
          ) : null}
        </div>
      </section>
    )

  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-12 md:py-16', tones[tone])}
      aria-labelledby={labelled}
    >
      <div
        className={cn(
          'container-content flex flex-wrap items-center gap-10',
          imageSide === 'left' ? 'flex-row' : 'flex-row-reverse',
        )}
      >
        <div
          className="mx-auto flex min-w-0 shrink grow-0 basis-auto flex-col gap-2.5"
          style={{ maxWidth: imageWidth, width: video || images ? imageWidth : undefined }}
        >
          <Media
            {...{ image, alt, images, imagesLayout, video, caption }}
            label={title ? `Photos: ${title}` : 'Photos'}
            sizes={`(min-width: 768px) ${imageWidth}px, 100vw`}
          />
        </div>
        <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-2">
          {eyebrow ? (
            <p className="text-small font-bold uppercase tracking-wide text-accent-deep">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 id={titleId} className="mb-2 text-h2 text-ink">
              {title}
            </h2>
          ) : null}
          <div className="my-4 flex flex-col gap-4 text-ink">{children}</div>
          {cta ? <CtaLink cta={cta} className="mt-4 self-start" /> : null}
        </div>
      </div>
    </section>
  )
}

function Media({
  image,
  alt = '',
  images,
  imagesLayout,
  video,
  caption,
  label,
  sizes,
  frameClassName,
  imageClassName,
}: Pick<MediaTextProps, 'image' | 'alt' | 'images' | 'imagesLayout' | 'video' | 'caption'> & {
  label: string
  sizes: string
  frameClassName?: string
  imageClassName?: string
}) {
  if (video) return <VideoEmbed {...video} className="w-full" />
  if (images?.length && imagesLayout === 'pair')
    return (
      <div className="grid grid-cols-2 gap-4">
        {images.map((s) => (
          <figure key={s.image.img.src} className="flex flex-col items-center gap-2">
            <Picture
              image={s.image}
              alt={s.alt}
              sizes="(min-width: 768px) 240px, 50vw"
              className="w-full rounded-card shadow-card"
            />
            {s.caption ? (
              <figcaption className="text-h3 font-bold text-ink">{s.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    )
  if (images?.length)
    return (
      <Carousel
        slides={images}
        label={label}
        sizes={sizes}
        frameClassName={frameClassName}
        imageClassName={imageClassName}
      />
    )
  if (!image) return null
  return (
    <figure className="flex flex-col gap-2.5">
      <Picture
        image={image}
        alt={alt}
        sizes={sizes}
        className={cn('h-auto w-full', caption && 'rounded-card shadow-card')}
      />
      {caption ? (
        <figcaption className="text-[13px] italic leading-[1.5] text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
