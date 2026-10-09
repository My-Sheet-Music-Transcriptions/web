import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { OUT, readArtifactRecord } from './lib'
import { pushRecord } from './push-lib'

/**
 * Records a publish of the Design System artifact on main: commits src/design-system/artifact.json alone
 * (after `pnpm ds:index --published --version <id>`) and pushes it straight to main, no pull request.
 * When two publishes race, the last push wins; when main moved by more than a record meanwhile, the
 * export is checked again on the new main first (`pnpm ds:index --check`).
 *   pnpm ds:push [--trailer "Key: value"]...
 * Exit 0: on main (or main already had this record). Exit 3: main moved past this publish, publish
 * again from the new main. Exit 1: anything else (the message says what).
 */
const args = process.argv.slice(2)
const trailers = args.flatMap((a, i) => (args[i - 1] === '--trailer' ? [a] : []))
const record = readArtifactRecord()

const result = await pushRecord({
  message: `Record Design System publish from main\n\nVersion ${record.publishedVersion}, export ${record.exportHash}.`,
  trailers,
  log: (line) => console.log(`[ds:push] ${line}`),
  check: (changed) => {
    if (changed.some((f) => f === 'package.json' || f === 'pnpm-lock.yaml'))
      execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' })
    fs.rmSync(OUT, { recursive: true, force: true })
    try {
      execSync('pnpm ds:index --check', { stdio: 'inherit' })
      return true
    } catch {
      return false
    }
  },
})

if (result.status === 'pushed')
  console.log(
    `[ds:push] recorded on main as ${result.commit}: version ${record.publishedVersion}, export ${record.exportHash} (attempt ${result.attempts})`,
  )
else if (result.status === 'unchanged')
  console.log(`[ds:push] main (${result.tip.slice(0, 7)}) already records this publish`)
else {
  console.error(
    `[ds:push] main moved past this publish: ${result.base.slice(0, 7)}..${result.tip.slice(0, 7)} changes the export (${result.changed.slice(0, 5).join(', ')}${result.changed.length > 5 ? ', …' : ''}). Nothing was pushed. Publish again from the new main (the publish-design-system skill), then run pnpm ds:push again.`,
  )
  process.exitCode = 3
}
