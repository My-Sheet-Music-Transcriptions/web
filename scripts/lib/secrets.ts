import { existsSync, readFileSync } from 'node:fs'

export type SecretsEnv = 'development' | 'production'

/**
 * Which encrypted env file a build's server reads its secrets from (src/server/env.server.ts): `.env.production` for a
 * Netlify production deploy, `.env.development` (Stripe's sandbox) for deploy previews, branch deploys, local builds
 * and `pnpm dev`. SECRETS_ENV overrides it (a staging site whose production deploys should stay on the sandbox).
 */
export function secretsEnv(env: Record<string, string | undefined> = process.env): SecretsEnv {
  const forced = env.SECRETS_ENV
  if (forced === 'development' || forced === 'production') return forced
  if (forced) throw new Error(`SECRETS_ENV must be development or production, not "${forced}"`)
  return env.CONTEXT === 'production' ? 'production' : 'development'
}

/** The encrypted file of that env as committed, or '' when there is none yet. */
export function secretsFile(name: SecretsEnv, root = process.cwd()): string {
  const path = `${root}/.env.${name}`
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}
