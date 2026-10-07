import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mdx from '@mdx-js/rollup'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { mergeConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: { viteConfigPath: '.storybook/vite.config.ts' },
    },
  },
  // Scoped so addon-docs never treats content MDX (src/content) as documentation entries.
  stories: ['../src/design-system/**/*.mdx', '../src/components/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  staticDirs: ['../public'],
  viteFinal: (cfg) =>
    mergeConfig(cfg, {
      define: { 'import.meta.env.SITE_LOCALE': JSON.stringify(process.env.SITE_LOCALE ?? 'en') },
      resolve: {
        tsconfigPaths: true,
        // Server functions need the Start compiler; stories use a local stand-in instead.
        alias: [
          {
            find: /^~\/server\/contact\.functions$/,
            replacement: path.resolve(__dirname, 'mocks/contact.functions.ts'),
          },
        ],
      },
      plugins: [
        // Content MDX (frontmatter + blocks) is compiled by the site's MDX pipeline, not by addon-docs,
        // whose compiler rejects the frontmatter export when it meets these files.
        {
          enforce: 'pre',
          ...mdx({
            include: /[\\/]src[\\/]content[\\/].*\.mdx$/,
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
      ],
    }),
}
export default config
