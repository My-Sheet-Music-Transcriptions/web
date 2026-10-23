import type { ComponentType } from 'react'
import { blocks } from '~/components/blocks'
import { cmsBlocks, isCmsBlock } from '~/components/blocks/cms'
import type { PictureSource } from '~/components/primitives/Picture'
import { AddToCart } from '~/components/shop/AddToCart'
import { useCart } from '~/components/shop/CartProvider'
import type { MediaLabels, PostCard, PostLabels, ReviewLabels, ShareLabels } from '~/content/types'
import { lightMarkdown } from '~/lib/light-markdown'
import type { AnyCmsBlock } from './cms-fields'
import type { DataBlock } from './data-page'

/** The locale's block words (content/<locale>/data/labels.ts), given to the blocks that show them. */
export interface BlockWords {
  mediaLabels: MediaLabels
  reviewLabels: ReviewLabels
  shareLabels: ShareLabels
  /** The words of a post's fixed layout (src/content/post-template.ts). */
  postLabels: PostLabels
}

/** The locale's brand pictures (content/<locale>/data/brand.ts) the blocks take without a field for them. */
export interface BlockBrand {
  /** The still of every video until it is played, given to the blocks that get the media words. */
  videoPoster?: PictureSource
  /** The photo faded behind the homepage header on phones, given to every PageHeader. */
  heroPhone?: PictureSource
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
  product,
}: {
  blocks: DataBlock[]
  words: BlockWords
  brand?: BlockBrand
  /** The blog posts of the page's language, for the blocks that list them (`feed: 'posts'`). */
  posts?: PostCard[]
  /** A product page's product code (`shop.sku`): its PageHeader gets the price and the add-to-cart button. */
  product?: string
}) {
  // the shop's products as cards, for the blocks that list them (`feed: 'products'`): none outside the app's cart
  const products =
    useCart()?.products.map((p) => ({
      image: p.image,
      name: p.name,
      href: p.path,
      action: <AddToCart sku={p.sku} variant="compact" />,
    })) ?? []
  const buyIn = product ? list.findIndex((b) => b.type === 'PageHeader') : -1
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
          ...(type === 'PageHeader' && brand.heroPhone && { mobileImage: brand.heroPhone }),
          ...(entry.feed === 'posts' && { items: posts }),
          ...(entry.feed === 'products' && { items: products }),
          ...(i === buyIn && { actions: <AddToCart sku={product as string} /> }),
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
