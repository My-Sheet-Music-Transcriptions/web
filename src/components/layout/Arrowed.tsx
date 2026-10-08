import { Fragment } from 'react'

/**
 * A label with "→" drawn in the system sans-serif, as on the live site: its Montserrat has no arrow glyph,
 * so the browser falls back to a smaller, thinner one.
 */
export function Arrowed({ label }: { label: string }) {
  const parts = label.split('→')
  return (
    <>
      {parts.map((part, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static split of a fixed label
        <Fragment key={i}>
          {i > 0 && <span className="font-[sans-serif]">→</span>}
          {part}
        </Fragment>
      ))}
    </>
  )
}
