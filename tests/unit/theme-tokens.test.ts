import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contrast, parseTheme, toArtifactTokens } from '../../src/design-system/theme-parse'

const theme = parseTheme(fs.readFileSync('src/styles/theme.css', 'utf8'))

describe('theme tokens', () => {
  it('parses the brand palette with accessible primary and CTA colours', () => {
    const get = (n: string) => theme.color.tokens.find((t) => t.name === n)?.value
    expect(get('primary')).toBe('#1a7f97')
    expect(get('accent-deep')).toBe('#b8571c')
    expect(contrast(get('primary') ?? '', '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(contrast(get('accent-deep') ?? '', '#ffffff')).toBeGreaterThanOrEqual(4.5)
  })
  it('uses unique token names across every family and only hex/rgb values', () => {
    const all = [
      ...theme.color.tokens,
      ...theme.spacing.tokens,
      ...theme.radius.tokens,
      ...theme.shadow.tokens,
    ]
    const names = all.map((t) => t.name)
    expect(new Set(names).size).toBe(names.length)
    for (const c of theme.color.tokens) expect(c.value, c.name).toMatch(/^(#[0-9a-f]{6}|rgba?\()/)
  })
  it('gives every brand colour a usage note', () => {
    const silent = theme.color.tokens.filter((t) => !t.usage).map((t) => t.name)
    // Platform brand colours and simple tints may stay unannotated; everything else must be documented.
    const allowed = new Set([
      'google',
      'facebook',
      'trustpilot',
      'accent-hover',
      'orange-tint',
      'teal-light',
      'azure',
      'pine',
      'peach-deep',
      'sand',
      'line',
      'footer',
      'footer-text',
    ])
    expect(silent.filter((n) => !allowed.has(n))).toEqual([])
  })
  it('pairs every text size with a line-height and a weight', () => {
    expect(theme.type.styles.length).toBeGreaterThanOrEqual(9)
    for (const s of theme.type.styles) {
      expect(s.fontSize, s.name).toMatch(/px$/)
      expect(s.lineHeight, s.name).not.toBe('')
      expect(s.fontWeight).toBeGreaterThan(0)
    }
  })
  it('exports the artifact tokens.json shape', () => {
    const json = toArtifactTokens(theme)
    expect(json.color.themes[0]?.id).toBe('light')
    expect(json.type.groups[0]?.styles.length).toBe(theme.type.styles.length)
    expect(json.type.fonts.every((f) => f.file.startsWith('fonts/'))).toBe(true)
    expect('styles' in json.type).toBe(false) // helper view not leaked at top level
    expect('layout' in json).toBe(false)
  })
})
