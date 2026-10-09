import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { ARTIFACT_FILE } from './lib'

/**
 * Puts a publish record (src/design-system/artifact.json, written by `pnpm ds:index --published`) on main
 * with a direct push, no pull request. Two publishes can race (the routine runs once per merge, and merges
 * land seconds apart): the last push wins. A push that main refuses because it moved is retried on top of
 * the new main, with this record replacing whatever record main has. When main also moved by more than a
 * record, `check` decides first whether this publish still matches the new main.
 */

export interface PushOptions {
  /** Repository to work in (default: the current directory). */
  cwd?: string
  remote?: string
  branch?: string
  message: string
  /** `Key: value` lines for `git commit --trailer`. */
  trailers?: string[]
  attempts?: number
  /**
   * Called with the working tree on the new main plus this record, when main moved by files other than
   * the record (`changed`): true when this publish still matches (`pnpm ds:index --check`).
   */
  check: (changed: string[]) => boolean | Promise<boolean>
  wait?: (ms: number) => Promise<void>
  log?: (line: string) => void
}

export type PushResult =
  /** The record is on main as `commit`, on top of `onto`. */
  | { status: 'pushed'; commit: string; onto: string; attempts: number }
  /** Main already holds this exact record. */
  | { status: 'unchanged'; tip: string }
  /** Main moved past the publish: `changed` (between `base` and `tip`) changes the export. Publish again. */
  | { status: 'stale'; base: string; tip: string; changed: string[] }

export type PushFailure = 'behind' | 'protected' | 'network' | 'other'

/** What a failed `git push` says, from its stderr. */
export function classifyPushFailure(stderr: string): PushFailure {
  if (/GH006|GH013|protected branch|repository rule|push declined/i.test(stderr)) return 'protected'
  if (/\[rejected\]|fetch first|non-fast-forward|updates were rejected/i.test(stderr))
    return 'behind'
  if (
    /could not resolve host|connection (reset|refused|timed out)|timed out|rpc failed|unexpected disconnect|early eof|returned error: 5\d\d|HTTP 5\d\d/i.test(
      stderr,
    )
  )
    return 'network'
  return 'other'
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function pushRecord(opts: PushOptions): Promise<PushResult> {
  const cwd = opts.cwd ?? process.cwd()
  const remote = opts.remote ?? 'origin'
  const branch = opts.branch ?? 'main'
  const attempts = opts.attempts ?? 6
  const wait = opts.wait ?? sleep
  const log = opts.log ?? (() => {})
  const backoff = (attempt: number) => 2000 * 2 ** Math.min(attempt - 1, 3)

  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  const tryGit = (...args: string[]) => {
    try {
      return { ok: true as const, out: git(...args) }
    } catch (e) {
      const err = e as { stderr?: string; message: string }
      return { ok: false as const, err: String(err.stderr || err.message) }
    }
  }

  const modified = git('diff', '--name-only', 'HEAD').split('\n').filter(Boolean)
  const others = modified.filter((file) => file !== ARTIFACT_FILE)
  if (others.length)
    throw new Error(
      `only ${ARTIFACT_FILE} goes to ${branch}, but the working tree also changes: ${others.join(', ')}`,
    )
  if (!modified.includes(ARTIFACT_FILE))
    throw new Error(
      `nothing to record: ${ARTIFACT_FILE} is unchanged (run pnpm ds:index --published --version <id> first)`,
    )
  const record = fs.readFileSync(path.join(cwd, ARTIFACT_FILE), 'utf8')

  const fetchTip = async () => {
    for (let attempt = 1; ; attempt++) {
      const r = tryGit('fetch', '--quiet', remote, branch)
      if (r.ok) return git('rev-parse', 'FETCH_HEAD')
      if (attempt >= 4 || classifyPushFailure(r.err) !== 'network')
        throw new Error(`git fetch ${remote} ${branch} failed: ${r.err}`)
      await wait(backoff(attempt))
    }
  }

  // The commit the export (and so the publish) was made from: what `check` has vouched for so far. Only
  // the record is ever pushed: when HEAD is not main's tip (main moved, or HEAD is a PR head or a branch),
  // the record goes on top of the tip instead, so no other commit of this checkout reaches main.
  let base = git('rev-parse', 'HEAD')
  let committed = false
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const tip = await fetchTip()
    const there = tryGit('show', `${tip}:${ARTIFACT_FILE}`)
    if (there.ok && there.out === record.trim()) return { status: 'unchanged', tip }
    if (tip !== base) {
      const changed = git('diff', '--name-only', base, tip)
        .split('\n')
        .filter((file) => file && file !== ARTIFACT_FILE)
      git('checkout', '--quiet', '--force', '--detach', tip)
      fs.writeFileSync(path.join(cwd, ARTIFACT_FILE), record)
      committed = false
      log(
        `${branch} is at ${tip.slice(0, 7)}${changed.length ? `, ${changed.length} files besides the record differ from the export's commit` : ', only records differ'}: putting this record on top`,
      )
      if (changed.length && !(await opts.check(changed)))
        return { status: 'stale', base, tip, changed }
      base = tip
    }
    if (!committed) {
      git('add', '--', ARTIFACT_FILE)
      git(
        'commit',
        '--quiet',
        '-m',
        opts.message,
        ...(opts.trailers ?? []).flatMap((t) => ['--trailer', t]),
      )
      committed = true
    }

    const pushed = tryGit('push', '--quiet', remote, `HEAD:refs/heads/${branch}`)
    if (pushed.ok)
      return {
        status: 'pushed',
        commit: git('rev-parse', '--short', 'HEAD'),
        onto: base,
        attempts: attempt,
      }
    const failure = classifyPushFailure(pushed.err)
    if (failure === 'protected')
      throw new Error(
        `${remote} refused the push to ${branch} (branch rule): the identity this session pushes as must be allowed to bypass the rule on ${branch}. ${pushed.err}`,
      )
    if (failure === 'other') throw new Error(`git push failed: ${pushed.err}`)
    log(
      failure === 'behind'
        ? `${branch} moved while pushing, trying again on top of it (${attempt}/${attempts})`
        : `push failed (network), retrying (${attempt}/${attempts})`,
    )
    if (attempt < attempts) await wait(backoff(attempt))
  }
  throw new Error(`gave up after ${attempts} pushes: ${branch} kept moving`)
}
