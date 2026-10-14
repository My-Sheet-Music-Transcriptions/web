import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { sites } from '../src/i18n/sites/index.ts'
import { LOCALES, type Locale } from '../src/i18n/types.ts'
import { entriesFor } from './lib/content-fs.ts'
import { type HostSite, hostRules, pagesIn, parseHosts } from './lib/host-rules.ts'

/**
 * Multi-domain build (`SITE_LOCALE=multi`): one Netlify site serves every locale's domain. Each locale with pages is
 * built exactly as its own domain build (`SITE_LOCALE=<locale> pnpm build`), its pages, robots.txt and sitemaps
 * are moved under `dist/client/<locale>/`, and the files every build shares (hashed `/assets`, `/og/<locale>`, the
 * CMS at `/admin`, favicons) are merged at the root. `_redirects` then maps each domain to its folder
 * (scripts/lib/host-rules.ts). The server bundle (quote form, server functions) is the last build's; English is
 * built last so a request that reaches it renders English.
 *
 * `SITE_HOSTS_<LOCALE>` (Netlify environment variables, e.g. `SITE_HOSTS_ES="staging.example.es, example.es"`,
 * primary first) replaces that locale's domains from the site config (`domain` + `aliases`), so the site can be
 * tried on any host before a real domain moves.
 */
const DIST = 'dist/client'
const STAGE = '.cache/multi'
/** Files of every build that stay at the root, shared by all domains. */
const SHARED = new Set([
  'assets',
  'og',
  'admin',
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
])

const origins = (locale: Locale): string[] =>
  parseHosts(process.env[`SITE_HOSTS_${locale.toUpperCase()}`]) ?? [
    sites[locale].domain,
    ...sites[locale].aliases,
  ]

const locales = LOCALES.filter((l) => entriesFor(l).length && origins(l).length).sort(
  (a, b) => Number(a === 'en') - Number(b === 'en'),
)
if (!locales.length) throw new Error('[build-multi] no locale has pages and origins')

fs.rmSync(STAGE, { recursive: true, force: true })
fs.mkdirSync(STAGE, { recursive: true })
for (const locale of locales) {
  console.log(`[build-multi] building ${locale}`)
  execSync('pnpm build', { stdio: 'inherit', env: { ...process.env, SITE_LOCALE: locale } })
  fs.renameSync(DIST, path.join(STAGE, locale))
}

fs.mkdirSync(DIST, { recursive: true })
const hostSites: HostSite[] = []
for (const locale of locales) {
  const from = path.join(STAGE, locale)
  const into = path.join(DIST, locale)
  fs.mkdirSync(into)
  for (const name of fs.readdirSync(from)) {
    if (SHARED.has(name))
      fs.cpSync(path.join(from, name), path.join(DIST, name), { recursive: true })
    else fs.renameSync(path.join(from, name), path.join(into, name))
  }
  const redirects = path.join(into, '_redirects')
  const lines = fs.existsSync(redirects) ? fs.readFileSync(redirects, 'utf8').split('\n') : []
  fs.rmSync(redirects, { force: true })
  hostSites.push({ folder: locale, origins: origins(locale), ...pagesIn(into), redirects: lines })
}
fs.rmSync(STAGE, { recursive: true, force: true })

const rules = hostRules(hostSites)
fs.writeFileSync(path.join(DIST, '_redirects'), `${rules.join('\n')}\n`)
for (const s of hostSites)
  console.log(`[build-multi] ${s.folder}: ${s.pages.length} pages on ${s.origins.join(', ')}`)
console.log(`[build-multi] ${DIST}/_redirects: ${rules.length} rules`)
