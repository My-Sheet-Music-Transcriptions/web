import { useId } from 'react'

/**
 * The id of a section's heading, which labels the section (`aria-labelledby`): `<id>-title` when the block
 * has an anchor id, otherwise a generated one. Never fixed, so a block can appear twice on a page.
 */
export function useTitleId(id?: string): string {
  const auto = useId().replace(/[^\w-]/g, '')
  return id ? `${id}-title` : `title-${auto}`
}
