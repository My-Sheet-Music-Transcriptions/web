# My Sheet Music Transcriptions – website

Static-first rebuild of the My Sheet Music Transcriptions sites (one codebase, one build per locale/domain).
Content lives in this repository as MDX and is changed by chatting with Claude Code; there is no CMS.

- Stack: TypeScript, React 19, TanStack Start (static prerender + selective SSR), Tailwind v4, Biome, Vitest, Playwright, Storybook 10 (+ axe), Lighthouse CI, Satori OG images, Netlify.
- Start here: [`CLAUDE.md`](./CLAUDE.md) (how the repo is organised and how to add content), Storybook (`pnpm storybook`) for the design system.

```sh
pnpm install
pnpm dev                 # http://localhost:3000
pnpm storybook           # http://localhost:6006
SITE_LOCALE=en pnpm build && pnpm serve:dist
pnpm release-check       # everything CI runs, locally
```
