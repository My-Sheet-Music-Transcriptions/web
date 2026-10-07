---
name: page
description: Handles any request about the website's pages from anyone, technical or not — a new page or landing page, a translation, a change of text, images, prices or sections, in any of the site's languages. One conversation in three phases — understand the request in plain words, show a preview rendered with the real site components that the user can comment on and iterate until it is right, then (only when they say yes) publish it with a commit straight to main. No pull request, no auto-merge.
---

# Page: request → preview → publish

The person asking may be a colleague who never sees code. Talk about the page, never about blocks, MDX,
props, branches or commits. Everything technical happens behind the preview. Reply in their language.

## Phase 1 · Understand (at most a few questions, in one message)

Ask only what you cannot find out yourself, with sensible defaults offered:
- **Which page, which site?** An existing page (name or URL) or a new one; which site/language (English,
  Spanish, French, German, Japanese, Catalan). A language whose site has no content yet
  (`src/content/<locale>` empty): say so and offer the English site or to plan it.
- **What should it achieve?** Who reads it and what they should do next (ask for a quote, buy a gift card…).
- **What goes on it?** Text they already have, facts and numbers, pictures (pasted or attached), anything
  that must not change. Missing copy shows as `[PLACEHOLDER]` in the preview, never invented; prices,
  counts, ratings and reviews come only from `src/content/<locale>/data/*.ts`.
- **For a change to an existing page:** what exactly changes; everything else stays.
If the message already answers these, do not ask: state your assumptions and go to the preview.

## Phase 2 · Preview and iterate

Build (do not narrate this):
1. Freshness: if `src/styles/theme.css`, a block, `catalogue.ts`, a layout component or a brand asset changed
   after `src/design-system/artifact.json#publishedFrom`, run `publish-design-system` first.
2. Read `src/components/blocks/catalogue.ts`. For an existing page start from its `index.mdx` and change only
   what was asked. Compose the page as an ordered list of blocks with catalogue props. A section nothing fits
   becomes a **proposed block** (or a proposed prop): name it and its props as if it existed and draw it as
   fluid plain markup with token values from `dist/design-system/project/tokens.json`. Prefer a prop over a
   new block.
3. Porting from the live site: it blocks headless browsers, its WordPress API answers
   (`curl -A "Mozilla/5.0" "https://www.mysheetmusictranscriptions.com/wp-json/wp/v2/pages?slug=<slug>&_fields=title,content,yoast_head_json"`;
   files under `wp-content/uploads` download the same way). Images are downloaded into the repo, never linked.
4. Write `mockups/<slug>/sections.html` (images in `mockups/<slug>/img/`, referenced as `img/<file>`): a root
   `<div style="width: 100%; background: #ffffff; color: #444444; font-family: 'Montserrat Variable', Montserrat, system-ui, sans-serif;">`,
   `<div data-msmt="TopBar"></div>`, `<div data-msmt="Header"></div>`, one
   `<div data-msmt="<Block>" data-props='{…}'></div>` per real block (`children` = light-markdown string;
   apostrophes inside `data-props` as `&#39;`), proposed blocks as
   `<section data-proposed="<Name>" data-props='{…}'>…</section>`, `<div data-msmt="Footer"></div>` last.
   Plain markup is fluid (flex-wrap, max-width 1140px, 16px side padding), uses real
   `<label>`/`<input>`/`<button>`, 4.5:1 text; no scripts, no `{{`, no external URLs.
5. `pnpm ds:review <slug> "<Page name>"` → `dist/design-system/review/<slug>/{index.html,page.html,files.json}`.
   Artifact publish: `file_path` = that `index.html` (absolute), `files` = the contents of `files.json`,
   `icon: "page"`, `capabilities: {"comments": {"composer_only": true}}`, a one-sentence `description`.
   Republish the same artifact on every iteration; never a second one for the same page.

Talk: the link; one short paragraph of what the page shows, top to bottom, in everyday words; what you
assumed; what is still a placeholder and what you need. Explain commenting: Desktop/Phone switch at the
top, hover a section and press Comment, or the comment tool top right; ask them to tell you here when they
are done (comments do not reach you on their own; read them with the `ArtifactComments` tool when they say
so). The preview is private until they share it. Iterate: edit `sections.html`, rerun `pnpm ds:review`,
republish, summarise the change. When they say it is right, ask exactly one question: "Shall I publish this
to the live site?" naming the site and the address. Only a yes starts Phase 3. Never publish unasked.

## Phase 3 · Publish (after an explicit yes)

Tell them it takes a few minutes; keep the rest out of the conversation.
1. **Build the page from the approved preview.** Each `data-msmt` element → one MDX block with exactly its
   `data-props` (`children` → MDX prose; `PageHero` → the template's hero in frontmatter when the template
   renders one). Each `data-proposed` element → build it first: component (+ typed props with doc comments),
   story, `catalogue.ts` entry, README section, export from `blocks/index.tsx`, `pnpm test:storybook` green,
   then `publish-design-system`. Never improvise a prop that is not in the catalogue.
2. **Page folder (co-location).** `src/content/<locale>/<collection>/<slug>/index.mdx` with every image of the
   page beside it (≤ 2000px long side, descriptive names), imported at the top of the MDX
   (`import card from './gift-card.png?w=480;960&as=picture'`) and passed to blocks as props with alt text.
   No external URLs, ever; brand-wide assets only (logo, icons, flags) stay in `src/assets/images/`.
   Collection `pages` unless it is a service/post/faq/artist/musician/partner/review; slug as on the live
   site when porting; `pnpm exec tsx scripts/check-slugs.ts`.
3. **Frontmatter** per `src/content/schema.ts`: `title` 30–65 chars, `description` 50–160, `translationKey`
   shared across languages, `template` or type-specific fields. Structured facts stay in
   `src/content/<locale>/data/*.ts`; add the page to `data/nav.ts` / `data/footer.ts` where the preview shows
   it; drop its slug from any legacy-link list.
4. **All checks green before anything is pushed:** `pnpm release-check` (lint, types, unit, Storybook axe,
   build, SEO suite), plus `pnpm test:e2e` when layout changed. Fix failures, never lower a threshold. A page
   that cannot pass is not published: go back to the user with what is missing, in plain words.
5. **Publish = commit to main.** `git fetch origin main && git checkout -B publish/<slug> origin/main`, commit
   the page folder, `mockups/<slug>/` and any block work ("Publish /<slug> (EN)"), `git push origin HEAD:main`.
   If main moved meanwhile, merge `origin/main` and rerun `pnpm check` first. No PR, no auto-merge: the
   approved preview is the review. Pull requests remain for engineering work (blocks, tooling, CI).
6. **Confirm.** Netlify builds and deploys main; poll the live URL until the new page answers 200 with its
   title (up to ~5 minutes), then tell the user it is live with its address. If the deploy or CI on main
   fails, say so, fix forward or revert, and report.
