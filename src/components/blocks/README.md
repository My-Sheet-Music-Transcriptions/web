# Block catalogue

Blocks are what pages are made of: a page (`content/<locale>/<collection>/<slug>/index.tsx`) imports them by name from
`~/components/blocks` and writes its prose with the typography components (`Text`, `Heading`, `List`, `TextLink`… from
`~/components/typography`; `<strong>` and `<em>` stay plain). Blocks are named for what they do, not for the page they
came from, and never import content: a page passes its lists as props (`items`, `tiers`, `sources`, `groups`),
imported from `content/<locale>/data/*.ts` or written in the page, and its pictures from its own folder. Each block
has a role (where it sits in a page), shown in this table, in `pnpm ds:blocks` and in Storybook
(`Blocks/<Role>/<Name>`); its story takes the catalogue's documented example and passes axe.

| Block | Role | Purpose | Props | Data source |
| --- | --- | --- | --- | --- |
| `Hero` | Opening | Homepage hero: studio photo slideshow cut by a white diagonal, brand lockup, headline with an orange highlight, two lines of copy, teal CTA and the floating rating card. Phones: the photo above the copy, no button or card. | title, highlight, lead, strong, strongMobile, ctaLabel, ctaHref, slideshow, rating | content/<locale>/data/ratings.ts (google) |
| `PageHeader` | Opening | Page opening. `band`: dark centred title band with an orange rule, then the instrument icon and the compact rating card when given (service pages). `split`: white, copy and button left, a picture or carousel right (landing pages). | title, subtitle, eyebrow, lead, cta, rating, variant, image, alt, images, tone, id | content/<locale>/data/ratings.ts (google) |
| `RatingBanner` | Proof | Full-bleed piano photo with white wavy edges, a white heading, the big counter and a row of rating cards (Google, Trustpilot or customers, Facebook). | title, counter, sources, image, id | content/<locale>/data/ratings.ts (counter, homeRatings, platforms) |
| `Testimonials` | Proof | Customer quote cards in two columns with teal stars over the peach staff lines, and an optional link to all reviews. | title, items, limit, cta, id | content/<locale>/data/reviews.ts |
| `LogoGrid` | Proof | Grid of logos (contained) or round portraits, each optionally named and linked, under a heading and a lead. | title, lead, items, shape, showNames, columns, tone, id | – |
| `Stats` | Proof | A row of big teal figures, each above what it measures, under an optional heading. | title, lead, items, tone, id | – |
| `Samples` | Proof | One row per sample: its title and the YouTube video (loaded on click) beside the score picture. | title, items, tone, id | – |
| `CardGrid` | Offer | Grid of cards (icon or picture, title, text, optional button). `surface`: card (white), tile (peach, the audiences) or plain. `background="photo"`: white cards over the studio photo band. `tabs`: the same cards in sets (currencies). | title, lead, items, tabs, columns, surface, background, image, tone, cta, id | content/<locale>/data/services.ts (included), home.ts (audiences) |
| `IconGrid` | Offer | Grid of illustrated icons with their labels, each linking to its page, and an optional button. | title, items, limit, columns, cta, id | content/<locale>/data/home.ts (serviceGrid), services.ts (allServices) |
| `PricingCards` | Offer | Three price-from cards with coloured headers, floating icons and pricing factors, or one wide card (price beside numbered factors) when given one tier; intro prose goes in the children. | title, tiers, children, cta, id | content/<locale>/data/home.ts (pricingTiers), services.ts (<service>Pricing) |
| `Steps` | How | `timeline`: numbered vertical list with an icon or number per step. `columns`: steps side by side, each with its picture or video (the homepage adds one wide illustration on desktop). | title, items, layout, illustration, illustrationAlt, tone, id | – |
| `Section` | Story | Generic titled section for prose: optional heading with rule, white/peach/cream background, three widths, an optional row of link buttons. | title, rule, tone, width, links, id, children | – |
| `MediaText` | Story | Prose beside media (picture with caption, carousel, before/after pair, video), optional eyebrow, heading and button; media left or right; `align="center"` puts the heading above and the button below (who we are). | title, eyebrow, image, alt, images, imagesLayout, video, imageSide, imageWidth, caption, cta, align, tone, id, children | – |
| `Gallery` | Story | `marquee`: strip of photos that scrolls by on its own (paused on hover and for reduced motion; hidden on phones). `grid`: square tiles with optional captions. `carousel`: one photo at a time. | images, variant, columns, title, label, id | – |
| `FaqList` | Story | Questions that open one at a time (no script), in titled groups with optional jump links, a button, and FAQPage structured data. | title, groups, jumpLinks, jsonLd, cta, tone, id | content/<locale>/data/faqs.ts (generalFaq and the FAQ page groups) |
| `Table` | Story | A table with a caption and column headings; links in cells; each row becomes a labelled card on phones. | title, caption, columns, rows, tone, id, children | – |
| `CtaBand` | Closing | Short centred band on cream or peach: optional eyebrow, a heading, a sentence, a button. | eyebrow, title, text, cta, tone, id | – |
| `ContactSection` | Closing | Peach section under a white wave: title, subtitle, the teal response-time pill and the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript. | title, subtitle, responseTime, id, variant, returnTo | – |

Adding a block: first look for a block that already does it, and prefer a prop on it (a `variant`, a `layout`,
an optional field) over a near-duplicate. A new block is a component in its own file with its props typed and
documented in one `export interface <Name>Props` (one member per line, item shapes in `src/content/types.ts` or
beside it), a `catalogue.ts` entry (role, one line on when to pick it and when not, a documented example, which
regenerates this table and feeds `pnpm ds:blocks`), a story titled `Blocks/<Role>/<Name>` built from that example
(`storyArgs`) plus a story per variant, and the export in `index.tsx`. Shared pieces (a photo band, a carousel, a
button, a video) are primitives in `src/components/primitives`, not copies.
