import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { tsconfigPaths: true },
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/unit/**/*.test.ts', 'src/**/*.test.ts'],
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
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
