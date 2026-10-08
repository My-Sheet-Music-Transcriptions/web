---
name: status
description: Where every page is right now, in plain words — preview to comment on, real page waiting for your check on a test address, publishing, or live with its link. Use for "is my page live?", "what is pending?", "¿cómo va la página?", "com va la pàgina?".
argument-hint: "[page title]"
---

Invoke the `page` skill with the Skill tool (`page`) and run it in mode **status**.

Request as typed: $ARGUMENTS

1. `pnpm page:status [slug]`: one JSON line per page with a mockup (title, path, preview and canvas URLs,
   recorded PR, whether the page exists in `src/content`, live URL).
2. For each recorded PR, read its state with the GitHub tools (`pull_request_read`): draft (waiting for
   the person's check of the test address), ready/auto-merge (publishing), merged (live), closed. Netlify's
   deploy-preview comment gives the test-address link.
3. Answer as one short table in the person's language, one row per page: Page · Where it is · Link
   (preview, canvas, test address or live page, as a clickable link) · What you need from them, if anything.
   No PR numbers, branches or file paths; "nothing in progress" when there is nothing.
