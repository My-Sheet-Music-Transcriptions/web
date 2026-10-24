import { Fragment } from 'react'
import type { Audio } from '~/components/primitives/AudioPlayer'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import type { Clip } from '~/components/primitives/Clip'
import { Media } from '~/components/primitives/Media'
import type { PictureSource } from '~/components/primitives/Picture'
import type { Video } from '~/components/primitives/VideoEmbed'
import type { MediaLabels } from '~/content/types'
import { lightMarkdown } from '~/lib/light-markdown'

/** One stretch of an article: its prose, then the picture or video that follows it. */
export interface ArticlePart {
  /** The prose, in light markdown: paragraphs, "## " and "### " subheadings, lists, "> " quotes, **bold**, *italics*, [links](/path). */
  body?: string
  /** A picture under the prose (from the page folder). */
  image?: PictureSource
  /** Alt text of the picture. */
  alt?: string
  /** A line under the picture or video. */
  caption?: string
  /** The picture's width in px when it is smaller than the column (an icon, a small diagram). */
  imageWidth?: number
  /** A YouTube video under the prose, instead of a picture. */
  video?: Video
  /** A short silent video of the page folder under the prose, instead of a picture. */
  clip?: Clip
  /** A recording of the page folder under the prose, in a player. */
  audio?: Audio
}

export interface ArticleProps extends ShellProps {
  /** The article in order: prose, picture, prose, video… */
  items: ArticlePart[]
  /** Column width: narrow 900px (default, a reading column) or content 1140px. */
  width?: 'narrow' | 'content'
  /** What the article is, for screen readers, when it has no title. */
  label?: string
  /** The words of the play buttons: `media` from content/<locale>/data/labels. */
  labels?: MediaLabels
  /** The still shown over a video until it is played. */
  videoPoster?: PictureSource
}

/**
 * Long-form prose in one reading column: a blog post, a legal text, a guide. Paragraphs with their own
 * subheadings, lists and quotes, and pictures, recordings, YouTube videos or short looping clips between them, each with an
 * optional caption. The article's parts follow one another without the gaps between blocks.
 */
export function Article({
  items,
  width = 'narrow',
  label,
  labels,
  videoPoster,
  ...shell
}: ArticleProps) {
  const caption = (p: ArticlePart) =>
    p.caption && (p.video || p.clip || p.audio) ? { ...p, caption: undefined } : p
  return (
    <BlockShell {...shell} width={width} align="start" label={label}>
      <div className="flex flex-col gap-stack text-ink [overflow-wrap:break-word] [&>h2]:mt-6 [&>h3]:mt-4 [&>figure]:my-4">
        {items.map((p, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the stored order is the article's order
          <Fragment key={i}>
            {p.body ? lightMarkdown(p.body) : null}
            {p.image || p.video || p.clip || p.audio ? (
              <div
                className="mx-auto w-full"
                style={p.imageWidth && p.image ? { maxWidth: p.imageWidth } : undefined}
              >
                <Media
                  {...caption(p)}
                  video={p.video && { ...p.video, caption: p.caption ?? p.video.caption }}
                  clip={p.clip && { ...p.clip, caption: p.caption ?? p.clip.caption }}
                  audio={p.audio}
                  labels={labels}
                  videoPoster={videoPoster}
                  sizes={p.imageWidth ? `${p.imageWidth}px` : '(min-width: 900px) 860px, 100vw'}
                  imageClassName="mx-auto w-auto max-w-full"
                />
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </BlockShell>
  )
}
