import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
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
  // Docs MDX lives in src/design-system only (compiled by addon-docs); stories sit beside their components.
  stories: ['../src/design-system/**/*.mdx', '../src/components/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  staticDirs: ['../public'],
  viteFinal: (cfg) =>
    mergeConfig(cfg, {
      define: {
        // Stories render one locale without prefixes (domain mode), whatever SITE_LOCALE says.
        'import.meta.env.SITE_LOCALE': JSON.stringify(
          !process.env.SITE_LOCALE || process.env.SITE_LOCALE === 'all'
            ? 'en'
            : process.env.SITE_LOCALE,
        ),
        'import.meta.env.LOCALE_ROUTING': '"domain"',
      },
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
