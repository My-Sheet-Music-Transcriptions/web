import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { parseTsx } from '../../scripts/lib/ts-literal'
import { sites } from '../../src/i18n/sites'

/**
 * The rule of the components (CLAUDE.md, Conventions): a component is agnostic of the content. No copy, no
 * pictures. Every word a visitor can read comes from props or from the site strings; every picture from
 * props, from a registry fed a name by content or config (src/assets/*.ts), or from a theme token.
 * This test reads every component source and lists what breaks the rule, with file:line.
 */

const ROOT = 'src/components'
const SKIP = /\.stories\.tsx$|\/(catalogue|story-args)\.tsx?$/

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) && !SKIP.test(p) ? [p] : []
  })

/** JSX attributes that are copy by nature: a word there is a violation whatever its shape. */
const COPY_ATTRS = new Set([
  'alt',
  'title',
  'placeholder',
  'label',
  'aria-label',
  'aria-description',
  'aria-roledescription',
  'hint',
  'caption',
  'subtitle',
  'lead',
  'text',
])
/** JSX attributes and object keys that hold technical strings (class names, ids, hrefs, SVG paths…). */
const TECHNICAL = new Set([
  'className',
  'class',
  'id',
  'key',
  'href',
  'hrefLang',
  'lang',
  'to',
  'srcSet',
  'sizes',
  'type',
  'rel',
  'target',
  'loading',
  'decoding',
  'name',
  'autoComplete',
  'method',
  'action',
  'encType',
  'accept',
  'inputMode',
  'role',
  'viewBox',
  'd',
  'fill',
  'stroke',
  'strokeLinecap',
  'strokeLinejoin',
  'transform',
  'style',
  'htmlFor',
  'width',
  'height',
  'step',
  'min',
  'max',
  'value',
  'defaultValue',
  'tabIndex',
  'data-live-colour',
  'timeZone',
  'month',
  'year',
  'fontFamily',
  '@context',
  '@type',
  'position',
  'variant',
  'tone',
  'layout',
  'preset',
  'surface',
  'shape',
  'align',
  'imageSide',
  'color',
  'size',
])
const IMAGE = /\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i
/** The app's content and pictures: pages and the app pass them, components never fetch them. */
const APP_MODULES = /^(@content\/|~\/assets\/|~\/content\/data$|~\/i18n\/sites|~\/stories\/)/
const WORD = /[A-Za-z]/

/**
 * Prose, as opposed to a class list, a selector, a token or an identifier: a capitalised word ("Send"), or
 * words with spaces between them and no code characters ("see more").
 */
