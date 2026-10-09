import { type BlockDoc, CATEGORIES, catalogue } from '../../src/components/blocks/catalogue'
import { blockDescription, blockProps } from './blocks-lib'

/**
 * The block table of src/components/blocks/README.md and of the artifact's brand book: one row per block,
 * grouped by category in page order, generated from the catalogue and each block's source (its description and
 * props). `pnpm ds:export` writes it; tests/unit/catalogue.test.ts checks the committed README carries the
 * current one.
 */
export function blockTable(): string {
  const rows: string[] = []
  for (const [category, { label }] of Object.entries(CATEGORIES))
    for (const [name, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
      if (doc.category !== category) continue
      const props = blockProps(name)?.props.map((p) => p.name) ?? []
      rows.push(
        `| \`${name}\` | ${label} | ${blockDescription(name)} | ${props.join(', ') || '–'} | ${doc.dataSource ?? '–'} |`,
      )
    }
  return [
    '| Block | Category | Purpose | Props | Data source |',
    '| --- | --- | --- | --- | --- |',
    ...rows,
  ].join('\n')
}

/** `readme` with its block table (from `| Block |` to the next blank line) replaced by the current one. */
export function withBlockTable(readme: string): string {
  const start = readme.indexOf('| Block |')
  if (start < 0) throw new Error('README has no "| Block |" table')
  const end = readme.indexOf('\n\n', start)
  return `${readme.slice(0, start)}${blockTable()}${end < 0 ? '\n' : readme.slice(end)}`
}
