import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { set } from '@dotenvx/dotenvx'
import { describe, expect, it } from 'vitest'
import { secretsEnv, secretsFile } from '../../scripts/lib/secrets'
import { loadSecrets } from '../../src/server/env.server'

describe('secrets', () => {
  it('picks the production file only for production deploys', () => {
    expect(secretsEnv({ CONTEXT: 'production' })).toBe('production')
    expect(secretsEnv({ CONTEXT: 'deploy-preview' })).toBe('development')
    expect(secretsEnv({ CONTEXT: 'branch-deploy' })).toBe('development')
    expect(secretsEnv({})).toBe('development')
    expect(secretsEnv({ CONTEXT: 'production', SECRETS_ENV: 'development' })).toBe('development')
    expect(() => secretsEnv({ SECRETS_ENV: 'staging' })).toThrow(/SECRETS_ENV/)
  })

  it('decrypts the file with its private key, letting variables already set win', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'secrets-'))
    const file = path.join(dir, '.env.development')
    const keys = { path: file, envKeysFile: path.join(dir, '.env.keys') }
    await set('STRIPE_SECRET_KEY', 'sk_test_123', keys)
    await set('SHOP_FROM_EMAIL', 'shop@example.com', keys)
    const src = secretsFile('development', dir)
    expect(src).toMatch(/STRIPE_SECRET_KEY="?encrypted:/)
    expect(src).not.toContain('sk_test_123')
    const privateKey = /DOTENV_PRIVATE_KEY_DEVELOPMENT="?(\w+)/.exec(
      fs.readFileSync(path.join(dir, '.env.keys'), 'utf8'),
    )?.[1]

    const env: Record<string, string | undefined> = {
      DOTENV_PRIVATE_KEY_DEVELOPMENT: privateKey,
      SHOP_FROM_EMAIL: 'netlify@example.com',
      RESEND_API_KEY: 'encrypted:undecryptable',
    }
    loadSecrets('development', src, env)
    expect(env.STRIPE_SECRET_KEY).toBe('sk_test_123')
    expect(env.SHOP_FROM_EMAIL).toBe('netlify@example.com')
    expect(env.RESEND_API_KEY).toBeUndefined()
    expect(Object.keys(env).some((k) => k.startsWith('DOTENV_PUBLIC_KEY'))).toBe(false)

    const keyless: Record<string, string | undefined> = {}
    loadSecrets('development', src, keyless)
    expect(keyless).toEqual({})
    const wrong: Record<string, string | undefined> = {
      DOTENV_PRIVATE_KEY_DEVELOPMENT: 'a'.repeat(64),
    }
    loadSecrets('development', src, wrong)
    expect(wrong.STRIPE_SECRET_KEY).toBeUndefined()
  })

  it('commits only encrypted values', () => {
    for (const name of ['development', 'production'] as const) {
      const lines = secretsFile(name)
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('#'))
      for (const line of lines)
        expect(line, `.env.${name}`).toMatch(/^(DOTENV_PUBLIC_KEY\w*=|\w+="?encrypted:)/)
    }
  })
})