const looksLikeProse = (text: string): boolean => {
  if (!WORD.test(text)) return false
  if (/^[A-Z][a-z]+$/.test(text.trim())) return true
  if (!/\s/.test(text.trim())) return false
  return !text.split(/\s+/).some((t) => /[-:[\]/().%#,=>*_]/.test(t))
}

/** Calls whose string arguments are code: selectors, storage keys, form fields, event names. */
const TECHNICAL_CALLS = new Set([
  'querySelector',
  'querySelectorAll',
  'matchMedia',
  'getElementById',
  'getItem',
  'setItem',
  'removeItem',
  'addEventListener',
  'removeEventListener',
  'createElement',
  'get',
  'set',
  'has',
  'split',
  'replace',
  'toLocaleDateString',
  'toLocaleString',
])

interface Violation {
  file: string
  line: number
  kind: string
  text: string
}

function scan(file: string): Violation[] {
  const source = fs.readFileSync(file, 'utf8')
  const sf = parseTsx(source, file)
  const out: Violation[] = []
  const report = (node: ts.Node, kind: string, text: string) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf))
    out.push({ file, line: line + 1, kind, text: text.trim().slice(0, 60) })
  }
  const attrOf = (node: ts.Node): string | undefined => {
    for (let n: ts.Node | undefined = node.parent; n; n = n.parent) {
      if (ts.isJsxAttribute(n)) return n.name.getText(sf)
      if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isFunctionLike(n)) return
    }
  }
  const keyOf = (node: ts.Node): string | undefined => {
    for (let n: ts.Node | undefined = node.parent; n; n = n.parent) {
      if (ts.isPropertyAssignment(n)) return n.name.getText(sf).replace(/^['"]|['"]$/g, '')
      if (ts.isJsxAttribute(n) || ts.isFunctionLike(n) || ts.isJsxElement(n)) return
    }
  }
  const inside = (node: ts.Node, test: (n: ts.Node) => boolean): boolean => {
    for (let n: ts.Node | undefined = node.parent; n; n = n.parent) if (test(n)) return true
    return false
  }
  const isClassCall = (n: ts.Node) =>
    ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'cn'
  const isTechnicalCall = (n: ts.Node) =>
    ts.isCallExpression(n) &&
    ts.isPropertyAccessExpression(n.expression) &&
    TECHNICAL_CALLS.has(n.expression.name.text)
  const isComparison = (n: ts.Node) =>
    (ts.isBinaryExpression(n) &&
      [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken].includes(
        n.operatorToken.kind,
      )) ||
    ts.isCaseClause(n)

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node)) {
      const from = (node.moduleSpecifier as ts.StringLiteral).text
      if (IMAGE.test(from)) report(node, 'image import', from)
      else if (APP_MODULES.test(from)) report(node, 'content import', from)
      return
    }
    if (ts.isPropertyAccessExpression(node) && node.name.text === 'strings')
      report(node, 'site strings read in a component', node.getText(sf))
    if (ts.isCallExpression(node) && node.expression.getText(sf) === 'import.meta.glob') {
      const arg = node.arguments[0]
      if (arg && ts.isStringLiteral(arg) && IMAGE.test(arg.text))
        report(node, 'image glob', arg.text)
    }
    if (ts.isJsxText(node)) {
      if (WORD.test(node.text)) report(node, 'text in JSX', node.text)
      return
    }
    if (ts.isJsxAttribute(node) && node.name.getText(sf) === 'src' && node.initializer) {
      const v = node.initializer
      if (ts.isStringLiteral(v)) report(node, 'image path', v.text)
    }
    if (ts.isLiteralTypeNode(node) || ts.isTypeReferenceNode(node)) return
    if (
      ts.isJsxExpression(node) &&
      node.parent &&
      ts.isJsxElement(node.parent) &&
      node.expression
    ) {
      const e = node.expression
      const text =
        ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e) ? e.text : undefined
      if (text !== undefined && WORD.test(text)) report(e, 'text in JSX', text)
      if (ts.isTemplateExpression(e)) {
        const chunks = [e.head.text, ...e.templateSpans.map((s) => s.literal.text)]
        if (chunks.some((c) => WORD.test(c))) report(e, 'text in JSX', e.getText(sf))
      }
    }
    if (
      ts.isBindingElement(node) &&
      node.initializer &&
      inside(node, (n) => ts.isParameter(n)) &&
      (ts.isStringLiteral(node.initializer) ||
        ts.isNoSubstitutionTemplateLiteral(node.initializer) ||
        ts.isTemplateExpression(node.initializer))
    ) {
      const text = node.initializer.getText(sf).slice(1, -1)
      if (!/^[a-z0-9/#._-]*$/.test(text)) report(node, 'copy as a prop default', text)
    }
    const literal =
      ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
        ? node.text
        : ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)
          ? node.text
          : undefined
    if (literal !== undefined && WORD.test(literal)) {
      const attr = attrOf(node)
      const key = keyOf(node)
      const skip =
        (attr !== undefined && TECHNICAL.has(attr)) ||
        (attr === undefined && key !== undefined && TECHNICAL.has(key)) ||
        inside(node, isClassCall) ||
        inside(node, isTechnicalCall) ||
        inside(node, isComparison) ||
        (node.parent && ts.isPropertyAssignment(node.parent) && node.parent.name === node) ||
        inside(node, ts.isImportDeclaration) ||
        inside(node, (n) => ts.isBindingElement(n) && !!n.initializer) ||
        (node.parent && ts.isJsxExpression(node.parent) && ts.isJsxElement(node.parent.parent))
      if (!skip) {
        if (attr !== undefined && COPY_ATTRS.has(attr)) report(node, `copy in ${attr}`, literal)
        else if (attr === undefined && key !== undefined && COPY_ATTRS.has(key))
          report(node, `copy in ${key}`, literal)
        else if (looksLikeProse(literal)) report(node, 'copy', literal)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return out
}

describe('components are agnostic of the content', () => {
  const files = walk(ROOT)

  it('scans every component (blocks, primitives, layout, typography)', () => {
    expect(files.length).toBeGreaterThan(40)
    expect(files).toContain('src/components/blocks/ContactSection.tsx')
    expect(files).not.toContain('src/components/blocks/catalogue.ts')
  })

  it('hold no copy and no picture: words come from props or the site strings, pictures from props or a registry', () => {
    const violations = files.flatMap(scan)
    const lines = violations.map((v) => `${v.file}:${v.line} ${v.kind}: ${JSON.stringify(v.text)}`)
    expect(lines).toEqual([])
  })

  it('stories use Storybook’s own data (src/stories), never the app’s content or pictures', () => {
    const stories = fs
      .readdirSync(ROOT, { recursive: true, encoding: 'utf8' })
      .filter((f) => f.endsWith('.stories.tsx'))
      .map((f) => path.join(ROOT, f))
    expect(stories.length).toBeGreaterThan(25)
    const bad = stories.flatMap((file) =>
      [
        ...fs
          .readFileSync(file, 'utf8')
          .matchAll(/from '((?:@content\/|~\/assets\/|~\/content\/data|~\/i18n\/sites)[^']*)'/g),
      ].map((m) => `${file}: ${m[1]}`),
    )
    expect(bad).toEqual([])
  })

  it('every locale carries the same string keys as English (the type; here the runtime shape)', () => {
    const shape = (o: unknown): unknown =>
      o && typeof o === 'object'
        ? Object.fromEntries(
            Object.entries(o as Record<string, unknown>)
              .sort()
              .map(([k, v]) => [k, shape(v)]),
          )
        : typeof o
    for (const [locale, site] of Object.entries(sites))
      expect(shape(site.strings), locale).toEqual(shape(sites.en.strings))
  })
})
