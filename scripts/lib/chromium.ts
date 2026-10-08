import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { chromium } from 'playwright'

/**
 * The Chromium every local browser tool launches (Playwright e2e, Storybook's vitest browser, Lighthouse CI,
 * `pnpm ds:shot`), so none of them needs `playwright install` in a container that already has a browser:
 *   1. CHROME_PATH, when it points at a file;
 *   2. nothing (undefined: Playwright's own default) when the browser this Playwright version expects is
 *      installed, which is the case on CI after `playwright install chromium`;
 *   3. otherwise the newest Chromium found in PLAYWRIGHT_BROWSERS_PATH, ~/.cache/ms-playwright or
 *      /opt/pw-browsers (cloud sessions ship one there, often a different revision than the lockfile's), then
 *      a system Chrome/Chromium.
 */
export function chromiumExecutable(env: NodeJS.ProcessEnv = process.env): string | undefined {
  if (env.CHROME_PATH && fs.existsSync(env.CHROME_PATH)) return env.CHROME_PATH
  if (fs.existsSync(chromium.executablePath())) return undefined
  return findChromium(browserRoots(env))
}

/** Like chromiumExecutable(), but a path even for Playwright's own browser (Lighthouse launches Chrome itself). */
export function chromiumPath(env: NodeJS.ProcessEnv = process.env): string | undefined {
  const found = chromiumExecutable(env) ?? chromium.executablePath()
  return fs.existsSync(found) ? found : undefined
}

export function browserRoots(env: NodeJS.ProcessEnv = process.env): string[] {
  return [
    env.PLAYWRIGHT_BROWSERS_PATH,
    path.join(os.homedir(), '.cache/ms-playwright'),
    path.join(os.homedir(), 'Library/Caches/ms-playwright'),
    '/opt/pw-browsers',
  ].filter((d): d is string => !!d && d !== '0')
}

/** Binaries inside a Playwright browser folder, full Chromium before the headless shell. */
const LAYOUTS: [RegExp, string[]][] = [
  [
    /^chromium-(\d+)$/,
    [
      'chrome-linux64/chrome',
      'chrome-linux/chrome',
      'chrome-mac-arm64/Chromium.app/Contents/MacOS/Chromium',
      'chrome-mac/Chromium.app/Contents/MacOS/Chromium',
    ],
  ],
  [
    /^chromium_headless_shell-(\d+)$/,
    [
      'chrome-headless-shell-linux64/chrome-headless-shell',
      'chrome-linux/headless_shell',
      'chrome-headless-shell-mac-arm64/chrome-headless-shell',
    ],
  ],
]
const SYSTEM = [
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]

/** The newest Chromium under `roots` (by revision), else a system one, else undefined. */
export function findChromium(roots: string[], system: string[] = SYSTEM): string | undefined {
  for (const [pattern, bins] of LAYOUTS) {
    const found: { rev: number; bin: string }[] = []
    for (const root of roots) {
      if (!fs.existsSync(root)) continue
      for (const dir of fs.readdirSync(root)) {
        const rev = pattern.exec(dir)?.[1]
        const bin = rev && bins.map((b) => path.join(root, dir, b)).find((b) => fs.existsSync(b))
        if (rev && bin) found.push({ rev: Number(rev), bin })
      }
    }
    const best = found.sort((a, b) => b.rev - a.rev)[0]
    if (best) return best.bin
  }
  return system.find((b) => fs.existsSync(b))
}
