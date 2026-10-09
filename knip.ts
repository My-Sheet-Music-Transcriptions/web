import type { KnipConfig } from 'knip'

/**
 * Dead-code check (`pnpm knip`, part of `pnpm check` and CI): unused files, exports, types and dependencies.
 * Knip finds most entry points itself (package.json scripts, Vite/Vitest/Storybook/Playwright configs, the
 * `import.meta.glob` patterns of the content loader); the ones listed here are those it cannot see.
 * An export that only its own file uses is not reported. To keep an export nothing imports yet (an
 * authoring type for a collection with no page), tag it `/** @public *\/` with a comment saying why.
 */
const config: KnipConfig = {
  entry: [
    // TanStack file routes: src/routeTree.gen.ts imports them, but it is gitignored, so knip skips it.
    'src/routes/**/*.{ts,tsx}',
    // vite.ds.config.ts: the design-system bundle's lib entry and its @tanstack/react-router alias.
    'src/design-system/export/entry.tsx',
    'src/design-system/export/router-shim.tsx',
    // .storybook/main.ts: the builder's viteConfigPath and the server-function stand-in (an alias).
    '.storybook/vite.config.ts',
    '.storybook/mocks/contact.functions.ts',
    // Lighthouse CI finds its config by name (scripts/lhci.ts).
    'lighthouserc.cjs',
  ],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [
    // scripts/lib/og.ts reads its static font files by path (Satori needs TTF/WOFF, not the variable font).
    '@fontsource/montserrat',
    // .storybook/main.ts names it as a string; @storybook/react-vite brings it.
    '@storybook/builder-vite',
  ],
}

export default config
