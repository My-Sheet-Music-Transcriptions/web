import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'

/** Minimal static server for the prerendered output (used by Playwright, Lighthouse CI, SEO tests). */
const args = process.argv.slice(2)
const port = Number(args[args.indexOf('--port') + 1] || process.env.PORT || 4173)
const dir = path.resolve(
  args.includes('--dir')
    ? (args[args.indexOf('--dir') + 1] as string)
    : process.env.DIST_DIR || 'dist/client',
)

const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
}

// Exact-path rules of a Netlify _redirects file (path-mode previews write "/  /en  302").
const redirects = new Map<string, { to: string; status: number }>()
const redirectsFile = path.join(dir, '_redirects')
if (fs.existsSync(redirectsFile))
  for (const line of fs.readFileSync(redirectsFile, 'utf8').split('\n')) {
    const [from, to, status] = line.trim().split(/\s+/)
    if (from && to && !line.trim().startsWith('#'))
      redirects.set(from, { to, status: Number(status) || 301 })
  }

function resolveFile(urlPath: string): { file: string; status: number } {
  const clean = decodeURIComponent(urlPath.split('?')[0] ?? '/').replace(/\/+$/, '') || '/'
  const candidates =
    clean === '/' ? ['index.html'] : [clean, `${clean}.html`, path.join(clean, 'index.html')]
  for (const c of candidates) {
    const f = path.join(dir, c)
    if (f.startsWith(dir) && fs.existsSync(f) && fs.statSync(f).isFile())
      return { file: f, status: 200 }
  }
  // Path-mode previews have one 404 page per locale: /<locale>/404.html.
  const localeNf = path.join(dir, clean.split('/')[1] ?? '', '404.html')
  if (clean !== '/' && fs.existsSync(localeNf)) return { file: localeNf, status: 404 }
  const nf = path.join(dir, '404', 'index.html')
  return { file: fs.existsSync(nf) ? nf : path.join(dir, '404.html'), status: 404 }
}

http
  .createServer((req, res) => {
    const redirect = redirects.get((req.url ?? '/').split('?')[0] ?? '/')
    if (redirect) {
      res.writeHead(redirect.status, { location: redirect.to })
      res.end()
      return
    }
    const { file, status } = resolveFile(req.url ?? '/')
    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      res.end('Not found')
      return
    }
    const ext = path.extname(file)
    res.writeHead(status, {
      'content-type': types[ext] ?? 'application/octet-stream',
      'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    fs.createReadStream(file).pipe(res)
  })
  .listen(port, () => console.log(`serving ${dir} at http://localhost:${port}`))
