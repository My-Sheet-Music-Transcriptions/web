# My Sheet Music Transcriptions – web

One codebase, one static build per locale/domain. No CMS: content is MDX in this repo and is changed by
chatting with Claude Code. Read this file before touching anything.

## Commands

```sh
pnpm dev                      # Vite dev server (http://localhost:3000)
pnpm storybook                # design system docs + a11y panel (http://localhost:6006)
pnpm check                    # biome + tsc + unit tests  (fast, run before every commit)
SITE_LOCALE=en pnpm build     # prebuild (hreflang, robots, OG images) + prerender + sitemap -> dist/client
pnpm serve:dist               # serve dist/client on :4173
pnpm test:seo                 # SEO conformance over dist/client (needs a build)
pnpm test:storybook           # every story through axe (contrast included)
pnpm test:e2e | test:visual   # Playwright (needs a build; serves dist itself)
pnpm lhci                     # Lighthouse CI thresholds (needs a build; locally set CHROME_PATH to a Chrome/Chromium binary)
pnpm release-check            # what CI runs, locally
pnpm ds:export                # design-system export for the artifact -> dist/design-system (see below)
pnpm ds:review <slug> "<Title>"   # HTML review page of mockups/<slug>/sections.html -> dist/design-system/review/<slug>
NETLIFY_TARGET=storybook pnpm build:netlify   # what the design-system Netlify site publishes (dist/client)
```

## Where things live

- `src/content/<locale>/<collection>/<slug>.mdx` – every page. Collections: pages, services, posts, faqs, artists,
  musicians, partners, reviews. The file name is the URL slug (`pages/home.mdx` is `/`, `faqs/x.mdx` is `/faqs/x`).
  Frontmatter is validated by `src/content/schema.ts` (zod) at build and in unit tests.
- `src/content/<locale>/data/*.ts` – structured data blocks read (nav, footer, pricing, ratings, reviews).
  Numbers that appear in several places (review counts, prices) live here once.
- `src/components/primitives` – Button, Card, Picture, Stars, Icon, SectionHeading, WaveDivider...
- `src/components/blocks` – the page-building catalogue. `index.tsx` exports the `blocks` map, which is the only
  set of components MDX may use. Each block has a story next to it.
- `src/components/layout` – TopBar, Header (+MegaMenu, MobileNav), Footer, ConsentBanner, SiteShell.
- `src/components/templates` – wraps an entry's MDX body (home, page, landing...). Selected by frontmatter.
- `src/components/blocks/catalogue.ts` – one entry per block (description, defaults, MDX snippet, data source);
  drives the README table, the artifact docs and the mockup skill. Missing entry = type error.
- `src/i18n/sites/<locale>.ts` – domain, strings, switcher, contact facts per locale. `src/site.ts` exposes the active one.
- `src/design-system` – `theme-parse.ts` (reads `theme.css` into tokens), `tokens.tsx` (Storybook Foundations),
  `export/` (browser bundle entry, router shim, cover), `review/` (shell + page template of the HTML mockup
  artifact), `artifact.json` (the published artifact + asset ids).
- `mockups/<slug>/sections.html` (+ `img/`) – the approved mockup of a page, the source `new-page` builds from.
- `src/seo` – `head.ts` (title/description/canonical/OG/hreflang), `jsonld.ts`, `og/template.tsx` (Satori).
- `scripts/` – `prebuild.ts` (slug check, hreflang map, robots.txt, OG PNGs), `serve-dist.ts`, `lib/content-fs.ts`,
  `design-system/{export,index,lib}.ts` (artifact export).
- `tests/unit`, `tests/seo` (runs over `dist/client`), `tests/e2e`, `tests/visual` (+ `reference/` captures of the live site).
- `.claude/skills` – `mockup`, `new-page`, `publish-design-system`, `release-check`, and stubs for later phases.

## Rules that CI enforces

