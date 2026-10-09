# Block catalogue

Blocks are what pages are made of: a page (`content/<locale>/<collection>/<slug>/index.tsx`) imports them by name from
`~/components/blocks` and writes its prose with the typography components (`Text`, `Heading`, `List`, `TextLink`… from
`~/components/typography`; `<strong>` and `<em>` stay plain). Blocks are named for what they do, not for the page they
came from, and never import content: a page passes its lists as props (`items`, `tiers`, `sources`, `groups`),
imported from `content/<locale>/data/*.ts` or written in the page, and its pictures from its own folder. Each block
is filed by category (what it shows: headers, text & media, lists & grids, reviews & ratings, calls to action),
shown in this table, in `pnpm ds:blocks` and in Storybook (`Blocks/<Category>/<Name>`); its story takes the
catalogue's documented example and passes axe.

| Block | Category | Purpose | Props | Data source |
| --- | --- | --- | --- | --- |
| `PageHeader` | Headers | The opening of every page, its h1 first. `band`: the dark centred title band with an orange rule, then the instrument icon and the compact rating card when given (service pages). `split`: white, the copy and button left, a picture or carousel right (landing pages). `photo`: the homepage, rotating studio photos behind the copy, cut by a curve that leaves the copy on white (above it on phones), the brand lockup, the orange highlight and the floating rating card. It drifts in as the page opens. | title, eyebrow, subtitle, lead, cta, rating, variant, image, alt, images, mobileImages, highlight, logo, labels, id | content/<locale>/data/ratings.ts (google), labels.ts (mediaLabels, with images) |
| `Section` | Text & media | A titled section for a page's own prose (`Text`, `Heading`, `List`… from ~/components/typography): the heading with its rule, a white, cream or peach background, three widths, a filled `cta` and outline `links`. `align="center"` with `rule={false}` is the short band that points somewhere (the glossary, the form, an email: "Unsure about music notation?"). | title, eyebrow, lead, id, reveal, tone, cta, align, rule, width, links, children | – |
| `MediaText` | Text & media | Prose beside media: a picture with its caption, a carousel, a before/after pair (`layout="pair"`) or a video, left or right, with an optional eyebrow, heading and button. `align="center"` puts the heading above and the button below (who we are). | title, eyebrow, lead, id, reveal, tone, cta, image, alt, caption, images, layout, video, labels, videoPoster, imageSide, imageWidth, align, children | content/<locale>/data/labels.ts (mediaLabels, with a carousel or a video) |
| `Samples` | Text & media | Our work, to compare: each sample's title, the YouTube recording (loaded on click) and the score we wrote from it. `rows`: the recording beside the score, one row per sample. `columns`: the samples side by side, the recording in a card with the instrument's icon and name, an arrow, then the score. | title, eyebrow, lead, id, reveal, tone, cta, items, variant, labels, videoPoster | content/<locale>/data/labels.ts (mediaLabels) |
| `Table` | Text & media | A table of facts with a caption and column headings, links in cells; on phones each row becomes a labelled card. | title, eyebrow, lead, id, reveal, tone, cta, caption, columns, rows, children | – |
| `CardGrid` | Lists & grids | A grid of cards, each an icon or picture with a title, a short text and an optional button. `variant`: card (white), tile (peach, the audiences) or plain. With an `image`, white cards over that photo band. `tabs`: the same cards in sets (currencies). | title, eyebrow, lead, id, reveal, tone, cta, items, tabs, columns, variant, image | content/<locale>/data/services.ts (included), home.ts (audiences) |
| `PictureGrid` | Lists & grids | A grid of pictures, each with its name and caption, linked when it has an `href`. `shape`: icon (services), logo, portrait (round) or photo (square). `variant="marquee"`: a strip that scrolls by on its own, of icons with their names or of tall photos (hidden on phones). `limit` shows the first n. | title, eyebrow, lead, id, reveal, tone, cta, items, shape, variant, columns, limit, label | content/<locale>/data/services.ts (allServices) |
| `Steps` | Lists & grids | A process step by step. `timeline`: a numbered vertical list with a glyph or number per step. `bubbles`: a vertical line with each step's illustrated icon on it and its title and text in a speech bubble. `columns`: the steps side by side, each with its picture or video (the homepage adds one wide illustration on desktop). | title, eyebrow, lead, id, reveal, tone, cta, items, variant, illustration, illustrationAlt, stepLabel, labels, videoPoster | content/<locale>/data/labels.ts (mediaLabels, with videos) |
| `Stats` | Lists & grids | A row of big teal figures that back a claim, each above its one-line label, under an optional heading. | title, eyebrow, lead, id, reveal, tone, cta, items | – |
| `PricingCards` | Lists & grids | Prices from: three cards with coloured headers, a floating icon and the pricing factors (the homepage), or one wide card with the price beside the numbered factors when given one tier (a service or landing page). Intro prose goes in the children. | eyebrow, lead, id, reveal, title, tiers, children, cta | content/<locale>/data/home.ts (pricingTiers), services.ts (<service>Pricing) |
| `FaqList` | Lists & grids | Questions that open one at a time (native `<details>`, no script), in titled groups with optional jump links (outline buttons, or a row of filled pills when the groups have a `tone`) and a button, with the FAQPage structured data search engines read. | title, eyebrow, lead, id, reveal, tone, cta, groups, jumpLinks, jsonLd | content/<locale>/data/faqs.ts (generalFaq and the FAQ page groups) |
| `RatingBanner` | Reviews & ratings | The big trust moment: a full-bleed photo with white wavy edges, a white heading, the transcriptions counter and a row of rating cards (Google, Trustpilot or customers, Facebook). With `reveal` the counter ticks up like an odometer and the stars pop in. | eyebrow, lead, id, reveal, title, counter, sources, image | content/<locale>/data/ratings.ts (counter, homeRatings, platforms) |
| `Testimonials` | Reviews & ratings | Customer quote cards in two columns with teal stars over the peach staff lines, and an optional link to all reviews. With `reveal` the cards come in one by one and their stars pop in. | eyebrow, lead, id, reveal, title, items, cta, labels | content/<locale>/data/reviews.ts, labels.ts (reviewLabels) |
| `ContactSection` | Calls to action | The request form in its peach section under a white wave: title, lead, the teal response-time pill and the form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. The optional fields show when the copy names them. Submits to the contact server function; works without JavaScript. | form, title, lead, id, variant, returnTo, reveal | content/<locale>/data/forms.ts (quoteForm, giftCardForm) |

