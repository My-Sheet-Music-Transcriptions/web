# My Sheet Music Transcriptions – web

One codebase, one static build per locale/domain. No CMS: content is React pages in this repo (`content/`) and is changed by
chatting with Claude Code. Read this file before touching anything.

## Commands

```sh
pnpm dev                      # Vite dev server, every locale under /en, /es... (http://localhost:3000/en)
pnpm storybook                # design system docs + a11y panel (http://localhost:6006)
pnpm check                    # biome + tsc + unit tests  (fast, run before every commit)
pnpm check:pr                 # exactly what PR CI runs: check + English build + SEO suite (~1.5 min)
SITE_LOCALE=en pnpm build     # production build of one locale: prebuild (hreflang, robots, OG) + prerender + sitemaps -> dist/client
pnpm build                    # preview build: every locale under /<locale>, noindex, no sitemaps (what deploy previews ship)
pnpm serve:dist               # serve dist/client on :4173
pnpm test:seo                 # SEO conformance over dist/client (needs a build)
pnpm test:storybook           # every story through axe (contrast included)
pnpm test:e2e | test:visual   # Playwright (needs a build; serves dist itself)
pnpm lhci                     # Lighthouse CI thresholds (needs a build; finds Chromium itself, CHROME_PATH overrides)
pnpm release-check            # the full local gate (more than the PR CI runs: see nightly.yml)
pnpm ds:export                # design-system export for the artifact -> dist/design-system (see below)
pnpm ds:blocks [Block...|--all]    # no args: the index (blocks by category, when to use each, where used); names: props, allowed values, docs + a ready mockup line
pnpm ds:review <slug> ["<Title>"]  # checks mockups/<slug>/sections.html, renders it locally (as ds:shot), builds the review page and prints the Artifact publish parameters
pnpm ds:shot <slug> [--built | --url <url>] [--width 390]   # renders the mockup (or the real page) in headless Chromium at 1440/768/390: pictures per section + problems
pnpm ds:canvas <slug> [--canvas <canvas.json>] | --pull <Board.dc.html>   # design mode: the mockup as a Design canvas, and back
pnpm ds:mockup <slug> [--force]    # an existing page (index.tsx + meta.ts) -> mockups/<slug>/sections.html (+ img/, preview.json)
pnpm page:status [slug]            # the pages in flight (mockups/*/preview.json) as JSON, for the /status command
NETLIFY_TARGET=storybook pnpm build:netlify   # what the design-system Netlify site publishes (dist/client)
```

## Where things live

- `content/` – everything content managers own, and the only folder a PR may change without a core approval
  (see "Who may change what"). Imported as `@content/*` (tsconfig paths).
- `content/<locale>/<collection>/<slug>/` – every page is a **folder**: `index.tsx` (the page component, a
  fragment of blocks), `meta.ts` (`export default { title, description, translationKey, … } satisfies
  PageMetaInput`) and every image the page uses, side by side (co-location). Collections: pages, services, posts,
  faqs, artists, musicians, partners, reviews. The folder name is the URL slug (`pages/home/` is `/`, `faqs/x/` is
  `/faqs/x`). `meta.ts` is plain data: read statically by `scripts/lib/ts-literal.ts` (never run in Node) and
  validated by `src/content/schema.ts` (zod) at build and in unit tests.
- `content/<locale>/data/*.ts` – the data pages pass to blocks (ratings, prices, services, reviews, FAQ groups), the
  words blocks show around their content (`labels.ts`: carousel and video controls, review lines; `forms.ts`: the
  request forms) and the locale's menus and footer (`nav.ts`, `footer.ts`, read by `src/app`). Numbers that appear in
  several places (review counts, prices) live here once. Plain literals, read statically like `meta.ts`; they may
  import pictures from `~/assets/images` (icons, logos).
- `src/assets/images` – brand-wide pictures (lockup, illustrated icons, photo bands, flags, software logos), imported
  by pages, data files and `src/app`; never by a component.
- `src/content/{index,schema,types}.ts` – the content loader (globs `content/`), the meta schemas and data types.
- `src/components/primitives` – `BlockShell` (the frame of every block), `Media`, `FeatureItem`, `Card`, Button, Picture,
  Stars, Icon, SectionHeading, WaveDivider...
