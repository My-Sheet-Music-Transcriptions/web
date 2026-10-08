import type { ReactNode } from 'react'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { SmartLink } from '~/components/primitives/SmartLink'
import { tones } from '~/components/primitives/tones'
import { cn } from '~/lib/cn'
import { useTitleId } from '~/lib/use-title-id'

/** A cell: text, or a link. */
export type TableCell = string | { label: string; href: string }

export interface TableProps {
  title?: string
  /** What the table lists, shown above it ("General openings"). */
  caption?: string
  /** The column headings; an empty one (a column of links) has no heading. */
  columns: string[]
  /** One list of cells per row, in column order. */
  rows: TableCell[][]
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id. */
  id?: string
  /** Intro paragraphs (`<Text>`) above the table. */
  children?: ReactNode
}

/** Rows and columns of facts: job openings, prices per level, formats. On phones each row is a card. */
export function Table({ title, caption, columns, rows, tone = 'white', id, children }: TableProps) {
  const titleId = useTitleId(id)
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-[50px]', tones[tone])}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="container-content">
        {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
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
                      <SmartLink
                        href={cell.href}
                        className="font-bold text-primary hover:underline"
                      >
                        {cell.label}
                      </SmartLink>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const cellText = (c: TableCell) => (typeof c === 'string' ? c : c.label + c.href)
