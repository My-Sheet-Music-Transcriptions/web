import { writeIndex } from './lib'

/**
 * Rewrites only the artifact index + manifest from the committed asset records (after new uploads
 * were recorded in src/design-system/artifact.json), without rebuilding the bundle.
 *   pnpm ds:index [-- "note for lastChange"]
 */
const m = writeIndex(process.argv[2] ?? 'index refreshed')
console.log(
  `[ds:index] ${m.files.length} project files, ${m.uploads.length} uploads (${m.pendingUploads.length} pending)`,
)
