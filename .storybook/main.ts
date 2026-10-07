import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { mergeConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/design-system/**/*.mdx', '../src/**/*.stories.tsx'],
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
