import ts from 'typescript'

/**
 * Static reading of TypeScript/TSX source with the compiler API (no evaluation, no Vite). Shared by the content
 * reader (scripts/lib/content-fs.ts reads every page's meta.ts) and the mockup tooling
 * (scripts/design-system/mockup-lib.ts reads a page's index.tsx). Only plain data is accepted, so a meta.ts can
 * never run code and a page's block props stay something a mockup can show.
 */

export class LiteralError extends Error {}

export function parseTsx(text: string, file = 'page.tsx'): ts.SourceFile {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

/** " (line L:C)" of a node, 1-based. */
export function where(node: ts.Node): string {
  const sf = node.getSourceFile()
  const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf))
  return ` (line ${line + 1}:${character + 1})`
}

/** Strips `( … )`, `… as T`, `… satisfies T` and `<T>…`, which change types, never values. */
export function unwrap(node: ts.Expression): ts.Expression {
  let n = node
  while (
    ts.isParenthesizedExpression(n) ||
    ts.isAsExpression(n) ||
    ts.isSatisfiesExpression(n) ||
    ts.isTypeAssertionExpression(n)
  )
    n = n.expression
  return n
}

const ONLY = '(only literals, objects, arrays and image imports)'

function fail(what: string, node: ts.Node, src: string): never {
  throw new LiteralError(`${src ? `${src}: ` : ''}${what}${where(node)}`)
}

function propertyName(name: ts.PropertyName, src: string): string {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name))
    return name.text
  if (ts.isNoSubstitutionTemplateLiteral(name)) return name.text
  return fail('a computed key', name, src)
}

/**
 * The value of a literal expression: strings, numbers, booleans, null, `undefined`, negation, arrays, plain
 * objects (with `...known` spreads of an object already known), identifiers listed in `identifiers` (the mockup
 * maps image imports to "img/<file>" and data imports to their values) and fields of those (`piano.faq`,
 * `ratings[0]`). Anything else (calls, template substitutions, array spreads, JSX…) throws a LiteralError with
 * the line.
 */
export function evalTsLiteral(
  node: ts.Expression,
  identifiers: Record<string, unknown> = {},
  src = '',
): unknown {
  const n = unwrap(node)
  if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) return n.text
  if (ts.isNumericLiteral(n)) return Number(n.text)
  if (n.kind === ts.SyntaxKind.TrueKeyword) return true
  if (n.kind === ts.SyntaxKind.FalseKeyword) return false
  if (n.kind === ts.SyntaxKind.NullKeyword) return null
  if (ts.isPrefixUnaryExpression(n)) {
    const v = evalTsLiteral(n.operand, identifiers, src)
    if (n.operator === ts.SyntaxKind.MinusToken && typeof v === 'number') return -v
    if (n.operator === ts.SyntaxKind.PlusToken && typeof v === 'number') return v
    if (n.operator === ts.SyntaxKind.ExclamationToken) return !v
    return fail(`the operator in "${n.getText()}" ${ONLY}`, n, src)
  }
  if (ts.isArrayLiteralExpression(n))
    return n.elements.map((el) => {
      if (ts.isSpreadElement(el) || ts.isOmittedExpression(el))
        return fail(`array holes and spreads ${ONLY}`, el, src)
      return evalTsLiteral(el, identifiers, src)
    })
  if (ts.isObjectLiteralExpression(n)) {
    const out: Record<string, unknown> = {}
    for (const p of n.properties) {
      if (ts.isPropertyAssignment(p))
        out[propertyName(p.name, src)] = evalTsLiteral(p.initializer, identifiers, src)
      else if (ts.isShorthandPropertyAssignment(p))
        out[p.name.text] = evalTsLiteral(p.name, identifiers, src)
      else if (ts.isSpreadAssignment(p)) {
        const v = evalTsLiteral(p.expression, identifiers, src)
        if (!v || typeof v !== 'object' || Array.isArray(v))
          fail(`a spread of something that is not an object ${ONLY}`, p, src)
        Object.assign(out, v)
      } else fail(`only plain "key: value" pairs in objects ${ONLY}`, p, src)
    }
    return out
  }
  if (ts.isIdentifier(n)) {
    if (n.text === 'undefined') return undefined
    if (Object.hasOwn(identifiers, n.text)) return identifiers[n.text]
    return fail(
      `unknown identifier "${n.text}": only imported pictures and data may be referenced ${ONLY}`,
      n,
      src,
    )
  }
  // `piano.faq`, `ratings[0]`: a field of a value already known (imported data), never of anything else
  if (ts.isPropertyAccessExpression(n) || ts.isElementAccessExpression(n)) {
    const base = evalTsLiteral(n.expression, identifiers, src)
    let key: string | number
    if (ts.isPropertyAccessExpression(n)) key = n.name.text
    else {
      const k = unwrap(n.argumentExpression)
      if (ts.isNumericLiteral(k)) key = Number(k.text)
      else if (ts.isStringLiteral(k) || ts.isNoSubstitutionTemplateLiteral(k)) key = k.text
      else return fail(`a computed index in "${n.getText()}" ${ONLY}`, n, src)
    }
    if (!base || typeof base !== 'object' || !Object.hasOwn(base, key))
      return fail(`"${n.getText()}" is not a field of the data`, n, src)
    return (base as Record<string | number, unknown>)[key]
  }
  if (ts.isTemplateExpression(n)) return fail(`a template string with \${…} ${ONLY}`, n, src)
  if (ts.isRegularExpressionLiteral(n)) return fail(`a regular expression ${ONLY}`, n, src)
  if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n))
    return fail(`JSX inside a value ${ONLY}`, n, src)
  return fail(`"${n.getText()}" ${ONLY}`, n, src)
}

