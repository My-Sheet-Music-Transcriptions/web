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

- **The artifact follows `main`.** The usual publish happens on `main`, after a merge: the "Design System
  artifact" routine (a Claude routine GitHub starts on every merge to `main`) runs `pnpm ds:index --check`
  and publishes when it fails, and the `page` skill does the same before a preview. A PR that changes design-system sources
  does **not** have to republish: no test fails on it. Publish from a branch only when a preview on that
  branch needs the branch's blocks (a proposed block); it is safe, see the next point.
- **Previews pin a version.** `artifact.json#publishedVersion` is the artifact version the last publish
  created; `ds:review` and `ds:canvas` copy the design-system files from that exact version (`ver`), so a
  later publish from another branch, or from `main`, never changes what an existing preview renders.
- **The record is the export hash, not a commit.** `artifact.json#exportHash` is the hash of the export
  output (`exportHash()` in `scripts/design-system/lib.ts`, timestamps left out); `pnpm ds:index --check`
  exports and compares. `publishedFrom` is informational only: a branch commit disappears when its PR is
  squash-merged, so never look it up or try to find "the branch it was published from".
- **On `main` the last record wins.** Merges seconds apart start routine runs side by side, so two
  publishes can race. The record goes to `main` by a direct push, no PR (`pnpm ds:push`): when `main` moved,
  it puts this record on top of the new `main`, replacing the record there. Both are real publishes of the
  same sources, so either is a valid pin. When `main` also moved by other files, it runs the check again on
  the new `main` first and pushes nothing if the export no longer matches (exit 3: publish again).
- **Conflicts in `artifact.json`** on a branch: take either side, run `pnpm ds:index --check`, and republish
  if it fails. Both sides are real publishes; the check decides.

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
   must say "in sync". Then record it:
   - **on `main`:** `pnpm ds:push` (add `--trailer "<Key>: <value>"` per attribution line). It commits
     `artifact.json` alone and pushes it straight to `main`: no branch, no PR. Exit 0: it is on `main`, or
     `main` already had it. Exit 3: `main` moved past this publish; check out the new `main`
     (`git fetch origin main && git checkout --force --detach origin/main`) and start again at step 1.
     A refusal naming the branch rule means the identity pushing may not bypass the rule on `main`: say so
     and stop, never open a PR instead.
   - **on a branch:** commit it with the change that motivated the publish.

   Tell the user the artifact URL and what changed; the artifact is private until they share it.

Format rules the export already enforces (keep them when editing the export): `bundle.js` is one classic
script assigning `window.MSMT`, line 1 the `@ds-bundle` header, no `</script` or `<!--` inside; previews are
`<!-- @dsCard group=".." height=N -->` + a `data-msmt` root + the mount script; `tokens.json` families are
lists of `{name, value, usage}`; the cover (`components/Cover/preview.html`, from `src/design-system/export/
cover.html`) is a bare folder; asset groups keep a README. If the artifact refuses a publish, read the refusal
and fix the export, not the output.
