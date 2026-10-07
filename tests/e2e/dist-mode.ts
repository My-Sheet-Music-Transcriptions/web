import fs from 'node:fs'
import path from 'node:path'

/**
 * Whether dist/client is a path-mode build (every locale under /<locale>, see src/i18n/routing.ts) rather
 * than a single-locale production build. Specs for one mode skip on the other.
 */
export const pathModeDist = fs.existsSync(
  path.resolve(process.env.DIST_DIR || 'dist/client', 'en', 'index.html'),
)
