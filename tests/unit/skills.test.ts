import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * The skills, the slash commands and the content-manager guides must agree: every command skill is documented
 * in README and in each guide, every reference file the page skill names exists, and frontmatter is sound
 * (a skill's `name` is its folder; the listing truncates descriptions at 1536 characters).
 */
const root = '.claude/skills'
const skills = fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'SKILL.md')))

function frontmatter(dir: string): Record<string, string> {
  const text = fs.readFileSync(path.join(root, dir, 'SKILL.md'), 'utf8')
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text)
  if (!m) throw new Error(`${dir}/SKILL.md has no frontmatter`)
  const out: Record<string, string> = {}
  for (const line of (m[1] ?? '').split('\n')) {
    const kv = /^([\w-]+):\s*(.*)$/.exec(line)
    if (kv) out[kv[1] as string] = (kv[2] ?? '').replace(/^"(.*)"$/, '$1')
  }
  return out
}

const commands = skills.filter((d) => {
  const fm = frontmatter(d)
  return (
    fm['user-invocable'] !== 'false' &&
    !['page', 'component', 'publish-design-system', 'release-check'].includes(d)
  )
})
const guides = [
  'docs/content-managers.md',
  'docs/content-managers.es.md',
  'docs/content-managers.ca.md',
]

describe('skills', () => {
  it.each(skills)('%s has sound frontmatter', (dir) => {
    const fm = frontmatter(dir)
    expect(fm.name).toBe(dir)
    expect(fm.description?.length ?? 0).toBeGreaterThan(40)
    expect(fm.description?.length ?? 0).toBeLessThanOrEqual(1536)
  })

  it('the content-manager commands are the documented ones', () => {
    expect(commands.sort()).toEqual(
      ['design', 'edit-page', 'new-page', 'publish', 'site-help', 'status', 'translate'].sort(),
    )
  })

  it.each(commands)('/%s hands over to the page skill or the guides', (dir) => {
    const body = fs.readFileSync(path.join(root, dir, 'SKILL.md'), 'utf8')
    expect(body).toMatch(dir === 'site-help' ? /docs\/content-managers/ : /`page` skill/)
    if (dir !== 'site-help' && dir !== 'status')
      expect(frontmatter(dir)['disable-model-invocation']).toBe('true')
  })

  it('the page skill names only reference files that exist, and all of them', () => {
    const skill = fs.readFileSync(path.join(root, 'page/SKILL.md'), 'utf8')
    const refDir = path.join(root, 'page/reference')
    const named = new Set([...skill.matchAll(/reference\/([\w-]+\.md)/g)].map((m) => m[1]))
    const present = fs.readdirSync(refDir).sort()
    for (const f of named) expect(present, `${f} is named in SKILL.md`).toContain(f)
    for (const f of present) expect([...named], `${f} is never named in SKILL.md`).toContain(f)
    expect(skill.split('\n').length).toBeLessThan(200)
  })

  it('the page skill lists every command in its description', () => {
    const desc = frontmatter('page').description ?? ''
    for (const c of commands) expect(desc).toContain(`/${c}`)
  })

  it.each([...guides, 'README.md'])('%s documents every command', (file) => {
    const text = fs.readFileSync(file, 'utf8')
    for (const c of commands) expect(text, `/${c} in ${file}`).toContain(`\`/${c}`)
  })

  it('the guides link each other and the site-help skill names them', () => {
    for (const g of guides) {
      const text = fs.readFileSync(g, 'utf8')
      for (const other of guides.filter((x) => x !== g))
        expect(text).toContain(path.basename(other))
    }
    const help = fs.readFileSync(path.join(root, 'site-help/SKILL.md'), 'utf8')
    for (const g of guides) expect(help).toContain(g)
  })
})