function isTypeOnlyImport(s: ts.ImportDeclaration): boolean {
  const clause = s.importClause
  if (!clause) return false
  if (clause.isTypeOnly) return true
  if (clause.name) return false
  const b = clause.namedBindings
  return !!b && ts.isNamedImports(b) && b.elements.every((e) => e.isTypeOnly)
}

/**
 * A meta.ts: type-only imports and exactly one `export default { … }` object literal (`satisfies` welcome).
 * Returns the object's value; anything else throws a LiteralError naming the statement and line.
 */
export function readDefaultExportLiteral(text: string, file: string): unknown {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  let value: ts.ObjectLiteralExpression | undefined
  for (const s of sf.statements) {
    if (ts.isImportDeclaration(s)) {
      if (isTypeOnlyImport(s)) continue
      throw new LiteralError(
        `${file}: meta.ts may only import types (write "import type { PageMetaInput } from '~/content/schema'")${where(s)}`,
      )
    }
    if (ts.isExportAssignment(s) && !s.isExportEquals) {
      if (value) throw new LiteralError(`${file}: more than one "export default"${where(s)}`)
      const e = unwrap(s.expression)
      if (!ts.isObjectLiteralExpression(e))
        throw new LiteralError(
          `${file}: "export default" must be an object literal { … }${where(s)}`,
        )
      value = e
      continue
    }
    throw new LiteralError(
      `${file}: only "export default { … }" and type imports are allowed in meta.ts (found ${ts.SyntaxKind[s.kind]})${where(s)}`,
    )
  }
  if (!value) throw new LiteralError(`${file}: no "export default { … }"`)
  return evalTsLiteral(value, {}, file)
}

/** A picture import in a data module: a brand-wide file under src/assets/images (`?w=…&as=picture` welcome). */
export const DATA_PICTURE = /^~\/assets\/images\/[\w./-]+\.(?:png|jpe?g|webp|gif|svg)(?:\?.*)?$/i

/**
 * A data module (content/<locale>/data/*.ts): type-only imports, picture imports (`import piano from
 * '~/assets/images/icons/piano.png?w=150;300&as=picture'`, whose value is `picture(specifier)`, or the specifier
 * itself) and top-level `const`s (exported or not, `satisfies`/`as const` welcome), each a literal that may name
 * the consts and pictures above it. Returns every const by name; anything else (functions, other imports,
 * `let`, expressions) throws a LiteralError with the line.
 */
export function readModuleLiterals(
  text: string,
  file: string,
  picture: (specifier: string) => unknown = (specifier) => specifier,
): Record<string, unknown> {
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const values: Record<string, unknown> = {}
  const pictures: Record<string, unknown> = {}
  for (const s of sf.statements) {
    if (ts.isImportDeclaration(s)) {
      if (isTypeOnlyImport(s)) continue
      const from = (s.moduleSpecifier as ts.StringLiteral).text
      const clause = s.importClause
      if (clause?.name && !clause.namedBindings && DATA_PICTURE.test(from)) {
        pictures[clause.name.text] = picture(from)
        continue
      }
      throw new LiteralError(
        `${file}: a data file may only import types and pictures from ~/assets/images${where(s)}`,
      )
    }
    if (ts.isInterfaceDeclaration(s) || ts.isTypeAliasDeclaration(s)) continue
    if (
      ts.isVariableStatement(s) &&
      (s.declarationList.flags & ts.NodeFlags.Const) !== 0 &&
      s.declarationList.declarations.every((d) => ts.isIdentifier(d.name) && d.initializer)
    ) {
      for (const d of s.declarationList.declarations)
        values[(d.name as ts.Identifier).text] = evalTsLiteral(
          d.initializer as ts.Expression,
          { ...pictures, ...values },
          file,
        )
      continue
    }
    throw new LiteralError(
      `${file}: only "export const name = <literal>" and type imports are allowed in a data file (found ${ts.SyntaxKind[s.kind]})${where(s)}`,
    )
  }
  return values
}
