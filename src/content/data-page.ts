import { cmsBlocks, isCmsBlock } from '../components/blocks/cms.ts'
import { checkFields, decodeFields } from './cms-fields.ts'

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

/**
 * Splits a page.json into its meta (validated by the collection's schema) and its blocks, each checked against its
 * CMS fields (src/components/blocks/cms.ts): a block the CMS does not offer, a field it does not have or a value of the
 * wrong kind fails here, so at build and in the unit tests. The CMS preview passes `check: false` (a block being
 * filled in is incomplete until it is saved, and Decap checks it then).
 */
export function splitDataPage(
  data: unknown,
  file: string,
  { check = true } = {},
): { meta: unknown; blocks: DataBlock[] } {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error(`${file}: a page.json is one object (the meta fields and "blocks")`)
  const { blocks, ...meta } = dropEmpty(data) as Record<string, unknown>
  if (!Array.isArray(blocks) || blocks.some((b) => typeof b?.type !== 'string'))
    throw new Error(`${file}: "blocks" must be a list of { "type": "<Block>", … }`)
  if (check) {
    const problems = (blocks as DataBlock[]).flatMap(({ type, ...props }, i) =>
      isCmsBlock(type)
        ? checkFields(cmsBlocks[type].fields, props, `blocks[${i}] (${type})`)
        : [`blocks[${i}]: "${type}" is not a CMS block (${Object.keys(cmsBlocks).join(', ')})`],
    )
    if (problems.length) throw new Error(`${file}:\n  ${problems.join('\n  ')}`)
  }
  return { meta, blocks: blocks as DataBlock[] }
}

/** The srcset widths a block's pictures are built at (vite-imagetools `w=`). */
export const pictureWidths = (type: string): string =>
  isCmsBlock(type) ? cmsBlocks[type].pictureWidths : '480;960'

/**
 * A stored block as its block's props (and `body`): every picture field's file name replaced by what `picture`
 * returns for it, table rows and other stored shapes decoded (src/content/cms-fields.ts).
 */
export function resolveBlock<T>(
  { type, ...props }: DataBlock,
  picture: (file: string) => T,
): DataBlock {
  if (!isCmsBlock(type)) return { type, ...props }
  return { type, ...decodeFields(cmsBlocks[type].fields, props, picture) }
}
