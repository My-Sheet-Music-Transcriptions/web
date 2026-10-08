import type * as estree from 'estree'
import type * as mdast from 'mdast'
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx-jsx'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { catalogue } from '../../src/components/blocks/catalogue'
import { encodeProps, LAYOUT, WRAPPER_OPEN } from './review-lib'

/**
 * Pure pieces of `pnpm ds:mockup`: an existing page (its MDX body and frontmatter) as the sections.html the
 * page skill previews from, so a change to a live page starts from a mechanical, faithful mockup. Only what
 * the mockup format can show is accepted (literal props, image imports, light-markdown children); anything
 * else fails with the line it came from, never silently.
 */

export interface MockupEntry {
  /** `<locale>/<collection>/<slug>/index.mdx` or `<locale>/<collection>/<slug>.mdx` */
  file: string
  /** Locale-free public path. */
  path: string
  meta: {
    type: string
    title: string
    template?: string
    hero?: { eyebrow?: string; title: string; subtitle?: string }
  }
  /** The MDX without its frontmatter. */
  body: string
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
  /** The page's H1 (the hero title) or its SEO title. */
  title: string
  path: string
  warnings: string[]
}

class MockupError extends Error {}

const IMAGE_IMPORT = /^\.\/([\w.-]+\.(?:png|jpe?g|webp|gif|svg))(?:\?.*)?$/i

/** Every template but the homepage renders PageHero from the frontmatter hero (or the title). */
export function rendersPageHero(meta: { type: string; template?: string }): boolean {
  return !(meta.type === 'page' && meta.template === 'home')
}

const where = (node: { position?: { start: { line: number; column: number } } }) =>
  node.position ? ` (line ${node.position.start.line}:${node.position.start.column})` : ''

function fail(
  message: string,
  node?: { position?: { start: { line: number; column: number } } },
): never {
  throw new MockupError(`cannot mockup: ${message}${node ? where(node) : ''}`)
}

/** A literal JSX attribute expression as a JSON value; image imports become `img/<file>`. */
export function evalLiteral(
  node: estree.Node,
  imports: Record<string, string>,
  source = '',
): unknown {
  const src = source || `${node.type}`
  switch (node.type) {
    case 'Literal':
      if ('regex' in node && node.regex) fail(`${src} (a regular expression)`)
      return node.value
    case 'TemplateLiteral':
      if (node.expressions.length) fail(`${src} (only literals, objects, arrays and image imports)`)
      return node.quasis[0]?.value.cooked ?? ''
    case 'UnaryExpression': {
      const v = evalLiteral(node.argument, imports, src)
      if (node.operator === '-' && typeof v === 'number') return -v
      if (node.operator === '+' && typeof v === 'number') return v
      if (node.operator === '!') return !v
      return fail(`${src} (unsupported unary expression)`)
    }
    case 'ArrayExpression':
      return node.elements.map((el) => {
        if (!el || el.type === 'SpreadElement') return fail(`${src} (array holes and spreads)`)
        return evalLiteral(el, imports, src)
      })
    case 'ObjectExpression': {
      const out: Record<string, unknown> = {}
      for (const p of node.properties) {
        if (p.type !== 'Property' || p.computed || p.kind !== 'init' || p.method)
          return fail(`${src} (only plain key: value pairs)`)
        const key =
          p.key.type === 'Identifier'
            ? p.key.name
            : p.key.type === 'Literal'
              ? String(p.key.value)
              : fail(`${src} (computed key)`)
        out[key] = evalLiteral(p.value as estree.Node, imports, src)
      }
      return out
    }
    case 'Identifier':
      if (node.name === 'undefined') return undefined
      if (node.name in imports) return `img/${imports[node.name]}`
      return fail(
        `${src} (unknown identifier "${node.name}": only imported images may be referenced)`,
      )
    default:
      return fail(`${src} (only literals, objects, arrays and image imports)`)
  }
}

type Inline = mdast.PhrasingContent | MdxJsxTextElement

