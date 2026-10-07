---
name: new-page
description: Create or update a content page (MDX) composed from the block catalogue, with valid frontmatter, assets, SEO fields and a draft PR that passes CI. Use after a mockup is approved or when the user asks for a page directly.
---

# New page

1. Decide the collection (`pages` unless it is a service/post/faq/artist/musician/partner/review) and the slug
   (lowercase, hyphens, same as the live site when porting). Check for collisions: `pnpm exec tsx scripts/check-slugs.ts`.
2. Write `src/content/<locale>/<collection>/<slug>.mdx`:
   - frontmatter per `src/content/schema.ts`: `title`, `description` (50–160 chars), `translationKey`
     (shared across locales), `template` for pages, type-specific fields otherwise.
   - body composed only of blocks from `src/components/blocks/index.tsx` and plain Markdown prose.
3. Images: copy originals into `src/assets/images/<collection>/`, max 2000px on the long side, descriptive
   file names. Blocks import them; never hotlink.
4. Structured facts (prices, counts, nav entries) go in `src/content/<locale>/data/*.ts`, not inline.
5. If the page needs a header/footer link, edit `data/nav.ts` or `data/footer.ts`.
6. Run `pnpm release-check`. Fix every failure (SEO suite messages name the file and the rule).
7. Commit, push, open a draft PR describing the page and the blocks used; paste the Netlify preview URL
   once it is posted.
