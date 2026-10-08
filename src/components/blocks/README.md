# Block catalogue

Blocks are the only components MDX pages may use. Every block has a story (`*.stories.tsx`) with its props and
an axe pass. Props are optional with sensible defaults taken from `src/content/<locale>/data`.

| Block | Purpose | Props | Data source |
| --- | --- | --- | --- |
| `Hero` | Homepage hero on white: headline with an orange highlight, two lines of copy, orange and outlined buttons beside the studio photo slideshow, then a row of three trust facts (Google rating, transcriptions delivered, response time) separated by hairlines. | title, highlight, lead, strong, ctaLabel, ctaHref, slideshow | content/en/data/home.ts (ratings) |
| `HowItWorks` | Three numbered columns under a hairline (send audio, we transcribe, print & play), each with its illustration. | title, eyebrow, id | content/en/data/home.ts (howItWorks) |
| `StatsBanner` | Full-bleed navy band over a dimmed piano photo: big counter and the three ratings (Google, customers, Facebook) in hairline columns. | title, eyebrow, counterValue, counterLabel | content/en/data/home.ts (counter, ratings) |
| `AudienceCards` | Four columns under a hairline describing who the service is for, each with its illustration and a link to its audience page. | title, eyebrow | content/en/data/home.ts (audiences) |
| `ServiceGrid` | Four-column list of services, each row an instrument icon and a name over a hairline, with a "see all services" link. | title, eyebrow, ctaLabel, ctaHref, limit | content/en/data/home.ts (serviceGrid) |
| `FeatureCards` | "What's included": three columns under a hairline (turnaround, formats, accuracy), each with its icon. | title, eyebrow | content/en/data/home.ts (included) |
| `PricingTiers` | Heading beside the intro prose (children), then three price-from columns with a coloured top rule and a pricing-factor checklist. | title, eyebrow, children, ctaLabel, ctaHref | content/en/data/home.ts (pricingTiers) |
| `ImageStrip` | Horizontal strip of sheet-music photos; scrolls on touch, no autoplay. | items | src/assets/images/home/strip-*.jpg |
| `ReviewCards` | Customer quotes in two columns, each under a hairline with teal stars and the reviewer below, and a link to all reviews. | title, eyebrow, limit, ctaLabel, ctaHref | content/en/data/reviews.ts |
| `AboutTeaser` | Office photo carousel beside the team introduction (children) and a "read more" link. | title, eyebrow, children, ctaLabel, ctaHref | src/assets/images/home/office-*.jpg |
| `ContactSection` | Full-bleed peach band: intro and contact facts beside the request form. `variant="quote"` (default): name, email, music link, instruments, file, message, phone. `variant="gift-card"`: name, email, amount, currency, details. Submits to the contact server function; works without JavaScript. | title, eyebrow, subtitle, responseTime, id, variant, returnTo | – |
| `PageHero` | Page header for non-home pages on a full-bleed navy (or ink) band: eyebrow, title and optional subtitle. | title, subtitle, eyebrow, tone | – |
| `Section` | Generic titled section for prose or ad-hoc layouts: optional eyebrow and left-aligned heading (optional short rule), white/peach/cream/surface background, three widths. | title, eyebrow, rule, tone, width, id, children | – |
| `MediaText` | Prose beside a picture: optional eyebrow and heading, caption under the picture, optional button; picture left or right, white/cream/peach/surface. | title, eyebrow, image, alt, imageSide, imageWidth, caption, cta, tone, id, children | – |
| `Steps` | Numbered list: each step is a teal icon square, a "Step n" eyebrow and one line of text, separated by hairlines; optional eyebrow and heading. | title, eyebrow, steps, tone, id | – |

Adding a block: component in its own file, props typed and documented, story with at least the default state,
a row in this table, and the export in `index.tsx`.
