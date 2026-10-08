# Draft PR, test address, publish, confirm

1. **Draft PR with the real page.** Branch `page/<slug>` from `origin/main` unless the session dictates a
   branch (cloud sessions do: use theirs). Commit the page folder, `mockups/<slug>/` (incl. `preview.json`)
   and any block work ("Add /<slug> (EN)", "Change /<slug>: …"); push; open a **draft** PR (title "Add
   /<slug>" or "Change /<slug>", body: the preview link, the canvas link when there is one, what the page
   contains or what changed in plain words, new blocks if any); subscribe to it (`subscribe_pr_activity`).
   Record the PR in `preview.json` as `pr: { number, url, branch }` and push that too, so `/status` and a
   new session find it.
2. **The test address.** Netlify posts the deploy preview within a few minutes: wait for its comment (or
   poll `https://deploy-preview-<n>--msmt-web.netlify.app/<locale><path>`, e.g. `/en/gift-card`,
   `/es/precios`: previews serve every locale under its prefix) until it answers 200, check that page
   against the approved mockup section by section, then give the person that link and ask with
   AskUserQuestion: "This is the real page on a test address. Does it look right?" (options: "Yes, put it
   live" / "Something to change"). The link is a clickable markdown link straight to the page
   (`[Open the gift card page](https://deploy-preview-12--msmt-web.netlify.app/en/gift-card)`), never the
   preview's home page or the PR; also as a push notification, since it arrives minutes after they last
   heard from you. Changes they ask for now go through the same loop: edit the mockup and the page, checks,
   push, and when Netlify's comment shows the new commit ready, the link again, saying what changed.
3. **Publish on their acceptance.** Mark the PR ready for review and enable **auto-merge (squash)** with the
   GitHub tools (`update_pull_request` draft=false, `enable_pr_auto_merge` SQUASH). From here on auto-fix:
   stay subscribed, and on every CI failure or review-bot finding fix the root cause and push until the PR
   merges (never skip a test or lower a threshold). If auto-merge is refused, say so: the repository needs
   "Allow auto-merge" and a branch protection rule on `main` requiring the CI checks; merge manually once
   CI is green only if the person asks.
4. **Confirm.** When the PR merges, Netlify deploys `main`: poll the live URL until the new page answers 200
   with its title (up to ~5 minutes), then tell the person it is live with a clickable link to the live
   page, in the conversation and as a push notification. If the production deploy or CI on main fails
   afterwards, say so, fix forward, and report.
