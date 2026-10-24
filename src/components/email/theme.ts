import { parseTheme } from '~/design-system/theme-parse'
import themeCss from '~/styles/theme.css?raw'

/**
 * The site's tokens as plain values for email: mail clients take neither CSS variables nor classes, so the emails
 * style inline from these, read from src/styles/theme.css like every other surface. A fluid size takes its smallest
 * step (a phone's), the only one an email can rely on.
 */

const theme = parseTheme(themeCss)
const byName = (tokens: { name: string; value: string }[], prefix = '') =>
  Object.fromEntries(tokens.map((t) => [t.name.replace(prefix, ''), t.value]))
const minSize = (value: string) => value.match(/^clamp\(([^,]+),/)?.[1]?.trim() ?? value

const colors = byName(theme.color.tokens)
const spacing = byName(theme.spacing.tokens)
const radii = byName(theme.radius.tokens, 'radius-')

const pick = (map: Record<string, string>, name: string) => {
  const value = map[name]
  if (!value) throw new Error(`theme.css has no ${name} token`)
  return value
}

export const color = (name: string) => pick(colors, name)
export const space = (name: string) => pick(spacing, name)
export const radius = (name: string) => pick(radii, name)

/** A type style as inline CSS: size, line-height and weight. */
export function type(name: string) {
  const style = theme.type.styles.find((s) => s.name === name)
  if (!style) throw new Error(`theme.css has no ${name} token`)
  return {
    fontSize: minSize(style.fontSize),
    lineHeight: style.lineHeight,
    fontWeight: style.fontWeight,
  }
}

/** Montserrat where the reader has it, then the system sans of every mail client. */
export const fontFamily = `${theme.type.families.sans}, Helvetica, Arial`

/** The letter-spacing of uppercase labels and buttons (`label-caps`). */
export const trackingLabel = themeCss.match(/--tracking-label:\s*([^;]+);/)?.[1]?.trim() ?? 'normal'
