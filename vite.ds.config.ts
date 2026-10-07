import { execSync } from 'node:child_process'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { imagetools } from 'vite-imagetools'

/**
 * Library build of the design system for the published Design System artifact and Design canvas
 * mockups: one classic script (`window.MSMT`) with React 19 inside, one stylesheet, webp assets.
 *   pnpm ds:build   -> dist/design-system/project/components/{bundle.js,bundle.css,assets/}
 */

const MAX_WIDTH = 1200

/** Keeps the bundle's images small: one width (<= 1200px) in webp per import, instead of every srcset candidate. */
function capImageWidths(): Plugin {
  return {
    name: 'msmt:cap-image-widths',
    enforce: 'pre',
    async resolveId(source, importer) {
      const m = /^(.*\.(?:png|jpe?g|webp))\?w=([0-9;]+)(?:&.*)?$/.exec(source)
      if (!m) return null
      const widths = (m[2] ?? '').split(';').map(Number)
      const fitting = widths.filter((w) => w <= MAX_WIDTH)
      const w = fitting.length ? Math.max(...fitting) : Math.min(...widths)
      return this.resolve(`${m[1]}?w=${w}&format=webp&as=picture`, importer, { skipSelf: true })
    },
  }
}

function version() {
  try {
    return `${execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()} ${new Date().toISOString().slice(0, 10)}`
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env.SITE_LOCALE': '"en"',
    'import.meta.env.DEV': 'false',
    __MSMT_VERSION__: JSON.stringify(version()),
  },
  resolve: {
    tsconfigPaths: true,
    alias: [
      {
        find: /^~\/server\/contact\.functions$/,
        replacement: path.resolve('.storybook/mocks/contact.functions.ts'),
      },
      {
        find: '@tanstack/react-router',
        replacement: path.resolve('src/design-system/export/router-shim.tsx'),
      },
    ],
  },
  plugins: [
    capImageWidths(),
    imagetools({
      defaultDirectives: (url) => {
        const d = new URLSearchParams()
        if (!url.searchParams.has('format')) d.set('format', 'webp')
        if (!url.searchParams.has('as')) d.set('as', 'picture')
        return d
      },
    }),
    tailwindcss(),
    viteReact(),
  ],
  experimental: {
    // Assets are emitted next to bundle.js; resolve them at runtime relative to the script's URL.
    renderBuiltUrl(filename, { type }) {
      if (type === 'asset') return { runtime: `__msmtAssetUrl(${JSON.stringify(filename)})` }
      return { relative: true }
    },
  },
  publicDir: false,
  build: {
    outDir: 'dist/design-system/project/components',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    lib: {
      entry: path.resolve('src/design-system/export/entry.tsx'),
      name: 'MSMT',
      formats: ['iife'],
      fileName: () => 'bundle.js',
      cssFileName: 'bundle',
    },
    rollupOptions: {
      output: { assetFileNames: 'assets/[name]-[hash][extname]' },
    },
  },
})
