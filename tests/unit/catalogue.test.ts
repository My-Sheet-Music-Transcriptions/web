import fs from 'node:fs'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'
import { blockProps, checkProps } from '../../scripts/design-system/blocks-lib'
import { withBlockTable } from '../../scripts/design-system/readme-lib'
import { evalTsLiteral, LiteralError, parseTsx } from '../../scripts/lib/ts-literal'
import { type BlockDoc, CATEGORIES, catalogue } from '../../src/components/blocks/catalogue'

const names = Object.keys(catalogue)
const readme = fs.readFileSync('src/components/blocks/README.md', 'utf8')

/**
 * What a `usage` snippet gets wrong about block `name`: a prop it does not take, a required one left out, a
 * literal value outside its type (`variant="tiles"`, a glyph that is not an Icon), children it cannot hold.
 * The snippet is read as JSX, `…` standing for the words a page writes; a value a page computes (`{google}`,
 * `[{ image: photo }]`) is checked for its name only.
 */
function usageProblems(name: string, usage: string): string[] {
  const source = `const usage = (\n  <>\n${usage.replaceAll('…', 'x')}\n  </>\n)\n`
  const syntax = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: { jsx: ts.JsxEmit.Preserve },
  }).diagnostics
  if (syntax?.length)
    return syntax.map((d) => `not JSX: ${ts.flattenDiagnosticMessageText(d.messageText, ' ')}`)
  const known = blockProps(name)?.props.map((p) => p.name) ?? []
  const problems: string[] = []
  const visit = (node: ts.Node) => {
    const opening = ts.isJsxElement(node)
      ? node.openingElement
      : ts.isJsxSelfClosingElement(node)
        ? node
        : undefined
    if (opening?.tagName.getText() === name) {
      const props: Record<string, unknown> = {}
      const computed: string[] = []
      for (const attr of opening.attributes.properties) {
        if (!ts.isJsxAttribute(attr)) {
          problems.push(`<${name} {...}>: write each prop`)
          continue
        }
        const key = attr.name.getText()
        const init = attr.initializer
        try {
          props[key] = !init
            ? true
            : ts.isStringLiteral(init)
              ? init.text
              : evalTsLiteral((init as ts.JsxExpression).expression as ts.Expression)
        } catch (e) {
          if (!(e instanceof LiteralError)) throw e
          computed.push(key)
          if (!known.includes(key)) problems.push(`${name} has no prop "${key}"`)
        }
      }
      if (ts.isJsxElement(node) && node.children.some((c) => c.getText().trim()))
        props.children = 'x'
      problems.push(
        ...checkProps(name, props).filter(
          (p) => !computed.some((key) => p.startsWith(`${name} needs "${key}"`)),
        ),
      )
    }
    ts.forEachChild(node, visit)
  }
  visit(parseTsx(source, `${name}.usage.tsx`))
  return problems
}

describe('block catalogue', () => {
  it('documents every block in README.md, with the current table (pnpm ds:export rewrites it)', () => {
    for (const n of names) expect(readme, n).toContain(`\`${n}\``)
    expect(readme).toBe(withBlockTable(readme))
  })
  it('uses the block itself as the root tag of its usage snippet', () => {
    for (const [n, doc] of Object.entries(catalogue)) {
      expect(doc.usage.trim().startsWith(`<${n}`), n).toBe(true)
    }
  })
  it.each(names)('%s: the usage snippet passes the props the block takes, as a page must', (n) => {
    expect(usageProblems(n, catalogue[n as keyof typeof catalogue].usage)).toEqual([])
  })
  it('catches a wrong usage snippet', () => {
    expect(usageProblems('CardGrid', '<CardGrid title="…" variant="tiles" item={x} />')).toEqual([
      'CardGrid has no prop "item"',
      'CardGrid.variant is "tiles": use one of card, tile, plain',
    ])
    expect(
      usageProblems('Steps', '<Steps items={[{ glyph: "nope", body: "…" }]} />').join(),
    ).toMatch(/items\[0\]\.glyph is "nope"/)
    expect(usageProblems('Stats', '<Stats title="…">\n  <Text>…</Text>\n</Stats>')).toEqual([
      expect.stringMatching(/^Stats has no prop "children": it takes title, /),
      'Stats needs "items" (Stat[])',
    ])
    expect(usageProblems('Section', '<Section title="…">')[0]).toMatch(/^not JSX: /)
  })
  it('has a story and a component file for every block', () => {
    for (const n of names) {
      expect(fs.existsSync(`src/components/blocks/${n}.tsx`), n).toBe(true)
      expect(fs.existsSync(`src/components/blocks/${n}.stories.tsx`), n).toBe(true)
    }
  })
  it('places every block in a category and uses every category', () => {
    const categories = Object.keys(CATEGORIES)
    for (const [n, doc] of Object.entries(catalogue)) expect(categories, n).toContain(doc.category)
    for (const category of categories)
      expect(
        Object.values(catalogue).some((d) => d.category === category),
        `category "${category}" has no block`,
      ).toBe(true)
  })
  it('says in one line when to use each block, and when not', () => {
    const oneLine = (s: string) => !s.includes('\n') && s.length >= 10 && s.length <= 160
    for (const [n, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
      expect(oneLine(doc.useWhen), `${n}.useWhen`).toBe(true)
      if (doc.notFor) expect(oneLine(doc.notFor), `${n}.notFor`).toBe(true)
    }
  })
  it('files every block story under Blocks/<Category>/<Name>', () => {
    for (const [n, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
      const story = fs.readFileSync(`src/components/blocks/${n}.stories.tsx`, 'utf8')
      expect(/title: '([^']+)'/.exec(story)?.[1], n).toBe(
        `Blocks/${CATEGORIES[doc.category].label}/${n}`,
      )
    }
  })
  it('lists the categories in Storybook in page order', () => {
    const preview = fs.readFileSync('.storybook/preview.tsx', 'utf8').replace(/\s+/g, ' ')
    expect(preview).toContain(
      `'Blocks', [${Object.values(CATEGORIES)
        .map((c) => `'${c.label}'`)
        .join(', ')}]`,
    )
  })
  it('keeps preview heights sane', () => {
    for (const [n, doc] of Object.entries(catalogue)) {
      expect(doc.previewHeight, n).toBeGreaterThanOrEqual(200)
      expect(doc.previewHeight, n).toBeLessThanOrEqual(1400)
    }
  })
})
