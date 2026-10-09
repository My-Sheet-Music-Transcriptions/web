import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The bundler emits byte-identical images once, under whichever source name it meets first, and that varies
 * from build to build: the prerendered HTML can then point at a name the client build never wrote (the 404s
 * tests/seo/seo.test.ts catches). So the same picture never sits under two names, and the brand folder holds
 * each picture once. Copies under the same name in several page folders are fine (co-location, translated
 * pages): they build to one file with one name.
 */

const ASSETS = 'src/assets/images'
const ROOTS = [ASSETS, 'content']
const IMAGE = /\.(png|jpe?g|webp|avif|gif|svg|ico)$/i

const byHash = new Map<string, string[]>()
for (const root of ROOTS) {
  for (const f of fs.readdirSync(root, { recursive: true, encoding: 'utf8' })) {
    if (!IMAGE.test(f)) continue
    const file = path.join(root, f)
    const hash = createHash('sha256').update(fs.readFileSync(file)).digest('hex')
    byHash.set(hash, [...(byHash.get(hash) ?? []), file])
  }
}

describe('images', () => {
  it('finds the brand and page pictures', () => {
    expect(byHash.size).toBeGreaterThan(100)
  })

  it('never holds the same picture under two names, nor twice in src/assets/images', () => {
    const conflicts = [...byHash.values()]
      .filter(
        (files) =>
          new Set(files.map((f) => path.basename(f))).size > 1 ||
          files.filter((f) => f.startsWith(`${ASSETS}/`)).length > 1,
      )
      .map((files) => files.sort().join(' ≡ '))
    expect(conflicts).toEqual([])
  })
})