- `src/components/blocks` – the page-building catalogue, named by what each block does (`PageHeader`, `CardGrid`,
  `FaqList`…) and filed by category, what each shows (headers, text & media, lists & grids, reviews & ratings, calls to
  action), in `catalogue.ts`, the README and Storybook (`Blocks/<Category>/<Name>`). `index.tsx` exports every block by name (pages import them from
  `~/components/blocks`) and the `blocks` map (the preview bundle). Each block has a story next to it, built from
  its catalogue example. Every block but `PageHeader` is a `BlockShell` around its own content, and shared pieces
  (media, feature items, cards, buttons, tones) are primitives: the `component` skill says how to add or change one.
- `src/components/typography` – `Text`, `Heading`, `List`/`ListItem`, `Quote`, `TextLink`, `Divider`: the prose
  inside pages and blocks, styled with Tailwind once. Plain `<strong>` / `<em>` are the exceptions, styled in the
  base layer of `theme.css`. Pages never write raw `<p>`, `<h2>`, `<ul>`, `<a>` (`tests/unit/content.test.ts`).
- `src/components/layout` – TopBar, Header (+MegaMenu, MobileNav), Footer, ConsentBanner, LangSwitcher, Logo: props
  only, with `children`/slots where composition helps (the top bar's and header's language switcher).
