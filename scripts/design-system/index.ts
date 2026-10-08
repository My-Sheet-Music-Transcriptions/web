import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { readArtifactRecord, recordPublish, writeIndex } from './lib'
import { MANIFEST_FILE } from './preview-lib'

/**
 * The artifact index + manifest, and the publish record the sync check compares against.
 *   pnpm ds:index ["note for lastChange"]     rewrite project/design-system.json + manifest.json from the
 *                                             committed asset records, without rebuilding the bundle
 *   pnpm ds:index --check [--no-export]       exit 1 when the artifact is behind the repo: runs pnpm ds:export
 *                                             (unless --no-export) and compares the export's hash with the one
 *                                             recorded at the last publish (src/design-system/artifact.json)
 *   pnpm ds:index --published --version <id>  after a successful publish: records the artifact version the
 *                                             publish created (from the Artifact files listing), the export
 *                                             hash, the commit and the time in src/design-system/artifact.json
 */
const args = process.argv.slice(2)
const flag = (name: string) => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : (args[i + 1] ?? '')
}

if (args.includes('--check')) {
  if (!args.includes('--no-export')) {
    try {
      execSync('pnpm ds:export "sync check"', { stdio: 'pipe' })
    } catch (e) {
      console.error(String((e as { stdout?: Buffer }).stdout ?? e))
      throw new Error('pnpm ds:export failed')
    }
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as { exportHash: string }
  const record = readArtifactRecord()
  if (manifest.exportHash === record.exportHash) {
    console.log(
      `[ds:index] artifact in sync: export ${manifest.exportHash} = version ${record.publishedVersion}`,
    )
  } else {
    console.error(
      `[ds:index] the export hashes to ${manifest.exportHash} but the artifact (version ${record.publishedVersion ?? 'unknown'}) was published from ${record.exportHash ?? 'nothing'}: run the publish-design-system skill`,
    )
    process.exitCode = 1
  }
} else if (args.includes('--published')) {
  const version = flag('--version')
  if (!version)
    throw new Error(
      'pnpm ds:index --published needs --version <id>: the artifact version the publish created, as the Artifact files listing prints it (e.g. 1791471138-a631)',
    )
  const r = recordPublish(version)
  console.log(
    `[ds:index] recorded publish: version ${r.publishedVersion}, export ${r.exportHash} (from ${r.publishedFrom})`,
  )
} else {
  const m = writeIndex(args[0] ?? 'index refreshed')
  const r = readArtifactRecord()
  console.log(
    `[ds:index] ${m.files.length} project files, ${m.uploads.length} uploads (${m.pendingUploads.length} pending)${m.exportHash === r.exportHash ? '' : ' — the export changed since the last publish'}`,
  )
}
