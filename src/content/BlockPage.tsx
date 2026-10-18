import type { ComponentType } from 'react'
import { blocks } from '~/components/blocks'
import { cmsBlocks, isCmsBlock } from '~/components/blocks/cms'
import type { PictureSource } from '~/components/primitives/Picture'
import type { MediaLabels, PostCard, ReviewLabels, ShareLabels } from '~/content/types'
import { lightMarkdown } from '~/lib/light-markdown'
import type { AnyCmsBlock } from './cms-fields'
import type { DataBlock } from './data-page'

/** The locale's block words (content/<locale>/data/labels.ts), given to the blocks that show them. */
export interface BlockWords {
  mediaLabels: MediaLabels
  reviewLabels: ReviewLabels
  shareLabels: ShareLabels
}

/** The locale's brand pictures (content/<locale>/data/brand.ts) the blocks take without a field for them. */
export interface BlockBrand {
  /** The still of every video until it is played, given to the blocks that get the media words. */
  videoPoster?: PictureSource
}

/**
 * The body of a data page (src/content/data-page.ts): its blocks in order, already resolved (`resolveBlock`: pictures
 * as PictureSources, data names as the locale's lists, table rows as cells), `labels` from the locale's words where the
 * block's CMS entry says (and the brand's video poster with the media words), `body` (light markdown) rendered as the
 * block's children, and the blog's posts to the blocks that list them. The site renders it from page.json
 * and the CMS preview renders it from the entry being edited.
 */
export function BlockPage({
  blocks: list,
  words,
  brand = {},
  posts = [],
}: {
  blocks: DataBlock[]
  words: BlockWords
  brand?: BlockBrand
  /** The blog posts of the page's language, for the blocks that list them (`feed: 'posts'`). */
  posts?: PostCard[]
}) {
  return (
    <>
      {list.map(({ type, body, ...props }, i) => {
        if (!isCmsBlock(type))
          throw new Error(`Unknown block "${type}" (known: ${Object.keys(cmsBlocks).join(', ')})`)
        const entry = cmsBlocks[type] as AnyCmsBlock
        // biome-ignore lint/suspicious/noExplicitAny: each block takes its own props, checked against its CMS fields
        const Block = blocks[(entry.block ?? type) as keyof typeof blocks] as ComponentType<any>
        const w = entry.words
        const poster = w === 'mediaLabels' ? brand.videoPoster : undefined
        const given = {
          labels: w && words[w],
          ...(poster && { videoPoster: poster }),
          ...(entry.feed === 'posts' && { items: posts }),
        }
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: the stored order is the page's order
          <Block key={i} {...props} {...given}>
            {body ? lightMarkdown(body) : undefined}
          </Block>
        )
      })}
    </>
  )
}
