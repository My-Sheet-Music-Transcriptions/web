import { type BlockDoc, catalogue, ROLE_LABELS, ROLES } from '../../src/components/blocks/catalogue'
import { blockProps } from './blocks-lib'

/**
 * The block table of src/components/blocks/README.md and of the artifact's brand book: one row per block,
 * grouped by role in page order, generated from the catalogue and the props interfaces. `pnpm ds:export`
 * writes it; tests/unit/catalogue.test.ts checks the committed README carries the current one.
 */
export function blockTable(): string {
  const rows: string[] = []
  for (const role of Object.keys(ROLES) as (keyof typeof ROLES)[])
    for (const [name, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
      if (doc.role !== role) continue
      const props = blockProps(name)?.props.map((p) => p.name) ?? []
      rows.push(
        `| \`${name}\` | ${ROLE_LABELS[role]} | ${doc.description} | ${props.join(', ') || '–'} | ${doc.dataSource ?? '–'} |`,
      )
    }
  return [
    '| Block | Role | Purpose | Props | Data source |',
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
