---
name: page
description: Handles any request about the website's pages from anyone, technical or not — a new page or landing page, a translation, a change of text, images, prices or sections, in any of the site's languages. One conversation in three phases — understand the request in plain words, show a preview rendered with the real site components that the user can comment on and iterate until it is right, then (only when they say yes) build it on a draft PR, let them check Netlify's deploy preview of the real page, and on their acceptance mark the PR ready with auto-merge and drive it to green until it is live.
---

# Page: request → preview → build → check the real thing → publish

The person asking may be a colleague who never sees code. Talk about the page, never about blocks, MDX,
props, branches or commits. Everything technical happens behind the preview. Reply in their language.

## Phase 1 · Understand (at most a few questions, in one message)

Ask with the **AskUserQuestion** tool, so the answers are clickable: one call, at most four questions, two to
four options each, the sensible default first and marked "(Recommended)", free text comes for free through
"Other" (chips render in the Claude Code app; elsewhere, Slack for instance, the same question falls back to
text). Ask only what you cannot find out yourself:
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

Every request gets this preview before anything else: a new page, and every change to an existing one, even a
single word. What the person sees is always the published HTML artifact, never screenshots, images or a
description in words.

Build (do not narrate this). The tooling does the checking; follow the recipe literally:
1. Freshness: skip when this session has not touched `src/`. Otherwise `pnpm ds:index --check`; if it fails,
   run `publish-design-system` first.
2. Read `src/components/blocks/catalogue.ts`: the block names, their props and defaults (the `defaults` of
   each entry are a working example of its props). For an existing page start from its `index.mdx` and change
   only what was asked. A section nothing fits becomes a **proposed block** (prefer a new prop on an existing
   block over a new block).
3. Images: copy every picture the page needs into `mockups/<slug>/img/` (from the user, from
   `src/assets/images/home/` as a stand-in, or downloaded from the live site, never linked). A real block
   takes a picture as the string `"img/<file>"` in `data-props`; `ds:review` turns it into the picture object
   with its real size. Porting from the live site: it blocks headless browsers, its WordPress API answers
   (`curl -A "Mozilla/5.0" "https://www.mysheetmusictranscriptions.com/wp-json/wp/v2/pages?slug=<slug>&_fields=title,content,yoast_head_json"`;
   files under `wp-content/uploads` download the same way).
4. Write `mockups/<slug>/sections.html` like `mockups/gift-card/sections.html` (the reference; read it):
   ```html
   <div style="width: 100%; background: #ffffff; color: #444444; font-family: 'Montserrat Variable', Montserrat, system-ui, sans-serif;">
     <div data-msmt="TopBar"></div>
     <div data-msmt="Header"></div>
     <div data-msmt="PageHero" data-props='{"title":"…","subtitle":"…"}'></div>
     <div data-msmt="MediaText" data-props='{"image":"img/photo.jpg","alt":"…","children":"Paragraph one.\n\n**Bold** paragraph two."}'></div>
     <section data-proposed="PieceList" data-props='{"pieces":[…]}' style="padding: 50px 16px;">…plain markup…</section>
     <div data-msmt="Footer"></div>
   </div>
   ```
   One `<div data-msmt="<Block>" data-props='{…}'></div>` per real block, in page order, `children` = prose
   as a string (blank line = new paragraph, `**bold**`). `data-props` is JSON in single quotes: write an
   apostrophe as `&#39;` and never a raw `'`. A proposed block is a `<section data-proposed="<Name>"
   data-props='{…}'>` whose props are what the block would take, drawn inside as fluid plain markup (flex-wrap,
   max-width 1140px, 16px side padding, real `<label>`/`<input>`/`<button>`, 4.5:1 text) with these token
   values: text #444444, primary #1a7f97, CTA fill #b8571c, orange rule #f49946, cream #f7eee7, peach #fdebdc,
   muted #6b6b6b, line #e5e5e5, radii 12px cards / 28px buttons / 20px fields, h2 32px/700, body 16px/1.7.
   No scripts, no `{{`, no external files.
