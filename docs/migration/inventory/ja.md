# Japanese site inventory: mysheetmusictranscriptions.jp

Generated on 2026-10-08 for the migration plan ([`../PLAN.md`](../PLAN.md)); machine-readable copy: [`ja.json`](./ja.json). This site's inventory is **less complete than the English one**: its only archived sitemap is from 2022; the list adds the live menu (Common Crawl, Sept 2026) and the English pages' hreflang tags. **Step W0.2 of the plan replaces it with the live sitemap before any page of this locale is ported.**

**Found in**: `sitemap:<type>` = Yoast sitemap · `crawl` = archived page reached from the menu · `live-2026-home` = linked from the live homepage (Common Crawl) · `en-hreflang` = named by an English page's hreflang · `archive` = some capture exists in the Internet Archive · `linked` = linked but never archived.

| Action | URLs |
|---|---|
| Port | 18 |
| Verify first (linked from the live site, never archived) | 2 |
| Decide first (see the plan's decisions) | 3 |
| Redirect (retired URLs) | 5 |
| **Total** | **28** |

## Port

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/`](https://mysheetmusictranscriptions.jp) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/` | 採譜サービス | 2025-09 | home (translationKey home) | |
| [`/about-us`](https://mysheetmusictranscriptions.jp/about-us) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/about-us` | MSMTについて | 2024-06 | translation of EN /about-us | |
| [`/contact`](https://mysheetmusictranscriptions.jp/contact) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/contact` | お問い合せ | 2024-06 | translation of EN /contact | |
| [`/cookies-policy`](https://mysheetmusictranscriptions.jp/cookies-policy) | crawl, archive, live-2026-home, en-hreflang | pages | `/cookies` | Cookies Policy | 2024-05 | translation of EN /cookies | |
| [`/data-protection-and-privacy-policy`](https://mysheetmusictranscriptions.jp/data-protection-and-privacy-policy) | crawl, archive, live-2026-home, en-hreflang | pages | `/gdpr` | Data Protection and Privacy Policy | 2024-05 | translation of EN /gdpr | |
| [`/faqs`](https://mysheetmusictranscriptions.jp/faqs) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/frequent-asked-questions` | FAQs | 2024-04 | translation of EN /frequent-asked-questions | |
| [`/how-does-it-work`](https://mysheetmusictranscriptions.jp/how-does-it-work) | sitemap:page, crawl, archive, live-2026-home | pages |  | 採譜サービス \| 100%正確 & プロフェッショナル | 2024-07 | no EN hreflang pair recorded: match by content | |
| [`/musical-services`](https://mysheetmusictranscriptions.jp/musical-services) | linked, live-2026-home | pages |  |  | — | services overview (EN /services-samples) | |
| [`/pricing`](https://mysheetmusictranscriptions.jp/pricing) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/pricing` | 採譜　料金 | 2024-05 | translation of EN /pricing | |
| [`/reviews`](https://mysheetmusictranscriptions.jp/reviews) | sitemap:page, linked, archive, live-2026-home, en-hreflang | pages | `/customer-reviews` |  | 2021-10 | translation of EN /customer-reviews | |
| [`/terms-of-use`](https://mysheetmusictranscriptions.jp/terms-of-use) | crawl, archive, live-2026-home, en-hreflang | pages | `/terms-of-use` | Terms of use | 2024-04 | translation of EN /terms-of-use | |
| [`/music-blog`](https://mysheetmusictranscriptions.jp/music-blog) | linked, live-2026-home | (route) |  |  | — | blog index route (routes.blogIndex) | |
| [`/services/bass`](https://mysheetmusictranscriptions.jp/services/bass) | linked, live-2026-home, en-hreflang | services | `/bass-tab-transcription-service` |  | — | translation of EN /bass-tab-transcription-service | |
| [`/services/guitar`](https://mysheetmusictranscriptions.jp/services/guitar) | linked, live-2026-home | services |  |  | — | nested /services/<slug> URL: port flat, 301 the old path (D8) | |
| [`/services/jazz-piano-solo`](https://mysheetmusictranscriptions.jp/services/jazz-piano-solo) | linked, live-2026-home, en-hreflang | services | `/jazz-piano-solo-transcriptions` |  | — | translation of EN /jazz-piano-solo-transcriptions | |
| [`/services/piano`](https://mysheetmusictranscriptions.jp/services/piano) | linked, live-2026-home, en-hreflang | services | `/piano` |  | — | translation of EN /piano | |
| [`/services/piano-vocal`](https://mysheetmusictranscriptions.jp/services/piano-vocal) | linked, live-2026-home | services |  |  | — | nested /services/<slug> URL: port flat, 301 the old path (D8) | |
| [`/services/vocal-ensambles`](https://mysheetmusictranscriptions.jp/services/vocal-ensambles) | linked, live-2026-home | services |  |  | — | nested /services/<slug> URL: port flat, 301 the old path (D8) | |

## Verify first (linked from the live site, never archived)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/precios`](https://mysheetmusictranscriptions.jp/precios) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/preguntas-frecuentes`](https://mysheetmusictranscriptions.jp/preguntas-frecuentes) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |

## Decide first (see the plan's decisions)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/pay`](https://mysheetmusictranscriptions.jp/pay) | sitemap:page, archive | pages |  |  | 2022-08 | payment page (D4) | |
| [`/pay-cancel`](https://mysheetmusictranscriptions.jp/pay-cancel) | sitemap:page, archive | pages |  |  | 2022-08 | payment page (D4) | |
| [`/pay-ok`](https://mysheetmusictranscriptions.jp/pay-ok) | sitemap:page, archive | pages |  |  | 2022-08 | payment page (D4) | |

## Redirect (retired URLs)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/black-friday-23`](https://mysheetmusictranscriptions.jp/black-friday-23) | archive | — |  |  | 2023-12 | expired promo → pricing page | |
| [`/review/yu-pi`](https://mysheetmusictranscriptions.jp/review/yu-pi) | archive | reviews |  |  | 2024-06 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/spring-24`](https://mysheetmusictranscriptions.jp/spring-24) | archive | — |  |  | 2024-04 | expired promo → pricing page | |
| [`/summer-26`](https://mysheetmusictranscriptions.jp/summer-26) | live-2026-home | — |  |  | — | expired promo → pricing page | |
| [`/summer-discounts-23`](https://mysheetmusictranscriptions.jp/summer-discounts-23) | archive | — |  |  | 2023-09 | expired promo → pricing page | |
