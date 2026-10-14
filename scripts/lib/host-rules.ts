import fs from 'node:fs'
import path from 'node:path'

/**
 * Netlify rules of a multi-domain build (`SITE_LOCALE=multi`, scripts/build-multi.ts): one Netlify site answers every
 * locale's domain, each locale's domain build sits in `dist/client/<locale>/`, and these host-matched rules send
 * each domain to its folder. The browser never sees the folder: rewrites (200) keep the URL, so the HTML is exactly
 * what that locale's own domain build serves.
 *
 * Per host, in the order Netlify matches them (first match wins):
 *   1. every alias host (apex or www twin) 301s to the primary host, path kept;
 *   2. the server function paths pass through to the function (a host's catch-all 404 would swallow them);
 *   3. the build folders themselves (`/en/...`) answer 404, so no page has a second URL;
 *   4. the locale's own redirects (legacy sitemaps, content redirects), host-prefixed;
 *   5. one forced rewrite per page (`/precios` -> `/es/precios/index.html`); Netlify ignores a trailing slash
 *      when matching, so `/precios/` takes the same rule;
 *   6. one forced rewrite per root file of the locale (robots.txt, sitemaps);
 *   7. the locale's 404 page for anything else, unforced so shared files (/assets, /og, /admin) are still served.
 */

/** Paths answered by the server function (the quote form's no-JS POST and TanStack server functions). */
const FUNCTION_PATHS = ['/api', '/_serverFn']
export interface HostSite {
  /** Folder under dist/client that holds this locale's build. */
  folder: string
  /** Origins answered by this locale, primary first ("https://www.mistranscripcionesmusicales.com"). */
  origins: readonly string[]
  /** Locale-free page paths ("/", "/precios"), from `pagesIn()`. */
  pages: readonly string[]
  /** Files at the root of the locale's build ("robots.txt", "sitemap.xml"), from `pagesIn()`. */
  files: readonly string[]
  /** Lines of the locale's own domain-mode `_redirects` ("/from  /to  301"). */
  redirects: readonly string[]
}

const trim = (origin: string) => origin.replace(/\/+$/, '')

export function hostRules(sites: readonly HostSite[]): string[] {
  const rules: string[] = []
  const folders = sites.map((s) => s.folder)
  for (const site of sites) {
    const [primary, ...aliases] = site.origins.map(trim)
    if (!primary) throw new Error(`[host-rules] ${site.folder}: no origin`)
    const dir = `/${site.folder}`
    rules.push(`# ${site.folder}: ${primary}`)
    for (const alias of aliases) rules.push(`${alias}/*  ${primary}/:splat  301!`)
    for (const fn of FUNCTION_PATHS) rules.push(`${primary}${fn}/*  ${fn}/:splat  200`)
    for (const other of folders) rules.push(`${primary}/${other}/*  ${dir}/404.html  404!`)
    for (const line of site.redirects) {
      const [from, ...rest] = line.trim().split(/\s+/)
      if (!from || from.startsWith('#')) continue
      rules.push(`${primary}${from}  ${rest.join('  ')}`)
    }
    for (const page of site.pages) {
      if (page === '/') {
        rules.push(`${primary}/  ${dir}/index.html  200!`)
        continue
      }
      rules.push(`${primary}${page}  ${dir}${page}/index.html  200!`)
    }
    for (const file of site.files) rules.push(`${primary}/${file}  ${dir}/${file}  200!`)
    rules.push(`${primary}/*  ${dir}/404.html  404`)
  }
  return rules
}

/**
 * Pages and root files of one locale's build folder: every `<path>/index.html` is a page (served at "/<path>"),
 * every other file at the folder's root but the 404 page and `_redirects` is a root file.
 */
export function pagesIn(dir: string): { pages: string[]; files: string[] } {
  const pages: string[] = []
  const files: string[] = []
  const walk = (rel: string) => {
    for (const entry of fs.readdirSync(path.join(dir, rel), { withFileTypes: true })) {
      const child = rel ? `${rel}/${entry.name}` : entry.name
      if (entry.isDirectory()) walk(child)
      else if (entry.name === 'index.html') pages.push(rel ? `/${rel}` : '/')
      else if (!rel && entry.name !== '404.html' && entry.name !== '_redirects') files.push(child)
    }
  }
  walk('')
  return { pages: pages.sort(), files: files.sort() }
}
