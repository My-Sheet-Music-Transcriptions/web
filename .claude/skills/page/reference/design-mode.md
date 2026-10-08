# Design mode: the Design canvas

Only when the person asks for design (design/diseño/disseny, mockup/maqueta, look, layout, options, or
`/design`). The canvas shows the same mockup as the HTML preview, but as artboards people can work on:
a desktop (1440) and a phone (390) artboard per option, side by side, the real blocks rendered live by the
design system installed on the canvas, and an orange sticky listing the sections. People can move things,
retype text in hand-drawn sections, add their own notes and comments, and compare options.

What it cannot do, said plainly to the person when you hand over the link: the real site blocks (header,
footer, forms, cards…) render live but their words change by asking you, not by typing on the canvas;
hand-drawn sections (proposed blocks) are fully editable. The canvas is private until they share it.

## Publishing the canvas

1. Write `mockups/<slug>/sections.html` exactly as in `preview.md`. Each option to compare is an extra
   `mockups/<slug>/sections.<variant>.html` (`sections.warm.html`, `sections.compact.html`…): same format,
   a short lowercase name.
2. `pnpm ds:canvas <slug> "<Page name>"` (later runs: `pnpm ds:canvas <slug>`). It checks every sections
   file like `ds:review`, writes the canvas files under `dist/design-system/canvas/<slug>/` and prints the
   Artifact calls:
   - **No canvas yet**: call 1 creates it from the Design type (`type_url` + `title`, nothing else; pass it
     as printed). Write the returned URL into `mockups/<slug>/preview.json` as `canvas.url`, rerun
     `pnpm ds:canvas <slug>`, then make call 2 with the printed parameters (replace only the `description`
     placeholder). The design system is installed on the canvas by the server copying its files from the
     Design System artifact (the `project/ds/msmt/…` entries): never fetch or re-upload them.
   - **Canvas exists**: `Artifact read` its `project/canvas.json` (people may have moved or renamed
     artboards) and run `pnpm ds:canvas <slug> --canvas <the downloaded canvas.json>`; publish the one
     printed call. The script keeps their positions, names, extra boards and notes and refreshes only the
     artboards' content, the sticky's text and the design-system record.
3. Talk: the link; what is on the canvas (one or several options, desktop and phone each, the sticky with
   the sections); how to use it in one or two sentences (click a hand-drawn section to change its text or
   colours; the comment tool; the real site blocks change by asking); ask them to say when they are done or
   which option they prefer.

## Pulling the design back

When they say done (or name the option they chose):
1. `Artifact read` the chosen artboard: `project/Main.dc.html`, or `project/<Variant>.dc.html` for an
   option (the phone artboard is a view of the same sections; pull the desktop one).
2. `pnpm ds:canvas <slug> --pull <the downloaded .dc.html>`: it rewrites `mockups/<slug>/sections.html`
   from the artboard and runs the checks. It warns about text typed inside a real block (dropped: make that
   change through the block's props and tell the person), and about pictures uploaded on the canvas it
   cannot name (`/_blob/<id>`): `Artifact read` the id as `path`, save the file into `mockups/<slug>/img/`,
   add `"<id>": "<file>"` to `canvas.uploads` in `preview.json`, pull again.
3. Delete the `sections.<variant>.html` files that were not chosen. Summarise in two or three lines what
   the pulled design changed compared with the previous version.
4. Continue as in Phase 2 step 5 of the skill: the publish question, then Phase 3 builds from
   `sections.html` exactly as for the HTML preview. The canvas stays as the record of the design
   (`preview.json` → `canvas`); republish it after later changes so it never shows something older than
   the page.

## The canvas's shapes (fixed by the Design type; the script writes them)

`project/canvas.json` v3 (boards with `x, y, w, h, title, expand: "fill"`, `order`, `notes`, the
`designSystems` record for namespace `msmt`); one `.dc.html` per artboard with the `support.js` line, the
design system's `fonts.css`, `bundle.css`, `bundle.js` from `ds/msmt/components/`, `<x-dc><helmet>…</helmet>`
+ the sections wrapper + `</x-dc>`, and the `text/x-dc` script that mounts the blocks. Never edit these by
hand; change `sections.html` and rerun the script.
