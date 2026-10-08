---
name: page
description: Handles any request about the website's pages from anyone, technical or not — a new page or landing page, a change of text, pictures, prices or sections, a translation, a design exploration, "is my page live yet" — in any of the site's languages. One conversation in three phases — understand the request in plain words, show a preview rendered with the real site components (an HTML preview, or a Design canvas when design is asked for) that the user can comment on and iterate until it is right, then (only when they say yes) build it on a draft PR, let them check Netlify's deploy preview of the real page, and on their acceptance mark the PR ready with auto-merge and drive it to green until it is live. The slash commands /new-page, /edit-page, /translate, /design, /publish, /status and /site-help are entry points into this skill.
---

# Page: request → preview → build → check the real thing → publish

The person asking may be a colleague who never sees code. Talk about the page, never about blocks, MDX,
props, branches, commits or scripts. Everything technical happens behind the preview. Reply in their
language (English, Spanish, Catalan, French, German or Japanese: whatever they wrote in).

## How to talk

- Ask with **AskUserQuestion** so answers are clickable: one call, at most four questions, two to four
  options each, the sensible default first and marked "(Recommended)"; free text comes for free through
  "Other" (chips render in the Claude Code app; elsewhere the same question falls back to text).
- Never invent copy: missing text shows as `[PLACEHOLDER]` in the preview and you say what you still need.
  Prices, counts, ratings, phone numbers and reviews come only from `src/content/<locale>/data/*.ts`.
- Research on the web through a real browser when the session has one (Claude in Chrome or the Claude app's
  browser), and download the pictures you find into the mockup rather than describing or linking them:
  `reference/wordpress.md` has the source order and the download fallbacks.
- Links you hand over are clickable markdown links straight to the thing (the preview, the page on the test
  address, the live page), never a home page or a PR. A link that arrives minutes after they last heard from
  you also goes out as a push notification (`PushNotification`, when available).
- Every request gets a preview the person can click before anything is built, even a single changed word.
  What they see is always a published artifact, never a screenshot, image or description in words.
- One preview artifact per page, updated in place; one canvas per page. Never a second one for the same page.
- Never publish unasked, never lower a quality threshold, nothing reaches `main` before the person has
  seen the real page on the test address.

## Modes

The request (or the slash command that invoked this skill) picks the mode; everything else is the same path.

| Mode | When | What is different |
| --- | --- | --- |
| **new** | a page that does not exist yet; a live-site URL means "bring this page over" | `reference/preview.md`, porting copy with `reference/wordpress.md` |
| **edit** | a change to an existing page: text, a picture, a price, a section | start from the real page: `reference/edit.md` |
| **translate** | the same page in another of the site's languages | `reference/translate.md` |
| **design** | only when they ask for design: words like design/diseño/disseny, mockup/maqueta, look, layout, "show me options/variants", or `/design` | the preview is a Design canvas: `reference/design-mode.md`. A text, price or picture change is never design mode |
| **publish** | an approved preview that should go live (`/publish`) | skip to the publish question, then Phase 3 |
| **status** | "where is my page", "is it live" (`/status`) | `pnpm page:status` + the PR, as a plain table; no preview |

Every mode works on `mockups/<slug>/sections.html` (the mockup, the single source of truth of what was
approved) and `mockups/<slug>/preview.json` (title, path, locale, preview URL, canvas URL, PR). Resuming in a
new session starts by reading `preview.json`.

## Phase 1 · Understand (at most a few questions, in one message)

Ask only what you cannot find out yourself:
- **Which page, which site?** An existing page (name or URL) or a new one; which language site (English,
  Spanish, French, German, Japanese, Catalan). A language whose site has no content yet (`src/content/<locale>`
  missing or empty): say so and offer the English site or a translation (`reference/translate.md` says what
  that means today).
- **What should it achieve?** Who reads it and what they should do next (ask for a quote, buy a gift card…).
- **What goes on it?** Text they already have, facts and numbers, pictures (pasted or attached), anything
  that must not change.
- **For a change:** what exactly changes; everything else stays.
- **For design:** the whole page or one section; one proposal or a few options side by side.
If the message already answers these, do not ask: state your assumptions in one line and go to the preview.

## Phase 2 · Preview and iterate

Build the mockup without narrating it; the tooling checks it; follow the recipe literally. Everything you
need comes from `preview.json`, `pnpm ds:blocks` and the worked example: do not read component sources or run
exploratory commands (no `cat`/`grep`/`ls` probes chained with `;` or `&&`: a probe that exits non-zero shows
the person a red "Failed"). Run each recipe command on its own and let its error lines tell you what to fix.
0. **Setup**: the session hook installs dependencies in cloud sessions; if `node_modules` is still missing
   (`pnpm` reports `tsx: not found` or a missing package), run `pnpm install --frozen-lockfile` once.
1. **Freshness**: skip when this session has not touched `src/`. Otherwise `pnpm ds:index --check`; if it
   fails, run the `publish-design-system` skill first.
2. **The mockup**: write or regenerate `mockups/<slug>/sections.html` per `reference/preview.md`
   (edit mode: `reference/edit.md` generates it from the real page first; translate: `reference/translate.md`).
3. **The surface**:
   - default: `pnpm ds:review <slug> "<Page name>" [/path]` and publish the printed parameters with the
     Artifact tool → the HTML preview with Desktop/Tablet/Phone switch and per-section comments
     (`reference/preview.md`, "Publishing and talking").
   - design mode: `pnpm ds:canvas <slug>` → the Design canvas (`reference/design-mode.md`).
4. **Talk**: the link; one short paragraph of what the page shows top to bottom in everyday words; what you
   assumed; what is still a placeholder and what you need; how to comment, in one sentence; ask them to tell
   you here when they are done (comments do not reach you on their own: read them with `ArtifactComments`
   when they say so).
5. **Iterate** on the same artifact until they say it is right: edit the mockup, rerun the script, republish,
   summarise the change. Then ask exactly one AskUserQuestion: "Shall I publish this to the live site?"
   (options: "Yes, publish" / "Not yet, more changes"), naming the site and the address. Only a yes starts
   Phase 3.

## Phase 3 · Build, test page, publish, confirm (after an explicit yes)

Tell them it takes a few minutes and that they will get a second link, the real page on a test address,
before anything goes live. Keep the rest out of the conversation.
1. **Build** the page from the approved mockup: `reference/build.md` (page folder, pictures, frontmatter,
   data files, proposed blocks built for real, every check green). A page that cannot pass the checks is not
   pushed: go back to the person with what is missing, in plain words.
2. **Draft PR and the test address**: `reference/publish.md` steps 1–2. Hand them the deploy-preview link to
   the page itself and ask: "This is the real page on a test address. Does it look right?" (options: "Yes,
   put it live" / "Something to change"). Changes go through the same loop: edit, checks, push, link again.
3. **Publish on their acceptance**: `reference/publish.md` steps 3–4: mark the PR ready, auto-merge (squash),
   auto-fix until it merges, then poll the live URL and confirm with a clickable link to the live page.

## Resuming in a new session

Read `mockups/<slug>/preview.json` first. `url` → `Artifact read` it once before republishing; `canvas.url`
→ `Artifact read` its `project/canvas.json` and pass it to `pnpm ds:canvas <slug> --canvas <file>`; `pr` →
look the PR up with the GitHub tools and continue from the state it is in (draft waiting for the person,
ready and auto-merging, merged). `/status` shows all of this as a table.
