import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import { chromiumExecutable } from './scripts/lib/chromium.ts'
import { dataPages } from './scripts/lib/vite-data-pages.ts'

export default defineConfig({
  test: {
    projects: [
      {
        // Data pages (page.json) load through the same plugin as in the site build.
        plugins: [dataPages()],
        resolve: { tsconfigPaths: true },
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.{ts,tsx}', 'src/**/*.test.ts'],
        },
      },
      {
        // Runs against the prerendered output in dist/client (set DIST_DIR to override).
        resolve: { tsconfigPaths: true },
        test: {
          name: 'seo',
          environment: 'node',
          include: ['tests/seo/**/*.test.ts'],
          testTimeout: 30_000,
        },
      },
      {
        plugins: [
          storybookTest({ configDir: '.storybook', storybookScript: 'pnpm storybook --ci' }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ launchOptions: { executablePath: chromiumExecutable() } }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
