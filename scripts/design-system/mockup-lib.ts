import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { catalogue } from '../../src/components/blocks/catalogue'
import { CONTENT_DIR } from '../lib/content-fs'
import {
  evalTsLiteral,
  LiteralError,
  parseTsx,
  readModuleLiterals,
  unwrap,
  where,
} from '../lib/ts-literal'
import { encodeProps, LAYOUT, WRAPPER_OPEN } from './review-lib'

/**
 * Pure pieces of `pnpm ds:mockup`: an existing page (its index.tsx and meta.ts) as the sections.html the page
 * skill previews from, so a change to a live page starts from a mechanical, faithful mockup. The page is read
 * statically with the TypeScript parser, never run. Only what the mockup format can show is accepted (blocks with
 * literal props, picture imports, prose written with the typography components); anything else fails with the
 * line it came from, never silently.
 */

export interface MockupEntry {
  /** `<locale>/<collection>/<slug>/index.tsx`, relative to content/ */
  file: string
  /** Locale-free public path. */
  path: string
  meta: {
    type: string
    title: string
  }
  /** The text of index.tsx. */
  source: string
}

export interface MockupBlock {
  name: string
  props?: Record<string, unknown>
}

export interface MockupResult {
  sections: string
  blocks: MockupBlock[]
  /** Pictures the page folder holds, to copy into mockups/<slug>/img/. */
  images: string[]
  /** The page's H1 (the title of its PageHeader or Hero) or its SEO title. */
  title: string
  path: string
  warnings: string[]
}

class MockupError extends Error {}

/** The h1 a page writes itself: the `title` of its first PageHeader or Hero block. */
function pageTitle(blocks: MockupBlock[]): string | undefined {
  const opening = blocks.find((b) => b.name === 'PageHeader' || b.name === 'Hero')
  const title = opening?.props?.title
  return typeof title === 'string' ? title : undefined
}

const IMAGE_IMPORT = /^\.\/([\w.-]+\.(?:png|jpe?g|webp|gif|svg))(?:\?.*)?$/i
const BLOCKS_MODULE = '~/components/blocks'
const TYPOGRAPHY_MODULE = '~/components/typography'
/** Typography components that make a paragraph of their own; TextLink (and plain <strong>, <em>) are inline. */
const PARAGRAPHS = ['Text', 'Heading']
const TYPOGRAPHY = [...PARAGRAPHS, 'TextLink', 'List', 'ListItem', 'Quote', 'Divider']

function fail(message: string, node?: ts.Node): never {
  throw new MockupError(`cannot mockup: ${message}${node ? where(node) : ''}`)
}

/**
 * A literal JSX attribute expression as a JSON value; picture imports become `img/<file>`, data imports
 * (`import { ratings } from '@content/en/data/ratings'`) their values.
 */
export function evalLiteral(
  node: ts.Expression,
  imports: Record<string, string>,
  source = '',
  data: Record<string, unknown> = {},
): unknown {
  const pictures = Object.fromEntries(Object.entries(imports).map(([k, f]) => [k, `img/${f}`]))
  try {
    return evalTsLiteral(node, { ...data, ...pictures }, source)
  } catch (e) {
    if (e instanceof LiteralError) throw new MockupError(`cannot mockup: ${e.message}`)
    throw e
  }
}

type Element = ts.JsxElement | ts.JsxSelfClosingElement

const isElement = (n: ts.Node): n is Element => ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n)

function tagName(n: Element): string {
  const tag = ts.isJsxElement(n) ? n.openingElement.tagName : n.tagName
  if (ts.isIdentifier(tag)) return tag.text
  return fail(`<${tag.getText()}>: only plain component names are supported`, n)
}

const childrenOf = (n: Element): readonly ts.JsxChild[] => (ts.isJsxElement(n) ? n.children : [])

const attributesOf = (n: Element) =>
  (ts.isJsxElement(n) ? n.openingElement : n).attributes.properties

