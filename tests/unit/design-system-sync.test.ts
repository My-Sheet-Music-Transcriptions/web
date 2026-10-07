import { describe, expect, it } from 'vitest'
import {
  designSystemSourceHash,
  designSystemSources,
  readArtifactRecord,
} from '../../scripts/design-system/lib'

/**
 * The Design System artifact (page previews) and Storybook render the same sources. This test keeps the
 * published artifact from drifting: when any of those sources changes, the publish-design-system skill
 * must run, which records the new source hash in src/design-system/artifact.json.
 */
describe('design-system artifact is in sync with its sources', () => {
  it('lists the sources Storybook also renders', () => {
    const sources = designSystemSources()
    expect(sources).toContain('src/styles/theme.css')
    expect(sources).toContain('src/components/blocks/catalogue.ts')
    expect(sources.some((f) => f.startsWith('src/components/blocks/') && f.endsWith('.tsx'))).toBe(
      true,
    )
    expect(sources.some((f) => f.endsWith('.stories.tsx'))).toBe(false)
  })

  it('was published from the current sources (else run the publish-design-system skill)', () => {
    const record = readArtifactRecord()
    expect(record.url, 'src/design-system/artifact.json has no url').toBeTruthy()
    expect(
      record.sourceHash,
      `artifact.json#sourceHash is ${record.sourceHash ?? 'missing'} but the design-system sources hash to ${designSystemSourceHash()}: ` +
        'theme, blocks, catalogue, layout, data or brand assets changed since the artifact was published. ' +
        'Run the publish-design-system skill (pnpm ds:export → publish → pnpm ds:index --published).',
    ).toBe(designSystemSourceHash())
  })
})
