# The mockup and the HTML preview

`mockups/<slug>/sections.html` is the page as a list of sections, each a real block of the design system or a
proposed one. `pnpm ds:review` checks it, renders it with the real components and prints the Artifact
publish parameters. `mockups/gift-card/sections.html` ↔ `src/content/en/pages/gift-card/index.mdx` is the
worked example: read it before writing a mockup.

## Writing sections.html

1. Run `pnpm ds:blocks` (or `pnpm ds:blocks MediaText Steps` for a few): per block, what it is for, every
   prop with its type, allowed values and doc comment, a ready `<div data-msmt=…>` line to copy and adapt,
   where its data lives and its guidelines. It is read from the block sources, so it is never stale: do not
   open the components or `catalogue.ts` yourself. `ds:review` rejects an unknown prop, a missing required
   one and a value outside the allowed ones, naming the alternatives. For an existing page run
   `pnpm ds:mockup <slug>` instead of writing from scratch (`edit.md`). A section nothing fits becomes a
   **proposed block** (prefer a new prop on an existing block over a new block).
2. Pictures: copy every picture the page needs into `mockups/<slug>/img/` (from the person, from
   `src/assets/images/home/` as a stand-in, or downloaded from the live site, never linked). Researching
   content means downloading its pictures too: a picture you found goes into `img/` and onto the preview,
   not into a placeholder or a description. One from outside our own sites gets a line in your summary
   (where it came from, rights to confirm before publishing). A real block
   takes a picture as the string `"img/<file>"` in its props; the script turns it into the picture object
   with its real size. Porting from the live site: `wordpress.md`.
3. The file, like the example:
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
   One `<div data-msmt="<Block>" data-props='{…}'></div>` per real block, in page order; `children` is the
   prose as one string (blank line = new paragraph, `**bold**`). `data-props` is JSON in single quotes: write
   an apostrophe as `&#39;`, never a raw `'`. TopBar and Header first, Footer last; ContactSection last of
   the content blocks when present.
4. A proposed block is `<section data-proposed="<Name>" data-props='{…}'>` whose props are what the block
   would take, drawn inside as fluid plain markup (flex-wrap, max-width 1140px, 16px side padding, real
   `<label>`/`<input>`/`<button>`, 4.5:1 text) with the token values: text #444444, primary #1a7f97, CTA fill
   #b8571c, orange rule #f49946, cream #f7eee7, peach #fdebdc, muted #6b6b6b, line #e5e5e5, radii 12px cards /
   28px buttons / 20px fields, h2 32px/700, body 16px/1.7. No scripts, no `{{`, no external files.
5. Options to compare side by side (design mode only) are extra files `mockups/<slug>/sections.<variant>.html`
   in the same format; the HTML preview shows only `sections.html`.

## Publishing the preview

`pnpm ds:review <slug> "<Page name>" [/path]` (later runs: `pnpm ds:review <slug>`; title and path are
remembered in `mockups/<slug>/preview.json`). It fails with one line per problem (unknown block, unreadable
props, unknown or missing prop, value not allowed, missing picture, external file, wrapper order): fix
every line and rerun. It runs `pnpm ds:export` itself when
needed. Its last line is the exact Artifact publish parameters: call the Artifact tool with them as printed,
replacing only the `description` placeholder with one real sentence. After the first publish write the
artifact URL into `preview.json` as `"url"`: from then on the printed parameters update that same artifact
(in a new session, `Artifact read` it once before publishing).

Do not render or screenshot the preview locally: the local `page.html` is blank by design (bundle and
pictures only join it in the published artifact). Publishing is the check. If the publish is refused, fix
the cause and publish again; never drop files from the parameters. A design-system file the artifact lacks
means running the `publish-design-system` skill first.

## Talking about it

The link; one short paragraph of what the page shows, top to bottom, in everyday words; what you assumed;
what is still a placeholder and what you need. Commenting, in one sentence: Desktop/Tablet/Phone switch at
the top; commenting is on from the start: click any section and write (turn **Comment** off to click links inside the
page, or use the comment tool in the top right);
"Block labels" is for the technical view only. The preview is private until they share it. Ask them to tell
you here when they are done; then read the comments with the `ArtifactComments` tool.

Iterate: edit `sections.html`, rerun `pnpm ds:review <slug>`, republish with the printed parameters,
summarise what changed in two or three lines.
