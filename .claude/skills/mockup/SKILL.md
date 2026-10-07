---
name: mockup
description: Default first step for any new page, landing page, section or page change. Builds an HTML mockup rendered with the site's real design-system components, publishes it as a commentable artifact (desktop/tablet/phone switch, block labels, per-section Comment buttons), and iterates on it until the user approves. Then hand over to new-page.
---

# Mockup a page as an HTML review artifact

The user asks for a page in chat and gets a link to a page that looks like the real thing. They comment on
sections; we edit and republish the same artifact; on approval `new-page` builds it. No design tool, no free-form
editing: what they approve is a list of blocks with props, so it can be built exactly.

1. **Freshness.** If `src/styles/theme.css`, a block, `catalogue.ts`, a layout component or a brand asset changed
   after `src/design-system/artifact.json#publishedFrom`, run `publish-design-system` first; the review page
   loads the components from the published artifact.
2. **Brief → block list.** Read `src/components/blocks/catalogue.ts` (description, defaults, `mdx`, data source,
   guidelines). Compose the page as an ordered list of blocks with catalogue props only. A section nothing fits
   becomes a **proposed block** (or a proposed prop on an existing block): give it a name and props as if it
   existed and draw it as plain markup with token values from `dist/design-system/project/tokens.json`
   (`pnpm ds:export` writes it). Prefer a prop on an existing block over a new block.
3. **Copy and data.** Real copy from the user or the live page. The live site blocks headless browsers; its
   WordPress API answers: `curl -A "Mozilla/5.0" "https://www.mysheetmusictranscriptions.com/wp-json/wp/v2/pages?slug=<slug>&_fields=title,content,yoast_head_json"`
   (images under `wp-content/uploads` download the same way). Unknown facts are `[PLACEHOLDER]`, never
   invented; prices, counts, ratings, reviews and nav come from `src/content/<locale>/data/*.ts`. Say in the
   reply which lines you derived rather than copied.
4. **Write `mockups/<slug>/sections.html`** (images in `mockups/<slug>/img/`, referenced as `img/<file>`):
   - a root `<div style="width: 100%; background: #ffffff; color: #444444; font-family: 'Montserrat Variable', Montserrat, system-ui, sans-serif;">`
   - `<div data-msmt="TopBar"></div>`, `<div data-msmt="Header"></div>`, then one
     `<div data-msmt="<Block>" data-props='{…}'></div>` per real block (props exactly as the catalogue;
     `children` is a light-markdown string; apostrophes inside `data-props` as `&#39;`), proposed blocks as
     `<section data-proposed="<Name>" data-props='{…}'>…plain markup…</section>`, and
     `<div data-msmt="Footer"></div>` last. Plain markup must be fluid (flex-wrap, max-width 1140px, 16px side
     padding) so the phone width works, with real `<label>`/`<input>`/`<button>` elements and 4.5:1 text.
   - no scripts, no `{{`, no external resources.
5. **Build and publish.** `pnpm ds:review <slug> "<Page name> page"` writes
   `dist/design-system/review/<slug>/{index.html,page.html,files.json}`. Publish with the Artifact tool:
   `file_path` = the absolute path of that `index.html`, `files` = the contents of `files.json` (page, images,
   and the bundle/assets/fonts copied server-side from the Design System artifact), `icon: "page"`,
   `capabilities: {"comments": {"composer_only": true}}`, a one-sentence `description`. Republish the same
   `file_path` (or `url`) on every iteration; never create a second artifact for the same page.
6. **Reply** with the link, the block list with props, proposed blocks, assumptions and open placeholders. The
   artifact is private until shared. Do not open it in a browser to verify.
7. **Feedback.** Comments on the artifact reach you only when the user says so or you read them with the
   `ArtifactComments` tool (wake subscriptions are not available in this environment); ask the user to ping you
   after commenting. Edit `sections.html`, rerun `pnpm ds:review`, republish. Keep `mockups/<slug>/` in the
   page's PR: it is the approved source.
8. **Approval** → run `new-page` with the slug.
