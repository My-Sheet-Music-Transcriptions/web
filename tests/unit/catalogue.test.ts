import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { catalogue } from '../../src/components/blocks/catalogue'

const names = Object.keys(catalogue)
const readme = fs.readFileSync('src/components/blocks/README.md', 'utf8')

describe('block catalogue', () => {
  it('documents every block in README.md', () => {
    for (const n of names) expect(readme, n).toContain(`\`${n}\``)
  })
  it('uses the block itself as the root tag of its MDX snippet', () => {
    for (const [n, doc] of Object.entries(catalogue)) {
      expect(doc.mdx.trim().startsWith(`<${n}`), n).toBe(true)
    }
  })
  it('has a story and a component file for every block', () => {
    for (const n of names) {
      expect(fs.existsSync(`src/components/blocks/${n}.tsx`), n).toBe(true)
      expect(fs.existsSync(`src/components/blocks/${n}.stories.tsx`), n).toBe(true)
    }
  })
  it('keeps preview heights sane', () => {
    for (const [n, doc] of Object.entries(catalogue)) {
      expect(doc.previewHeight, n).toBeGreaterThanOrEqual(200)
      expect(doc.previewHeight, n).toBeLessThanOrEqual(1400)
    }
  })
})
