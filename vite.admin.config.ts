import fs from 'node:fs'
import path from 'node:path'
import { mergeConfig, type Plugin } from 'vite'
import { assetFileNames } from './scripts/lib/asset-names.ts'
import { decapConfig } from './src/admin/config.ts'
import designSystem from './vite.ds.config.ts'

/**
 * The CMS admin (/admin, Decap CMS), built after the site into dist/client/admin:
 *   preview.{js,css}   the real-component preview (src/admin/preview.tsx), built like the design-system bundle
 *                      (React 19 inside, router links as plain anchors)
 *   index.html, emails/   from src/admin; logo.svg, the brand lockup (src/assets/images/brand)
 *   config.yml         Decap's configuration, from src/admin/config.ts (JSON, which YAML reads as it is)
 *   decap-cms.js (+ its chunks), netlify-identity-widget.js   copied from node_modules: nothing loads from a CDN
 * Run by `pnpm build` between the site build and postbuild.
 */

const OUT = 'dist/client/admin'
const DECAP = path.dirname(fs.realpathSync('node_modules/decap-cms/dist/decap-cms.js'))
const IDENTITY = fs.realpathSync(
  'node_modules/netlify-identity-widget/build/netlify-identity-widget.js',
)

function adminFiles(): Plugin {
  return {
    name: 'msmt:admin-files',
    apply: 'build',
    closeBundle() {
      fs.cpSync('src/admin', OUT, {
        recursive: true,
        filter: (src) => !/\.tsx?$/.test(src),
      })
      fs.writeFileSync(path.join(OUT, 'config.yml'), `${JSON.stringify(decapConfig, null, 2)}\n`)
      for (const file of fs.readdirSync(DECAP))
        if (/^(\d+\.)?decap-cms\.js$|\.wasm$|LICENSE/.test(file))
          fs.copyFileSync(path.join(DECAP, file), path.join(OUT, file))
      fs.copyFileSync(IDENTITY, path.join(OUT, 'netlify-identity-widget.js'))
      fs.copyFileSync('src/assets/images/brand/logo.svg', path.join(OUT, 'logo.svg'))
    },
  }
}

export default mergeConfig(designSystem, {
  plugins: [adminFiles()],
  build: {
    outDir: OUT,
    emptyOutDir: true,
    lib: {
      entry: path.resolve('src/admin/preview.tsx'),
      name: 'MSMTAdmin',
      fileName: () => 'preview.js',
      cssFileName: 'preview',
    },
    rolldownOptions: {
      output: {
        // preview.js registers the stylesheet by this name (Decap loads it into the preview frame).
        assetFileNames: (info: { names: readonly string[] }) =>
          info.names.some((n) => n.endsWith('.css')) ? 'preview.css' : assetFileNames(info),
      },
    },
  },
})
