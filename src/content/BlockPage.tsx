import type { ComponentType } from 'react'
import { blocks } from '~/components/blocks'
import type { MediaLabels, ReviewLabels } from '~/content/types'
import { lightMarkdown } from '~/lib/light-markdown'
import type { DataBlock } from './data-page'

/** The locale's block words (content/<locale>/data/labels.ts), given to the blocks that show them. */
export interface BlockWords {
  mediaLabels: MediaLabels
  reviewLabels: ReviewLabels
}

const MEDIA_LABELLED = new Set(['PageHeader', 'MediaText', 'Samples', 'Steps'])

/** `[label](href)` alone in a cell: a link cell. */
const LINK_CELL = /^\[([^\]]+)\]\(([^)\s]+)\)$/

/**
 * What the CMS stores where a block's props need another shape: a table row is `{ cells: [...] }` (a list of
 * lists cannot be edited as such) and a link cell is written `[See more](/job/x)`.
 */
function adapt(type: string, props: Record<string, unknown>): Record<string, unknown> {
  if (type === 'Table' && Array.isArray(props.rows))
    return {
      ...props,
      rows: props.rows.map((row: unknown) =>
        (Array.isArray(row) ? row : ((row as { cells?: unknown[] }).cells ?? [])).map((cell) => {
          const link = typeof cell === 'string' ? LINK_CELL.exec(cell.trim()) : null
          return link ? { label: link[1], href: link[2] } : cell
        }),
      ),
    }
  return props
}

/**
 * The body of a data page (src/content/data-page.ts): its blocks in order, pictures already resolved to
 * PictureSources, `body` (light markdown) rendered as the block's children. The site renders it from page.json
 * and the CMS preview renders it from the entry being edited.
 */
export function BlockPage({ blocks: list, words }: { blocks: DataBlock[]; words: BlockWords }) {
  return (
    <>
      {list.map(({ type, body, ...props }, i) => {
        // biome-ignore lint/suspicious/noExplicitAny: each block takes its own props, checked by the CMS fields
        const Block = (blocks as Record<string, ComponentType<any>>)[type]
        if (!Block)
          throw new Error(`Unknown block "${type}" (known: ${Object.keys(blocks).join(', ')})`)
        const labels =
          props.labels ??
          (MEDIA_LABELLED.has(type)
            ? words.mediaLabels
            : type === 'Testimonials'
              ? words.reviewLabels
              : undefined)
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: the stored order is the page's order
          <Block key={i} {...adapt(type, props)} labels={labels}>
            {body ? lightMarkdown(body) : undefined}
          </Block>
        )
      })}
    </>
  )
}
