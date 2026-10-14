/**
 * A data page: the second kind of page folder, edited in the CMS (/admin, Decap) instead of in code. Where a
 * hand-built page has `index.tsx` + `meta.ts`, a data page has one `page.json`: the meta fields at the top level
 * (the same schema as a meta.ts) and `blocks`, the page's blocks in order, each `{ "type": "<Block>", …props }`.
 * Its pictures sit in the folder as usual and are named by file name ("image": "office-8.jpg").
 *
 * Plain data and pure functions: shared by the Vite plugin that turns page.json into a page component
 * (scripts/lib/vite-data-pages.ts), the content loaders (src/content/index.ts, scripts/lib/content-fs.ts), the
 * renderer (src/content/BlockPage.tsx) and the CMS preview (src/admin/preview.tsx).
 */

export const DATA_PAGE_FILE = 'page.json'

/** A block as stored: its catalogue name and its props; `body` is light markdown for the block's children. */
export interface DataBlock {
  type: string
  body?: string
  [prop: string]: unknown
}

/**
 * A field the CMS saved empty ("" or null after someone cleared it, or an optional group such as a button with
 * nothing filled in) is a field left out: optional props and meta fields then take their defaults instead of failing
 * validation or rendering an empty line. Values inside lists (a table's empty heading) are kept.
 */
function dropEmpty(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(dropEmpty)
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .map(([k, v]) => [k, dropEmpty(v)] as const)
        .filter(([, v]) => v !== '' && v !== null && !isEmptyObject(v)),
    )
  return value
}
const isEmptyObject = (v: unknown) =>
  !!v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0

/** Splits a page.json into its meta (validated by the collection's schema) and its blocks. */
export function splitDataPage(data: unknown, file: string): { meta: unknown; blocks: DataBlock[] } {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error(`${file}: a page.json is one object (the meta fields and "blocks")`)
  const { blocks, ...meta } = dropEmpty(data) as Record<string, unknown>
  if (!Array.isArray(blocks) || blocks.some((b) => typeof b?.type !== 'string'))
    throw new Error(`${file}: "blocks" must be a list of { "type": "<Block>", … }`)
  return { meta, blocks: blocks as DataBlock[] }
}

const PICTURE = /^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp|avif)$/i

/** A picture of the page folder, as an `image` field names it. */
export const isPictureName = (value: unknown): value is string =>
  typeof value === 'string' && PICTURE.test(value)

/**
 * The srcset widths a block's pictures are built at (vite-imagetools `w=`), the ones its hand-built pages use.
 * One set per block: a picture's width is set by the block's layout, not by the page.
 */
const PICTURE_WIDTHS: Record<string, string> = {
  PictureGrid: '180;360',
  MediaText: '560;1000',
  PageHeader: '480;960',
}
export const pictureWidths = (block: string): string => PICTURE_WIDTHS[block] ?? '480;960'

/**
 * Every `image` field in a block, at any depth (`image`, `items[].image`, `images[].image`), replaced by what
 * `resolve` returns for its file name. Other values are kept as they are.
 */
export function mapPictures<T>(block: DataBlock, resolve: (file: string) => T): DataBlock {
  const walk = (value: unknown, key?: string): unknown => {
    if (key === 'image' && isPictureName(value)) return resolve(value)
    if (Array.isArray(value)) return value.map((v) => walk(v))
    if (value && typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, k)]))
    return value
  }
  return walk(block) as DataBlock
}
