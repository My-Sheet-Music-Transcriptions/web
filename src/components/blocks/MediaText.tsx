import type { ReactNode } from 'react'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { Media, type MediaContent } from '~/components/primitives/Media'
import { cn } from '~/lib/cn'

export interface MediaTextProps extends ShellProps, MediaContent {
  /** Which side the media sits on at desktop width (stacks on phones). */
  imageSide?: 'left' | 'right'
  /** Maximum width of the media in px at desktop width (start layout). */
  imageWidth?: number
  /** start: heading beside the media, button under the prose. center: heading centred above, button centred below. */
  align?: 'start' | 'center'
  /** Prose: `<Text>` paragraphs from ~/components/typography. */
  children: ReactNode
}

/**
 * Prose beside media: a picture, a carousel, a before/after pair or a video. The free-form middle of a page:
 * a product with its caption and button, a use case, who we are.
 */
export function MediaText({
  image,
  alt,
  caption,
  images,
  layout,
  video,
  labels,
  videoPoster,
  imageSide = 'right',
  imageWidth = 480,
  align = 'start',
  children,
  ...shell
}: MediaTextProps) {
  const media = { image, alt, caption, images, layout, video, labels, videoPoster }
  const label = shell.title ?? images?.[0]?.alt

  if (align === 'center')
    return (
      <BlockShell {...shell}>
        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-2',
            imageSide === 'right' && 'lg:[&>*:first-child]:order-2',
          )}
        >
          <Media
            {...media}
            label={label}
            sizes="(min-width: 1025px) 654px, 100vw"
            frameClassName={imageSide === 'left' ? 'lg:ml-[-124px]' : 'lg:mr-[-124px]'}
            imageClassName="aspect-[654/437]"
          />
          <div className="flex flex-col gap-[14.4px] text-secondary">{children}</div>
        </div>
      </BlockShell>
    )

  return (
    <BlockShell {...shell} align="start" rule={false}>
      {({ heading, actions }) => (
        <div
          className={cn(
            'flex flex-wrap items-center gap-10',
            imageSide === 'left' ? 'flex-row' : 'flex-row-reverse',
          )}
        >
          <div
            className="mx-auto min-w-0 shrink grow-0 basis-auto"
            style={{ width: imageWidth, maxWidth: '100%' }}
          >
            <Media {...media} label={label} sizes={`(min-width: 768px) ${imageWidth}px, 100vw`} />
          </div>
          <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-4">
            {heading}
            <div className="flex flex-col gap-4 text-ink">{children}</div>
            {actions ? <div className="mt-4">{actions}</div> : null}
          </div>
        </div>
      )}
    </BlockShell>
  )
}
