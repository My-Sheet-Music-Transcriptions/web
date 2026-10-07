# Block catalogue

Blocks are the only components MDX pages may use. Every block has a story (`*.stories.tsx`) with its props and
an axe pass. Props are optional with sensible defaults taken from `src/content/<locale>/data`.

| Block | Purpose | Props | Data source |
| --- | --- | --- | --- |
| `Hero` | Homepage hero: brand lockup, headline with an orange highlight, two lines of copy, teal CTA, studio photo slideshow and the floating Google rating card. | title, highlight, lead, strong, ctaLabel, ctaHref, slideshow | content/en/data/home.ts (ratings) |
| `HowItWorks` | Three numbered steps (send audio, we transcribe, print & play) with one wide illustration on desktop. | title, id | content/en/data/home.ts (howItWorks) |
| `StatsBanner` | Full-bleed photo banner with wavy edges, a big counter and three rating cards (Google, customers, Facebook). | title, counterValue, counterLabel | content/en/data/home.ts (counter, ratings) |
| `AudienceCards` | Four peach cards describing who the service is for, each linking to an audience page. | title | content/en/data/home.ts (audiences) |
| `ServiceGrid` | Grid of instrument icons linking to service pages, with a "see all services" button. | title, ctaLabel, ctaHref, limit | content/en/data/home.ts (serviceGrid) |
| `FeatureCards` | "What's included": three white cards (turnaround, formats, accuracy) over a studio photo. | title | content/en/data/home.ts (included) |
| `PricingTiers` | Three price-from cards with coloured headers and pricing factors; intro prose goes in the children. | title, children, ctaLabel, ctaHref | content/en/data/home.ts (pricingTiers) |
| `ImageStrip` | Horizontal strip of sheet-music photos; scrolls on touch, no autoplay. | items | src/assets/images/home/strip-*.jpg |
| `ReviewCards` | Customer quote cards with teal stars and a link to all reviews. | title, limit, ctaLabel, ctaHref | content/en/data/reviews.ts |
| `AboutTeaser` | Office photo carousel next to the team introduction (children) and a "read more" button. | title, children, ctaLabel, ctaHref | src/assets/images/home/office-*.jpg |
| `ContactSection` | Peach section with the quote request form (name, email, music link, instruments, file, message, phone). Submits to the contact server function; works without JavaScript. | title, subtitle, responseTime, id | – |
| `PageHero` | Dark page header for non-home pages: title, optional subtitle and eyebrow, short orange rule. | title, subtitle, eyebrow, tone | – |
| `Section` | Generic titled section for prose or ad-hoc layouts: optional heading with rule, white/peach/cream background, three widths. | title, rule, tone, width, id, children | – |

Adding a block: component in its own file, props typed and documented, story with at least the default state,
a row in this table, and the export in `index.tsx`.
