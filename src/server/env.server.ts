import { parse } from '@dotenvx/dotenvx'

/**
 * The server's secrets (Stripe, Resend, the shop's addresses) are kept in the repo encrypted with dotenvx:
 * `.env.development` (Stripe's sandbox: `pnpm dev`, deploy previews, branch deploys) and `.env.production`
 * (production deploys). The build inlines the file of its deploy (scripts/lib/secrets.ts), and here, the first time a
 * server module needs a secret, it is decrypted with that file's private key, DOTENV_PRIVATE_KEY_DEVELOPMENT or
 * DOTENV_PRIVATE_KEY_PRODUCTION, set in Netlify's environment variables (locally `pnpm dev` decrypts the file itself
 * with .env.keys). A variable Netlify already sets wins; one that cannot be decrypted stays unset, so the shop falls
 * back to demo mode and emails are logged.
 */
export function loadSecrets(
  name: string = import.meta.env.SECRETS_ENV ?? 'development',
  src: string = import.meta.env.SECRETS ?? '',
  env: Record<string, string | undefined> = process.env,
): void {
  // values `dotenvx run` could not decrypt (no .env.keys) are not secrets: drop them
  for (const [key, value] of Object.entries(env))
    if (value?.startsWith('encrypted:')) delete env[key]
  if (!src) return
  const privateKey = env[`DOTENV_PRIVATE_KEY_${name.toUpperCase()}`]
  if (!privateKey) return
  let values: Record<string, string>
  try {
    values = parse(src, { privateKey, processEnv: {} })
  } catch (err) {
    console.error(
      `[env] .env.${name} could not be decrypted:`,
      err instanceof Error ? err.message : err,
    )
    return
  }
  for (const [key, value] of Object.entries(values))
    if (!key.startsWith('DOTENV_PUBLIC_KEY') && !value.startsWith('encrypted:') && !env[key])
      env[key] = value
}

loadSecrets()
