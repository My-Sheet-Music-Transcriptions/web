import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { ARTIFACT_FILE } from '../../scripts/design-system/lib'
import { classifyPushFailure, pushRecord } from '../../scripts/design-system/push-lib'

/**
 * `pnpm ds:push` puts a publish record on main with a direct push. These run it against a local bare
 * repository standing in for GitHub: the race between two publishes (the last push wins), main moving by
 * code meanwhile (the export is checked again) and a branch rule refusing the push.
 */
const git = (cwd: string, ...args: string[]) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

const write = (dir: string, file: string, text: string) => {
  fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
  fs.writeFileSync(path.join(dir, file), text)
}
const recordOf = (version: string) =>
  `${JSON.stringify({ publishedVersion: version, exportHash: version.padEnd(16, '0') }, null, 2)}\n`

function setup() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ds-push-'))
  const remote = path.join(root, 'remote.git')
  git(root, 'init', '--quiet', '--bare', '--initial-branch=main', remote)
  const clone = (name: string) => {
    const dir = path.join(root, name)
    git(root, 'clone', '--quiet', remote, dir)
    git(dir, 'config', 'user.name', 'Test')
    git(dir, 'config', 'user.email', 'test@example.com')
    git(dir, 'config', 'commit.gpgsign', 'false')
    return dir
  }
  const seed = clone('seed')
  write(seed, ARTIFACT_FILE, recordOf('v0'))
  write(seed, 'src/block.tsx', 'export {}\n')
  git(seed, 'add', '.')
  git(seed, 'commit', '--quiet', '-m', 'seed')
  git(seed, 'push', '--quiet', 'origin', 'HEAD:main')
  /** Another clone pushes a commit to main (a merge, or another run's record). */
  const land = (files: Record<string, string>) => {
    git(seed, 'pull', '--quiet', 'origin', 'main')
    for (const [f, text] of Object.entries(files)) write(seed, f, text)
    git(seed, 'add', '.')
    git(seed, 'commit', '--quiet', '-m', 'landed')
    git(seed, 'push', '--quiet', 'origin', 'HEAD:main')
  }
  const onMain = (file: string) => git(remote, 'show', `main:${file}`)
  return { root, remote, clone, land, onMain }
}

const quiet = { wait: async () => {}, message: 'Record Design System publish from main' }
const noCheck = () => {
  throw new Error('check must not run when only records changed')
}

