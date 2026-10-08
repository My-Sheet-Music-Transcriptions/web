# Block catalogue

Blocks are the only components MDX pages may use. Every block has a story (`*.stories.tsx`) with its props and
an axe pass. Props are optional with sensible defaults taken from `src/content/<locale>/data`.

| Block | Purpose | Props | Data source |
| --- | --- | --- | --- |
| `Hero` | Homepage hero: Google rating chip, headline with an orange highlight, two lines of copy, orange + outlined CTAs, and the studio photo slideshow in a rounded frame with the delivery counter and the floating Google rating card. | title, highlight, lead, strong, ctaLabel, ctaHref, slideshow | content/en/data/home.ts (ratings) |
| `HowItWorks` | Three numbered step cards (send audio, we transcribe, print & play), each with its illustration. | title, eyebrow, id | content/en/data/home.ts (howItWorks) |
| `StatsBanner` | Rounded navy panel over a dimmed piano photo with a big counter and three rating cards (Google, customers, Facebook). | title, eyebrow, counterValue, counterLabel | content/en/data/home.ts (counter, ratings) |
| `AudienceCards` | Four white cards on the cool surface describing who the service is for, each linking to an audience page. | title, eyebrow | content/en/data/home.ts (audiences) |
| `ServiceGrid` | Grid of instrument tiles linking to service pages, with a "see all services" button. | title, eyebrow, ctaLabel, ctaHref, limit | content/en/data/home.ts (serviceGrid) |
| `FeatureCards` | "What's included": three white cards (turnaround, formats, accuracy) on the warm cream band. | title, eyebrow | content/en/data/home.ts (included) |
| `PricingTiers` | Three price-from cards with a coloured top edge and a pricing-factor checklist; intro prose sits beside the heading (children). | title, eyebrow, children, ctaLabel, ctaHref | content/en/data/home.ts (pricingTiers) |
| `ImageStrip` | Horizontal strip of sheet-music photos; scrolls on touch, no autoplay. | items | src/assets/images/home/strip-*.jpg |
| `ReviewCards` | Customer quote cards (initials avatar, teal stars) on the cool surface and a link to all reviews. | title, eyebrow, limit, ctaLabel, ctaHref | content/en/data/reviews.ts |
| `AboutTeaser` | Office photo carousel beside the left-aligned team introduction (children) and a "read more" button. | title, eyebrow, children, ctaLabel, ctaHref | src/assets/images/home/office-*.jpg |
| `ContactSection` | Peach section: intro and contact facts beside the request form in a white card. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript. | title, eyebrow, subtitle, responseTime, id, variant, returnTo | – |
| `PageHero` | Page header for non-home pages on a navy (or dark slate) gradient: eyebrow, title and optional subtitle. | title, subtitle, eyebrow, tone | – |
| `Section` | Generic titled section for prose or ad-hoc layouts: optional eyebrow and heading with rule, white/peach/cream/surface background, three widths. | title, eyebrow, rule, tone, width, id, children | – |
| `MediaText` | Prose beside a picture: optional eyebrow and heading, caption under the picture, optional button; picture left or right, white/cream/peach/surface. | title, eyebrow, image, alt, imageSide, imageWidth, caption, cta, tone, id, children | – |
| `Steps` | Numbered vertical timeline: a teal disc with an icon per step, "Step n" eyebrow and one line of text; optional eyebrow and heading. | title, eyebrow, steps, tone, id | – |

Adding a block: component in its own file, props typed and documented, story with at least the default state,
a row in this table, and the export in `index.tsx`.
