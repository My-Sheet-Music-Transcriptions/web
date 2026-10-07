/** Token tables for the Foundations docs page. Values mirror src/styles/app.css. */

const colors: { name: string; value: string; usage: string }[] = [
  { name: 'primary', value: '#219ebc', usage: 'Links, outlined buttons, review stars, focus ring' },
  { name: 'primary-deep', value: '#1b86a0', usage: 'Hover of primary' },
  { name: 'secondary', value: '#171717', usage: 'Small labels' },
  { name: 'ink', value: '#444444', usage: 'Headings and body on light backgrounds' },
  { name: 'body', value: '#333333', usage: 'Default body copy' },
  {
    name: 'muted',
    value: '#6b6b6b',
    usage: 'Captions (darkened from the source to pass contrast)',
  },
  { name: 'accent', value: '#f49946', usage: 'Orange rules, the "#1" highlight' },
  { name: 'accent-deep', value: '#e2864d', usage: 'Filled CTA buttons' },
  { name: 'orange', value: '#ec8a1b', usage: 'Hero highlight' },
  { name: 'navy', value: '#023047', usage: 'Pricing header, artist hero' },
  { name: 'teal', value: '#2ec4b6', usage: 'Pricing header (piano/easy), customers icon' },
  { name: 'blue', value: '#2e97c4', usage: 'Pricing header (bands)' },
  { name: 'yellow', value: '#ffb703', usage: 'Platform rating stars' },
  { name: 'peach', value: '#fdebdc', usage: 'Audience cards, contact section' },
  { name: 'cream', value: '#f7eee7', usage: 'Pricing tier bodies' },
  { name: 'footer', value: '#222222', usage: 'Footer background' },
  { name: 'footer-text', value: '#c9c9c9', usage: 'Footer links' },
]

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0)
}
function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return ((l1 ?? 0) + 0.05) / ((l2 ?? 0) + 0.05)
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
        {colors.map((c) => {
          const onWhite = contrast(c.value, '#ffffff')
          const whiteOn = contrast('#ffffff', c.value)
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
              <td>
                {onWhite.toFixed(2)}:1{' '}
                {onWhite >= 4.5 ? '✓ AA' : onWhite >= 3 ? '○ large text' : '✗'}
              </td>
              <td>
                {whiteOn.toFixed(2)}:1{' '}
                {whiteOn >= 4.5 ? '✓ AA' : whiteOn >= 3 ? '○ large text' : '✗'}
              </td>
              <td>{c.usage}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const type = [
  ['display', '40 / 46', '700', 'Page h1'],
  ['h2', '32 / 1', '700', 'Section headings'],
  ['h3', '20 / 26', '700–800', 'Card and step titles'],
  ['h4', '16 / 1.2', '700', 'Service grid labels'],
  ['price', '46 / 1', '700', 'Pricing tiers'],
  ['counter', '64 / 1', '700', 'Stats banner number'],
  ['body', '16 / 24', '400', 'Body copy'],
  ['small', '14 / 20', '400–700', 'Buttons, card copy, nav'],
  ['caption', '13 / 26', '400–600', 'Footer links, footnotes'],
] as const

export function TypeScale() {
  return (
    <div className="space-y-3">
      {type.map(([name, size, weight, usage]) => (
        <div key={name} className="flex flex-wrap items-baseline gap-4 border-b border-line pb-3">
          <span
            className={`text-${name} w-56`}
            style={{ fontWeight: Number(String(weight).split('–')[0]) }}
          >
            Aa Montserrat
          </span>
          <code className="text-small">text-{name}</code>
          <span className="text-small text-muted">
            {size}px · {weight} · {usage}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Radii() {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      <li className="rounded-card bg-white p-4 shadow-card">
        <code>rounded-card</code> 12px + <code>shadow-card</code>
      </li>
      <li className="rounded-pill bg-accent-deep p-4 text-center font-bold uppercase text-white">
        <code>rounded-pill</code> 28px
      </li>
      <li className="rounded-field bg-peach p-4">
        <code>rounded-field</code> 20px (form fields)
      </li>
    </ul>
  )
}

export function Spacing() {
  return (
    <ul className="list-disc space-y-1 pl-5 text-small">
      <li>
        Containers: <code>container-content</code> 1140px, <code>container-wide</code> 1200px
        (footer), <code>container-narrow</code> 900px (forms)
      </li>
      <li>
        Section padding: 50px (<code>py-section</code>) and 90px (<code>py-section-lg</code>) on
        desktop
      </li>
      <li>
        Breakpoints: <code>md</code> 768px (Elementor mobile ends at 767), <code>lg</code> 1025px
        (tablet ends at 1024)
      </li>
      <li>Grid gaps: 20px between cards, 32px between review cards</li>
    </ul>
  )
}
