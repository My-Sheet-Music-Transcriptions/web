import { execSync } from 'node:child_process'
import fs from 'node:fs'

/**
 * One build command for every Netlify site made from this repo. The site's environment decides what
 * is published to dist/client:
 *   NETLIFY_TARGET=site      (default) the locale site selected by SITE_LOCALE
 *   NETLIFY_TARGET=storybook the static design system (Storybook), with robots disallowed
 */
const target = process.env.NETLIFY_TARGET ?? 'site'
const run = (cmd: string) => execSync(cmd, { stdio: 'inherit', env: process.env })

if (target === 'storybook') {
  run('pnpm build:hreflang')
  run('pnpm exec storybook build --quiet -o dist/client')
  fs.writeFileSync('dist/client/robots.txt', 'User-agent: *\nDisallow: /\n')
  fs.writeFileSync('dist/client/_headers', '/*\n  X-Robots-Tag: noindex\n')
  console.log('[netlify-build] storybook -> dist/client')
} else if (target === 'site') {
  run('pnpm build')
  console.log(`[netlify-build] site (${process.env.SITE_LOCALE ?? 'en'}) -> dist/client`)
} else {
  console.error(
    `[netlify-build] unknown NETLIFY_TARGET "${target}" (expected "site" or "storybook")`,
  )
  process.exit(1)
}
