import mdx from '@mdx-js/rollup'
import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import { listPrerenderPages } from './scripts/lib/content-fs'
import { resolveLocaleRouting } from './scripts/lib/site-locale'
import { getSiteConfig } from './src/i18n/sites'

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
  plugins: [
    // MDX must run before React so JSX in .mdx is compiled by the MDX compiler.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        providerImportSource: '@mdx-js/react',
      }),
    },
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
      // Path-mode previews are not indexed: no sitemap.
      sitemap: { enabled: mode === 'domain', host: site.domain, outputPath: 'sitemap.xml' },
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
    netlify(),
  ],
})
