---
name: page-request
description: The default way to handle any request about the website's pages from any user, technical or not — a new page, a landing page, a translation, a change of text, images, prices or sections on an existing page, in any of the site's languages. Runs a short, plain-language conversation, then shows a preview artifact rendered with the real site components that the user can comment on, and iterates until they say it is right. Publishing is a separate step (publish-page) that only happens when the user asks for it.
---

# Page request: from a chat message to an approved preview

The person asking may be a colleague who never sees code. Talk about the page, never about blocks, MDX,
props, branches or PRs. Everything technical happens behind the preview.

## 1. Understand the request (at most a few questions, in one message)

Ask only what you cannot find out yourself, in plain words, and offer sensible defaults:
- **Which page and which site/language?** An existing page (name or URL) or a new one; which of the sites
  (English, Spanish, French, German, Japanese, Catalan). A language whose site is not built yet
  (only `src/content/<locale>` folders with content count): say so and offer the English site or a note
  to plan it.
- **What should it achieve?** Who reads it and what they should do next (ask for a quote, buy a gift card, …).
- **What goes on it?** The text they already have, facts and numbers, pictures (they can paste or attach
  them), and anything that must not change. Missing copy is shown as `[PLACEHOLDER]` in the preview, never
  invented; prices, counts, ratings and reviews come only from `src/content/<locale>/data/*.ts`.
- **For a change to an existing page:** what exactly to change; everything else stays as it is.
If the message already answers these, do not ask: say what you assumed and go straight to the preview.

## 2. Build the preview (technical part, do not narrate it)

1. Freshness: if `src/styles/theme.css`, a block, `catalogue.ts`, a layout component or a brand asset
   changed after `src/design-system/artifact.json#publishedFrom`, run `publish-design-system` first.
2. Read `src/components/blocks/catalogue.ts` (descriptions, defaults, `mdx`, data sources, guidelines).
   For an existing page start from its `index.mdx` and only change what was asked. Compose the page as an
   ordered list of blocks with catalogue props. A section nothing fits becomes a **proposed block** (or a
   proposed prop on an existing block): name it and its props as if it existed and draw it as fluid plain
   markup with token values from `dist/design-system/project/tokens.json`. Prefer a prop over a new block.
3. Copy from the live site when porting: the live site blocks headless browsers but its WordPress API
   answers (`curl -A "Mozilla/5.0" "https://www.mysheetmusictranscriptions.com/wp-json/wp/v2/pages?slug=<slug>&_fields=title,content,yoast_head_json"`;
   files under `wp-content/uploads` download the same way). Images are downloaded into the repo, never linked.
4. Write `mockups/<slug>/sections.html` (images in `mockups/<slug>/img/`, referenced as `img/<file>`):
   a root `<div style="width: 100%; background: #ffffff; color: #444444; font-family: 'Montserrat Variable', Montserrat, system-ui, sans-serif;">`,
   `<div data-msmt="TopBar"></div>`, `<div data-msmt="Header"></div>`, one
   `<div data-msmt="<Block>" data-props='{…}'></div>` per real block (`children` is a light-markdown string;
   apostrophes inside `data-props` as `&#39;`), proposed blocks as
   `<section data-proposed="<Name>" data-props='{…}'>…</section>`, `<div data-msmt="Footer"></div>` last.
   Plain markup: flex-wrap, max-width 1140px, 16px side padding, real `<label>`/`<input>`/`<button>`,
   4.5:1 text. No scripts, no `{{`, no external URLs.
5. `pnpm ds:review <slug> "<Page name>"` → `dist/design-system/review/<slug>/{index.html,page.html,files.json}`.
   Publish with the Artifact tool: `file_path` = that `index.html` (absolute), `files` = the contents of
   `files.json`, `icon: "page"`, `capabilities: {"comments": {"composer_only": true}}`, one-sentence
   `description`. Republish the same artifact on every iteration; never a second one for the same page.

## 3. Talk about it

Reply in the user's language with: the link; one short paragraph of what the page shows, top to bottom,
in everyday words; what you assumed; what is still a placeholder and what you need from them. Explain
how to comment: switch Desktop/Phone at the top, hover a section and press Comment, or use the comment
tool top right; then tell you here when they are done (comments do not reach you on their own: read them
with the `ArtifactComments` tool when they say so). The preview is private until they share it.

Iterate: change `sections.html`, rerun `pnpm ds:review`, republish, summarise what changed. Keep going
until they say it is right. Then ask one question: "Shall I publish this to the live site?" (name the site
and the address it will have). Only a yes starts `publish-page`; never publish on your own.