- Slugs are flat and unique per locale across collections; reserved: api, assets, og, faqs, review, 404, storybook.
- Every page: exactly one `<h1>`, `<title>` 30–65 chars, description 50–160, canonical, og:title/description/image
  (the image file must exist in dist), twitter card, `<html lang>`, valid JSON-LD, images with alt/width/height,
  no broken internal links, present in sitemap unless `noindex`.
- Every story passes axe WCAG 2.1 AA including colour contrast (`parameters.a11y.test = 'error'`).
- Lighthouse: performance ≥ 0.90, accessibility ≥ 0.95, best practices ≥ 0.95, SEO = 1.0; JS budget 150 KB.
- Biome formats and lints everything; `tsc --noEmit` must pass; MDX may only use components from `blocks`.

## Adding content (short version; the skills have the full checklist)

1. Pick the collection and slug; check `src/content/<locale>/...` for collisions.
2. Write frontmatter (title, description, translationKey, template/type-specific fields) and compose the body
   from blocks, e.g. `<Hero />`, `<Section title="...">prose</Section>`, `<ReviewCards limit={4} />`.
3. Put images in `src/assets/images/<collection>/` and import them through blocks (never raw `<img>`).
4. `pnpm release-check`, open a draft PR; Netlify posts a preview.

## Design tokens

Defined once in `src/styles/theme.css` (`@theme`, every token with a usage comment; `app.css` only imports).
Text and fills use the contrast-safe `primary` #1a7f97 and `accent-deep` #b8571c; the live site's #219EBC / #F49946
survive as decorative `sky` / `accent`. Navy #023047, teal #239c90, ink #444. Font: Montserrat (variable). Radii:
card 12px, pill 28px, field 20px. Containers 1140 / 1200 / 900 px. Breakpoints: md 768, lg 1025 (Elementor's
tablet/desktop split). Use utilities, never ad-hoc hex values in components. `tests/unit/theme-tokens.test.ts`
checks names, usage notes and contrast.

## Design System artifact and the page workflow

New pages and page changes start as a **mockup, not code**, and this is the default for every content request:

1. `mockup` skill: write `mockups/<slug>/sections.html` (one `data-msmt` element per real block, `data-proposed`
   for a block or prop that does not exist yet), run `pnpm ds:review <slug> "<Title>"` and publish the result as
   an HTML artifact. The user sees the page rendered by the real components, switches desktop/tablet/phone,
   and comments on sections. Iterate on the same artifact until they approve. (The Design canvas type is only
   for free-form exploration when the user asks for it.)
2. `new-page` skill: turn the approved sections into MDX one block per section, build any proposed block, run
   `pnpm release-check`, open a **ready-for-review PR with auto-merge** (squash). CI green = deployed to
   production by Netlify. Draft PRs are for work the user has not approved yet.

The Design System artifact (`src/design-system/artifact.json`, title "My Sheet Music Transcriptions") is generated by
`pnpm ds:export` from `theme.css`, the blocks, `catalogue.ts`, the layout components and the brand assets; it ships
the real components as `components/bundle.js` (`window.MSMT`, React included) and the review pages load them from
there. Republish with the `publish-design-system` skill after changing any of those sources; never edit the
artifact by hand. CI: PRs run lint/types/unit (+ `ds:export`), build, SEO, e2e and Lighthouse; the Storybook axe
suite runs on `main` only (run `pnpm test:storybook` locally when touching components).

## Conventions

- TypeScript strict, Biome style (single quotes, no semicolons). Components are function components with typed props.
- Internal links use the router `<Link>` (preloaded on hover); external ones a plain `<a rel="noopener">`.
- Images go through `<Picture>` (vite-imagetools `?w=...` import) so they ship as AVIF/WebP with dimensions.
- Prefer editing an existing block over adding a near-duplicate. New block = component + story + README section
  in `src/components/blocks/README.md` + export from `blocks/index.tsx`.
- Do not commit generated files: `routeTree.gen.ts`, `hreflang.generated.json`, `public/og`, `public/robots.txt`.
