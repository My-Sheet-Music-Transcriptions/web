# Block catalogue

Blocks are the only components MDX pages may use. Every block has a story (`*.stories.tsx`) with its props and
an axe pass. Props are optional with sensible defaults taken from `src/content/<locale>/data`.

| Block | Purpose | Key props | Data source |
| --- | --- | --- | --- |
| `Hero` | Homepage hero with photo, headline (`#1` highlighted), CTA, floating Google card | title, highlight, lead, strong, ctaLabel, ctaHref | data/home.ts ratings |
| `HowItWorks` | Three numbered steps with illustration | title, id | data/home.ts howItWorks |
| `StatsBanner` | Photo banner with wavy edges, counter and 3 rating cards | title, counterValue, counterLabel | data/home.ts ratings, counter |
| `AudienceCards` | Four peach audience tiles | title | data/home.ts audiences |
| `ServiceGrid` | Instrument icon grid linking to services | title, limit, ctaLabel, ctaHref | data/home.ts serviceGrid |
| `FeatureCards` | "What's included" three cards over photo | title | data/home.ts included |
| `PricingTiers` | Price-from cards; children = intro prose | title, ctaLabel, ctaHref | data/home.ts pricingTiers |
| `ImageStrip` | Horizontal strip of sheet-music photos | items | assets/images/home/strip-* |
| `ReviewCards` | Quote cards with teal stars | title, limit, ctaLabel, ctaHref | data/reviews.ts |
| `AboutTeaser` | Office photo carousel + rich text children | title, ctaLabel, ctaHref | assets/images/home/office-* |
| `ContactSection` | Peach section with the quote request form | title, subtitle, responseTime | server fn `submitContact` |
| `PageHero` | Dark page header (non-home templates) | title, subtitle, eyebrow, tone | – |
| `Section` | Generic titled section for prose | title, rule, tone, width | – |

Adding a block: component in its own file, props typed and documented, story with at least the default state,
a row in this table, and the export in `index.tsx`.
