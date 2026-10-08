# Redirect map (draft)

Part of the [migration plan](./PLAN.md). This is the **draft** list of rules each production site needs on the day its
domain moves to Netlify. It is built from what can be seen from outside: URLs the Internet Archive captured, redirects the
live sites answered in 2025–2026, and old slugs. **It is incomplete until step W0.1 adds the WordPress-side sources**:

- the redirect plugin's export of every site (Redirection or Yoast Premium → Redirects → export CSV);
- WordPress's automatic old-slug redirects, which no plugin export contains:
  `SELECT p.post_name, m.meta_value AS old_slug FROM wp_postmeta m JOIN wp_posts p ON p.ID = m.post_id WHERE m.meta_key = '_wp_old_slug';`
- Search Console (Pages → "Not found (404)" and Links → "Top linked pages") and any backlink export, to decide which
  long-dead URLs still deserve a rule.

Status legend: **live** = the live site answered this redirect in 2025–2026 (archived) · **planned** = new rule needed
because the URL stops existing · **verify** = an archived URL whose current behaviour is unknown; check it before adding
a rule.

## How rules will ship (built in W1, see the plan)

- One typed list per locale, `content/<locale>/redirects.ts` (`{ from, to, status }`), written to
  `dist/client/_redirects` by `scripts/postbuild.ts` for that locale's production build (domain mode) and with the
  `/<locale>` prefix in preview builds, so every rule can be tried on a deploy preview.
