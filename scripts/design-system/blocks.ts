import { CATEGORIES, catalogue } from '../../src/components/blocks/catalogue'
import {
  blockDescription,
  blockIndex,
  blockProps,
  blockUsage,
  type PropDoc,
  usageLine,
} from './blocks-lib'
import { encodeProps, LAYOUT } from './review-lib'

/**
 * What whoever composes a page needs to know about the blocks, without opening their code, in two tiers:
 *   pnpm ds:blocks                   the index: every block by category (what it shows), one line of
 *                                    purpose, when to pick it and when not, and the pages that use it
 *   pnpm ds:blocks MediaText Steps   the detail of the blocks picked: every prop with its type, allowed
 *                                    values and doc comment, a ready `data-msmt` line built from the
 *                                    catalogue defaults, where its data lives and the guidelines
 *   pnpm ds:blocks --all             the detail of every block
 * The description and the props come from each block's source, the rest of the prose from catalogue.ts, and
 * where each block is used from the pages.
 */
const args = process.argv.slice(2)
const all = Object.keys(catalogue) as (keyof typeof catalogue)[]
const names = args.includes('--all') ? [...all] : args
const unknown = names.filter((n) => !(all as string[]).includes(n) && !LAYOUT.includes(n as never))
if (unknown.length) {
  console.error(`[ds:blocks] unknown block ${unknown.join(', ')}: use one of ${all.join(', ')}`)
  process.exit(1)
}

console.log(`Layout (no props): ${LAYOUT.join(', ')}. TopBar and Header first, Footer last.\n`)
const usage = blockUsage()

if (!names.length) {
  console.log(blockIndex(usage))
  console.log(
    'Details of the blocks you picked (props, allowed values, a ready mockup line, data, guidelines):\n  pnpm ds:blocks <Block> [<Block>...]     (every block: pnpm ds:blocks --all)',
  )
  process.exit(0)
}

// in a mockup a picture is the string "img/<file>", whatever PictureSource looks like in code
const mockupType = (t: string) => t.replaceAll('PictureSource', '"img/<file>"')
const line = (p: PropDoc) =>
  `  ${p.name}${p.optional ? '?' : ''}: ${mockupType(p.type)}${p.doc ? `  // ${p.doc}` : ''}`

// the catalogue previews pictures with "sample:<kind>"; a mockup names its own file in img/
const forMockup = (v: unknown): unknown =>
  typeof v === 'string' && v.startsWith('sample:')
    ? 'img/<file>'
    : Array.isArray(v)
      ? v.map(forMockup)
      : v && typeof v === 'object'
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, forMockup(x)]))
        : v

for (const name of names.filter((n) => n in catalogue)) {
  const doc = catalogue[name as keyof typeof catalogue]
  const block = blockProps(name)
  const out = [
    `## ${name} (${CATEGORIES[doc.category].label})`,
    blockDescription(name),
    `use when: ${doc.useWhen}`,
    ...('notFor' in doc ? [`not for: ${doc.notFor}`] : []),
    usageLine(usage[name] ?? []),
  ]
  if (block) {
    out.push('props:', ...block.props.map(line))
    for (const [type, def] of Object.entries(block.types).filter(([t]) => t !== 'PictureSource'))
      out.push(Array.isArray(def) ? `${type}:\n${def.map(line).join('\n')}` : `${type} = ${def}`)
  }
  const props = {
    ...(forMockup(doc.defaults) as object),
    ...('children' in doc ? { children: doc.children } : {}),
  }
  out.push(
    'mockup:',
    Object.keys(props).length
      ? `  <div data-msmt="${name}" data-props='${encodeProps(JSON.stringify(props))}'></div>`
      : `  <div data-msmt="${name}"></div>`,
  )
  if ('dataSource' in doc) out.push(`data: ${doc.dataSource}`)
  if ('guidelines' in doc) out.push(`guidelines: ${doc.guidelines}`)
  console.log(`${out.join('\n')}\n`)
}
