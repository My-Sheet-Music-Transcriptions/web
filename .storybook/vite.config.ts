import { defineConfig } from 'vite'

/**
 * Storybook must not load the site's vite.config.ts (TanStack Start would pull routes and content
 * into every story build). Everything Storybook needs is added in main.ts viteFinal.
 */
export default defineConfig({})
