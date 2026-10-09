import crypto from 'node:crypto'
import fs from 'node:fs'
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

/**
 * Byte-identical pictures under different names (Storybook's own pictures repeat some brand ones: its
 * flag is the Spanish flag) would reach the bundler as two files with the same bytes, written once under
 * whichever name it met first, which varies from run to run, and the export hash
 * (scripts/design-system/lib.ts) with it. Each such picture resolves to the alphabetically first copy.
 */
function identicalPictures(): Map<string, string> {
  const walk = (dir: string): string[] =>
    fs
      .readdirSync(dir, { withFileTypes: true })
      .flatMap((e) =>
        e.isDirectory()
          ? walk(path.join(dir, e.name))
          : /\.(png|jpe?g|webp)$/.test(e.name)
            ? [path.join(dir, e.name)]
            : [],
      )
  const byHash = new Map<string, string[]>()
  for (const file of ['src/assets/images', 'src/stories'].flatMap((d) => walk(path.resolve(d)))) {
    const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
    byHash.set(hash, [...(byHash.get(hash) ?? []), file])
  }
  const canonical = new Map<string, string>()
  for (const files of byHash.values()) {
    const [first, ...rest] = files.sort()
    for (const file of rest) canonical.set(file, first as string)
  }
  return canonical
}

/** Keeps the bundle's images small: one width (<= 1200px) in webp per import, instead of every srcset candidate. */
function capImageWidths(): Plugin {
  const canonical = identicalPictures()
  return {
    name: 'msmt:cap-image-widths',
    enforce: 'pre',
    async resolveId(source, importer) {
      const m = /^(.*\.(?:png|jpe?g|webp))\?w=([0-9;]+)(?:&.*)?$/.exec(source)
      if (!m) return null
      const widths = (m[2] ?? '').split(';').map(Number)
      const fitting = widths.filter((w) => w <= MAX_WIDTH)
      const w = fitting.length ? Math.max(...fitting) : Math.min(...widths)
      const resolved = await this.resolve(`${m[1]}?w=${w}&format=webp&as=picture`, importer, {
        skipSelf: true,
      })
      const [file, query] = resolved?.id.split('?') ?? []
      const same = file && canonical.get(file)
      return same ? { ...resolved, id: `${same}?${query}` } : resolved
    },
  }
}

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"production"',
    'import.meta.env.SITE_LOCALE': '"en"',
    'import.meta.env.LOCALE_ROUTING': '"domain"',
    'import.meta.env.DEV': 'false',
    // The package version, not the commit or the date: the export hash (scripts/design-system/lib.ts) must
    // change only when what the bundle renders changes. design-system.json#lastChange names the commit.
    __MSMT_VERSION__: JSON.stringify(
      (JSON.parse(fs.readFileSync('package.json', 'utf8')) as { version: string }).version,
    ),
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
