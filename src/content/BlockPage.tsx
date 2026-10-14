import type { ComponentType } from 'react'
import { blocks } from '~/components/blocks'
import { cmsBlocks, isCmsBlock } from '~/components/blocks/cms'
import type { MediaLabels, ReviewLabels } from '~/content/types'
import { lightMarkdown } from '~/lib/light-markdown'
import type { AnyCmsBlock } from './cms-fields'
import type { DataBlock } from './data-page'

/** The locale's block words (content/<locale>/data/labels.ts), given to the blocks that show them. */
export interface BlockWords {
  mediaLabels: MediaLabels
  reviewLabels: ReviewLabels
}

/**
 * The body of a data page (src/content/data-page.ts): its blocks in order, already resolved (`resolveBlock`: pictures
 * as PictureSources, data names as the locale's lists, table rows as cells), `labels` from the locale's words where the block's CMS entry says, `body` (light markdown) rendered as the block's children. The site renders it from page.json
 * and the CMS preview renders it from the entry being edited.
 */
export function BlockPage({ blocks: list, words }: { blocks: DataBlock[]; words: BlockWords }) {
  return (
    <>
      {list.map(({ type, body, ...props }, i) => {
        if (!isCmsBlock(type))
          throw new Error(`Unknown block "${type}" (known: ${Object.keys(cmsBlocks).join(', ')})`)
        const entry = cmsBlocks[type] as AnyCmsBlock
        // biome-ignore lint/suspicious/noExplicitAny: each block takes its own props, checked against its CMS fields
        const Block = blocks[(entry.block ?? type) as keyof typeof blocks] as ComponentType<any>
        const w = entry.words
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: the stored order is the page's order
          <Block key={i} {...props} labels={w && words[w]}>
            {body ? lightMarkdown(body) : undefined}
          </Block>
        )
      })}
    </>
  )
}