- `src/app` – the app's side: `SiteShell` (reads the locale's site config, `content/<locale>/data/{nav,footer}.ts` and
  the brand files and passes them to the layout; the design-system bundle mounts the same pieces), `EntryPage` (wraps
  an entry's page component in `<main>`), `NotFound`, `ErrorPage`. There are no templates: a page is blocks only and
  opens with its own `PageHeader` (`variant="photo"` on the homepage); `meta.ts` holds SEO data only.
- `src/stories` – Storybook's own data and pictures (`data.ts`, `images/`, `samples.ts` resolving `'sample:photo'`…):
  they mimic the app's content but stay separate. Stories, the catalogue examples and the design-system previews
  use them; no story imports `content/` or `src/assets`.
- `src/components/blocks/catalogue.ts` – one entry per block (description, defaults, JSX usage, data source);
  drives the README table, the artifact docs and the `page` skill's previews. Missing entry = type error.
- `src/i18n/sites/<locale>.ts` – domain, the chrome's strings (menus, footer headings, consent, 404), switcher, contact facts per locale. `src/site.ts` exposes the build's
  locale routing and `useSite()` / `useLocale()` (the page's locale); `src/i18n/routing.ts` is how locales map to URLs.
- `src/design-system` – `theme-parse.ts` (reads `theme.css` into tokens), `tokens.tsx` (Storybook Foundations),
  `export/` (browser bundle entry, router shim, cover), `review/` (shell + page template of the HTML preview
  artifact), `artifact.json` (the published artifact + asset ids).
- `mockups/<slug>/sections.html` (+ `img/`, `sections.<variant>.html` for design options, `preview.json` with title,
  path, locale, preview URL, canvas URL and PR) – the approved mockup of a page, the single source every preview
  surface and the build start from; `tests/unit/mockups.test.ts` keeps every mockup valid.
- `src/seo` – `head.ts` (title/description/canonical/OG/hreflang), `alternates.ts` (hreflang, shared with the
  sitemaps), `jsonld.ts`, `og/template.tsx` (Satori).
- `scripts/` – `prebuild.ts` (slug check, hreflang map, robots.txt, OG PNGs), `postbuild.ts` (sitemaps, `_redirects`),
  `serve-dist.ts`, `lib/content-fs.ts`, `lib/sitemap.ts` (see "Sitemaps" below),
  `lib/chromium.ts` (the Chromium Playwright, Storybook's vitest, `lhci` and `ds:shot` launch: Playwright's own,
  else the one the container ships in `/opt/pw-browsers`; `CHROME_PATH` overrides),
  `design-system/{export,index,lib}.ts` (artifact export, `ds:index --check` and the publish record),
  `design-system/{blocks,review,shot,canvas,mockup,status}.ts` + `*-lib.ts` and `preview-lib.ts` (the page-preview tooling).
- `tests/unit`, `tests/seo` (runs over `dist/client`), `tests/e2e`, `tests/visual` (+ `reference/` captures of the live site).
- `.claude/skills` – `page` (the whole page workflow; `reference/*.md` hold the recipes per step), the content-manager
  commands `new-page`, `edit-page`, `translate`, `design`, `publish`, `status`, `site-help` (thin entry points into
  `page`), the engineering skills `component` (adding or changing a block or primitive without duplicating one),
  `motion` (every animation: the Motion provider, presets, reveals, menus) with Motion's official `motion-dev`
  skill vendored beside it, `publish-design-system` and `release-check`, and hidden stubs for later phases.
- `docs/content-managers.{md,es.md,ca.md}` – the plain-language guide for content managers and writers (EN/ES/CA);
  `tests/unit/skills.test.ts` keeps the commands, the guides and the skill's reference files in sync.
- `docs/migration/PLAN.md` – the WordPress → repo migration plan (waves, decisions, cutover runbook), with the URL
  inventory per locale (`inventory/<locale>.md` + `.json`) and the redirect map. Read it before porting a page; tick
  its checklists, fill the inventory's PR column and add a session-log line when you do.

## Rules that CI enforces

- Slugs are flat and unique per locale across collections; reserved: api, assets, og, faqs, review, 404, storybook.
- Every page: exactly one `<h1>`, `<title>` 30–65 chars, description 50–160, canonical, og:title/description/image
  (the image file must exist in dist), twitter card, `<html lang>`, valid JSON-LD, images with alt/width/height,
  no broken internal links, listed once in its collection's sitemap unless `noindex`, with the hreflang alternates of
  its `<head>`.
- Every story passes axe WCAG 2.1 AA including colour contrast (`parameters.a11y.test = 'error'`). The one exception
  is elements marked `data-live-colour`, which keep the live site's colours by decision (filled buttons, pricing headers,
  the active nav item, the current language, the response-time pill); contrast is checked everywhere else.
- Lighthouse: performance ≥ 0.90, accessibility ≥ 0.95, best practices ≥ 0.95, SEO = 1.0; JS budget 150 KB.
- Biome formats and lints everything; `tsc --noEmit` must pass (pages are type-checked against the block props).
- `meta.ts` is a literal only; pages use the typography components for text (`tests/unit/content.test.ts`).
- No picture under `src/assets/images` or `content/` is byte-identical to another under a different file name,
  nor stored twice in `src/assets/images` (`tests/unit/images.test.ts`): reuse the file instead of copying it.
- A PR touching anything outside the content paths needs a code-owner approval (`.github/CODEOWNERS`).

## Adding content (short version; the skills have the full checklist)

1. Pick the collection and slug; check `content/<locale>/...` for collisions.
2. Write `meta.ts` (title, description, translationKey, the collection's fields) and compose `index.tsx`
   from blocks, opening with `<PageHeader … />` (its h1; the service icon as `image` + `rating` on service pages),
   then e.g. `<Section title="..."><Text>…</Text></Section>`, `<Testimonials title="…" items={homeReviews}
   labels={reviewLabels} />`, `<ContactSection form={quoteForm} returnTo="/x" />` (`content/en/pages/gift-card/`
   is the worked example, `content/en/services/piano/` the service one). The page passes every word and picture:
   lists (ratings, prices, reviews, shared FAQ groups) and shared words (`labels.ts`, `forms.ts`) are imported from
   `content/<locale>/data/*.ts` and passed as props.
3. Put the page's images in its folder (`content/<locale>/<collection>/<slug>/`), import them in `index.tsx`
   (`import mascot from './mascot.png?w=240;480&as=picture'`) and pass them to blocks as props; never raw `<img>`.
   Only brand-wide assets (logo, icons, photo bands, flags, software logos) live in `src/assets/images/`; a page
   imports those the same way (`import studioBand from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'`).
4. Content goes live through the `page` skill (checks, draft PR + Netlify preview, then auto-merge on acceptance);
   engineering changes go through `pnpm release-check` and a PR with a Netlify preview and a core approval.

## Who may change what

Paths decide, not people. `.github/CODEOWNERS` makes `@My-Sheet-Music-Transcriptions/core` the owner of everything
except `content/`, `mockups/`, `docs/migration/` and `src/design-system/artifact.json` (generated, rewritten when a
data change forces a republish). The branch rule on `main` requires a code owner's review, so a PR that only touches
those paths merges on green CI, and any other PR (blocks, components, server functions, forms, tests, CI, config,
these instructions, the skills) waits for core. `.github/workflows/labels.yml` labels every PR `content` and/or
`engineering` so the blast radius is visible; the `page` skill reads the label and tells the person when an engineer
must approve. Auto-merge is always enabled on acceptance: the rule, not the skill, decides when it merges. Keep the
unowned list in CODEOWNERS and `CONTENT_PATHS` in the labels workflow identical.

## Locales and URLs

Production is one build and one Netlify site per locale, each on its own TLD (`SITE_LOCALE=es` → domain mode, no
prefix). Deploy previews, branch deploys and `pnpm dev` are one build with every locale under `/<locale>` (path
mode: `SITE_LOCALE` unset or `all`); only the English Netlify site builds previews (`scripts/netlify-ignore.sh`).

- Routes, content paths and hrefs are always locale-free: `<Link to="/pricing">`, `<SmartLink href="/#contact">`,
  `<TextLink href="/gift-card">` in a page. In path mode the router's URL rewrite (`localePrefixRewrite`) adds the current
  page's prefix, so links stay TanStack `<Link>`s with preloading. Never hand-write `/es/...` or a TLD.
- Components read the locale with `useSite()` / `useLocale()`, never a module-level constant; loaders and `head`
  use `localeOf(location.publicHref)`. Other locales: `siteUrl(locale, path)` (TLD or prefix), absolute URLs:
  `absoluteUrl(locale, path)`. The language switcher uses `localeSwitchHref` (falls back to the live site for a
  locale with no pages yet). Locale codes are reserved slugs.
- `/api`, `/assets` and `/og` are shared and never prefixed.

### Sitemaps

Every production build writes, after prerendering (`scripts/postbuild.ts` → `scripts/lib/sitemap.ts`), an index at
`/sitemap.xml` (named by `robots.txt` and every page's `<link rel="sitemap">`) and one sitemap per collection,
`/<name>-sitemap.xml` (Yoast's names: `page`, `post`, `services`…, `SITEMAP_NAMES`). They are made from the entries
in `content/` (not drafts, not `noindex`), the same list the build prerenders, so a new page or collection is listed
with no extra step; a new collection must be named in `SITEMAP_NAMES` (type error otherwise). Each URL carries
hreflang alternates to its translations on the other TLDs, from the same function as the page `<head>`
(`src/seo/alternates.ts`); `lastmod` is `meta.updated`, else the page folder's last commit. The WordPress sitemap URLs
(`/sitemap_index.xml`, other Yoast and WordPress names, `LEGACY_SITEMAPS`) 301 to the index. Previews have none.
`tests/unit/sitemap.test.ts` (every locale, plus a multi-language fixture) and the SEO suite (sitemaps == indexable
pages, alternates == `<head>`) keep them complete.

## Design tokens

Defined once in `src/styles/theme.css` (`@theme`, every token with a usage comment; `app.css` only imports).
Text uses the contrast-safe `primary` #1a7f97 and `accent-deep` #b8571c; filled buttons keep the live site's `cta` #E2864D
and `sky` #219EBC (marked `data-live-colour`), and #F49946 stays the decorative `accent`. Navy #023047, teal #239c90, ink #444. Font: Montserrat (variable). Radii:
card 12px, pill 28px, field 20px. Containers 1140 / 1200 / 900 px. Breakpoints: md 768, lg 1025 (Elementor's
tablet/desktop split). Use utilities, never ad-hoc hex values in components. `tests/unit/theme-tokens.test.ts`
checks names, usage notes and contrast.

## Design System artifact and the page workflow

Every request about pages, from anyone (also non-technical colleagues, in any language), goes through the
single `page` skill; the slash commands `/new-page`, `/edit-page`, `/translate`, `/design`, `/publish`, `/status`
and `/site-help` are entry points into it that preset its mode. One conversation in three phases:

1. **Understand**: a short plain-language exchange (which page/site, what for, what goes on it).
2. **Preview**: `mockups/<slug>/sections.html` is the mockup (an existing page starts from `pnpm ds:mockup <slug>`,
   never from memory). Two interchangeable surfaces render it with the real components: the HTML preview
   artifact (`pnpm ds:review`: desktop/tablet/phone switch, block labels, per-section comments) by default, or, only
   when the user asks for design, a **Design canvas** (`pnpm ds:canvas`: a desktop and a phone artboard per option,
   the design system installed on the canvas, pulled back into the mockup with `--pull` when they are done).
   Each round is rendered and looked at locally first (`ds:review` runs the `ds:shot` check: pictures per section
   at 1440/768/390), then published. Iterate on the same artifact until the user says it is right, then ask
   whether to publish. Never publish unasked.
3. **Build and check the real thing**, only after an explicit yes: build the approved sections into the page
   folder (`content/<locale>/<collection>/<slug>/` with `index.tsx`, `meta.ts` and images), build proposed blocks, run every check
   locally, push a **draft PR** and hand the user Netlify's deploy preview of the real page.
4. **Publish** on their acceptance: mark the PR ready with **auto-merge (squash)** and auto-fix it (watch CI,
   fix failures, push) until it merges; Netlify deploys `main`; confirm to the user when the page is live.
   Nothing reaches `main` without the user having seen the real page first. A page PR that also touches code
   (a proposed block) waits for a core approval; Engineering PRs (blocks, tooling, CI) follow the normal review path.

The Design System artifact (`src/design-system/artifact.json`, title "My Sheet Music Transcriptions") is generated by
`pnpm ds:export` from `theme.css`, the blocks, `catalogue.ts`, the layout components and the brand assets; it ships
the real components as `components/bundle.js` (`window.MSMT`, React included) and both preview surfaces load them
from there (the server copies the files by name, so a file the artifact lacks fails every preview publish).
The artifact follows `main`: `pnpm ds:index --check` exports and compares the output's hash with the one
recorded at the last publish (`artifact.json#exportHash`); a scheduled Claude routine runs it on `main` every
few hours and republishes when it fails (the `publish-design-system` skill), the `page` skill runs it before
every preview, and nightly CI runs it as an alarm. A PR that changes blocks or tokens does not republish; a
branch publishes only when its preview needs a proposed block. Every preview copies the design-system files
from the artifact version recorded in `artifact.json#publishedVersion`, so a publish from any branch never
changes an existing preview. Never edit the artifact by hand. CI: PRs and pushes to `main` run only the fast
checks (lint/types/unit, build, SEO suite); Storybook axe, Playwright e2e + visual, Lighthouse, the link check,
`ds:export` and the artifact sync check run nightly on `main` (`nightly.yml`, also on demand). Run `pnpm test:storybook` and `pnpm test:e2e` locally when touching
components or layout.

## Conventions

- **Components are agnostic of the content.** A component (`src/components/**`) holds no words and no pictures:
  no copy (text, alt, aria labels, placeholders, defaults), no picture imports or lookups, no `content/` data, no
  site strings. Every word a visitor reads and every picture arrives through props or `children`: pages pass them
  directly (from their folder and `content/<locale>/data`), and `src/app` passes the chrome's from the site config.
  The design system's own marks are not content: the `Icon` glyph set, colours, textures (`bg-staff-lines`), the
  numbers and punctuation it formats. `tests/unit/components.test.ts` lists every breach with file:line.
- **Co-location, no external assets.** Everything a page or component needs sits next to it: a page's images
  in its folder, a block's story and docs beside the block. Nothing on the site or in the artifacts references a
  third-party URL at runtime: no hotlinked images, no CDN scripts, no Google Fonts (Montserrat is self-hosted).
  Images from the old site are downloaded into the repo, never linked.

- TypeScript strict, Biome style (single quotes, no semicolons). Components are function components with typed props.
- Internal links use the router `<Link>` (preloaded on hover); external ones a plain `<a rel="noopener">`.
- Images go through `<Picture>` (vite-imagetools `?w=...` import) so they ship as AVIF/WebP with dimensions.
- **One shell, one vocabulary.** Before touching `src/components`, follow the `component` skill: a prop or `variant` on
  an existing block beats a new shape of a shared item, which beats a new primitive, which beats a new block. Every
  block renders `BlockShell` (section, tone, container, heading with its rule, lead, closing `cta`/`links`, photo
  band, `reveal`) and picks presets, never pixels. Props say one thing one way: `title`, `eyebrow`, `lead`, `tone`,
  `variant`, `columns` (desktop), `items` (fields `title`, `body`, `image`, `name`, `alt`, `caption`, `href`), `cta`,
  `links`, `labels`, `id`, `reveal`. `tests/unit/blocks.test.ts` refuses a hand-made shell and the retired synonyms.
- **Motion through Motion.** Animations use Motion (`motion/react`): `m` components and the presets in
  `src/components/primitives/Motion.tsx`, under the `MotionProvider` every root mounts (reduced motion respected).
  A page reveals a block with `reveal`. The one exception is the `PageHeader`, which never takes `reveal`: its copy
  rises into place as the page opens with a CSS animation (`entrance` in `theme.css`; its text moves but never fades),
  so its largest paint never waits for JavaScript. Follow the `motion` skill.
- Do not commit generated files: `routeTree.gen.ts`, `hreflang.generated.json`, `public/og`, `public/robots.txt`.
