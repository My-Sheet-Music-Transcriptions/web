---
name: component
description: Add or change a block or primitive in src/components without duplicating what exists. The decision ladder (a prop or variant on an existing block, then a new shape of a shared item, then a new primitive, only then a new block), the BlockShell every block renders, the shared pieces, the prop vocabulary, the content rule, what a block ships with and the checks. Use before touching src/components (a proposed block from a mockup, a new variant, a layout change) and when reviewing a component change.
---

# Components without duplication

In October 2026 the catalogue had 18 blocks. Twenty-one hand-built section shells and nine prop names all
meant "which form". IconGrid, LogoGrid and Gallery drew the same item. CtaBand was a centred Section, and Hero
was PageHeader with a photo. Merged, that came to 14 blocks on one shell with one vocabulary. This skill keeps
it that way. `tests/unit/blocks.test.ts` and `tests/unit/components.test.ts` enforce the parts a test can see.

## 1. Look first

- Run `pnpm ds:blocks` to see every block by category, when to pick it and where it is used. `pnpm ds:blocks <Block>` shows its props and allowed values.
- Look in Storybook under `Blocks/<Category>/<Name>` (one story per variant) and `Primitives/*`.
- Look in `src/components/primitives` for the piece you are about to write; it is probably there (section 4).

## 2. The ladder: stop at the first rung that works

1. **The existing block, composed differently.** Change its props, `children`, `tone` or `id` in the page. No code change.
2. **A prop or a `variant` on an existing block.** Use this when the content has the same shape and only its form changes. Examples: `PageHeader variant="photo"` (the homepage), `Section align="center"` (a band with one button), `PictureGrid shape="portrait"`.
3. **A new shape of a shared item.** Add an optional field to `CardItem` or `PictureItem` (`src/content/types.ts`), a `FeatureItem` surface or a `Media` layout. Every block that shows that item gains it.
4. **A new primitive.** Use this when two blocks need the same piece (a kind of media, a surface, a control). Build it once in `primitives/` with a story, then use it from both.
5. **A new block.** Only when the content has a shape no block lists (its own data type). Say in the PR which rungs did not fit and why.

These signs mean it is a duplicate: the DOM outline matches a block you have (heading, grid of picture + title + text); it differs only in spacing, colours or sizes; or its name says where it is used (`HomeHero`) instead of what it shows.

## 3. Every block is a BlockShell

```tsx
export interface ThingProps extends ShellProps {
  /** The things: a list from content/<locale>/data or written in the page. */
  items: ThingItem[]
}

/** One sentence: what the block shows. */
export function Thing({ items, ...shell }: ThingProps) {
  return <BlockShell {...shell}>{/* only the block's own content */}</BlockShell>
}
```

- **What the shell gives:**
  - the `<section>`, labelled by its heading (`label` when untitled);
  - the tone and the container;
  - eyebrow, h2 with its orange rule, and the `lead`;
  - the closing `cta` (filled) and `links` (outline);
  - with an `image`, the photo band (veil, white wavy edges, white heading);
  - with `reveal`, the entrance on scroll (heading, content, buttons). A block with a list passes `cascade` and
    renders each item as `<RevealItem as="li">` so its cards come in one by one (the `motion` skill).
- **Blocks pick presets, never pixels:**
  - `spacing`: `tight`, `normal` or `loose`;
  - `width`: `narrow`, `content`, `wide` or `full`;
  - `align`: `center` or `start`;
  - `rule`: on or off.
