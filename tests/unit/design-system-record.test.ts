import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { exportHash, readArtifactRecord } from '../../scripts/design-system/lib'

/**
 * The Design System artifact is published from main by the publish-design-system skill; whether it is in
 * sync is `pnpm ds:index --check` (nightly and before every preview), not a unit test, because a single
 * artifact cannot match every branch at once. What the unit tests keep: the record every preview pins to,
 * and the export hash that the check compares.
 */
describe('design-system publish record', () => {
  it('names the artifact, the version previews pin to and the export it was published from', () => {
    const record = readArtifactRecord()
    expect(record.url, 'src/design-system/artifact.json has no url').toMatch(
      /^https:\/\/claude\.ai\/artifact\//,
    )
    expect(record.publishedVersion, 'artifact.json#publishedVersion').toMatch(/^[\w.-]{4,64}$/)
    expect(record.exportHash, 'artifact.json#exportHash').toMatch(/^[0-9a-f]{16}$/)
  })
})

describe('exportHash', () => {
  const fixture = (index: Record<string, unknown>, extra: Record<string, string> = {}) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-export-'))
    fs.mkdirSync(path.join(dir, 'components'), { recursive: true })
    fs.writeFileSync(path.join(dir, 'design-system.json'), JSON.stringify(index))
    fs.writeFileSync(path.join(dir, 'components/bundle.js'), 'window.MSMT = {}')
    for (const [f, text] of Object.entries(extra)) fs.writeFileSync(path.join(dir, f), text)
    return dir
  }
  const index = { v: 3, title: 'MSMT', groups: ['Brand'] }

  it('ignores the index note and timestamp', () => {
    const a = fixture({ ...index, lastChange: { at: '2026-10-08T14:52:00Z', note: 'one' } })
    const b = fixture({ ...index, lastChange: { at: '2026-10-09T09:00:00Z', note: 'two' } })
    expect(exportHash(a)).toBe(exportHash(b))
    expect(exportHash(a)).toMatch(/^[0-9a-f]{16}$/)
  })

  it('changes with any file of the export', () => {
    const a = fixture(index)
    expect(exportHash(fixture({ ...index, groups: ['Brand', 'Flags'] }))).not.toBe(exportHash(a))
    expect(exportHash(fixture(index, { 'components/bundle.css': ':root{}' }))).not.toBe(
      exportHash(a),
    )
  })

  it('asks for an export when there is none', () => {
    expect(() => exportHash(path.join(os.tmpdir(), 'ds-export-missing'))).toThrow(/pnpm ds:export/)
  })
})
