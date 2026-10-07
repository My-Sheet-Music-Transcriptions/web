---
name: new-page
description: Create or update a content page (MDX) composed from the block catalogue, with valid frontmatter, assets, SEO fields and a draft PR that passes CI. Use after a mockup on the Design canvas is approved, or when the user asks for a page directly and explicitly skips the mockup.
---

# New page

1. **From the approved canvas.** Read the Design canvas artifact (the `mockup` skill produced it). Each section
   is labelled `BlockName prop=value …`; map them to MDX in order, one block per section, with exactly those
   props. `PageHero` becomes the page template's hero (frontmatter) when the template renders one; block prose
   becomes MDX children. A label naming a block or prop that is not in `src/components/blocks/catalogue.ts`
   is a mistake in the mockup: fix the canvas first (or add the block properly: component + story + catalogue
   entry + README section + `blocks/index.tsx` export, then `publish-design-system`). Never improvise a prop.
2. Decide the collection (`pages` unless it is a service/post/faq/artist/musician/partner/review) and the slug
   (lowercase, hyphens, same as the live site when porting). Check for collisions: `pnpm exec tsx scripts/check-slugs.ts`.
3. Write `src/content/<locale>/<collection>/<slug>.mdx`:
   - frontmatter per `src/content/schema.ts`: `title` (page `<title>` 30–65 chars), `description` (50–160),
     `translationKey` (shared across locales), `template` for pages, type-specific fields otherwise.
   - body composed only of blocks from `src/components/blocks/index.tsx` and plain Markdown prose.
   - copy comes from the canvas; `[PLACEHOLDER]` left on the canvas means ask, never invent.
4. Images: copy originals into `src/assets/images/<collection>/`, max 2000px on the long side, descriptive
   file names. Blocks import them through `<Picture>`; never hotlink. Add alt text.
5. Structured facts (prices, counts, nav entries) go in `src/content/<locale>/data/*.ts`, not inline.
6. If the page needs a header/footer link, edit `data/nav.ts` or `data/footer.ts`; remove the slug from the
   legacy list the `SmartLink` falls back to if it was pointing at the old site.
7. Run `pnpm release-check` (and `pnpm ds:export` if a block changed). Fix every failure (SEO suite messages
   name the file and the rule).
8. Commit, push, open a draft PR describing the page, the canvas link and the blocks used; paste the Netlify
   preview URL once it is posted and compare it with the artboard block by block.
