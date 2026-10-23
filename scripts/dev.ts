import { type ChildProcess, execFileSync, spawn } from 'node:child_process'

/**
 * `pnpm dev`, after `dotenvx run` has decrypted .env.development: Vite's dev server, and with the Stripe CLI
 * installed and a sandbox key, `stripe listen` forwarding the sandbox's checkout webhooks to the local server, signed
 * with the CLI's own secret (passed to Vite as STRIPE_WEBHOOK_SECRET, replacing the sandbox endpoint's, which is never
 * needed locally). Without the CLI or a key, Vite alone; checkout then runs in demo mode or never records a payment.
 */
const PORT = 3000
const key = process.env.STRIPE_SECRET_KEY
const env = { ...process.env }
const children: ChildProcess[] = []

function stripeSecret(apiKey: string): string | null {
  try {
    return execFileSync('stripe', ['listen', '--api-key', apiKey, '--print-secret'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

if (key?.startsWith('sk_test_')) {
  const secret = stripeSecret(key)
  if (secret) {
    env.STRIPE_WEBHOOK_SECRET = secret
    children.push(
      spawn(
        'stripe',
        [
          'listen',
          '--api-key',
          key,
          '--events',
          'checkout.session.completed,checkout.session.async_payment_succeeded',
          '--forward-to',
          `localhost:${PORT}/api/shop/stripe-webhook`,
        ],
        { stdio: 'inherit' },
      ),
    )
  } else
    console.warn(
      '[dev] Stripe CLI not found: paid sandbox orders will not reach this server (https://docs.stripe.com/stripe-cli)',
    )
}

children.push(spawn('vite', ['dev', '--port', String(PORT)], { stdio: 'inherit', env }))

const stop = (code: number) => {
  for (const child of children) child.kill()
  process.exit(code)
}
for (const child of children) child.on('exit', (code) => stop(code ?? 0))
process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))
