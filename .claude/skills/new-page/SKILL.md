---
name: new-page
description: Build an approved mockup into a content page (MDX from the block catalogue, new blocks if proposed, assets, SEO fields) and ship it through a ready-for-review PR with auto-merge so a green CI deploys it. Use after the user approves a mockup; when they skip the mockup explicitly, build from their brief the same way.
---

# New page

1. **From the approved mockup.** Read `mockups/<slug>/sections.html`. Each `data-msmt` element is one MDX block
   with exactly its `data-props`; `children` becomes MDX prose. `PageHero` becomes the page template's hero in
   frontmatter when the template renders one. Each `data-proposed` element is a block or prop to build first:
   component (+ props interface with doc comments), story, `catalogue.ts` entry, README section, export from
   `blocks/index.tsx`, axe pass in Storybook; then `publish-design-system`. Never improvise a prop that is not
   in the catalogue.
2. Decide the collection (`pages` unless it is a service/post/faq/artist/musician/partner/review) and the slug
   (same as the live site when porting). Check collisions: `pnpm exec tsx scripts/check-slugs.ts`.
3. Write `src/content/<locale>/<collection>/<slug>.mdx`: frontmatter per `src/content/schema.ts` (`title` 30–65
   chars as the page `<title>`, `description` 50–160, `translationKey`, `template` or type-specific fields);
   body only from blocks in `src/components/blocks/index.tsx` plus Markdown prose. Copy comes from the mockup;
   a `[PLACEHOLDER]` still in it means ask, never invent.
4. Images: originals into `src/assets/images/<collection>/` (≤ 2000px long side, descriptive names, alt text),
   imported through blocks and `<Picture>`; never hotlink.
5. Structured facts (prices, counts, nav entries) go in `src/content/<locale>/data/*.ts`. Add the page to
   `data/nav.ts` / `data/footer.ts` where the mockup shows it, and drop its slug from any legacy-link list.
6. `pnpm release-check` (and `pnpm test:storybook` when a block changed; CI runs it on main only). Fix every
   failure; never lower a threshold.
7. Ship: commit on a branch, push, open a **ready-for-review** PR (title "Add /<slug>", body: mockup artifact
   link, blocks used, new blocks) and enable **auto-merge (squash)** with the GitHub tool
   `enable_pr_auto_merge`. Keep `mockups/<slug>/` in the PR. Subscribe to the PR and drive it to green; when
   it merges, Netlify deploys production. If auto-merge is refused, say so: the repository needs "Allow
   auto-merge" and a branch protection rule on `main` requiring the CI checks (otherwise auto-merge would merge
   before CI finishes). Paste the Netlify preview URL once posted and compare it with the mockup section by
   section. Draft PRs are only for work the user has not approved.
