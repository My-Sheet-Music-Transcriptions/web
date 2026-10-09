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
| `PageHeader` | Headers | Page opening. `band`: dark centred title band with an orange rule, then the instrument icon and the compact rating card when given (service pages). `split`: white, copy and button left, a picture or carousel right (landing pages). `photo`: the homepage, rotating studio photos behind the copy (above it on phones), brand lockup, orange highlight and the floating rating card. | title, eyebrow, subtitle, lead, cta, rating, variant, image, alt, images, mobileImages, highlight, logo, labels, id | content/<locale>/data/ratings.ts (google), labels.ts (mediaLabels, with images) |
| `Section` | Text & media | Titled section for a page's own prose: heading with its rule, white/cream/peach background, three widths, a filled `cta` and outline `links`. `align="center"` with `rule={false}` is the short band that points somewhere (the glossary, the form, an email). | title, eyebrow, lead, id, tone, cta, align, rule, width, links, children | – |
| `MediaText` | Text & media | Prose beside media (picture with caption, carousel, before/after pair with `layout="pair"`, video), optional eyebrow, heading and button; media left or right; `align="center"` puts the heading above and the button below (who we are). | title, eyebrow, lead, id, tone, cta, image, alt, caption, images, layout, video, labels, videoPoster, imageSide, imageWidth, align, children | content/<locale>/data/labels.ts (mediaLabels, with a carousel or a video) |
| `Samples` | Text & media | One row per sample: its title and the YouTube video (loaded on click) beside the score picture. | title, eyebrow, lead, id, tone, cta, items, labels, videoPoster | content/<locale>/data/labels.ts (mediaLabels) |
| `Table` | Text & media | A table with a caption and column headings; links in cells; each row becomes a labelled card on phones. | title, eyebrow, lead, id, tone, cta, caption, columns, rows, children | – |
| `CardGrid` | Lists & grids | Grid of cards (icon or picture, title, text, optional button). `variant`: card (white), tile (peach, the audiences) or plain. With an `image`, white cards over that photo band. `tabs`: the same cards in sets (currencies). | title, eyebrow, lead, id, tone, cta, items, tabs, columns, variant, image | content/<locale>/data/services.ts (included), home.ts (audiences) |
| `PictureGrid` | Lists & grids | Grid of pictures, each with its name and caption, linked when it has an `href`. `shape`: icon (services), logo, portrait (round) or photo (square). `variant="marquee"`: a strip of tall photos that scrolls by on its own (hidden on phones). `limit` shows the first n. | title, eyebrow, lead, id, tone, cta, items, shape, variant, columns, limit, label | content/<locale>/data/services.ts (allServices) |
| `Steps` | Lists & grids | `timeline`: numbered vertical list with a glyph or number per step. `columns`: steps side by side, each with its picture or video (the homepage adds one wide illustration on desktop). | title, eyebrow, lead, id, tone, cta, items, variant, illustration, illustrationAlt, stepLabel, labels, videoPoster | content/<locale>/data/labels.ts (mediaLabels, with videos) |
| `Stats` | Lists & grids | A row of big teal figures, each above what it measures, under an optional heading. | title, eyebrow, lead, id, tone, cta, items | – |
| `PricingCards` | Lists & grids | Three price-from cards with coloured headers, floating icons and pricing factors, or one wide card (price beside numbered factors) when given one tier; intro prose goes in the children. | eyebrow, lead, id, title, tiers, children, cta | content/<locale>/data/home.ts (pricingTiers), services.ts (<service>Pricing) |
| `FaqList` | Lists & grids | Questions that open one at a time (no script), in titled groups with optional jump links, a button, and FAQPage structured data. | title, eyebrow, lead, id, tone, cta, groups, jumpLinks, jsonLd | content/<locale>/data/faqs.ts (generalFaq and the FAQ page groups) |
| `RatingBanner` | Reviews & ratings | Full-bleed piano photo with white wavy edges, a white heading, the big counter and a row of rating cards (Google, Trustpilot or customers, Facebook). | eyebrow, lead, id, title, counter, sources, image | content/<locale>/data/ratings.ts (counter, homeRatings, platforms) |
| `Testimonials` | Reviews & ratings | Customer quote cards in two columns with teal stars over the peach staff lines, and an optional link to all reviews. | eyebrow, lead, id, title, items, cta, labels | content/<locale>/data/reviews.ts, labels.ts (reviewLabels) |
| `ContactSection` | Calls to action | Peach section under a white wave: title, lead, the teal response-time pill and the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript. | form, title, lead, id, variant, returnTo | content/<locale>/data/forms.ts (quoteForm, giftCardForm) |

Rules of a component: it is agnostic of the content. It holds no words and no pictures (no copy, alt texts,
aria labels, placeholders or default texts; no picture imports or lookups; no `content/` data, no site strings):
everything a visitor reads or sees arrives as props or `children`. Pages pass their words and pictures directly,
from their folder and `content/<locale>/data` (`labels.ts` for the words around carousels, videos and reviews,
`forms.ts` for the request forms); the app (`src/app`) passes the chrome's. Composition is welcome where it helps
(a slot or `children` instead of a growing list of props). `tests/unit/components.test.ts` enforces this; Storybook
shows blocks with its own data (`src/stories`), never the site's.

Adding a block: first look for a block that already does it, and prefer a prop on it (a `variant`, a `layout`,
an optional field) over a near-duplicate. A new block is a component in its own file with its props typed and
documented in one `export interface <Name>Props` (one member per line, item shapes in `src/content/types.ts` or
beside it), a `catalogue.ts` entry (category, one line on when to pick it and when not, a documented example, which
regenerates this table and feeds `pnpm ds:blocks`), a story titled `Blocks/<Category>/<Name>` built from that example
(`storyArgs`) plus a story per variant, and the export in `index.tsx`. Shared pieces (a photo band, a carousel, a
button, a video) are primitives in `src/components/primitives`, not copies.
