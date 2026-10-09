import type { ReactNode } from 'react'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { Media, type MediaContent } from '~/components/primitives/Media'
import { RevealItem } from '~/components/primitives/Motion'
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
 * Prose beside media: a picture with its caption, a carousel, a before/after pair (`layout="pair"`) or a
 * video, left or right, with an optional eyebrow, heading and button. `align="center"` puts the heading above
 * and the button below (who we are).
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
      <BlockShell {...shell} cascade>
        <div
          className={cn(
            'grid items-center gap-10 lg:grid-cols-2',
            imageSide === 'right' && 'lg:[&>*:first-child]:order-2',
          )}
        >
          <RevealItem>
            <Media
              {...media}
              label={label}
              sizes="(min-width: 1025px) 654px, 100vw"
              frameClassName={imageSide === 'left' ? 'lg:ml-[-124px]' : 'lg:mr-[-124px]'}
              imageClassName="aspect-[654/437]"
            />
          </RevealItem>
          <RevealItem className="flex flex-col gap-[14.4px] text-secondary">{children}</RevealItem>
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
          <RevealItem
            className="mx-auto min-w-0 shrink grow-0 basis-auto"
            style={{ width: imageWidth, maxWidth: '100%' }}
          >
            <Media {...media} label={label} sizes={`(min-width: 768px) ${imageWidth}px, 100vw`} />
          </RevealItem>
          <div className="flex min-w-0 flex-1 basis-[420px] flex-col gap-4">
            {heading}
            <RevealItem className="flex flex-col gap-4 text-ink">{children}</RevealItem>
            {actions ? <div className="mt-4">{actions}</div> : null}
          </div>
        </div>
      )}
    </BlockShell>
  )
}
