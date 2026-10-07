import themeCss from '~/styles/theme.css?raw'
import { contrast, parseTheme } from './theme-parse'

/** Token tables for the Foundations docs page, generated from src/styles/theme.css at build time. */
export const theme = parseTheme(themeCss)

function Rating({ ratio }: { ratio: number }) {
  return (
    <span>
      {ratio.toFixed(2)}:1 {ratio >= 4.5 ? '✓ AA' : ratio >= 3 ? '○ large text' : '✗'}
    </span>
  )
}

export function ColorTokens() {
  return (
    <table className="w-full text-small">
      <thead>
        <tr className="text-left">
          <th>Token</th>
          <th>Value</th>
          <th>On white</th>
          <th>White on it</th>
          <th>Usage</th>
        </tr>
      </thead>
      <tbody>
        {theme.color.tokens.map((c) => {
          const solid = c.value.startsWith('#')
          return (
            <tr key={c.name} className="border-t border-line">
              <td className="py-2 font-mono">--color-{c.name}</td>
              <td>
                <span
                  className="inline-block h-5 w-5 rounded border border-line align-middle"
                  style={{ background: c.value }}
                />{' '}
                <span className="font-mono">{c.value}</span>
              </td>
              <td>{solid ? <Rating ratio={contrast(c.value, '#ffffff')} /> : '–'}</td>
              <td>{solid ? <Rating ratio={contrast('#ffffff', c.value)} /> : '–'}</td>
              <td>{c.usage || '–'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function TypeScale() {
  return (
    <div className="space-y-3">
      {theme.type.styles.map((s) => (
        <div key={s.name} className="flex flex-wrap items-baseline gap-4 border-b border-line pb-3">
          <span
            className="w-56"
            style={{ fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.fontWeight }}
          >
            Aa Montserrat
          </span>
          <code className="text-small">text-{s.name}</code>
          <span className="text-small text-muted">
            {s.fontSize} / {s.lineHeight} · {s.fontWeight} · {s.usage}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Radii() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {theme.radius.tokens.map((r) => (
        <li key={r.name} className="bg-peach p-4 text-small" style={{ borderRadius: r.value }}>
          <code>rounded-{r.name.replace('radius-', '')}</code> {r.value}
          {r.usage ? <span className="block text-muted">{r.usage}</span> : null}
        </li>
      ))}
      {theme.shadow.tokens.map((s) => (
        <li
          key={s.name}
          className="rounded-card bg-white p-4 text-small"
          style={{ boxShadow: s.value }}
        >
          <code>{s.name}</code>
          <span className="block font-mono text-muted">{s.value}</span>
        </li>
      ))}
    </ul>
  )
}

export function Spacing() {
  return (
    <ul className="list-disc space-y-1 pl-5 text-small">
      <li>
        Containers:{' '}
        {theme.layout.containers.map((c, i) => (
          <span key={c.name}>
            {i > 0 ? ', ' : ''}
            <code>container-{c.name}</code> {c.value}
          </span>
        ))}
      </li>
      <li>
        Breakpoints:{' '}
        {theme.layout.breakpoints.map((b, i) => (
          <span key={b.name}>
            {i > 0 ? ', ' : ''}
            <code>{b.name}</code> {b.value} ({b.usage})
          </span>
        ))}
      </li>
      <li>
        Section padding:{' '}
        {theme.spacing.tokens
          .filter((t) => !t.name.startsWith('container-') && !t.name.startsWith('breakpoint-'))
          .map((t, i) => (
            <span key={t.name}>
              {i > 0 ? ', ' : ''}
              <code>py-{t.name}</code> {t.value}
            </span>
          ))}
      </li>
      <li>Grid gaps: 20px between cards, 32px between review cards</li>
    </ul>
  )
}
