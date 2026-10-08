# My Sheet Music Transcriptions – website

Static-first rebuild of the My Sheet Music Transcriptions sites (one codebase, one build per locale/domain).
Content lives in this repository as MDX and is changed by chatting with Claude Code; there is no CMS.

- Stack: TypeScript, React 19, TanStack Start (static prerender + selective SSR), Tailwind v4, Biome, Vitest, Playwright, Storybook 10 (+ axe), Lighthouse CI, Satori OG images, Netlify.
- Start here: [`CLAUDE.md`](./CLAUDE.md) (how the repo is organised and how to add content), Storybook (`pnpm storybook`) for the design system.

```sh
pnpm install
pnpm dev                 # http://localhost:3000/en (every locale under /<locale>)
pnpm storybook           # http://localhost:6006
SITE_LOCALE=en pnpm build && pnpm serve:dist
pnpm release-check       # everything CI runs, locally
```

## For content managers and writers

You do not need any of the above. Open the repository in Claude Code and ask for what you need in your own
words; Claude shows a preview, then the real page on a test address, and publishes only when you say yes. The
guide: [English](./docs/content-managers.md) · [Español](./docs/content-managers.es.md) ·
[Català](./docs/content-managers.ca.md), or type `/site-help`.

| Command | What it does |
| --- | --- |
| `/new-page [name or live URL] [language]` | a new page, or a page brought over from the live site |
| `/edit-page <page> [what changes]` | a change to an existing page; everything else stays |
| `/translate <page> <language>` | the same page in another language |
| `/design <page or idea>` | work on the look on a design canvas, compare options |
| `/publish <page>` | put an approved preview live |
| `/status [page]` | where every page is right now, with links |
| `/site-help` | a short version of the guide, in your language |

Engineering skills: `/publish-design-system` (republish the Design System artifact after changing tokens, blocks or
layout) and `/release-check` (every CI gate locally). How it all fits together: [`CLAUDE.md`](./CLAUDE.md).
