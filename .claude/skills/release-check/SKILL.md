---
name: release-check
description: Run every gate CI runs (lint, types, unit tests, Storybook axe, build, SEO conformance, e2e, Lighthouse) locally and fix what fails before pushing. Use before every push and whenever CI is red.
---

# Release check

```sh
pnpm release-check                 # lint, typecheck, unit, storybook a11y, build (en), SEO suite
pnpm test:e2e && pnpm lhci         # when layout or performance-relevant code changed
```

Reading failures:
- Biome: `pnpm lint:fix` first, then fix what remains by hand.
- tsc: MDX using an unknown component shows up as a type error in `mdx-components.d.ts` context – add the
  block to `blocks/index.tsx` or use an existing one.
- Storybook/axe: open `pnpm storybook`, the Accessibility panel names the element and the rule. Fix the
  component, never disable the rule. Contrast failures: darken text or the fill; tokens are in `app.css`.
- SEO suite: the message names the HTML file and the rule (title length, missing description, broken link...).
  Fix the MDX frontmatter or the block that rendered the markup.
- Lighthouse: check the JS budget (150 KB) and image sizes (`?w=` directives) first.
Never skip, quarantine or lower a threshold to get green.
