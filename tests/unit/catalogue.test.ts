import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { type BlockDoc, catalogue, ROLES } from '../../src/components/blocks/catalogue'

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
  it('places every block in a role and uses every role', () => {
    const roles = Object.keys(ROLES)
    for (const [n, doc] of Object.entries(catalogue)) expect(roles, n).toContain(doc.role)
    for (const role of roles)
      expect(
        Object.values(catalogue).some((d) => d.role === role),
        `role "${role}" has no block`,
      ).toBe(true)
  })
  it('says in one line when to use each block, and when not', () => {
    const oneLine = (s: string) => !s.includes('\n') && s.length >= 10 && s.length <= 160
    for (const [n, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
      expect(oneLine(doc.useWhen), `${n}.useWhen`).toBe(true)
      if (doc.notFor) expect(oneLine(doc.notFor), `${n}.notFor`).toBe(true)
    }
  })
  it('keeps preview heights sane', () => {
    for (const [n, doc] of Object.entries(catalogue)) {
      expect(doc.previewHeight, n).toBeGreaterThanOrEqual(200)
      expect(doc.previewHeight, n).toBeLessThanOrEqual(1400)
    }
  })
})
