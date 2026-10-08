import { spawnSync } from 'node:child_process'
import { chromiumPath } from './lib/chromium'

/**
 * `pnpm lhci [args]`: `lhci autorun` with CHROME_PATH set to the Chromium the other browser tools use
 * (scripts/lib/chromium.ts), so it runs in a container or on a laptop without setting it by hand.
 */
const chrome = chromiumPath()
const env = { ...process.env, ...(chrome ? { CHROME_PATH: chrome } : {}) }
const r = spawnSync('lhci', ['autorun', ...process.argv.slice(2)], { stdio: 'inherit', env })
process.exit(r.status ?? 1)
