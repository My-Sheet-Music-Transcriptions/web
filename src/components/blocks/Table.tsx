import type { ReactNode } from 'react'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { SmartLink } from '~/components/primitives/SmartLink'

/** A cell: text, or a link. */
export type TableCell = string | { label: string; href: string }

export interface TableProps extends ShellProps {
  /** What the table lists, shown above it ("General openings"). */
  caption?: string
  /** The column headings; an empty one (a column of links) has no heading. */
  columns: string[]
  /** One list of cells per row, in column order. */
  rows: TableCell[][]
  /** Intro paragraphs (`<Text>`) above the table. */
  children?: ReactNode
}

/**
 * A table of facts with a caption and column headings, links in cells; on phones each row becomes a
 * labelled card.
 */
export function Table({ caption, columns, rows, children, ...shell }: TableProps) {
  return (
    <BlockShell {...shell}>
      {children ? <div className="mb-8 flex flex-col gap-4 text-ink">{children}</div> : null}
      <table className="w-full border-collapse text-left text-body text-ink">
        {caption ? (
          <caption className="mb-4 text-left text-h3 font-bold text-ink">{caption}</caption>
        ) : null}
        <thead className="hidden md:table-header-group">
          <tr className="border-b-2 border-accent">
            {columns.map((c, i) =>
              c ? (
                <th key={c} scope="col" className="px-3 py-3 font-bold">
                  {c}
                </th>
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: an unnamed column (links) has only its position
                <td key={`col-${i}`} />
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.map(cellText).join('|')}
              className="mb-4 block rounded-card border border-line p-4 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:p-0"
            >
              {row.map((cell, i) => (
                <td
                  key={columns[i] ?? i}
                  data-label={columns[i]}
                  className="block py-1 md:table-cell md:px-3 md:py-4 md:before:content-none before:mr-2 before:font-bold before:content-[attr(data-label)]"
                >
                  {typeof cell === 'string' ? (
                    cell
                  ) : (
                    <SmartLink href={cell.href} className="font-bold text-primary hover:underline">
                      {cell.label}
                    </SmartLink>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </BlockShell>
  )
}

const cellText = (c: TableCell) => (typeof c === 'string' ? c : c.label + c.href)