describe('pnpm ds:push', () => {
  it('pushes the record alone onto main', async () => {
    const { clone, onMain, remote } = setup()
    const run = clone('run')
    write(run, ARTIFACT_FILE, recordOf('v1'))
    const result = await pushRecord({ ...quiet, cwd: run, check: noCheck })
    expect(result).toMatchObject({ status: 'pushed', attempts: 1 })
    expect(onMain(ARTIFACT_FILE)).toBe(recordOf('v1').trim())
    expect(git(remote, 'log', '-1', '--format=%s', 'main')).toBe(quiet.message)
  })

  it('lets the last of two racing publishes win', async () => {
    const { clone, onMain } = setup()
    const first = clone('first')
    const second = clone('second')
    write(first, ARTIFACT_FILE, recordOf('v1'))
    write(second, ARTIFACT_FILE, recordOf('v2'))
    await pushRecord({ ...quiet, cwd: first, check: noCheck })
    const result = await pushRecord({ ...quiet, cwd: second, check: noCheck })
    expect(result).toMatchObject({ status: 'pushed' })
    expect(onMain(ARTIFACT_FILE)).toBe(recordOf('v2').trim())
  })

  it('tries again on top of main when main moves during the push', async () => {
    const { clone, land, onMain } = setup()
    const run = clone('run')
    write(run, ARTIFACT_FILE, recordOf('v2'))
    land({ 'content/page.tsx': 'page\n' })
    const seen: string[][] = []
    const result = await pushRecord({
      ...quiet,
      cwd: run,
      check: (changed) => {
        seen.push(changed)
        // the re-check sees the new main with this record on top
        expect(fs.readFileSync(path.join(run, 'content/page.tsx'), 'utf8')).toBe('page\n')
        expect(fs.readFileSync(path.join(run, ARTIFACT_FILE), 'utf8')).toBe(recordOf('v2'))
        // ...and another run's record lands while it runs, so the next push is refused
        land({ [ARTIFACT_FILE]: recordOf('v1') })
        return true
      },
    })
    expect(seen).toEqual([['content/page.tsx']])
    expect(result).toMatchObject({ status: 'pushed', attempts: 2 })
    expect(onMain(ARTIFACT_FILE)).toBe(recordOf('v2').trim())
    expect(onMain('content/page.tsx')).toBe('page')
  })

  it('pushes nothing when main moved past the publish', async () => {
    const { clone, land, onMain, remote } = setup()
    const run = clone('run')
    write(run, ARTIFACT_FILE, recordOf('v1'))
    land({ 'src/block.tsx': 'export const changed = true\n' })
    const before = git(remote, 'rev-parse', 'main')
    const result = await pushRecord({ ...quiet, cwd: run, check: () => false })
    expect(result).toMatchObject({ status: 'stale', changed: ['src/block.tsx'] })
    expect(git(remote, 'rev-parse', 'main')).toBe(before)
    expect(onMain(ARTIFACT_FILE)).toBe(recordOf('v0').trim())
  })

  it('never pushes the checkout’s other commits', async () => {
    const { clone, onMain } = setup()
    const run = clone('run')
    write(run, 'src/unmerged.tsx', 'export {}\n')
    git(run, 'add', '.')
    git(run, 'commit', '--quiet', '-m', 'unmerged work')
    write(run, ARTIFACT_FILE, recordOf('v1'))
    const result = await pushRecord({ ...quiet, cwd: run, check: () => true })
    expect(result).toMatchObject({ status: 'pushed' })
    expect(onMain(ARTIFACT_FILE)).toBe(recordOf('v1').trim())
    expect(() => onMain('src/unmerged.tsx')).toThrow()
  })

  it('stops when main already holds the same record', async () => {
    const { clone, land } = setup()
    const run = clone('run')
    write(run, ARTIFACT_FILE, recordOf('v1'))
    land({ [ARTIFACT_FILE]: recordOf('v1') })
    const result = await pushRecord({ ...quiet, cwd: run, check: noCheck })
    expect(result).toMatchObject({ status: 'unchanged' })
  })

  it('refuses a working tree with other changes, or without a new record', async () => {
    const { clone } = setup()
    const run = clone('run')
    await expect(pushRecord({ ...quiet, cwd: run, check: noCheck })).rejects.toThrow(
      /nothing to record/,
    )
    write(run, ARTIFACT_FILE, recordOf('v1'))
    write(run, 'src/block.tsx', 'export const x = 1\n')
    await expect(pushRecord({ ...quiet, cwd: run, check: noCheck })).rejects.toThrow(
      /src\/block\.tsx/,
    )
  })

  it('says so when a branch rule refuses the push', async () => {
    const { clone, remote } = setup()
    const hook = path.join(remote, 'hooks', 'pre-receive')
    fs.writeFileSync(
      hook,
      '#!/bin/sh\necho "error: GH006: Protected branch update failed" >&2\nexit 1\n',
    )
    fs.chmodSync(hook, 0o755)
    const run = clone('run')
    write(run, ARTIFACT_FILE, recordOf('v1'))
    await expect(pushRecord({ ...quiet, cwd: run, check: noCheck })).rejects.toThrow(/bypass/)
  })
})

describe('classifyPushFailure', () => {
  it('tells a moved main from a branch rule and a network error', () => {
    expect(
      classifyPushFailure(
        ' ! [rejected]        HEAD -> main (fetch first)\nerror: failed to push some refs',
      ),
    ).toBe('behind')
    expect(
      classifyPushFailure(
        'remote: error: GH006: Protected branch update failed for refs/heads/main.\n ! [remote rejected] HEAD -> main (protected branch hook declined)',
      ),
    ).toBe('protected')
    expect(
      classifyPushFailure(
        'remote: error: GH013: Repository rule violations found for refs/heads/main.',
      ),
    ).toBe('protected')
    expect(
      classifyPushFailure('error: RPC failed; curl 56 Recv failure: Connection reset by peer'),
    ).toBe('network')
    expect(classifyPushFailure('fatal: Authentication failed')).toBe('other')
  })
})
