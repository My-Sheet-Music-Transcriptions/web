import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { withBlockTable } from '../../scripts/design-system/readme-lib'
import { type BlockDoc, CATEGORIES, catalogue } from '../../src/components/blocks/catalogue'

const names = Object.keys(catalogue)
const readme = fs.readFileSync('src/components/blocks/README.md', 'utf8')

describe('block catalogue', () => {
  it('documents every block in README.md, with the current table (pnpm ds:export rewrites it)', () => {
    for (const n of names) expect(readme, n).toContain(`\`${n}\``)
    expect(readme).toBe(withBlockTable(readme))
  })
  it('uses the block itself as the root tag of its usage snippet', () => {
    for (const [n, doc] of Object.entries(catalogue)) {
      expect(doc.usage.trim().startsWith(`<${n}`), n).toBe(true)
    }
  })
  it('has a story and a component file for every block', () => {
    for (const n of names) {
      expect(fs.existsSync(`src/components/blocks/${n}.tsx`), n).toBe(true)
      expect(fs.existsSync(`src/components/blocks/${n}.stories.tsx`), n).toBe(true)
    }
  })
  it('places every block in a category and uses every category', () => {
    const categories = Object.keys(CATEGORIES)
    for (const [n, doc] of Object.entries(catalogue)) expect(categories, n).toContain(doc.category)
    for (const category of categories)
      expect(
        Object.values(catalogue).some((d) => d.category === category),
        `category "${category}" has no block`,
      ).toBe(true)
  })
  it('says in one line when to use each block, and when not', () => {
    const oneLine = (s: string) => !s.includes('\n') && s.length >= 10 && s.length <= 160
    for (const [n, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
      expect(oneLine(doc.useWhen), `${n}.useWhen`).toBe(true)
      if (doc.notFor) expect(oneLine(doc.notFor), `${n}.notFor`).toBe(true)
    }
  })
  it('files every block story under Blocks/<Category>/<Name>', () => {
    for (const [n, doc] of Object.entries(catalogue) as [string, BlockDoc][]) {
      const story = fs.readFileSync(`src/components/blocks/${n}.stories.tsx`, 'utf8')
      expect(/title: '([^']+)'/.exec(story)?.[1], n).toBe(
        `Blocks/${CATEGORIES[doc.category].label}/${n}`,
      )
    }
  })
  it('lists the categories in Storybook in page order', () => {
    const preview = fs.readFileSync('.storybook/preview.tsx', 'utf8').replace(/\s+/g, ' ')
    expect(preview).toContain(
      `'Blocks', [${Object.values(CATEGORIES)
        .map((c) => `'${c.label}'`)
        .join(', ')}]`,
    )
  })
  it('keeps preview heights sane', () => {
    for (const [n, doc] of Object.entries(catalogue)) {
      expect(doc.previewHeight, n).toBeGreaterThanOrEqual(200)
      expect(doc.previewHeight, n).toBeLessThanOrEqual(1400)
    }
  })
})
