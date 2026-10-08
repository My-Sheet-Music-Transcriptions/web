import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'
import { PROJ } from '../../scripts/design-system/lib'
import {
  compareWithMockup,
  mockupFile,
  type ShotReport,
} from '../../scripts/design-system/shot-lib'
import { findChromium } from '../../scripts/lib/chromium'

/**
 * The local render check: every browser tool finds the Chromium a container already has (cloud sessions ship
 * one whose revision differs from the lockfile's), a mockup is served with its design system and pictures and
 * nothing else, and a real page is compared with its mockup.
 */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'msmt-shot-'))
afterAll(() => fs.rmSync(tmp, { recursive: true, force: true }))

function touch(file: string) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, '')
}

describe('findChromium', () => {
  it('takes the newest full Chromium across roots, before any headless shell', () => {
    const a = path.join(tmp, 'a')
    const b = path.join(tmp, 'b')
    touch(path.join(a, 'chromium-1194/chrome-linux/chrome'))
    touch(path.join(b, 'chromium-1200/chrome-linux64/chrome'))
    touch(
      path.join(
        b,
        'chromium_headless_shell-1300/chrome-headless-shell-linux64/chrome-headless-shell',
      ),
    )
    expect(findChromium([a, b, path.join(tmp, 'missing')], [])).toBe(
      path.join(b, 'chromium-1200/chrome-linux64/chrome'),
    )
  })

  it('falls back to a headless shell, then a system browser, then nothing', () => {
    const c = path.join(tmp, 'c')
    touch(path.join(c, 'chromium_headless_shell-1194/chrome-linux/headless_shell'))
    expect(findChromium([c], [])).toBe(
      path.join(c, 'chromium_headless_shell-1194/chrome-linux/headless_shell'),
    )
    const system = path.join(tmp, 'usr/bin/chromium')
    touch(system)
    expect(findChromium([path.join(tmp, 'empty')], [system])).toBe(system)
    expect(findChromium([path.join(tmp, 'empty')], [])).toBeUndefined()
  })
})

describe('mockupFile', () => {
  const img = path.join(tmp, 'img')
  it('maps ds/ to the export, img/ to the pictures and names to the rendered pages', () => {
    expect(mockupFile('/ds/components/bundle.js', img, {})).toBe(
      path.join(PROJ, 'components/bundle.js'),
    )
    expect(mockupFile('/img/photo%20one.jpg?v=1', img, {})).toBe(path.join(img, 'photo one.jpg'))
    expect(mockupFile('/main.html', img, { 'main.html': 'x/main.html' })).toBe('x/main.html')
  })

  it('serves nothing outside those folders', () => {
    expect(mockupFile('/ds/../../../package.json', img, {})).toBeNull()
    expect(mockupFile('/img/../secret', img, {})).toBeNull()
    expect(mockupFile('/package.json', img, {})).toBeNull()
  })
})

describe('compareWithMockup', () => {
  const report = (label: string, width: number, height: number): ShotReport => ({
    label,
    width,
    height,
    full: `${label}-${width}.png`,
    sections: [],
    errors: [],
    notes: [],
  })

  it('flags a page more than 5% taller or shorter than its mockup at the same width', () => {
    const dir = path.join(tmp, 'cmp')
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(
      path.join(dir, 'main.json'),
      JSON.stringify([report('main', 1440, 4000), report('main', 390, 7000)]),
    )
    const lines = compareWithMockup(dir, [report('page', 1440, 4100), report('page', 390, 5000)])
    expect(lines[0]).toMatch(/^· @ 1440px/)
    expect(lines[1]).toMatch(/^✗ @ 390px .*\(-29%\)/)
    expect(compareWithMockup(path.join(tmp, 'none'), [report('page', 390, 1)])).toEqual([])
  })
})
