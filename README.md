# My Sheet Music Transcriptions – website

Static-first rebuild of the My Sheet Music Transcriptions sites (one codebase, one build per locale/domain).
Content lives in this repository as React pages under [`content/`](./content) and is changed by chatting with Claude
Code; there is no CMS.

- Stack: TypeScript, React 19, TanStack Start (static prerender + selective SSR), Tailwind v4, Biome, Knip, Vitest, Playwright, Storybook 10 (+ axe), Lighthouse CI, Satori OG images, Netlify.
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

## Who may change what

A PR that only touches `content/`, `mockups/`, `docs/migration/` or `src/design-system/artifact.json` merges on green
CI; anything else needs an approval from `@My-Sheet-Music-Transcriptions/core` (`.github/CODEOWNERS`). Every PR is
labelled `content` and/or `engineering`. This relies on these repository settings (Settings → Branches / Rules):

- **Allow auto-merge** on, squash merging on.
- Branch protection on `main`: require a pull request; **require review from Code Owners**; required approvals 0
  (a content-only PR needs nobody); dismiss stale approvals on new commits; required status checks
  `Lint, types, unit tests`, `Build (prerender + OG + sitemap)` and `SEO conformance`; **include administrators**
  (every collaborator is an admin today, so without it the rule binds nobody); no force pushes.
- The `core` team has write access (CODEOWNERS ignores a team without it).

Engineering skills: `/publish-design-system` (republish the Design System artifact after changing tokens, blocks or
layout) and `/release-check` (every CI gate locally). How it all fits together: [`CLAUDE.md`](./CLAUDE.md).
