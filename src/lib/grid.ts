/** Columns a grid can have at one width. */
export type Columns = 1 | 2 | 3 | 4 | 5 | 6

// Whole class names, so Tailwind sees every one of them.
const base = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
}
const md = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
}
const lg = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
}

/**
 * The columns a list of `count` items really gets: `columns` unless that leaves a last row of one or two items,
 * in which case the nearest count up to `max` (never above) or down to 2 that fills every row (6 items in 4 columns: 3;
 * 4 in 3: 4 when `max` allows). A count no column count divides keeps `columns`, and so does a list that fits one
 * row. So pages never have to pick a count per list.
 */
export function balanceColumns(columns: Columns, count: number, max: Columns = columns): Columns {
  if (count <= columns) return columns
  const rest = count % columns
  if (rest === 0 || rest > 2) return columns
  const candidates: Columns[] = []
  for (let up = columns + 1; up <= max; up++) candidates.push(up as Columns)
  for (let down = columns - 1; down >= 2; down--) candidates.push(down as Columns)
  return candidates.find((c) => count % c === 0) ?? columns
}

/**
 * The grid classes of a block's `columns`, which always means the columns from desktop (1025px) up. Tablets
 * (768px) show `tablet` columns (never more than desktop) and phones `phone` (one by default).
 */
export function gridCols(
  columns: Columns,
  { tablet = columns, phone = 1 }: { tablet?: Columns; phone?: Columns } = {},
): string {
  const t = Math.min(tablet, columns) as Columns
  return `grid ${base[phone]} ${md[t]} ${lg[columns]}`
}
