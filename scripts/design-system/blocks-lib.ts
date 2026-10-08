import fs from 'node:fs'
import path from 'node:path'
import { type BlockDoc, catalogue, ROLES } from '../../src/components/blocks/catalogue'
import { DEFAULT_LOCALE } from '../../src/i18n/routing'
import { readAllEntries } from '../lib/content-fs'

/**
 * Reads each block's `<Name>Props` interface straight from its source, so `pnpm ds:blocks` can show the
 * props (with their doc comments and allowed values) and `pnpm ds:review` can reject a wrong prop name,
 * a missing required prop or a value outside a union before anything is published. Light parsing on
 * purpose: the block files keep their props as one `export interface <Name>Props { … }` with one
 * member per line, which tests/unit/blocks.test.ts checks for every block.
 */

const BLOCKS = 'src/components/blocks'

export interface PropDoc {
  name: string
  optional: boolean
  /** The TypeScript type as written, e.g. `'left' | 'right'`, `Step[]`, `PictureSource`. */
  type: string
  doc?: string
}

/** A block's props plus the named types they use (local interfaces and imported unions like IconName). */
export interface BlockProps {
  props: PropDoc[]
  types: Record<string, PropDoc[] | string>
}

function members(body: string): PropDoc[] {
  const out: PropDoc[] = []
  let doc: string | undefined
  for (const line of body.split('\n')) {
    const t = line.trim()
    const comment = /^\/\*\*\s*(.*?)\s*\*\/$/.exec(t)
    if (comment) {
      doc = comment[1]
      continue
    }
    const m = /^(\w+)(\?)?:\s*(.+?)\s*$/.exec(t)
    if (m) {
      out.push({ name: m[1] as string, optional: !!m[2], type: m[3] as string, doc })
      doc = undefined
    }
  }
  return out
}

/** `interface X { … }` and `type X = …` declarations of a source file, by name. */
function declarations(source: string): Record<string, PropDoc[] | string> {
  const out: Record<string, PropDoc[] | string> = {}
  for (const m of source.matchAll(/^(?:export )?interface (\w+) \{\n([\s\S]*?)\n\}/gm))
    out[m[1] as string] = members(m[2] as string)
  for (const m of source.matchAll(/^(?:export )?type (\w+) =([\s\S]*?)(?=\n\S|\n\n)/gm))
    out[m[1] as string] = (m[2] as string).replace(/\s+/g, ' ').replace(/^ \| /, '').trim()
  return out
}

const cache = new Map<string, BlockProps | undefined>()

/** The props of block `name`; undefined for a block without a `<Name>Props` interface (layout). */
export function blockProps(name: string): BlockProps | undefined {
  if (cache.has(name)) return cache.get(name)
  const file = path.join(BLOCKS, `${name}.tsx`)
  let result: BlockProps | undefined
  if (fs.existsSync(file)) {
    const source = fs.readFileSync(file, 'utf8')
    const local = declarations(source)
    const props = local[`${name}Props`]
    if (Array.isArray(props)) {
      // named types from `~/…` imports (e.g. IconName from primitives/Icon)
      const imported: Record<string, PropDoc[] | string> = {}
      for (const m of source.matchAll(/import [^\n]*from '~\/([^']+)'/g)) {
        const f = `src/${m[1]}.tsx`
        if (fs.existsSync(f)) Object.assign(imported, declarations(fs.readFileSync(f, 'utf8')))
      }
      const all = { ...imported, ...local }
      const types: Record<string, PropDoc[] | string> = {}
      const collect = (type: string) => {
        for (const word of type.match(/\b[A-Z]\w+/g) ?? [])
          if (all[word] !== undefined && types[word] === undefined && word !== `${name}Props`) {
            types[word] = all[word] as PropDoc[] | string
            const t = types[word]
            if (Array.isArray(t)) for (const p of t) collect(p.type)
          }
      }
      for (const p of props) collect(p.type)
      result = { props, types }
    }
  }
  cache.set(name, result)
  return result
}

const literals = (type: string): string[] | undefined => {
  const parts = type.split('|').map((s) => s.trim())
  return parts.every((p) => /^'[^']*'$/.test(p)) ? parts.map((p) => p.slice(1, -1)) : undefined
}

