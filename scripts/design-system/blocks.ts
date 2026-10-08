import { catalogue } from '../../src/components/blocks/catalogue'
import { blockProps, type PropDoc } from './blocks-lib'
import { encodeProps, LAYOUT } from './review-lib'

/**
 * Everything needed to write a mockup section, per block, in one read: what it is for, every prop with
 * its type, allowed values and doc comment (from the block's source), a ready `data-msmt` line built
 * from the catalogue defaults, where its data lives and the guidelines.
 *   pnpm ds:blocks               every block
 *   pnpm ds:blocks MediaText Steps
 */
const names = process.argv.slice(2)
const all = Object.keys(catalogue) as (keyof typeof catalogue)[]
const unknown = names.filter((n) => !(all as string[]).includes(n) && !LAYOUT.includes(n as never))
if (unknown.length) {
  console.error(`[ds:blocks] unknown block ${unknown.join(', ')}: use one of ${all.join(', ')}`)
  process.exit(1)
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

console.log(`Layout (no props): ${LAYOUT.join(', ')}. TopBar and Header first, Footer last.\n`)
for (const name of (names.length ? names : all).filter((n) => n in catalogue)) {
  const doc = catalogue[
    name as keyof typeof catalogue
  ] as (typeof catalogue)[keyof typeof catalogue] & {
    children?: string
    dataSource?: string
    guidelines?: string
  }
  const block = blockProps(name)
  const out = [`## ${name}`, doc.description]
  if (block) {
    out.push('props:', ...block.props.map(line))
    for (const [type, def] of Object.entries(block.types).filter(([t]) => t !== 'PictureSource'))
      out.push(Array.isArray(def) ? `${type}:\n${def.map(line).join('\n')}` : `${type} = ${def}`)
  }
  const props = {
    ...(forMockup(doc.defaults) as object),
    ...(doc.children ? { children: doc.children } : {}),
  }
  out.push(
    'mockup:',
    Object.keys(props).length
      ? `  <div data-msmt="${name}" data-props='${encodeProps(JSON.stringify(props))}'></div>`
      : `  <div data-msmt="${name}"></div>`,
  )
  if (doc.dataSource) out.push(`data: ${doc.dataSource}`)
  if (doc.guidelines) out.push(`guidelines: ${doc.guidelines}`)
  console.log(`${out.join('\n')}\n`)
}