/** JSX text as React renders it: lines trimmed and joined by one space, blank lines dropped (Babel's rule). */
function jsxText(node: ts.JsxText): string {
  const raw = node.text // getText() would drop the leading whitespace
  if (/&[#\w]+;/.test(raw)) fail('an HTML entity in the text: write the character itself', node)
  const lines = raw.split(/\r\n|\n|\r/)
  let lastNonEmpty = -1
  for (const [i, l] of lines.entries()) if (/[^ \t]/.test(l)) lastNonEmpty = i
  let out = ''
  for (const [i, l] of lines.entries()) {
    let line = l.replace(/\t/g, ' ')
    if (i > 0) line = line.replace(/^ +/, '')
    if (i < lines.length - 1) line = line.replace(/ +$/, '')
    if (line) out += i === lastNonEmpty ? line : `${line} `
  }
  return out
}

const RAW_TAG_HINT = `use the typography components (Text, Heading, List, TextLink…) from ${TYPOGRAPHY_MODULE}; only <strong> and <em> stay plain`

function inline(nodes: readonly ts.JsxChild[], parent: string): string {
  let out = ''
  for (const n of nodes) {
    if (ts.isJsxText(n)) {
      out += jsxText(n)
      continue
    }
    if (ts.isJsxExpression(n)) {
      if (!n.expression) continue // a {/* comment */}
      const e = unwrap(n.expression)
      if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) out += e.text
      else fail(`an expression {${e.getText()}} inside <${parent}>`, n)
      continue
    }
    if (!isElement(n)) fail(`a fragment inside <${parent}>`, n)
    const name = tagName(n)
    if (name === 'strong' || name === 'b')
      out += `**${inline(childrenOf(n), parent).replaceAll('**', '')}**`
    else if (name === 'em' || name === 'i' || name === 'TextLink')
      out += inline(childrenOf(n), parent)
    else if (name === 'br') out += ' '
    else if (['img', 'picture', 'Picture'].includes(name))
      fail(`a picture inside <${parent}>: pictures are props, not prose`, n)
    else if (TYPOGRAPHY.includes(name))
      fail(`<${name}> inside a line of text in <${parent}>: it starts a paragraph of its own`, n)
    else if (/^[a-z]/.test(name)) fail(`<${name}> inside <${parent}>: ${RAW_TAG_HINT}`, n)
    else fail(`<${name}> inside <${parent}>: nested components are not shown in a mockup`, n)
  }
  return out
}

/** Block children as the light markdown the bundle renders: one paragraph per Text/Heading, **bold** kept. */
export function flattenChildren(
  nodes: readonly ts.JsxChild[],
  parent = 'block',
): string | undefined {
  const paragraphs: string[] = []
  let line: ts.JsxChild[] = []
  const flush = () => {
    if (line.length) paragraphs.push(inline(line, parent).trim())
    line = []
  }
  for (const n of nodes) {
    const name = isElement(n) ? tagName(n) : ''
    if (!isElement(n) || !['List', 'Quote', 'Divider', ...PARAGRAPHS].includes(name)) {
      line.push(n)
      continue
    }
    flush()
    if (PARAGRAPHS.includes(name)) paragraphs.push(inline(childrenOf(n), name).trim())
    else if (name === 'Quote') paragraphs.push(flattenChildren(childrenOf(n), name) ?? '')
    else if (name === 'List')
      for (const item of childrenOf(n)) {
        if (ts.isJsxText(item) && item.containsOnlyTriviaWhiteSpaces) continue
        if (ts.isJsxExpression(item) && !item.expression) continue
        if (!isElement(item) || tagName(item) !== 'ListItem')
          fail(`only <ListItem> goes inside <List>`, item)
        paragraphs.push(flattenChildren(childrenOf(item), 'ListItem') ?? '')
      }
  }
  flush()
  const text = paragraphs.filter(Boolean).join('\n\n')
  return text || undefined
}

function attributeValue(
  attr: ts.JsxAttribute,
  imports: Record<string, string>,
  block: string,
  data: Record<string, unknown>,
): unknown {
  const init = attr.initializer
  if (!init) return true
  if (ts.isStringLiteral(init)) return init.text
  if (ts.isJsxExpression(init) && init.expression)
    return evalLiteral(
      init.expression,
      imports,
      `<${block} ${attr.name.getText()}={${init.expression.getText()}}>`,
      data,
    )
  return fail(`<${block} ${attr.name.getText()}=…> is not a value`, attr)
}

/** One `<div data-msmt="…" data-props='…'></div>` line per block, inside the standard wrapper. */
export function serializeBlocks(blocks: MockupBlock[]): string {
  const lines = blocks.map(({ name, props }) => {
    const json =
      props && Object.keys(props).length
        ? ` data-props='${encodeProps(JSON.stringify(props))}'`
        : ''
    return `  <div data-msmt="${name}"${json}></div>`
  })
  const out: string[] = [WRAPPER_OPEN]
  for (const [i, line] of lines.entries()) {
    // The top of the page (TopBar, Header, the page's header) sits together; every other block is set off by a blank line.
    if (i > 0 && !['TopBar', 'Header'].includes(blocks[i - 1]?.name ?? '')) out.push('')
    out.push(line)
  }
  out.push('</div>', '')
  return out.join('\n')
}

const DATA_MODULE = /^@content\/([a-z]{2})\/data\/([\w-]+)$/

/** Reads `content/<locale>/data/<file>.ts` statically (never runs it). */
export type DataReader = (locale: string, file: string) => string
const readDataFile: DataReader = (locale, file) =>
  fs.readFileSync(path.join(CONTENT_DIR, locale, 'data', `${file}.ts`), 'utf8')

/** The page's imports and the JSX its default export returns (a fragment's children, or one element). */
function readPage(
  sf: ts.SourceFile,
  readData: DataReader,
  warnings: string[],
): {
  imports: Record<string, string>
  data: Record<string, unknown>
  nodes: readonly ts.JsxChild[]
} {
  const imports: Record<string, string> = {}
  const data: Record<string, unknown> = {}
  const pageLocale = /^([a-z]{2})\//.exec(sf.fileName)?.[1]
  let fn: ts.FunctionLikeDeclaration | undefined
  const isDefaultExport = (s: ts.Statement) =>
    ts.canHaveModifiers(s) &&
    !!ts.getModifiers(s)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
    !!ts.getModifiers(s)?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
  for (const s of sf.statements) {
    if (ts.isImportDeclaration(s)) {
      const from = (s.moduleSpecifier as ts.StringLiteral).text
      const clause = s.importClause
      if (!clause || clause.isTypeOnly) continue
      const picture = IMAGE_IMPORT.exec(from)
      if (picture && clause.name && !clause.namedBindings) {
        imports[clause.name.text] = picture[1] as string
        continue
      }
      if ((from === BLOCKS_MODULE || from === TYPOGRAPHY_MODULE) && !clause.name) continue
      const dataModule = DATA_MODULE.exec(from)
      const named = clause.namedBindings
      if (dataModule && !clause.name && named && ts.isNamedImports(named)) {
        const [, locale, file] = dataModule as unknown as [string, string, string]
        if (pageLocale && locale !== pageLocale)
          warnings.push(`${from}: data of another locale than the page (${pageLocale})`)
        let values: Record<string, unknown>
        try {
          values = readModuleLiterals(readData(locale, file), `content/${locale}/data/${file}.ts`)
        } catch (e) {
          if (e instanceof LiteralError) fail(e.message, s)
          return fail(`cannot read ${from}: ${(e as Error).message}`, s)
        }
        for (const el of named.elements) {
          if (el.isTypeOnly) continue
          const name = (el.propertyName ?? el.name).text
          if (!Object.hasOwn(values, name)) fail(`${from} has no "${name}"`, el)
          data[el.name.text] = values[name]
        }
        continue
      }
      fail(
        `import of ${from} (only blocks from '${BLOCKS_MODULE}', text from '${TYPOGRAPHY_MODULE}', data from '@content/<locale>/data/<file>' and pictures "import x from './picture.png?…'" are supported)`,
        s,
      )
    }
    if (ts.isFunctionDeclaration(s) && isDefaultExport(s)) {
      fn = s
      continue
    }
    if (ts.isExportAssignment(s) && !s.isExportEquals) {
      const e = unwrap(s.expression)
      if (ts.isArrowFunction(e) || ts.isFunctionExpression(e)) {
        fn = e
        continue
      }
    }
    if (ts.isExportAssignment(s) || ts.isExportDeclaration(s) || isExport(s))
      fail('an export in the page (only the default export, the page component)', s)
    fail(`${ts.SyntaxKind[s.kind]} in the page (only imports and the default export)`, s)
  }
  if (!fn?.body)
    return fail('no default export (export default function Page() { return (<>…</>) })')
  let returned: ts.Expression | undefined
  if (ts.isBlock(fn.body)) {
    const [only, ...rest] = fn.body.statements
    if (only && !rest.length && ts.isReturnStatement(only)) returned = only.expression
    if (!returned) fail('the page component may only "return (<>…</>)"', fn.body)
  } else returned = fn.body
  const jsx = unwrap(returned as ts.Expression)
  if (ts.isJsxFragment(jsx)) return { imports, data, nodes: jsx.children }
  if (isElement(jsx)) return { imports, data, nodes: [jsx] }
  return fail('the page must return a fragment of blocks (<>…</>)', jsx)
}

function isExport(s: ts.Statement): boolean {
  return (
    ts.canHaveModifiers(s) &&
    !!ts.getModifiers(s)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
  )
}

export function mockupFromEntry(
  entry: MockupEntry,
  readData: DataReader = readDataFile,
): MockupResult {
  const warnings: string[] = []
  const used = new Set<string>()
  const body: MockupBlock[] = []
  const { imports, data, nodes } = readPage(parseTsx(entry.source, entry.file), readData, warnings)
  let prose: ts.JsxChild[] = []
  const flushProse = () => {
    if (!prose.length) return
    const text = flattenChildren(prose, 'page')
    const first = prose.find((n) => !(ts.isJsxText(n) && n.containsOnlyTriviaWhiteSpaces))
    if (text) {
      body.push({ name: 'Section', props: { children: text } })
      warnings.push(
        `prose outside a block${first ? where(first) : ''} is shown in a Section; the page builds it as plain prose`,
      )
    }
    prose = []
  }

  for (const node of nodes) {
    if (ts.isJsxText(node)) {
      if (!node.containsOnlyTriviaWhiteSpaces) prose.push(node)
      continue
    }
    if (ts.isJsxExpression(node)) {
      if (!node.expression) continue // a {/* comment */}
      const e = unwrap(node.expression)
      if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) prose.push(node)
      else fail(`an expression {${e.getText()}} in the page`, node)
      continue
    }
    if (!isElement(node)) fail('a nested fragment in the page', node)
    const name = tagName(node)
    if (TYPOGRAPHY.includes(name)) {
      prose.push(node)
      continue
    }
    if (/^[a-z]/.test(name)) fail(`<${name}> in the page: ${RAW_TAG_HINT}, inside a block`, node)
    flushProse()
    if ((LAYOUT as readonly string[]).includes(name))
      fail(`<${name}> in the page: the layout comes with every page`, node)
    if (!(name in catalogue)) fail(`unknown block <${name}>`, node)
    const props: Record<string, unknown> = {}
    for (const attr of attributesOf(node)) {
      if (!ts.isJsxAttribute(attr)) fail(`<${name} {...}> spread attributes`, attr)
      const attrName = attr.name.getText()
      if (name === 'ContactSection' && attrName === 'returnTo') {
        warnings.push(`<ContactSection returnTo> left out: the page derives it from its path`)
        continue
      }
      const value = attributeValue(attr, imports, name, data)
      if (value === undefined) continue
      if (typeof value === 'string' && value.startsWith('img/')) used.add(value.slice(4))
      if (Array.isArray(value) || (value && typeof value === 'object'))
        for (const v of JSON.stringify(value).matchAll(/"img\/([\w.-]+)"/g))
          used.add(v[1] as string)
      props[attrName] = value
    }
    const children = flattenChildren(childrenOf(node), name)
    if (children) props.children = children
    body.push({ name, props })
  }
  flushProse()
  for (const [local, file] of Object.entries(imports))
    if (!used.has(file)) warnings.push(`import "${local}" (${file}) is not used by any block`)
  const last = body.findIndex((b) => b.name === 'ContactSection')
  if (last >= 0 && last !== body.length - 1)
    warnings.push('ContactSection is not the last block; the design system expects it last')

  const blocks: MockupBlock[] = [{ name: 'TopBar' }, { name: 'Header' }]
  blocks.push(...body, { name: 'Footer' })
  return {
    sections: serializeBlocks(blocks),
    blocks,
    images: [...used].sort(),
    title: pageTitle(body) ?? entry.meta.title,
    path: entry.path,
    warnings,
  }
}
