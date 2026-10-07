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
import { resolveSiteLocale } from './scripts/lib/site-locale'
import { getSiteConfig } from './src/i18n/sites'

const locale = resolveSiteLocale(process.env.SITE_LOCALE)
const site = getSiteConfig(locale)
const pages = listPrerenderPages(locale)

export default defineConfig({
  define: {
    'import.meta.env.SITE_LOCALE': JSON.stringify(locale),
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
      sitemap: { enabled: true, host: site.domain, outputPath: 'sitemap.xml' },
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
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