Rules of a component: it is agnostic of the content. It holds no words and no pictures (no copy, alt texts,
aria labels, placeholders or default texts; no picture imports or lookups; no `content/` data, no site strings):
everything a visitor reads or sees arrives as props or `children`. Pages pass their words and pictures directly,
from their folder and `content/<locale>/data` (`labels.ts` for the words around carousels, videos and reviews,
`forms.ts` for the request forms); the app (`src/app`) passes the chrome's. Composition is welcome where it helps
(a slot or `children` instead of a growing list of props). `tests/unit/components.test.ts` enforces this; Storybook
shows blocks with its own data (`src/stories`), never the site's.

## Rules of a component

Before adding or changing a block, follow the `component` skill (`.claude/skills/component/SKILL.md`). In short:

- **Climb the ladder, stop at the first rung that works.** A prop or `variant` on an existing block, then a new
  shape of a shared item (`CardItem`, `PictureItem`, a `FeatureItem` surface, a `Media` layout), then a new
  primitive, and only then a new block.
- **Every block is a `BlockShell` around its own content** (`PageHeader` is the one exception). The shell is the
  labelled section, tone, container, eyebrow, heading with its rule, lead, closing `cta` and `links`, and the photo
  band when given an `image`. Blocks pick presets (`spacing`, `width`, `align`, `rule`), never pixels, and extend
  `ShellProps` instead of repeating it.
- **One vocabulary:**
  - `title`, `eyebrow`, `lead`, `tone`, `variant` (the form), `layout` (several pictures), `columns` (desktop),
    `cta`, `links`, `labels`, `label`, `id`;
  - `items` with the fields `title`, `body`, `image`, `icon`, `glyph`, `name`, `alt`, `caption`, `href`, `linkLabel`.
- **Shared pieces are primitives, never copies:** `Media`, `FeatureItem`, `Card`, `Stars`, `CtaLink`, `gridCols`,
  `tones`.
- **No words and no pictures in a component:** a page passes them.

A new block ships with:

- its file, with `export interface <Name>Props extends ShellProps` (one member per line, each documented);
- a `catalogue.ts` entry, which regenerates this table and feeds `pnpm ds:blocks`;
- a story titled `Blocks/<Category>/<Name>` built from that entry's example (`storyArgs`), plus one per variant;
- its export in `index.tsx`.

`tests/unit/blocks.test.ts` checks the shell and the vocabulary; `tests/unit/components.test.ts` checks the
content rule.
