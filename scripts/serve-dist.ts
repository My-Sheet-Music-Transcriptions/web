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

function resolveFile(urlPath: string): { file: string; status: number } {
  const clean = decodeURIComponent(urlPath.split('?')[0] ?? '/').replace(/\/+$/, '') || '/'
  const candidates =
    clean === '/' ? ['index.html'] : [clean, `${clean}.html`, path.join(clean, 'index.html')]
  for (const c of candidates) {
    const f = path.join(dir, c)
    if (f.startsWith(dir) && fs.existsSync(f) && fs.statSync(f).isFile())
      return { file: f, status: 200 }
  }
  const nf = path.join(dir, '404', 'index.html')
  return { file: fs.existsSync(nf) ? nf : path.join(dir, '404.html'), status: 404 }
}

http
  .createServer((req, res) => {
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
