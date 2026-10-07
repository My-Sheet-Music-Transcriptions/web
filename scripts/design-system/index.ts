import { designSystemSourceHash, readArtifactRecord, recordPublish, writeIndex } from './lib'

/**
 * Rewrites only the artifact index + manifest from the committed asset records (after new uploads
 * were recorded in src/design-system/artifact.json), without rebuilding the bundle.
 *   pnpm ds:index ["note for lastChange"]
 *   pnpm ds:index --published      after a successful publish: records the commit + source hash in
 *                                  src/design-system/artifact.json (the sync test compares against it)
 *   pnpm ds:index --check          exits 1 when the sources changed since the last publish (the sync test's
 *                                  comparison, without starting vitest)
 */
const args = process.argv.slice(2)
if (args.includes('--check')) {
  const published = readArtifactRecord().sourceHash ?? null
  const current = designSystemSourceHash()
  if (published === current) {
    console.log(`[ds:index] artifact in sync with its sources (${current})`)
  } else {
    console.error(
      `[ds:index] sources hash to ${current} but the artifact was published from ${published ?? 'nothing'}: run the publish-design-system skill`,
    )
    process.exitCode = 1
  }
} else if (args.includes('--published')) {
  const r = recordPublish()
  console.log(`[ds:index] recorded publish: ${r.publishedFrom} sourceHash=${r.sourceHash}`)
} else {
  const m = writeIndex(args[0] ?? 'index refreshed')
  console.log(
    `[ds:index] ${m.files.length} project files, ${m.uploads.length} uploads (${m.pendingUploads.length} pending)${m.sourceHash === m.publishedSourceHash ? '' : ' — sources changed since the last publish'}`,
  )
}
