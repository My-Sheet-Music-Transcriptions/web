---
name: publish-design-system
description: Rebuild the design-system export (tokens, brand book, live component bundle, previews, assets) from the repo and publish it to the Design System artifact that page previews are built from. Use when `pnpm ds:index --check` fails (the artifact is behind the repo), after changing src/styles/theme.css, a block, the catalogue, layout components or brand assets, and before a preview that needs a proposed block.
---

# Publish the Design System artifact

The artifact (URL in `src/design-system/artifact.json`) is generated, never edited by hand: `pnpm ds:export`
turns `src/styles/theme.css`, `src/components/blocks/*` + `catalogue.ts`, the layout components and
`src/assets/images/{brand,icons,logos,flags}` into `dist/design-system/project/**` (the artifact's files) and
`dist/design-system/manifest.json` (what to upload).

How it stays in sync, so you know what the steps below are for:

- **The artifact follows `main`.** The usual publish happens on `main`, after a merge: the scheduled
  "Design System artifact" routine runs `pnpm ds:index --check` every few hours and publishes when it
  fails, and the `page` skill does the same before a preview. A PR that changes design-system sources
  does **not** have to republish: no test fails on it. Publish from a branch only when a preview on that
  branch needs the branch's blocks (a proposed block); it is safe, see the next point.
- **Previews pin a version.** `artifact.json#publishedVersion` is the artifact version the last publish
  created; `ds:review` and `ds:canvas` copy the design-system files from that exact version (`ver`), so a
  later publish from another branch, or from `main`, never changes what an existing preview renders.
- **The record is the export hash, not a commit.** `artifact.json#exportHash` is the hash of the export
  output (`exportHash()` in `scripts/design-system/lib.ts`, timestamps left out); `pnpm ds:index --check`
  exports and compares. `publishedFrom` is informational only: a branch commit disappears when its PR is
  squash-merged, so never look it up or try to find "the branch it was published from".
- **Conflicts in `artifact.json`** between two publishes: take either side, run `pnpm ds:index --check`,
  and republish if it fails. Both sides are real publishes; the check decides.

1. `pnpm check && pnpm ds:export "<one-line note for lastChange>"`. Read the summary line: files, uploads,
   pending uploads, bundle size (expect ~560 KB; investigate a jump).
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
   `{ from, contentType: "text/plain" }`. Send the whole `project/` tree: previews pin the version this
   publish creates, so every file must be in it. Never pass `type_url` again (that creates a second artifact)
   and never touch `index.html`, `SKILL.md` or `artifact-type/`. Then verify: list the artifact's files
   (`action: "list"`, `scope: "files"`); the first line prints the new **version id** (e.g.
   `1791471138-a631`), and every `manifest.files` path must be there as `project/<path>`; send any missing
   one and list again before step 5. Page previews copy the bundle's images from the artifact by name, so a
   missing file makes every `ds:review` publish fail.
5. `pnpm ds:index --published --version <version id from the listing>`: records the version, the export
   hash, the commit and the time in `src/design-system/artifact.json`. Then `pnpm ds:index --check --no-export`
   must say "in sync". Commit `artifact.json` (on `main`: as its own PR, "Record Design System publish";
   `artifact.json` is a content path, so it merges on green CI without a core approval; on a branch: with the
   change that motivated the publish). Tell the user the artifact URL and what changed; the artifact is
   private until they share it.

Format rules the export already enforces (keep them when editing the export): `bundle.js` is one classic
script assigning `window.MSMT`, line 1 the `@ds-bundle` header, no `</script` or `<!--` inside; previews are
`<!-- @dsCard group=".." height=N -->` + a `data-msmt` root + the mount script; `tokens.json` families are
lists of `{name, value, usage}`; the cover (`components/Cover/preview.html`, from `src/design-system/export/
cover.html`) is a bare folder; asset groups keep a README. If the artifact refuses a publish, read the refusal
and fix the export, not the output.
