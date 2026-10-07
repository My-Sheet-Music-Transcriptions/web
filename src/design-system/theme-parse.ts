/**
 * Parses the `@theme { ... }` block of src/styles/theme.css into the token model used by the
 * Storybook Foundations page and by the published Design System artifact (its tokens.json shape).
 * Pure and browser-safe: no Node APIs.
 */

export interface Token {
  name: string
  value: string
  usage: string
}
export interface TypeStyle {
  name: string
  fontSize: string
  lineHeight: string
  fontWeight: number
  usage: string
}
export interface ThemeTokens {
  name: string
  version: number
  color: { themes: { id: string; name: string }[]; tokens: Token[] }
  type: {
    fonts: { family: string; file: string; weight: string; style?: string }[]
    families: Record<string, string>
    groups: { name: string; family: string; styles: Omit<TypeStyle, 'usage'>[] }[]
    styles: TypeStyle[]
  }
  spacing: { tokens: Token[] }
  radius: { tokens: Token[] }
  shadow: { tokens: Token[] }
  layout: { containers: Token[]; breakpoints: Token[] }
}

/** Weights and usage for the type scale; sizes and line-heights come from the CSS. */
export const TYPE_META: Record<string, { weight: number; usage: string }> = {
  display: { weight: 700, usage: 'Page h1' },
  h2: { weight: 700, usage: 'Section headings' },
  h3: { weight: 800, usage: 'Card and step titles (700 on cards, 800 on steps)' },
  h4: { weight: 700, usage: 'Service grid labels' },
  price: { weight: 700, usage: 'Pricing tier amount' },
  counter: { weight: 700, usage: 'Stats banner number' },
  body: { weight: 400, usage: 'Body copy' },
  small: { weight: 400, usage: 'Buttons (700, uppercase), card copy, navigation' },
  caption: { weight: 400, usage: 'Footer links, footnotes' },
}

/** Font files shipped with the artifact (copied from @fontsource-variable/montserrat). */
export const FONT_FILES = [
  {
    family: 'Montserrat Variable',
    file: 'fonts/montserrat-latin-wght-normal.woff2',
    weight: '100 900',
    style: 'normal',
  },
  {
    family: 'Montserrat Variable',
    file: 'fonts/montserrat-latin-wght-italic.woff2',
    weight: '100 900',
    style: 'italic',
  },
  {
    family: 'Montserrat Variable',
    file: 'fonts/montserrat-latin-ext-wght-normal.woff2',
    weight: '100 900',
    style: 'normal',
  },
]

const DECL = /--([a-z0-9-]+?)(--line-height)?\s*:\s*([^;]+);[ \t]*(?:\/\*\s*(.*?)\s*\*\/)?/g

function hex8ToRgba(value: string): string {
  const m = /^#([0-9a-f]{6})([0-9a-f]{2})$/i.exec(value.trim())
  if (!m) return value.trim()
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt((m[1] ?? '').slice(i, i + 2), 16))
  const a = Number.parseInt(m[2] ?? 'ff', 16) / 255
  return `rgba(${r}, ${g}, ${b}, ${Math.round(a * 1000) / 1000})`
}

export function parseTheme(css: string): ThemeTokens {
  const start = css.indexOf('@theme')
  const open = css.indexOf('{', start)
  let depth = 0
  let end = open
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}') depth--
    if (depth === 0) {
      end = i
      break
    }
  }
  const block = css.slice(open + 1, end)

  const color: Token[] = []
  const radius: Token[] = []
  const shadow: Token[] = []
  const spacing: Token[] = []
  const containers: Token[] = []
  const breakpoints: Token[] = []
  const families: Record<string, string> = {}
  const sizes = new Map<string, { fontSize?: string; lineHeight?: string }>()

  for (const m of block.matchAll(DECL)) {
    const [, full = '', lh, rawValue = '', usage = ''] = m
    const value = rawValue.trim()
    const [family, ...rest] = full.split('-')
    const name = rest.join('-')
    switch (family) {
      case 'color':
        color.push({ name, value: hex8ToRgba(value), usage })
        break
      case 'text': {
        const cur = sizes.get(name) ?? {}
        if (lh) cur.lineHeight = value
        else cur.fontSize = value
        sizes.set(name, cur)
        break
      }
      // Artifact token names must be unique across families, so radius/shadow carry their family prefix.
      case 'radius':
        radius.push({ name: `radius-${name}`, value, usage })
        break
      case 'shadow':
        shadow.push({ name: `shadow-${name}`, value, usage })
        break
      case 'spacing':
        spacing.push({ name, value, usage: usage || 'Section padding' })
        break
      case 'container':
        containers.push({ name, value, usage: usage || containerUsage(name) })
        break
      case 'breakpoint':
        breakpoints.push({ name, value, usage })
        break
      case 'font':
        families[name] = value.replace(/"/g, '')
        break
      default:
        break
    }
  }

  const styles: TypeStyle[] = [...sizes.entries()].map(([name, s]) => {
    const meta = TYPE_META[name]
    if (!meta) throw new Error(`TYPE_META is missing an entry for --text-${name}`)
    return {
      name,
      fontSize: s.fontSize ?? '',
      lineHeight: s.lineHeight ?? 'normal',
      fontWeight: meta.weight,
      usage: meta.usage,
    }
  })

  return {
    name: 'My Sheet Music Transcriptions',
    version: 1,
    color: { themes: [{ id: 'light', name: 'Light' }], tokens: color },
    type: {
      fonts: FONT_FILES,
      families: { sans: families.sans ?? 'Montserrat Variable, Montserrat, system-ui, sans-serif' },
      groups: [{ name: 'Text', family: 'sans', styles: styles.map(({ usage: _u, ...s }) => s) }],
      styles,
    },
    spacing: {
      tokens: [
        ...spacing,
        ...containers.map((t) => ({ ...t, name: `container-${t.name}` })),
        ...breakpoints.map((t) => ({
          ...t,
          name: `breakpoint-${t.name}`,
          usage: t.usage || 'Breakpoint',
        })),
      ],
    },
    radius: { tokens: radius },
    shadow: { tokens: shadow },
    layout: { containers, breakpoints },
  }
}

function containerUsage(name: string) {
  return (
    { content: 'Default content width', wide: 'Footer and wide grids', narrow: 'Forms and prose' }[
      name
    ] ?? 'Container'
  )
}

/** Relative luminance (WCAG) of a #rrggbb colour. */
export function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!m) return 0
  const [r, g, b] = [0, 2, 4]
    .map((i) => Number.parseInt((m[1] ?? '').slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0)
}

export function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return ((l1 ?? 0) + 0.05) / ((l2 ?? 0) + 0.05)
}

/** tokens.json for the Design System artifact (drops the helper `styles`/`layout` views). */
export function toArtifactTokens(t: ThemeTokens) {
  return {
    name: t.name,
    version: t.version,
    color: t.color,
    type: { fonts: t.type.fonts, families: t.type.families, groups: t.type.groups },
    spacing: t.spacing,
    radius: t.radius,
    shadow: t.shadow,
  }
}
