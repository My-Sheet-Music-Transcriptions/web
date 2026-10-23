import path from 'node:path'
import { mergeConfig } from 'vite'
import { assetFileNames } from './scripts/lib/asset-names.ts'
import designSystem from './vite.ds.config.ts'

/**
 * The shop's orders panel (/admin/orders, src/admin/orders), built after the CMS admin into
 * dist/client/admin/orders: orders.js (React inside) and orders.css beside the index.html the admin build copies.
 * Built like the design-system bundle; it talks to /api/shop/orders with the CMS's Netlify Identity login.
 */
export default mergeConfig(designSystem, {
  build: {
    outDir: 'dist/client/admin/orders',
    emptyOutDir: false,
    lib: {
      entry: path.resolve('src/admin/orders/main.tsx'),
      name: 'MSMTOrders',
      fileName: () => 'orders.js',
      cssFileName: 'orders',
    },
    rolldownOptions: {
      output: {
        // index.html links the stylesheet by this name
        assetFileNames: (info: { names: readonly string[] }) =>
          info.names.some((n) => n.endsWith('.css')) ? 'orders.css' : assetFileNames(info),
      },
    },
  },
})
