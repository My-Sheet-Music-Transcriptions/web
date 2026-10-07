---
name: mockup
description: Draft a clickable, commentable mockup of a new or changed page on a Design canvas artifact that renders this site's real blocks from the published Design System artifact, before any code is written. Use when the user asks for a new page, landing page, section or redesign; iterate on the same canvas until they approve, then hand over to new-page.
---

# Mockup a page on the Design canvas

The mockup is built from the published Design System artifact (`src/design-system/artifact.json`): the canvas
loads the site's real components (`window.MSMT`, see the artifact's README) so what the user approves is
exactly what `new-page` writes as MDX, one block per section.

1. **Freshness.** If `src/styles/theme.css`, a block, `catalogue.ts`, a layout component or a brand asset changed
   after `artifact.json#publishedFrom`, run `publish-design-system` first.
2. **Brief → block list.** Read `src/components/blocks/catalogue.ts` (same data as the artifact's component
   cards): description, defaults, `mdx`, data source, guidelines. Put the page together as an ordered list of
   blocks with props from the catalogue only. A section nothing fits becomes a **proposed block**: give it a
   name and props as if it existed, render it as plain markup styled with token values from
   `dist/design-system/project/tokens.json` (or the artifact's `tokens.json`), and say so in the reply. Prefer
   a prop on an existing block over a new block.
3. **Copy and data.** Real copy from the user or the live page (`legacyOrigin` in `src/i18n/sites/en.ts`);
   unknown facts are `[PLACEHOLDER]`, never invented. Prices, counts, ratings, reviews, nav items come from
   `src/content/<locale>/data/*.ts`; quote them, never retype variants.
4. **Canvas.** Once per page: Artifact `quickstart` with intent `design`, then create a canvas from the Design
   type with title "<Page name> page" (never pass `type_url` again). Follow the type's instructions for the
   files, with these choices:
   - Install the design system in the first publish: server-side copies
     (`{"artifact": "<artifact url>", "path": "project/<file>"}`) of `tokens.json`,
     `components/bundle.js`, `components/bundle.css`, `components/fonts.css`, every `components/assets/*.webp`
     and every `fonts/*.woff2` into `project/ds/msmt/<same path>` (list the artifact's files with
     `scope: "files"` to get the hashed asset names), plus the `designSystems` record
     `{ title: "My Sheet Music Transcriptions", namespace: "msmt", artifact: <url>, version: <id>, copiedAt }`.
     The bundle resolves its images next to `bundle.js`, so the assets folder must travel with it.
   - Two PAGE artboards: `Main.dc.html` (desktop, `w` 1440) and `Mobile.dc.html` (`w` 390), both
     `"expand": "fill"`, `h` generous (over-tall beats clipped), 80px apart. Same body in both files.
   - `<head>`: after the `support.js` line, `<link rel="stylesheet" href="ds/msmt/components/fonts.css">`,
     `<link rel="stylesheet" href="ds/msmt/components/bundle.css">`, `<script src="ds/msmt/components/bundle.js"></script>`.
   - Body, inside `<x-dc>`: `<div data-msmt="TopBar"></div>`, `<div data-msmt="Header"></div>`, then one
     `<div data-msmt="<Block>" data-props='{…}'></div>` per section (props = catalogue props; `children` is a
     light-markdown string; apostrophes as `&#39;`), proposed blocks as
     `<section data-proposed="<Name>" data-props='{…}'>…plain markup…</section>`, and
     `<div data-msmt="Footer"></div>` last. The logic class mounts them:
     `componentDidMount() { if (window.MSMT) window.MSMT.renderAll() }`; `renderVals()` returns `{}`.
     No tweaks unless a real lever exists (a variant enum); copy stays literal in `data-props`.
   - One sticky `notes` entry per artboard row (`y` above the frames) listing the sections in order as
     `BlockName prop=value` and marking proposed blocks; this is what the user reads, the `data-msmt`
     attributes are what `new-page` reads.
5. **Reply** with the canvas link, the block list with props, proposed blocks, assumptions and the
   placeholders still open. Say that the canvas is private until shared. Do not verify the canvas in a browser.
6. **Feedback.** Edit the same artboard files (both widths), republish only the changed files; a comment on the
   canvas addressed to Claude arrives here, treat it like a chat message. Never start a second canvas for the
   same page.
7. **Approval** → run `new-page` with the canvas URL: it maps the `data-msmt` sections to MDX in order and
   builds proposed blocks properly (component + story + catalogue entry + README + `publish-design-system`).
