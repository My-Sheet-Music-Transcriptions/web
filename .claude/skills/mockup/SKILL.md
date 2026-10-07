---
name: mockup
description: Draft a visual mockup of a new or changed page on the Design canvas (clickable, commentable) using this site's real design tokens and block catalogue, before any code is written. Use when the user asks for a new page, landing page, section or redesign and wants to see it first.
---

# Mockup a page on the Design canvas

Goal: the user sees a realistic artboard of the proposed page, comments on it, and iterates; only after
approval does `new-page` turn it into MDX.

1. Read `src/components/blocks/README.md` (the catalogue) and `src/styles/app.css` (tokens). Reuse existing
   blocks; invent a new block only when nothing fits, and say so.
2. Collect the copy. Real copy from the user or from existing pages; unknown facts become `[PLACEHOLDER]`.
   Never invent prices, counts or reviews: read `src/content/<locale>/data/*.ts`.
3. Create one Design canvas artifact (type "Design") titled after the page. Build one artboard per breakpoint
   that matters (1440 and 390). Each section of the artboard mirrors a block 1:1 and is labelled with the
   block name in a note (e.g. `Hero`, `ServiceGrid limit=8`). Use the tokens exactly: Montserrat, #219EBC,
   #F49946, #E2864D, #023047, card radius 12px, pill buttons 28px, 1140px content width.
4. Reply with the canvas link, the list of blocks used (with props), and any new block you propose.
5. On feedback, edit the same canvas (never a new one) and keep the block labels in sync.
6. When the user approves, run the `new-page` skill with the block list as the brief.
