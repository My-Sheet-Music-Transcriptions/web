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
  components. The PageHeader's CSS entrance and parallax (section 4) are the one exception.

## 2. Presets, not numbers

Variants live in `Motion.tsx`, each with a one-line doc. Components import them and never write a duration,
an ease or a distance:

| Preset | What moves |
|---|---|
| `revealGroup`, `revealPiece` | A revealed block: pieces 0.08 s apart, each rising 24px and fading in over 0.6 s. |
| `dropDown`, `dropSide` | A menu panel under its button (`y`) or a submenu beside its row (`x`): 0.2 s in, 0.15 s out. |
| `fade`, `slideIn` | A backdrop, and a side panel from the right (the phone menu). |
| `tickerGroup`, `tickerDigit` | A figure of a revealed block (`Ticker`) rolling up like an odometer: each digit's column from 0 to it over 1.8 s, 0.12 s after the one before. |
| `starsGroup`, `pop` | The stars of a rating in a revealed block: 0.08 s apart, each growing from half size with a slight overshoot over 0.4 s. `pop` is also an icon popping in (`RevealItem preset="pop"`). |
| `revealSide`, `drawDown` | A piece sliding in 16px from the left (a step's speech bubble, `preset="side"`), and a line drawing itself from its top over 0.4 s (the timeline, `preset="draw"`). |
| `entrance-*`, `parallax` (theme.css) | The PageHeader: each piece fading in 40px from the side its variant calls for over 1.4 s as the page opens, the band's rule drawing itself, the homepage's photos sliding in behind their curve and lagging behind it on scroll (see 4). |

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
  and so does `ContactSection`. Do not reveal a block that already moves (the marquee strip).
- **The PageHeader** never takes `reveal`: it holds the page's largest paint, and a Motion reveal would
  prerender it hidden until the JavaScript and the features chunk have loaded (seconds on a slow phone, and
  the LCP with them). It comes in with CSS instead (theme.css), calmly and all at once, from the first paint,
  over 1.4 s, each piece from the side its variant calls for: `entrance-left` / `entrance-right` fade a piece in
  drifting 40px from that side (a split header's copy and picture, the homepage's copy), `entrance-up` from
  below (a band's centred copy, the rating cards), `entrance-settle` landing from slightly larger (the icon
  under a band), `entrance-behind` slides the homepage photos in behind their curve, which stays put, and then
  they lag behind it as the page scrolls (`parallax`: a scroll-driven animation, 70% of the page's speed over
  the first screen, compositor-run, nothing where browsers lack scroll timelines). `entrance-late` holds a
  piece back 0.35 s for what follows the copy; `entrance-rule` draws the band's orange rule out from its
  centre once the copy has settled. The photos centre under their curve.
  - **Fades start at 1%, never 0:** Chrome never counts an element first painted at opacity 0 as the LCP, not
    even once it shows, so a fade from 0 hands the LCP to whatever paints next (the consent banner, after
    hydration: piano at 4x CPU, 330 to 1090 ms). From 1% it is invisible to the eye and counted from the
    first paint.
  - **A picture never starts smaller:** Chrome records an image's LCP size as first painted, so an icon
    growing from `scale(0.9)` (81% of its area) lost the LCP to the consent banner's paragraph the same way.
    Landing from `scale(1.08)` keeps it the largest paint.
  - Measured on every English page: the LCP element and time are the same with and without the entrance.
  - It runs on screen only for visitors who did not ask for reduced motion, and it replays as each page
    mounts. A story that shows it waits in `play: ({ canvasElement }) => entered(canvasElement)`
    (src/stories/play.ts) before axe runs; `entered` skips the animations the scroll drives.
- **How it is driven:** the shell watches itself with `useInView` and switches `animate` from `hidden` to
  `shown`. It does not use `whileInView`: with `whileInView` and `once`, pieces mounted after the reveal (another
  tab's cards) inherit `hidden` and stay invisible. With `animate`, they inherit `shown` and come in on their
  own. The `RevealedTabs` story of CardGrid guards this.
- **In a block:** the shell reveals the heading, then the content as one piece, then the buttons. To bring a
  list in card by card:
  - render each item as `<RevealItem as="li">`;
  - pass `cascade` to `BlockShell` (see CardGrid, Steps, Testimonials).

  To bring the pieces of one item in one after another (a sample's title, video, arrow and score; a step's
  line, icon and bubble), render the item as `<RevealGroup as="li">` and its pieces as `RevealItem`s, each
  with the `preset` that fits it: `rise` (default), `pop` (an icon), `side` (a speech bubble, from the left)
  or `draw` (a line, from its top; give it `origin-top`).

  Decorations (waves, lines) stay plain elements so they do not move. `RevealItem` is inert when the block is
  not revealed.
- **Inside a piece**, primitives join the reveal through the variants they inherit, and stay still anywhere
  else (the hero's rating card):
  - `Stars` pop in one after another (`starsGroup`, `pop`) once their card has come in;
  - `Ticker` rolls a figure up like an odometer (`tickerGroup`, `tickerDigit`): `<Ticker>{figure}</Ticker>`,
    where the figure is the string the page shows ("71,844"). Each digit's column, 0 up to it, rolls up until
    it shows; separators stay put. CSS draws the rolling digits (`content: attr(data-char)`) and an `sr-only`
    copy carries the figure, so the page's text reads it once. The columns rest at `transform: none`, so
    `data-reveal` shows the figure where nothing animates. The RatingBanner's counter uses it; the
    customers figure stays still.
- The section starts once, when its top passes the lowest sixth of the screen (`viewport.once`).

## 5. What the prerendered page shows

- **Revealed pieces** are prerendered with `opacity: 0`. `RevealItem` marks them `data-reveal`. theme.css shows
  them as they are under reduced motion and in print, and the root's `<noscript>` does the same without
  JavaScript. Anything that starts hidden in the HTML must carry `data-reveal`, so use `RevealItem` (the
  `Stars` mark each star themselves, the `Ticker` each column).
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
