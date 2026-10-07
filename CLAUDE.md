# My Sheet Music Transcriptions – web

One codebase, one static build per locale/domain. No CMS: content is MDX in this repo and is changed by
chatting with Claude Code. Read this file before touching anything.

## Commands

```sh
pnpm dev                      # Vite dev server, every locale under /en, /es... (http://localhost:3000/en)
pnpm storybook                # design system docs + a11y panel (http://localhost:6006)
pnpm check                    # biome + tsc + unit tests  (fast, run before every commit)
SITE_LOCALE=en pnpm build     # production build of one locale: prebuild (hreflang, robots, OG) + prerender + sitemap -> dist/client
pnpm build                    # preview build: every locale under /<locale>, noindex, no sitemap (what deploy previews ship)
pnpm serve:dist               # serve dist/client on :4173
pnpm test:seo                 # SEO conformance over dist/client (needs a build)
pnpm test:storybook           # every story through axe (contrast included)
pnpm test:e2e | test:visual   # Playwright (needs a build; serves dist itself)
pnpm lhci                     # Lighthouse CI thresholds (needs a build; locally set CHROME_PATH to a Chrome/Chromium binary)
pnpm release-check            # the full local gate (more than the PR CI runs: see nightly.yml)
pnpm ds:export                # design-system export for the artifact -> dist/design-system (see below)
pnpm ds:review <slug> ["<Title>"]  # checks mockups/<slug>/sections.html, builds the review page and prints the Artifact publish parameters
NETLIFY_TARGET=storybook pnpm build:netlify   # what the design-system Netlify site publishes (dist/client)
```

## Where things live

- `src/content/<locale>/<collection>/<slug>/index.mdx` – every page is a **folder**: the MDX plus every image the
  page uses, side by side (co-location). Collections: pages, services, posts, faqs, artists, musicians, partners,
  reviews. The folder name is the URL slug (`pages/home/` is `/`, `faqs/x/` is `/faqs/x`). A flat `<slug>.mdx` is
  accepted for a page with no assets of its own. Frontmatter is validated by `src/content/schema.ts` (zod) at
  build and in unit tests.
- `src/content/<locale>/data/*.ts` – structured data blocks read (nav, footer, pricing, ratings, reviews).
  Numbers that appear in several places (review counts, prices) live here once.
- `src/components/primitives` – Button, Card, Picture, Stars, Icon, SectionHeading, WaveDivider...
- `src/components/blocks` – the page-building catalogue. `index.tsx` exports the `blocks` map, which is the only
  set of components MDX may use. Each block has a story next to it.
- `src/components/layout` – TopBar, Header (+MegaMenu, MobileNav), Footer, ConsentBanner, SiteShell.
- `src/components/templates` – wraps an entry's MDX body (home, page, landing...). Selected by frontmatter.
- `src/components/blocks/catalogue.ts` – one entry per block (description, defaults, MDX snippet, data source);
  drives the README table, the artifact docs and the `page` skill's previews. Missing entry = type error.