5. `pnpm ds:review <slug> "<Page name>" [/path]` (later runs: `pnpm ds:review <slug>`; title and path are
   remembered in `mockups/<slug>/preview.json`). It checks the mockup (known blocks, readable props, images
   present, no external files, wrapper order) and fails with one line per problem: fix and rerun. It runs
   `pnpm ds:export` itself when needed. Its last lines are the exact Artifact publish parameters: call the
   Artifact tool with them as printed (replace the `description` placeholder with one real sentence; nothing
   else). After the first publish write the artifact URL into `mockups/<slug>/preview.json` as `"url"`: from
   then on the printed parameters update that same artifact (in a new session, `Artifact read` it once
   before publishing). Never a second artifact for the same page.
   Do not render or screenshot the preview locally: the local `page.html` is blank by design (bundle and
   images only join it in the published artifact). Publishing is the check. If the publish is refused,
   fix the cause and publish again; never drop files from the parameters. A design-system file the artifact
   lacks means running `publish-design-system` first.

Talk: the link; one short paragraph of what the page shows, top to bottom, in everyday words; what you
assumed; what is still a placeholder and what you need. Explain commenting in one sentence: Desktop/Tablet/
Phone switch at the top; press **Comment**, click any section, write, press Done (or use the comment tool in
the top right); "Block labels" is for the technical view only. Ask them to tell you here when they are done
(comments do not reach you on their own; read them with the `ArtifactComments` tool when they say so). The
preview is private until they share it. Iterate: edit `sections.html`, rerun `pnpm ds:review <slug>`,
republish with the printed parameters, summarise the change. When they say it is right, ask exactly one
AskUserQuestion: "Shall I publish this to the live site?" (options: "Yes, publish" / "Not yet, more changes"),
naming the site and the address in the question. Only a yes starts Phase 3. Never publish unasked.

## Phase 3 · Build and publish (after an explicit yes)

Tell them it takes a few minutes and that they will get a second link, the real page on a test address,
before anything goes live. Keep the rest out of the conversation.
1. **Build the page from the approved preview.** Each `data-msmt` element → one MDX block with exactly its
   `data-props` (`children` → MDX prose; `"img/<file>"` → the file copied into the page folder and imported
   with `?w=…&as=picture`; `PageHero` → the template's hero in frontmatter when the template renders one).
   `mockups/gift-card/sections.html` ↔ `src/content/en/pages/gift-card/index.mdx` is the worked example. Each `data-proposed` element → build it first: component (+ typed props with doc comments),
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
4. **All checks green before pushing:** `pnpm release-check` (lint, types, unit, Storybook axe, build, SEO
   suite), plus `pnpm test:e2e` when layout changed. Fix failures, never lower a threshold. A page that cannot
   pass is not pushed: go back to the user with what is missing, in plain words.
5. **Draft PR with the real page.** Branch `page/<slug>` from `origin/main`; commit the page folder,
   `mockups/<slug>/` (incl. `preview.json`) and any block work ("Add /<slug> (EN)"); push; open a **draft** PR (title "Add /<slug>",
   body: the preview artifact link, what the page contains in plain words, new blocks if any); subscribe to it.
   Netlify posts the deploy preview within a few minutes: wait for its comment (or poll
   `https://deploy-preview-<n>--msmt-web.netlify.app/<locale><path>`, e.g. `/en/gift-card`, `/es/precios`: previews serve every locale under its prefix until it answers 200), check that page against
   the approved preview section by section, then give the user that link and ask with AskUserQuestion:
   "This is the real page on a test address. Does it look right?" (options: "Yes, put it live" / "Something
   to change"). The link is a clickable markdown link straight to the page
   (`[Open the boom boxes page](https://deploy-preview-12--msmt-web.netlify.app/en/boom-boxes)`), never the
   preview's home page or the PR. It arrives minutes after they last heard from you, so also send it as a push
   notification (`PushNotification`, when available) in case they stepped away. Changes they ask for now go
   through the same loop: edit, checks, push, and when Netlify's comment shows the new commit ready, the
   link again the same way, saying what changed.
6. **Publish on their acceptance.** Mark the PR ready for review and enable **auto-merge (squash)** with the
   GitHub tools (`update_pull_request` draft=false, `enable_pr_auto_merge` SQUASH). From here on auto-fix:
   stay subscribed, and on every CI failure or review-bot finding fix the root cause and push until the PR
   merges (never skip a test or lower a threshold); if auto-merge is refused, say so: the repository needs
   "Allow auto-merge" and a branch protection rule on `main` requiring the CI checks, and merge manually once
   CI is green only if the user asks.
7. **Confirm.** When the PR merges, Netlify deploys `main`: poll the live URL until the new page answers 200
   with its title (up to ~5 minutes), then tell the user it is live with a clickable link to the live page,
   in the conversation and as a push notification. If the production
   deploy or CI on main fails afterwards, say so, fix forward, and report.