- **What a block never writes:** a `<section>`, an `<h2>`, `SectionHeading`, `useTitleId`, a lead `<p>`, a CTA row, `py-[…]`, or `container-*`/`max-w-[1140px]`.
- **What `className` is for:** a texture or visibility (`bg-staff-lines`, `hidden md:block`), or clearance for a decoration (the form's wave). Never for spacing tweaks.
- **When the heading sits elsewhere** (beside a picture), pass children as a function: `{({ heading, actions }) => …}` (see MediaText).
- **Narrower props:**
  - A block that needs a title redeclares `title: string` (Testimonials).
  - A block without a background extends `HeadingProps` instead (RatingBanner, PricingCards).
- **The only block without the shell is `PageHeader`.** It is the page's `<header>` with the h1.

## 4. The shared pieces

| Piece | Use it for |
|---|---|
| `Media` (+ `MediaContent` props) | One picture with caption, a carousel, a before/after pair, a video with poster and play label. Blocks never wire `Carousel` or `VideoEmbed` themselves. |
| `FeatureItem` | Icon, picture or video, then title, body (light markdown), bold line and link, on a `card`, `tile` or `plain` surface (CardGrid, Steps). |
| `Card` | Every rounded surface: `tone`, `shadow` `card`/`band`, `as="article"`. Never hand-roll `rounded-card bg-white shadow-…`. |
| `Stars`, `RatingCard` | Every star rating and every platform card. |
| `CtaLink`, `Button`, `SmartLink`, `Picture`, `Slideshow` | Buttons, links (router for internal paths) and pictures. |
| `gridCols(columns, { tablet, phone })` | The grid of any list. `columns` always means desktop. |
| `tones` / `Tone` | Backgrounds. Tinted tones deepen `primary` and `accent-deep` so text stays AA. |
| `lightMarkdown`, `inlineMarkdown`, `fill`, `useAutoAdvance` | Prose kept as data, words with `{placeholders}`, and anything that rotates. |
| `RevealItem`, the variants in `Motion.tsx` | Anything that animates: reveals, menus, panels. Follow the `motion` skill. |

## 5. The vocabulary

A prop that means one of these takes this name; any other name for it is a synonym.

| Name | Meaning |
|---|---|
| `title` | The heading. |
| `eyebrow` | A short line above the title. |
| `lead` | A line under the title, in light markdown. |
| `tone` | The background; always the shared `Tone` type. |
| `variant` | The block's form. One per block. |
| `layout` | How several pictures show (`Media`). |
| `columns` | The number of columns from desktop up. |
| `items` | The block's list. |
| `cta` | The filled button. |
| `links` | Outline buttons. |
| `labels` | The words of controls, from `data/labels.ts`. |
| `label` | The accessible name of an untitled section. |
| `id` | The anchor. |
| `reveal` | Comes in as it scrolls into view. |

Item fields have their own names:

| Field | Meaning |
|---|---|
| `title`, `body` | The item's heading and its light-markdown text. |
| `image` | The item's picture. |
| `icon` | An illustrated icon (a picture). |
| `glyph` | An `Icon` name. |
| `name` | The line under a picture. |
| `alt`, `caption`, `href`, `linkLabel` | Alt text, a line under the name, the link and the link's button text. |

The guard test refuses the retired synonyms: `surface`, `background`, `imagesLayout`, `preset`, `strong`, `showNames`, `slideshow`, and `text` for prose.

## 6. The content rule

Components hold no words and no pictures: no copy, alt text, aria words, defaults or picture imports. Everything reaches them through props or `children`. Pages pass them; `src/app` passes the chrome's. Data shapes live in `src/content/types.ts`. Storybook uses `src/stories/data.ts` and its `'sample:…'` pictures, never `content/`. See CLAUDE.md, Conventions, and `tests/unit/components.test.ts`.

## 7. What a block ships with

- **Its file:** `src/components/blocks/<Name>.tsx`, holding `export interface <Name>Props extends ShellProps { … }`. Put one member per line, each with a doc comment: `pnpm ds:blocks` and the mockup checks read them, extended interfaces included.
- **A `catalogue.ts` entry:** category, `useWhen`, `notFor` (name the block to use instead), `defaults` from `src/stories/data`, `usage` with one line per variant, and `previewHeight`.
- **Stories:** `Blocks/<Category>/<Name>` built from `storyArgs('<Name>')`, plus one story per variant or shape.
- **The export:** in `blocks/index.tsx`, both `blocks` and the named exports.
- **The README table:** regenerated by `pnpm ds:export`.
- **A primitive:** its file and a `Primitives/<Name>` story.

## 8. Checks

```sh
pnpm check              # biome, types over every page, knip (no unused prop types or exports), unit (guards, components rule, mockup round-trips)
pnpm test:storybook     # axe on every story, contrast included
SITE_LOCALE=en pnpm build && pnpm ds:shot <slug> --built   # each page that uses it, 1440/768/390, looked at
pnpm test:visual        # homepage; re-capture (--update-snapshots) only after looking at the diff
pnpm release-check
```

- **Approval:** a block change is outside `content/`, so the PR needs a core approval.
- **The artifact:** republish it after the merge (`publish-design-system`). A preview that needs the new block publishes from its branch first.
