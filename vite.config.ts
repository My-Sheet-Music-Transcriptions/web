import path from 'node:path'
import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import { listPrerenderPages } from './scripts/lib/content-fs.ts'
import { resolveLocaleRouting } from './scripts/lib/site-locale.ts'
import { getSiteConfig } from './src/i18n/sites/index.ts'

// SITE_LOCALE=<locale>: production build of one locale for its TLD. Unset or "all": every locale under
// /<locale> (deploy previews, `pnpm dev`). See src/i18n/routing.ts.
const { mode, locale, locales } = resolveLocaleRouting(process.env.SITE_LOCALE)
const site = getSiteConfig(locale)
const pages = listPrerenderPages(locales, mode)

export default defineConfig({
  define: {
    'import.meta.env.SITE_LOCALE': JSON.stringify(locale),
    'import.meta.env.LOCALE_ROUTING': JSON.stringify(mode),
    'import.meta.env.PREVIEW_ORIGIN': JSON.stringify(
      mode === 'path' ? (process.env.DEPLOY_PRIME_URL ?? '') : '',
    ),
  },
  resolve: { tsconfigPaths: true },
  server: { port: 3000 },
  // Prerendering fetches every page from Vite's preview server at its resolved URL. With the default host
  // that URL is http://localhost:<port>, which Netlify's build image resolves to ::1 first, where the
  // connection hangs (ETIMEDOUT) while the server listens on IPv4 only. Pin both ends to IPv4 loopback.
  preview: { host: '127.0.0.1' },
  build: {
    rolldownOptions: {
      output: {
        // Byte-identical images (the rhythm-charts and transposing icons) become one asset with several names,
        // and each build keeps whichever name it emitted first, which varies from run to run: the prerendered
        // HTML (server build) could point at a file the client build wrote under the other name. Both builds
        // pick the alphabetically first name instead.
        assetFileNames: ({ names }) => {
          if (names.length < 2) return 'assets/[name]-[hash][extname]'
          const { dir, name, ext } = path.posix.parse(names.reduce((a, b) => (a < b ? a : b)))
          return path.posix.join('assets', dir, `${name}-[hash]${ext}`)
        },
      },
    },
  },
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        // Every image ships as AVIF/WebP (+ original format) in a <picture>, unless the import says otherwise.
        const d = new URLSearchParams()
        if (!url.searchParams.has('format'))
          d.set('format', `avif;webp;${url.pathname.endsWith('.png') ? 'png' : 'jpg'}`)
        if (!url.searchParams.has('as')) d.set('as', 'picture')
        return d
      },
    }),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'src',
      // The sitemaps are written by scripts/postbuild.ts from content/ (scripts/lib/sitemap.ts), not from the
      // prerender's crawl. Off explicitly: left out, this option defaults to on.
      sitemap: { enabled: false },
      prerender: {
        enabled: true,
        crawlLinks: true,
        // In path mode the bare static routes ("/", "/404") only redirect to /en; the pages list has them.
        autoStaticPathsDiscovery: mode === 'domain',
        autoSubfolderIndex: true,
        concurrency: 8,
        failOnError: true,
        // Routes that must stay dynamic (SSR on a function) are excluded here.
        filter: ({ path }) => !path.startsWith('/api/') && !site.ssrOnlyPaths.includes(path),
      },
      pages,
    }),
    viteReact(),
    // The site has no edge functions; Netlify's dev emulation of them would start a Deno it downloads on first
    // use, which slows `pnpm dev` and breaks it when that Deno is newer than the plugin expects.
    netlify({ dev: { edgeFunctions: { enabled: false } } }),
  ],
})