/** Problems of `value` against `type` (empty when it fits, or when the type is not checkable here). */
function check(where: string, value: unknown, type: string, types: BlockProps['types']): string[] {
  const t = type.trim()
  if (t.endsWith('[]')) {
    if (!Array.isArray(value)) return [`${where} must be a list`]
    return value.flatMap((v, i) => check(`${where}[${i}]`, v, t.slice(0, -2), types))
  }
  if (t === 'string' || t === 'ReactNode')
    return typeof value === 'string' ? [] : [`${where} must be text`]
  // a picture is written "img/<file>" in a mockup; prepareSections checks and resolves it
  if (t === 'PictureSource')
    return typeof value === 'string' || (value && typeof value === 'object')
      ? []
      : [`${where} must be a picture: "img/<file>"`]
  if (t === 'number') return typeof value === 'number' ? [] : [`${where} must be a number`]
  if (t === 'boolean') return typeof value === 'boolean' ? [] : [`${where} must be true or false`]
  const named = types[t]
  const union = literals(typeof named === 'string' ? named : t)
  if (union)
    return typeof value === 'string' && union.includes(value)
      ? []
      : [`${where} is ${JSON.stringify(value)}: use one of ${union.join(', ')}`]
  const inline = /^\{(.*)\}$/.exec(t)
  const fields = Array.isArray(named)
    ? named
    : inline
      ? members((inline[1] as string).split(';').join('\n'))
      : undefined
  if (fields) return checkObject(where, value, fields, types)
  return [] // shapes this light parser does not know: the bundle renders them as given
}

function checkObject(
  where: string,
  value: unknown,
  fields: PropDoc[],
  types: BlockProps['types'],
): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return [`${where} must be an object with ${fields.map((f) => f.name).join(', ')}`]
  const errors: string[] = []
  const obj = value as Record<string, unknown>
  for (const key of Object.keys(obj)) {
    const field = fields.find((f) => f.name === key)
    if (!field)
      errors.push(`${where} has no prop "${key}": it takes ${fields.map((f) => f.name).join(', ')}`)
    else errors.push(...check(`${where}.${key}`, obj[key], field.type, types))
  }
  for (const f of fields)
    if (!f.optional && !(f.name in obj)) errors.push(`${where} needs "${f.name}" (${f.type})`)
  return errors
}

/** Problems of a real block's data-props (unknown prop, missing required prop, value of the wrong kind). */
export function checkProps(name: string, props: unknown): string[] {
  const block = blockProps(name)
  if (!block) return []
  return checkObject(name, props ?? {}, block.props, block.types)
}

// --- the index: every block by role, with where it is used (computed from the pages, never written down)

/** Pages using each block, as `slug` (`<locale>/<slug>` outside the default locale), from the MDX itself. */
export function blockUsage(entries = readAllEntries()): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const name of Object.keys(catalogue)) out[name] = []
  for (const e of entries) {
    const page = e.locale === DEFAULT_LOCALE ? e.slug : `${e.locale}/${e.slug}`
    for (const name of Object.keys(catalogue)) {
      // PageHero comes from frontmatter `hero` on every template but home
      const used =
        new RegExp(`<${name}\\b`).test(e.body) ||
        (name === 'PageHero' && 'hero' in e.meta && !!e.meta.hero)
      if (used) out[name]?.push(page)
    }
  }
  return out
}

/** `used on: a, b` or `not used yet`, for the index and the detail. */
export const usageLine = (pages: string[]): string =>
  pages.length ? `used on: ${pages.join(', ')}` : 'not used on any page yet'

/**
 * The one-screen index `pnpm ds:blocks` prints without arguments: the blocks grouped by role in page order,
 * one line of purpose, when to pick each and when not, and where it is used. Props and the ready mockup
 * line stay behind `pnpm ds:blocks <Block>`.
 */
export function blockIndex(usage = blockUsage()): string {
  const out: string[] = []
  for (const [role, meaning] of Object.entries(ROLES)) {
    out.push(`## ${role}: ${meaning}`)
    for (const [name, doc] of Object.entries(catalogue).filter(([, d]) => d.role === role)) {
      const d = doc as BlockDoc
      out.push(`- ${name}: ${d.description}`)
      out.push(`  use when: ${d.useWhen}`)
      if (d.notFor) out.push(`  not for: ${d.notFor}`)
      out.push(`  ${usageLine(usage[name] ?? [])}`)
    }
    out.push('')
  }
  return out.join('\n')
}
