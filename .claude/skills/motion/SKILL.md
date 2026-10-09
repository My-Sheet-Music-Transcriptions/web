---
name: motion
description: Animate the site with Motion (formerly Framer Motion) the one way this repo does it. Covers the MotionProvider every root mounts (LazyMotion with `m` components, MotionConfig reducedMotion="user"), the shared variants in src/components/primitives/Motion.tsx, block reveals (`reveal` on a page, `cascade` and RevealItem in a block), menus and panels (variants, and AnimatePresence only for what unmounts), the prerender and reduced-motion guard (`data-reveal`), the JavaScript budget and the checks. Use before adding or changing any animation, transition or scroll effect in src/components or on a page, and when reviewing one.
---

# Motion

The site animates with [Motion](https://motion.dev) (`motion`, imported from `motion/react`), declaratively: `m`
components moving between named variants. The library runs every animation, and every animation follows the
same few rules. Before adding a new kind of motion, read the `component` skill as well: motion belongs to the
shell or to a primitive, never to one page.

## 1. One provider, `m` only

- `MotionProvider` (`src/components/primitives/Motion.tsx`) wraps every root:
  - the app (`src/routes/__root.tsx`);
  - Storybook (`.storybook/preview.tsx`);
  - the design-system bundle (`src/design-system/export/entry.tsx`).

  A new root (a bundle, a test harness) mounts it too. Without it `m` components never animate, and a revealed
  block stays hidden.
- It is `LazyMotion strict` with `MotionConfig reducedMotion="user"`. Use `m` components
  (`import * as m from 'motion/react-m'`, then `m.div`, `m.li`…). A `motion.div` throws under `strict`, because it
  would bundle every feature.
- The features (`domAnimation`: variants, in-view, hover, exit) load after hydration from
  `primitives/motion-features.ts`, in their own chunk. `domMax` (layout animations, drag) is not loaded. Ask
  before adding it, because it costs another ~10 KB on every page.
- Do not use the imperative `animate()`, `useAnimate` or `motion/mini`. Use one style: variants on `m`
  components.

## 2. Presets, not numbers

Variants live in `Motion.tsx`, each with a one-line doc. Components import them and never write a duration,
an ease or a distance:

| Preset | What moves |
|---|---|
| `revealGroup`, `revealPiece` | A revealed block: pieces 0.08 s apart, each rising 24px and fading in over 0.6 s. |
| `dropDown`, `dropSide` | A menu panel under its button (`y`) or a submenu beside its row (`x`): 0.2 s in, 0.15 s out. |
| `fade`, `slideIn` | A backdrop, and a side panel from the right (the phone menu). |

A new preset stays subtle:
- 0.15–0.3 s for controls and 0.6–0.7 s for scroll reveals;
- 8–24px of travel;
- ease-out in, ease-in out;
- only `opacity` and transforms (`x`, `y`, `scale`). Animating width, height, top or margins moves the layout
  (CLS) and janks.

## 3. Reduced motion

`reducedMotion="user"` turns movement off and keeps fades for visitors who ask for reduced motion. Do not read
`prefers-reduced-motion` yourself for Motion animations. The older CSS and interval motion (the marquee, the
slideshow's `useAutoAdvance`) stops on its own and is fine as it is.

## 4. Reveals

- **On a page:** `reveal` on a block brings it in as it scrolls into view. Every `BlockShell` block takes it,
  and so does `ContactSection`. Do not reveal `PageHeader` (it holds the largest paint) or a block that already
  moves (the marquee strip).
- **How it is driven:** the shell watches itself with `useInView` and switches `animate` from `hidden` to
  `shown`. It does not use `whileInView`: with `whileInView` and `once`, pieces mounted after the reveal (another
  tab's cards) inherit `hidden` and stay invisible. With `animate`, they inherit `shown` and come in on their
  own. The `RevealedTabs` story of CardGrid guards this.
- **In a block:** the shell reveals the heading, then the content as one piece, then the buttons. To bring a
  list in card by card:
  - render each item as `<RevealItem as="li">`;
  - pass `cascade` to `BlockShell` (see CardGrid, Steps, Testimonials).

  Decorations (waves, lines) stay plain elements so they do not move. `RevealItem` is inert when the block is
  not revealed.
- The section starts once, when its top passes the lowest sixth of the screen (`viewport.once`).

## 5. What the prerendered page shows

- **Revealed pieces** are prerendered with `opacity: 0`. `RevealItem` marks them `data-reveal`. theme.css shows
  them as they are under reduced motion and in print, and the root's `<noscript>` does the same without
  JavaScript. Anything that starts hidden in the HTML must carry `data-reveal`, so use `RevealItem`.
- **Menus and panels that open and close** use `initial={false}`, `animate={open ? 'open' : 'closed'}` and
  variants that end in `display: 'none'` (`transitionEnd`). The closed state is prerendered, so the links stay
  crawlable, and it ends unfocusable. Keep `AnimatePresence` for what really leaves the DOM (the phone menu
  dialog).
- **Focus and ARIA never wait on an animation.** Set `aria-expanded` and move focus at once. A closed panel ends
  in `display: none`.

## 6. Budget

Before Motion the home loaded about 167 KB of gzipped JavaScript, already over the 150 KB in `budgets.json` (a
budget Lighthouse reports but does not assert). Motion costs about 28 KB:
- about 17 KB in the up-front chunk (the renderer, values, `AnimatePresence`);
- about 14 KB in `motion-features`, after hydration.

The up-front part is bigger than Motion's documented ~5 KB for `m` because the bundler places code that the
lazy chunk shares with `m` in the entry. Lighthouse still scores 0.93–0.95 for performance with no blocking
time. Measure before and after any motion change (sum the `/assets/*.js` that `dist/client/index.html` loads,
gzipped) and give the difference in the PR.

## 7. Checks

```sh
pnpm check                         # types (variants are typed), knip (no unused variants), the components rule, unit
pnpm test:storybook                # axe; a revealed story waits in `play: ({ canvasElement }) => revealed(canvasElement)` (src/stories/play.ts)
SITE_LOCALE=en pnpm build && pnpm ds:shot home --built   # pictures in the final state (reduced motion)
pnpm test:e2e                      # the menus open, close and keep focus, desktop and phone
pnpm test:visual                   # reduced motion: the page must look as it did without motion
```

`ds:shot` and the visual tests run with reduced motion, so they show where things end, not how they move. To
watch the motion itself, use `pnpm dev`, Netlify's deploy preview, or a Playwright page without
`reducedMotion` that scrolls and takes pictures.

## 8. The API and the official skill

- **The official skill:** Motion's own skill is vendored as `motion-dev` (from `motion-ai` 14.1.0; its
  README.md says what was left out). Read its `best-practices/` for animation craft and API rules. Where it
  differs from this skill, this skill wins:
  - **`m`, not `motion`:** use `m` from `motion/react-m` under `LazyMotion strict`. Its examples use
    `motion.div`, which throws here.
  - **`x`/`y`, not `transform`:** it prefers `transform` strings, so animations run through WAAPI. Our presets
    keep `x`, `y` and `scale`, because Motion's reduced-motion mode only stops those keys (it makes
    positional keys instant). A `transform` string would still move for visitors who asked for less motion.
  - **No MCP:** its docs search, spring generation, audits and transition editor need Motion's MCP servers,
    which are not configured here.
- **The docs:** Motion's docs are published as Markdown for agents, at `https://motion.dev/docs/<page>.md`
  (for example `react-lazy-motion.md`, `react-motion-config.md`, `react-animate-presence.md`), indexed in
  `https://motion.dev/llms.txt`.
