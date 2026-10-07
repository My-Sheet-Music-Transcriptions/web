---
name: publish-design-system
description: Rebuild the design-system export (tokens, brand book, live component bundle, previews, assets) from the repo and publish it to the Design System artifact that page previews are built from. Use after any change to src/styles/theme.css, a block, the catalogue, layout components or brand assets, and before a preview if the artifact is behind main.
---

# Publish the Design System artifact

The artifact (URL in `src/design-system/artifact.json`) is generated, never edited by hand: `pnpm ds:export`
turns `src/styles/theme.css`, `src/components/blocks/*` + `catalogue.ts`, the layout components and
`src/assets/images/{brand,icons,logos,flags}` into `dist/design-system/project/**` (the artifact's files) and
`dist/design-system/manifest.json` (what to upload).

1. `pnpm check && pnpm ds:export "<one-line note for lastChange>"`. Read the summary line: files, uploads,
   pending uploads, bundle size (expect ~460 KB; investigate a jump).
2. Eyeball at least one changed preview locally: `pnpm serve:dist --dir dist/design-system --port 4173`, open
   `http://localhost:4173/local/<Block>.html` (headless Chromium is fine: no console errors, images load).
3. Pending uploads (`manifest.pendingUploads`, new or changed logos/icons/flags): upload them with the Artifact
   tool (`publish`, `url`, `asset: true`, `file_paths` ≤ 25 per call). Record each result in
   `src/design-system/artifact.json` → `assets["<Group>/<file>"] = { blob, size, type, sha256 }` (sha256 from
   `manifest.uploads`), then `pnpm ds:index "<note>"` to rewrite the index with the ids. An unchanged asset is
   never re-uploaded.
4. Publish in ONE Artifact call: `url` from `artifact.json`, `root: "dist/design-system"`,
   `file_path: "<abs>/dist/design-system/project/design-system.json"`, `files`: every other path from
   `manifest.files` as `"project/<path>": "project/<path>"`; `components/index.d.ts` needs
   `{ from, contentType: "text/plain" }`. Only changed files strictly need sending, but sending the whole
   `project/` tree is simplest and idempotent. Never pass `type_url` again (that creates a second artifact)
   and never touch `index.html`, `SKILL.md` or `artifact-type/`. Then verify: list the artifact's files
   (`action: "list"`, `scope: "files"`) and check that every `manifest.files` path is there as `project/<path>`;
   send any missing one before step 5. Page previews copy the bundle's images from the artifact by name, so a
   missing file makes every `ds:review` publish fail.
5. `pnpm ds:index --published`: records the commit and the hash of every design-system source
   (`designSystemSources()` in `scripts/design-system/lib.ts`: theme, blocks, primitives, layout, catalogue,
   export, data, brand assets) in `src/design-system/artifact.json`. `tests/unit/design-system-sync.test.ts`
   fails `pnpm check` whenever those sources change without a republish, so Storybook (which renders the
   same files) and the artifact cannot drift. Commit `artifact.json` with the change that motivated the
   publish. Tell the user the artifact URL and what changed; the artifact is private until they share it.

Format rules the export already enforces (keep them when editing the export): `bundle.js` is one classic
script assigning `window.MSMT`, line 1 the `@ds-bundle` header, no `</script` or `<!--` inside; previews are
`<!-- @dsCard group=".." height=N -->` + a `data-msmt` root + the mount script; `tokens.json` families are
lists of `{name, value, usage}`; the cover (`components/Cover/preview.html`, from `src/design-system/export/
cover.html`) is a bare folder; asset groups keep a README. If the artifact refuses a publish, read the refusal
and fix the export, not the output.
