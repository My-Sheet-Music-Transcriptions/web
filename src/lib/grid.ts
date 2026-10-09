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
