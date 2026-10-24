import fs from 'node:fs'
import path from 'node:path'
import { Scanner } from '@tailwindcss/oxide'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

/**
 * The design scale is the only one (src/styles/theme.css). This test reads every class the components and the
 * app use, the way Tailwind itself does (its scanner), compiles each one with the site's theme and refuses:
 *
 * - a utility that compiles to nothing: a size, weight, radius or shadow Tailwind no longer has because the theme
 *   switched its scale off (`text-lg`, `font-medium`, `rounded-lg`), or a typo;
 * - an arbitrary size or colour (`mt-[6px]`, `text-[13px]`, `bg-[#3a3a3a]`, `leading-[22.4px]`);
 * - a half step of the grid (`gap-2.5`, `py-1.5`);
 * - a hex colour written in a component (every colour is a token).
 *
 * The escape hatch, for geometry that cannot be on the scale (a curve traced on a photo, a wave): the line above
 * says why, as `// biome-ignore lint/plugin/off-scale: <reason>`, which also silences the editor's plugin
 * (biome-plugins/off-scale.grit). Those lines are counted, and the count may only go down (OFF_SCALE_BUDGET).
 */

const ROOTS = ['src/components', 'src/app']
const SKIP = /\.stories\.tsx$/
/** The number of escaped lines today. Lower it when one goes; never raise it without saying why in the PR. */
const OFF_SCALE_BUDGET = 6

const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) && !SKIP.test(p) ? [p] : []
  })
const files = ROOTS.flatMap(walk)
const sources = new Map(files.map((f) => [f, fs.readFileSync(f, 'utf8').split('\n')]))

/** A line is excused when it, or the line before it, carries an off-scale note. */
const ESCAPE = /off-scale:/
const excused = (lines: string[], i: number) =>
  ESCAPE.test(lines[i] ?? '') || ESCAPE.test(lines[i - 1] ?? '')

/** The candidates that look like a utility of a scaled family (and so must compile). */
const UTILITY =
  /^(?:[a-z0-9-]+:)*-?(?:text|leading|font|tracking|rounded(?:-[a-z]+)?|shadow|p[xytrbl]?|m[xytrbl]?|gap(?:-[xy])?|space-[xy]|w|h|size|min-w|max-w|min-h|max-h|basis|inset(?:-[xy])?|top|right|bottom|left|scroll-m[xytrbl]?|border(?:-[xytrbl])?|bg|stroke|fill|outline|decoration|divide|ring)(?:-[a-z0-9.[\]#%/()_,&*:=\\-]+)$/
/** An arbitrary value that is a size, a time or a colour; `var()`, `attr()`, `url()`, selectors and grid tracks are fine. */
const ARBITRARY = /\[[^\]]*(?:\d(?:px|rem|em|%|vh|vw|svh|dvh|ms)\b|#[0-9a-f]{3,8}\b)[^\]]*\]/i
const SAFE_ARBITRARY = /\[(?:var\(|attr\(|url\(|&|\.|--|length:|position:|linear-gradient)/
const HALF_STEP = /-\d+\.5$/
const HEX = /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b(?![0-9a-z-])/i

async function compiler() {
  const theme = fs.readFileSync('src/styles/theme.css', 'utf8')
  return compile(
    `@import "tailwindcss/theme.css" layer(theme);\n@import "tailwindcss/utilities.css" layer(utilities);\n${theme}`,
    {
      base: process.cwd(),
      loadStylesheet: async (id, base) => {
        const p = id.startsWith('tailwindcss/')
          ? path.join(process.cwd(), 'node_modules', id)
          : path.resolve(base, id)
        return { path: p, base: path.dirname(p), content: fs.readFileSync(p, 'utf8') }
      },
      loadModule: async (id) => ({ path: id, base: process.cwd(), module: {} }),
    },
  )
}

/** Where a class is written: `file:line` for every line that holds it and is not excused. */
function placesOf(cls: string): string[] {
  const out: string[] = []
  const whole = new RegExp(
    `(^|[\\s"'\`])${cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[\\s"'\`])`,
  )
  for (const [file, lines] of sources)
    lines.forEach((line, i) => {
      if (whole.test(line) && !excused(lines, i)) out.push(`${file}:${i + 1}  ${cls}`)
    })
  return out
}

describe('design scale', () => {
  it('every class of the components and the app is on the scale', async () => {
    const scanner = new Scanner({
      sources: files.map((f) => ({
        base: path.resolve(path.dirname(f)),
        pattern: path.basename(f),
        negated: false,
      })),
    })
    const candidates = scanner.scan()
    const tw = await compiler()
    // `build` is incremental: a candidate is a utility when the CSS grows with it.
    let size = tw.build([]).length
    const problems: string[] = []
    for (const cls of candidates) {
      const next = tw.build([cls]).length
      const compiles = next > size
      size = next
      let why: string | undefined
      if (ARBITRARY.test(cls) && !SAFE_ARBITRARY.test(cls)) why = 'arbitrary value: use a token'
      else if (HALF_STEP.test(cls)) why = 'half step: use a whole step of the 4px grid'
      else if (!compiles && UTILITY.test(cls) && !cls.includes('['))
        why = 'compiles to nothing: not on the scale, or a typo'
      if (why) for (const at of placesOf(cls)) problems.push(`${at}  (${why})`)
    }
    expect([...new Set(problems)].sort().join('\n')).toBe('')
  }, 30_000)

  it('no colour is written in a component: every colour is a token of theme.css', () => {
    const problems: string[] = []
    for (const [file, lines] of sources)
      lines.forEach((line, i) => {
        if (HEX.test(line) && !excused(lines, i)) problems.push(`${file}:${i + 1}  ${line.trim()}`)
      })
    expect(problems.join('\n')).toBe('')
  })

  it('keeps the off-scale escapes within the budget, and the budget honest', () => {
    const escapes: string[] = []
    for (const [file, lines] of sources)
      lines.forEach((line, i) => {
        if (ESCAPE.test(line)) escapes.push(`${file}:${i + 1}  ${line.trim()}`)
      })
    expect(escapes.length, `off-scale escapes:\n${escapes.join('\n')}`).toBeLessThanOrEqual(
      OFF_SCALE_BUDGET,
    )
    // lower the budget as escapes go, so it keeps saying what is there
    expect(escapes.length, 'OFF_SCALE_BUDGET is above the number of escapes: lower it').toBe(
      OFF_SCALE_BUDGET,
    )
  })
})
