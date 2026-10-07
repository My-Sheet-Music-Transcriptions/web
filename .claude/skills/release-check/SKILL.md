---
name: release-check
description: Run every gate CI runs (lint, types, unit tests, Storybook axe, build, SEO conformance, design-system export, e2e, Lighthouse) locally and fix what fails before pushing. Use before every push and whenever CI is red.
---

# Release check

```sh
pnpm release-check                 # lint, typecheck, unit, storybook a11y, build (en), SEO suite
pnpm ds:export                     # design-system export (nightly in CI)
pnpm test:e2e && pnpm lhci         # when layout or performance-relevant code changed
```

CI on a PR runs only lint/types/unit, the build and the SEO suite (minutes). Storybook axe, e2e + visual,
Lighthouse, the link check and the export run nightly on `main` (`.github/workflows/nightly.yml`, or trigger
it manually from the Actions tab), so run them locally before pushing component or layout changes.

Reading failures:
- Biome: `pnpm lint:fix` first, then fix what remains by hand.
- tsc: MDX using an unknown component shows up as a type error in `mdx-components.d.ts` context – add the
  block to `blocks/index.tsx` or use an existing one. A new block without a `catalogue.ts` entry is a type error
  too: add the entry (description, defaults, mdx, previewHeight).
- Unit tests: `theme-tokens` fails when a token in `src/styles/theme.css` lacks a usage comment, duplicates a
  name or fails contrast; `catalogue` fails when a block has no story or the README table is stale (run
  `pnpm ds:export` to regenerate the table).
- Storybook/axe: open `pnpm storybook`, the Accessibility panel names the element and the rule. Fix the
  component, never disable the rule. Contrast failures: darken text or the fill; tokens are in `theme.css`.
- SEO suite: the message names the HTML file and the rule (title length, missing description, broken link...).
  Fix the MDX frontmatter or the block that rendered the markup.
- `ds:export`: a bundle containing `</script` or `<!--`, or a block whose props interface cannot be parsed,
  stops the export with the reason.
- Lighthouse: check the JS budget (150 KB) and image sizes (`?w=` directives) first.
Never skip, quarantine or lower a threshold to get green.
