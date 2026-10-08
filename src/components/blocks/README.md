# Block catalogue

Blocks are what pages are made of: a page (`content/<locale>/<collection>/<slug>/index.tsx`) imports them by name from
`~/components/blocks` and writes its prose with the typography components (`Text`, `Heading`, `List`, `TextLink`… from
`~/components/typography`; `<strong>` and `<em>` stay plain). Every block has a story (`*.stories.tsx`) with its props
and an axe pass. Props are optional with sensible defaults taken from `content/<locale>/data`.

| Block | Purpose | Props | Data source |
| --- | --- | --- | --- |
| `Hero` | Homepage hero: studio photo slideshow cut by a white diagonal, brand lockup, headline with an orange highlight, two lines of copy, teal CTA and the floating Google rating card. Phones: the photo above the copy, no button or card. | title, highlight, lead, strong, strongMobile, ctaLabel, ctaHref, slideshow | content/en/data/home.ts (ratings) |
| `HowItWorks` | Three numbered steps (send audio, we transcribe, print & play) with one wide illustration on desktop, one per step on phones. | title, id | content/en/data/home.ts (howItWorks) |
| `StatsBanner` | Full-bleed piano photo with white wavy edges, a big counter and three rating cards (Google, customers, Facebook). | title, counterValue, counterLabel | content/en/data/home.ts (counter, ratings) |
| `AudienceCards` | Four rounded peach cards in one row describing who the service is for, each linking to an audience page. | title | content/en/data/home.ts (audiences) |
| `ServiceGrid` | Four-column grid of instrument icons linking to service pages, with a "see all services" button. | title, ctaLabel, ctaHref, limit | content/en/data/home.ts (serviceGrid) |
| `FeatureCards` | "What's included": three white cards (turnaround, formats, accuracy) over a studio photo. | title | content/en/data/home.ts (included) |
| `PricingTiers` | Three price-from cards with coloured headers and pricing factors; intro prose goes in the children. | title, children, ctaLabel, ctaHref | content/en/data/home.ts (pricingTiers) |
| `ImageStrip` | Strip of ten sheet-music photos that scrolls by on its own (paused on hover and for reduced motion); hidden on phones. | items | src/assets/images/home/strip-*.jpg |
| `ReviewCards` | Customer quote cards in two columns with teal stars over the peach staff lines, and a link to all reviews. | title, limit, ctaLabel, ctaHref | content/en/data/reviews.ts |
| `AboutTeaser` | Office photo carousel (slides every 10 s) next to the team introduction (children) and a "read more" button. | title, children, ctaLabel, ctaHref | src/assets/images/home/office-*.jpg |
| `ContactSection` | Peach section under a white wave: title, subtitle, the teal response-time pill and the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript. | title, subtitle, responseTime, id, variant, returnTo | – |
| `PageHero` | Dark page header for non-home pages: title, optional subtitle and eyebrow, short orange rule. | title, subtitle, eyebrow, tone | – |
| `Section` | Generic titled section for prose or ad-hoc layouts: optional heading with rule, white/peach/cream background, three widths. | title, rule, tone, width, id, children | – |
| `MediaText` | Prose beside a picture: optional heading, caption under the picture, optional button; picture left or right, white/cream/peach. | title, image, alt, imageSide, imageWidth, caption, cta, tone, id, children | – |
| `Steps` | Numbered vertical timeline: a primary disc with an icon per step, "Step n" eyebrow and one line of text; optional heading. | title, steps, tone, id | – |

Adding a block: component in its own file, props typed and documented, story with at least the default state,
a `catalogue.ts` entry (which regenerates this table and feeds `pnpm ds:blocks`, the index whoever composes a
page reads: say in one line where the block sits in a page, when to pick it and when not), and the export in
`index.tsx`.