function inline(nodes: Inline[], parent: string): string {
  let out = ''
  for (const n of nodes) {
    switch (n.type) {
      case 'text':
        out += n.value.replace(/\s*\n\s*/g, ' ')
        break
      case 'strong':
        out += `**${inline(n.children as Inline[], parent).replaceAll('**', '')}**`
        break
      case 'emphasis':
      case 'delete':
      case 'link':
      case 'linkReference':
        out += inline(n.children as Inline[], parent)
        break
      case 'inlineCode':
        out += n.value
        break
      case 'break':
        out += ' '
        break
      case 'image':
      case 'imageReference':
        fail(`a picture inside <${parent}>: pictures are props, not prose`, n)
        break
      case 'mdxJsxTextElement':
        if (n.name === 'br') out += ' '
        else fail(`<${n.name}> inside <${parent}>: nested components are not shown in a mockup`, n)
        break
      case 'html':
        fail(`raw HTML inside <${parent}>`, n)
        break
      default:
        fail(`${(n as { type: string }).type} inside <${parent}>`, n as { position?: never })
    }
  }
  return out
}

/** Block children as the light markdown the bundle renders: paragraphs by blank line, **bold** kept. */
export function flattenChildren(nodes: mdast.RootContent[], parent = 'block'): string | undefined {
  const paragraphs: string[] = []
  for (const n of nodes) {
    switch (n.type) {
      case 'paragraph':
      case 'heading':
        paragraphs.push(inline(n.children as Inline[], parent).trim())
        break
      case 'list':
        for (const item of n.children) {
          const text = flattenChildren(item.children, parent)
          if (text) paragraphs.push(text)
        }
        break
      case 'blockquote': {
        const text = flattenChildren(n.children, parent)
        if (text) paragraphs.push(text)
        break
      }
      case 'code':
        paragraphs.push(n.value)
        break
      case 'thematicBreak':
        break
      case 'mdxJsxFlowElement':
      case 'mdxJsxTextElement':
        fail(
          `<${(n as MdxJsxFlowElement).name}> inside <${parent}>: nested components are not shown in a mockup`,
          n,
        )
        break
      case 'mdxFlowExpression':
      case 'mdxTextExpression':
        fail(`an expression {…} inside <${parent}>`, n)
        break
      default:
        fail(`${n.type} inside <${parent}>`, n)
    }
  }
  const text = paragraphs.filter(Boolean).join('\n\n')
  return text || undefined
}

function attributeValue(
  attr: MdxJsxAttribute,
  imports: Record<string, string>,
  block: string,
): unknown {
  if (attr.value === null || attr.value === undefined) return true
  if (typeof attr.value === 'string') return attr.value
  const expr = attr.value.data?.estree?.body[0]
  if (expr?.type !== 'ExpressionStatement')
    return fail(`<${block} ${attr.name}={…}> is not a value`, attr)
  try {
    return evalLiteral(expr.expression, imports, `<${block} ${attr.name}={${attr.value.value}}>`)
  } catch (e) {
    if (e instanceof MockupError) throw new MockupError(`${e.message}${where(attr)}`)
    throw e
  }
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
    // The top of the page (TopBar, Header, the hero) sits together; every other block is set off by a blank line.
    if (i > 0 && !['TopBar', 'Header'].includes(blocks[i - 1]?.name ?? '')) out.push('')
    out.push(line)
  }
  out.push('</div>', '')
  return out.join('\n')
}

/** `<Section title="Hi">Text</Section>` on one line parses as inline JSX in a paragraph: treat it as a block. */
function asFlowElement(node: mdast.RootContent): mdast.RootContent {
  if (node.type !== 'paragraph') return node
  const parts = node.children.filter((c) => !(c.type === 'text' && !c.value.trim()))
  const only = parts[0]
  if (parts.length !== 1 || only?.type !== 'mdxJsxTextElement') return node
  const text = only as MdxJsxTextElement
  const flow: MdxJsxFlowElement = {
    type: 'mdxJsxFlowElement',
    name: text.name,
    attributes: text.attributes,
    children: text.children.length
      ? [{ type: 'paragraph', children: text.children as mdast.PhrasingContent[] }]
      : [],
    position: text.position,
  }
  return flow
}