- `src/i18n/sites/<locale>.ts` – domain, strings, switcher, contact facts per locale. `src/site.ts` exposes the build's
  locale routing and `useSite()` / `useLocale()` (the page's locale); `src/i18n/routing.ts` is how locales map to URLs.
- `src/design-system` – `theme-parse.ts` (reads `theme.css` into tokens), `tokens.tsx` (Storybook Foundations),
  `export/` (browser bundle entry, router shim, cover), `review/` (shell + page template of the HTML preview
  artifact), `artifact.json` (the published artifact + asset ids).
- `mockups/<slug>/sections.html` (+ `img/`, `preview.json` with title, path and artifact URL) – the approved preview of a page, what the `page` skill publishes from; `tests/unit/mockups.test.ts` keeps every mockup valid.
- `src/seo` – `head.ts` (title/description/canonical/OG/hreflang), `jsonld.ts`, `og/template.tsx` (Satori).
- `scripts/` – `prebuild.ts` (slug check, hreflang map, robots.txt, OG PNGs), `serve-dist.ts`, `lib/content-fs.ts`,
  `design-system/{export,index,lib}.ts` (artifact export).
- `tests/unit`, `tests/seo` (runs over `dist/client`), `tests/e2e`, `tests/visual` (+ `reference/` captures of the live site).
- `.claude/skills` – `page` (request → preview → publish), `publish-design-system`, `release-check`, and stubs for later phases.

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
3. Put the page's images in its folder (`src/content/<locale>/<collection>/<slug>/`), import them in the MDX
   (`import mascot from './mascot.png?w=240;480&as=picture'`) and pass them to blocks as props; never raw `<img>`.
   Only brand-wide assets (logo, icons, flags, software logos) live in `src/assets/images/`.
4. Content goes live through the `page` skill (checks, draft PR + Netlify preview, then auto-merge on acceptance);
   engineering changes go through `pnpm release-check` and a PR with a Netlify preview.

## Locales and URLs

Production is one build and one Netlify site per locale, each on its own TLD (`SITE_LOCALE=es` → domain mode, no
prefix). Deploy previews, branch deploys and `pnpm dev` are one build with every locale under `/<locale>` (path
mode: `SITE_LOCALE` unset or `all`); only the English Netlify site builds previews (`scripts/netlify-ignore.sh`).

- Routes, content paths and hrefs are always locale-free: `<Link to="/pricing">`, `<SmartLink href="/#contact">`,
  `[text](/gift-card)` in MDX. In path mode the router's URL rewrite (`localePrefixRewrite`) adds the current
  page's prefix, so links stay TanStack `<Link>`s with preloading. Never hand-write `/es/...` or a TLD.
- Components read the locale with `useSite()` / `useLocale()`, never a module-level constant; loaders and `head`
  use `localeOf(location.publicHref)`. Other locales: `siteUrl(locale, path)` (TLD or prefix), absolute URLs:
  `absoluteUrl(locale, path)`. The language switcher uses `localeSwitchHref` (falls back to the live site for a
  locale with no pages yet). Locale codes are reserved slugs.
- `/api`, `/assets` and `/og` are shared and never prefixed.

## Design tokens

Defined once in `src/styles/theme.css` (`@theme`, every token with a usage comment; `app.css` only imports).
Text and fills use the contrast-safe `primary` #1a7f97 and `accent-deep` #b8571c; the live site's #219EBC / #F49946
survive as decorative `sky` / `accent`. Navy #023047, teal #239c90, ink #444. Font: Montserrat (variable). Radii:
card 12px, pill 28px, field 20px. Containers 1140 / 1200 / 900 px. Breakpoints: md 768, lg 1025 (Elementor's
tablet/desktop split). Use utilities, never ad-hoc hex values in components. `tests/unit/theme-tokens.test.ts`
checks names, usage notes and contrast.

## Design System artifact and the page workflow

Every request about pages, from anyone (also non-technical colleagues, in any language), goes through the
single `page` skill, one conversation in three phases:

1. **Understand**: a short plain-language exchange (which page/site, what for, what goes on it).
2. **Preview**: a preview artifact rendered with the real components (`mockups/<slug>/sections.html` →
   `pnpm ds:review` → HTML artifact with desktop/phone switch, block labels and per-section comments). Iterate
   on the same artifact until the user says it is right, then ask whether to publish. Never publish unasked.
3. **Build and check the real thing**, only after an explicit yes: build the approved sections into the page
   folder (`src/content/<locale>/<collection>/<slug>/index.mdx` + images), build proposed blocks, run every check
   locally, push a **draft PR** and hand the user Netlify's deploy preview of the real page.
4. **Publish** on their acceptance: mark the PR ready with **auto-merge (squash)** and auto-fix it (watch CI,
   fix failures, push) until it merges; Netlify deploys `main`; confirm to the user when the page is live.
   Nothing reaches `main` without the user having seen the real page first. Engineering PRs (blocks, tooling,
   CI) follow the normal review path.

The Design System artifact (`src/design-system/artifact.json`, title "My Sheet Music Transcriptions") is generated by
`pnpm ds:export` from `theme.css`, the blocks, `catalogue.ts`, the layout components and the brand assets; it ships
the real components as `components/bundle.js` (`window.MSMT`, React included) and the review pages load them from
there. Republish with the `publish-design-system` skill after changing any of those sources; never edit the
artifact by hand. CI: PRs and pushes to `main` run only the fast checks (lint/types/unit, build, SEO suite);
Storybook axe, Playwright e2e + visual, Lighthouse, the link check and `ds:export` run nightly on `main`
(`nightly.yml`, also on demand). Run `pnpm test:storybook` and `pnpm test:e2e` locally when touching
components or layout.

## Conventions

- **Co-location, no external assets.** Everything a page or component needs sits next to it: a page's images
  in its folder, a block's story and docs beside the block. Nothing on the site or in the artifacts references a
  third-party URL at runtime: no hotlinked images, no CDN scripts, no Google Fonts (Montserrat is self-hosted).
  Images from the old site are downloaded into the repo, never linked.

- TypeScript strict, Biome style (single quotes, no semicolons). Components are function components with typed props.
- Internal links use the router `<Link>` (preloaded on hover); external ones a plain `<a rel="noopener">`.
- Images go through `<Picture>` (vite-imagetools `?w=...` import) so they ship as AVIF/WebP with dimensions.
- Prefer editing an existing block over adding a near-duplicate. New block = component + story + README section
  in `src/components/blocks/README.md` + export from `blocks/index.tsx`.
- Do not commit generated files: `routeTree.gen.ts`, `hreflang.generated.json`, `public/og`, `public/robots.txt`.
