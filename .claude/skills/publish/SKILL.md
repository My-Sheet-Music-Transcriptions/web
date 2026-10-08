---
name: publish
description: Put an approved page preview on the live website: builds the real page, shows it on a test address for a final check, and on your yes publishes it and confirms the live link. Use when a preview is already right. Also for "publicar", "ponlo en la web", "publica-ho", "posa-ho a la web".
argument-hint: "<page title>"
disable-model-invocation: true
---

Invoke the `page` skill with the Skill tool (`page`) and run it in mode **publish**.

Request as typed: $ARGUMENTS

- Read `mockups/<slug>/preview.json`; if the page is already on a draft PR (`pr` recorded), continue from
  there (`reference/publish.md`); if a PR is already merged, say the page is live and give the link.
- Otherwise ask the one AskUserQuestion of Phase 2 step 5 ("Shall I publish this to the live site?") naming
  the site and address, and only on "Yes, publish" go through Phase 3 (`reference/build.md`,
  `reference/publish.md`): the test address first, the live site only after their second yes.
- No mockup for that page: say so and offer to start one (`/new-page` or `/edit-page`).