- Unit test: no chains (a rule never points at another rule's `from`), no loops, every internal `to` is a page the build
  produces, no `from` shadows an existing page.
- Cutover gate (`tests/migration`): every `port` path in `docs/migration/inventory/<locale>.json` exists in `dist/client`,
  every `redirect` path has a rule, and the target answers 200 in one hop.
- `301` for moves, `410` for things removed on purpose (shop products with no successor, test pages are left to 404).
  Netlify keeps the query string on redirects by default (to be confirmed on a preview with `?gclid=`).

## Host-level (Netlify domain settings, not `_redirects`)

| Site | Primary host (unchanged) | Also answer and 301 to primary |
|---|---|---|
| en | `https://www.mysheetmusictranscriptions.com` | `mysheetmusictranscriptions.com`, `http://` |
| es | `https://www.mistranscripcionesmusicales.com` | `mistranscripcionesmusicales.com` (live hreflang tags point here today), `http://` |
| fr | `https://mapartitionsurmesure.com` | `www.` , `http://` |
| de | `https://meinemusiktranskription.de` | `www.` , `http://` |
| ja | `https://mysheetmusictranscriptions.jp` | `www.` (other sites' hreflang tags point at `www.` today), `http://` |
| ca | `https://lamevapartitura.cat` | `www.`, `http://` (launch wave C1) |

Trailing slash: WordPress canonicals have no trailing slash (`/pricing`). The new site must answer `/pricing` with 200
(no redirect) and `/pricing/` with a 301 to `/pricing`. The build writes `pricing/index.html`
(`autoSubfolderIndex: true`); check on a deploy preview what Netlify does with that layout before cutover (W1.3).

## English (`www.mysheetmusictranscriptions.com`)

### Pattern rules

| From | To | Status | Why |
|---|---|---|---|
| `/popular/*` | `/:splat` | planned | "Popular" artist pages are listed flat in the sitemap, but their canonical on the live site was `/popular/<slug>` (2024 captures) |
| `/endorsed/*` | `/:splat` | planned | same for endorsed musicians (`/endorsed/<slug>` canonicals) |
| `/endorsed` | `/endorsed-musicians-and-composers` | planned | custom post type archive ("CPT - Endorsed Archive") |
| `/musician` | `/endorsed-musicians-and-composers` | verify | same archive under its old name |
| `/musicians/*` | `/artists` | verify | 2021–22 artist pages (115 archived URLs), gone from the sitemaps |
| `/tag/*`, `/category/*`, `/author/*` | `/music-blog` | planned | WordPress archives are not rebuilt |
| `/music-blog/page/:n` | (kept) | planned | keep the same pagination scheme on the blog index so no rule is needed |
| `/:year/:month/:file.html` | from the plugin export, else `/music-blog` | live | Blogger-era URLs (2013–2018, ~500 archived); the live site 301s them today, target unknown |
| `/p/*` | from the plugin export, else `/` | live | Blogger static pages (`/p/payments.html`…) |
| `/home/*` | `/` | verify | old attachment pages of the home page |
| `/team/*`, `/about-us/*` | `/about-us` | verify | team member pages (`/team/santi` captured 2026-03) |
| `/faqs/*` | `/frequent-asked-questions` | planned | D5: 100 single FAQ entries (`/faqs/synthesia`…) answer on the WP REST API (`/wp-json/wp/v2/faqs`), not in the sitemaps; their content lives in `content/en/data/faqs.ts` |
| `/shop/*` | `https://catalog.mysheetmusictranscriptions.com/shop/:splat` | live | the live site already sends at least one product there (decision D4/D6) |
| `/shop` | `https://catalog.mysheetmusictranscriptions.com/` | planned | D4 |
| `/catalog` | `https://catalog.mysheetmusictranscriptions.com/` | live | |
| `/sitemap_index.xml`, `/sitemap.xml` → kept, `/*-sitemap.xml` | `/sitemap.xml` | planned | Search Console has the Yoast sitemaps registered |
| `/feed`, `/music-blog/feed` | RSS feed or `/music-blog` | planned | decision D11 |
| `/cart`, `/checkout`, `/my-account/*`, `/my-dashboard` | hub or `/` | planned | WooCommerce endpoints (D4) |
| `/wp-admin/*`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*` | (none: 404) | planned | |
| `/wp-content/uploads/*` | (none: 404) unless Search Console shows image traffic | planned | decision D10 |

### One-to-one rules

| From | To | Status | Note |
|---|---|---|---|
| `/blog` | `/music-blog` | live | |
| `/about` | `/about-us` | verify | "Behind the scenes" page, archived 2021 |
| `/login` | `https://hub.mysheetmusictranscriptions.com/` | planned | the header links to the hub directly already |
| `/sign-up` | `https://hub.mysheetmusictranscriptions.com/signup` | planned | if the page is not ported (D-list W7) |
| `/ukelele-mandolin-transcription-service` | `/ukulele-transcription-service` | live | live chain of two hops, flatten |
| `/ukulele-mandolin-transcription-service` | `/ukulele-transcription-service` | live | |
| `/caitlinOfficial` | from the plugin export | live | vanity link; expect more of these in the export |
| `/bill-evans-sheet-music` | `/bill-evans-sheet-music-transcriptions` | verify | |
| `/emile-pandolfi` | `/emile-pandolfi-sheet-music-transcriptions` | verify | |
| `/michael-petrucciani`, `/michael-petrucciani-sheet-music` | `/michel-petrucciani-sheet-music` | verify | |
| `/peter-vamos-sheet-music` | `/peter-vamos-transcription-service` | verify | |
| `/piano-exam-argh` | `/a-piano-exam-argh` | verify | |
| `/the-best-music-biopics-out-there` | `/best-music-biopics` | verify | |
| `/transcribing-like-a-pro-tips-tricks` | `/transcribe-like-a-pro-tips-tricks` | verify | |
| `/rhythmic-charts-transcription-service` | `/rhythm-charts` | verify | |
| `/sheet-music-printing-service`, `/us-sheet-music-printing-service` | `/sheet-music-printing` | verify | |
| `/services/piano` | `/piano` | verify | |
| `/decoding-lever-harp-music-notation-a-guide-for-composers-and-arrangers` | `/decoding-pedal-harp-music-notation-a-guide-for-composers-and-arrangers` | verify | or a post of its own: check |
| `/cv19` | `/covid19` | verify | |
| `/audio-to-sheet-music` | `/music-transcription-service` | verify | archived 2017 |
| `/pricing-4` | `/pricing` | verify | |
| `/sheet-music-catalog`, `/list-catalog` | `/sheet-music-catalogue` | verify | D6 |
| `/music-services` | `/services-samples` | verify | |
| `/music-days`, `/music-facts`, `/music-in-movies`, `/music-news`, `/music-notes`, `/music-tips`, `/music-writing`, `/our-favorites`, `/our-music-rankings` | `/music-blog` | verify | old blog sections |
| `/black-friday-22`, `/black-friday-23`, `/black-friday-2024`, `/black-friday-2025`, `/spring-22`, `/spring-23`, `/spring-24`, `/summer-discounts-23`, `/new-summer-discounts-23`, `/easter-23`, `/halloween-22`, `/fall-25` | `/pricing` | verify | expired promos; port the current promo (`/spring-2026` or its successor) instead (D-list W7) |
| `/thank-you`, `/thank-you-artist`, `/thank-you-b2b` | `/` | verify | old form targets; the new forms confirm inline |
| `/pay`, `/pay-all`, `/pay-aud`, `/pay-eur`, `/pay-gbp`, `/pay-cancel`, `/pay-success`, `/payment-successfull` | D4 | verify | payment pages |
| `/musicnotes` or `/music-4-humans` (the loser of each collision) | the winner | planned | see "Slug collisions" in the plan |

## Spanish (`www.mistranscripcionesmusicales.com`)

| From | To | Status | Note |
|---|---|---|---|
| `/category/*`, `/author/*`, `/:year/:month/:day` | `/blog` | planned | |
| `/review/*` | `/opiniones` | planned | decision D5 (19 archived review entries) |
| `/equipo/*` | `/sobre-nosotros` | planned | D5 (34 archived team entries) |
| `/faqs/*` | `/preguntas-frecuentes` | planned | D5 |
| `/orquestaciones` or `/orquestraciones` | the other one | planned | both exist and both claim EN `/orchestration-service`; the hreflang tag uses `/orquestraciones` |
| `/servicios/orquestraciones` | `/orquestraciones` | verify | old nested URL |
| `/política-de-cookies` | `/politica-de-cookies` | verify | accented duplicate linked from a page |
| `/transcribe-como-un-profesional` | `/transcribir-como-un-profesional` | verify | |
| `/tienda`, `/carrito`, `/finalizar-compra`, `/mi-cuenta` | `/` | planned | WooCommerce (D4) |
| `/black-friday-22`, `/black-friday-23`, `/summer-discounts-23`, `/summer-24` | `/precios` | verify | expired promos |
| `/como-pagar` | D4 | verify | payment page |

## French (`mapartitionsurmesure.com`)

| From | To | Status | Note |
|---|---|---|---|
| `/category/*`, `/author/*`, `/:year/:month/:day` | `/music-blog` | planned | |
| `/services/transcriptions-de-batterie` | `/transcriptions-de-batterie` | verify | old nested URL |
| `/black-friday-23`, `/spring-24`, `/summer-discounts-23`, `/summer-26` | `/tarifs` | verify | promos |
| `/comment-payer`, `/jellynote`, `/jellynote-merci` | D4 / keep | verify | |
| `/home-new` | (none: 404) | planned | draft page |

## German (`meinemusiktranskription.de`)

| From | To | Status | Note |
|---|---|---|---|
| `/category/*`, `/author/*` | `/musikblog` | planned | |
| `/services` | `/dienstleistungen` | planned | services archive |
| 30 team entries (`/oriol`, `/eric`… see [`inventory/de.md`](./inventory/de.md)) | `/uber-uns` | planned | flat slugs from the 2024 `team` sitemap (D5); one rule each, generated from the inventory |
| 16 review entries (`/caryl-mansfield`, `/stephane-l`…) | `/kundenbewertungen` | planned | D5 |
| 13 FAQ entries (`/piano-et-voix`, `/a-propos`…) | `/faq` | planned | D5; French slugs inherited from the FR site clone |
| `/black-friday-2024`, `/black-friday-23`, `/summer-25`, `/fall-25`, `/summer-discounts-23` | `/preisgestaltung` | verify | promos |
| `/comment-payer`, `/jellynote`, `/jellynote-merci` | D4 / keep | verify | French slugs on the German site |

## Japanese (`mysheetmusictranscriptions.jp`)

| From | To | Status | Note |
|---|---|---|---|
| `/services/*` | `/:splat` | planned | only if D8 flattens the nested service URLs; otherwise no rule |
| `/review/*` | `/reviews` | planned | D5 |
| `/pay`, `/pay-ok`, `/pay-cancel` | D4 | verify | payment pages in the 2022 sitemap |
| `/black-friday-23`, `/spring-24`, `/summer-discounts-23`, `/summer-26` | `/pricing` | verify | promos |

## Catalan (`lamevapartitura.cat`)

The draft WordPress site has seven URLs ([`inventory/ca.md`](./inventory/ca.md)); two keep their slug.

| From | To | Status | Note |
|---|---|---|---|
| `/la-meva-partitura` | `/` | planned | draft page |
| `/contacte-2` | `/contacte` | planned | duplicate draft |
| `/descartes`, `/sample-page` | (none: 404) | planned | parking page and WordPress default |
