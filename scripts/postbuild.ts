import fs from 'node:fs'
import { DEFAULT_LOCALE } from '../src/i18n/routing'
import { entriesFor } from './lib/content-fs'
import { resolveLocaleRouting } from './lib/site-locale'

/**
 * Runs after `vite build`. Path mode (previews): a Netlify _redirects file in dist/client so "/" goes to the
 * default locale and unknown paths under a locale get that locale's 404 page. Written here, not in public/,
 * so `pnpm dev` (which emulates Netlify redirects) never serves a stale one.
 */
const { mode, locales } = resolveLocaleRouting(process.env.SITE_LOCALE)
const out = 'dist/client/_redirects'

if (mode === 'path') {
  const served = locales.filter((l) => entriesFor(l).length)
  const rules = [`/  /${DEFAULT_LOCALE}  302`, ...served.map((l) => `/${l}/*  /${l}/404.html  404`)]
  fs.writeFileSync(out, `${rules.join('\n')}\n`)
  console.log(`[postbuild] ${out}: ${rules.length} rules`)
} else fs.rmSync(out, { force: true })
