---
name: publish-page
description: Publish an approved page preview to the live site: build the approved sections into content (MDX from the block catalogue, new blocks if any), run every check, commit directly to main and confirm when it is live. Use only after the user has explicitly said yes to publishing in page-request. No pull request, no auto-merge.
---

# Publish an approved page

Precondition: the user said yes to "Shall I publish this to the live site?" for a specific preview.
Tell them it takes a few minutes and report when it is live; keep the rest out of the conversation.

1. **From the approved preview.** Read `mockups/<slug>/sections.html`. Each `data-msmt` element becomes one
   MDX block with exactly its `data-props`; `children` becomes MDX prose; `PageHero` becomes the template's
   hero in frontmatter when the template renders one. Each `data-proposed` element is a block or prop to
   build first: component (+ typed props with doc comments), story, `catalogue.ts` entry, README section,
   export from `blocks/index.tsx`, `pnpm test:storybook` green; then `publish-design-system`. Never improvise
   a prop that is not in the catalogue.
2. **Page folder (co-location).** `src/content/<locale>/<collection>/<slug>/index.mdx` with every image of the
   page beside it (≤ 2000px long side, descriptive names), imported at the top of the MDX
   (`import card from './gift-card.png?w=480;960&as=picture'`) and passed to blocks as props with alt text.
   No external URLs, ever. Brand-wide assets only (logo, icons, flags) stay in `src/assets/images/`.
   Collection: `pages` unless it is a service/post/faq/artist/musician/partner/review; slug as on the live
   site when porting; `pnpm exec tsx scripts/check-slugs.ts` for collisions.
3. **Frontmatter** per `src/content/schema.ts`: `title` 30–65 chars (the page `<title>`), `description`
   50–160, `translationKey` shared across languages, `template` or type-specific fields. Structured facts
   (prices, counts, nav entries) live in `src/content/<locale>/data/*.ts`; add the page to `data/nav.ts` /
   `data/footer.ts` where the preview shows it and drop its slug from any legacy-link list.
4. **Checks, all green before anything is pushed:** `pnpm release-check` (lint, types, unit, Storybook axe,
   build, SEO suite) and `pnpm test:e2e` when layout changed. Fix failures; never lower a threshold. A page
   that cannot pass is not published: go back to the user with what is missing (in plain words).
5. **Publish = commit to main.** Branch from the current `main` (`git fetch origin main && git checkout -B
   publish/<slug> origin/main`), commit the page folder, `mockups/<slug>/` and any block work with a clear
   message ("Publish /<slug> (EN)"), then push it straight to main: `git push origin HEAD:main`. If main
   moved meanwhile, merge `origin/main` first and rerun `pnpm check`. No PR, no auto-merge: the preview the
   user approved is the review. Netlify builds and deploys main; CI runs on main as a safety net and is
   watched by whoever publishes.
6. **Confirm.** Wait for the Netlify production deploy of that commit (poll the live URL until the new page
   returns 200 with its title, up to ~5 minutes), then tell the user the page is live with its address.
   If the deploy or CI on main fails, say so, fix forward or revert the commit, and report.