export function mockupFromEntry(entry: MockupEntry): MockupResult {
  const warnings: string[] = []
  const imports: Record<string, string> = {}
  const used = new Set<string>()
  const body: MockupBlock[] = []
  const tree = unified().use(remarkParse).use(remarkMdx).parse(entry.body)
  let prose: mdast.RootContent[] = []
  const flushProse = () => {
    if (!prose.length) return
    const text = flattenChildren(prose, 'page')
    const first = prose[0]
    if (text) {
      body.push({ name: 'Section', props: { children: text } })
      warnings.push(
        `prose outside a block${first ? where(first) : ''} is shown in a Section; the page builds it as plain prose`,
      )
    }
    prose = []
  }

  for (const raw of tree.children) {
    const node = asFlowElement(raw)
    switch (node.type) {
      case 'mdxjsEsm': {
        for (const stmt of node.data?.estree?.body ?? []) {
          if (stmt.type !== 'ImportDeclaration')
            fail(
              `${stmt.type === 'ExportNamedDeclaration' || stmt.type === 'ExportDefaultDeclaration' ? 'an export' : stmt.type} in the page`,
              node,
            )
          const m = IMAGE_IMPORT.exec(String(stmt.source.value))
          const spec = stmt.specifiers[0]
          if (!m || stmt.specifiers.length !== 1 || spec?.type !== 'ImportDefaultSpecifier')
            fail(
              `import of ${stmt.source.value} (only "import x from './picture.png?…'" is supported)`,
              node,
            )
          imports[spec.local.name] = m[1] as string
        }
        break
      }
      case 'mdxJsxFlowElement': {
        flushProse()
        const name = node.name ?? ''
        if ((LAYOUT as readonly string[]).includes(name))
          fail(`<${name}> in the body: the layout comes with every page`, node)
        if (name === 'PageHero' && rendersPageHero(entry.meta))
          fail(
            '<PageHero> in the body: this template already renders the hero from the frontmatter',
            node,
          )
        if (!(name in catalogue)) fail(`unknown block <${name || '…'}>`, node)
        const props: Record<string, unknown> = {}
        for (const attr of node.attributes) {
          if (attr.type !== 'mdxJsxAttribute') fail(`<${name} {...}> spread attributes`, node)
          if (name === 'ContactSection' && attr.name === 'returnTo') {
            warnings.push(`<ContactSection returnTo> left out: the page derives it from its path`)
            continue
          }
          const value = attributeValue(attr, imports, name)
          if (value === undefined) continue
          if (typeof value === 'string' && value.startsWith('img/')) used.add(value.slice(4))
          if (Array.isArray(value) || (value && typeof value === 'object'))
            for (const v of JSON.stringify(value).matchAll(/"img\/([\w.-]+)"/g))
              used.add(v[1] as string)
          props[attr.name] = value
        }
        const children = flattenChildren(node.children, name)
        if (children) props.children = children
        body.push({ name, props })
        break
      }
      case 'mdxFlowExpression': {
        const stmts = node.data?.estree?.body ?? []
        if (stmts.length) fail(`an expression {${node.value}} in the page`, node)
        break // a comment
      }
      case 'html':
      case 'yaml':
        fail(`${node.type} in the page`, node)
        break
      default:
        prose.push(node)
    }
  }
  flushProse()

  for (const [local, file] of Object.entries(imports))
    if (!used.has(file)) warnings.push(`import "${local}" (${file}) is not used by any block`)
  const last = body.findIndex((b) => b.name === 'ContactSection')
  if (last >= 0 && last !== body.length - 1)
    warnings.push('ContactSection is not the last block; the design system expects it last')

  const blocks: MockupBlock[] = [{ name: 'TopBar' }, { name: 'Header' }]
  if (rendersPageHero(entry.meta)) {
    const hero = entry.meta.hero ?? { title: entry.meta.title }
    const props: Record<string, unknown> = { title: hero.title }
    if (hero.subtitle) props.subtitle = hero.subtitle
    if (hero.eyebrow) props.eyebrow = hero.eyebrow
    blocks.push({ name: 'PageHero', props })
  }
  blocks.push(...body, { name: 'Footer' })
  return {
    sections: serializeBlocks(blocks),
    blocks,
    images: [...used].sort(),
    title: entry.meta.hero?.title ?? entry.meta.title,
    path: entry.path,
    warnings,
  }
}
