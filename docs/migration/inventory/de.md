# German site inventory: meinemusiktranskription.de

Generated on 2026-10-08 for the migration plan ([`../PLAN.md`](../PLAN.md)); machine-readable copy: [`de.json`](./de.json). This site's inventory is **less complete than the English one**: the sitemap index captured in 2025-10 lists only posts, pages and services; the `faqs`, `review`, `team`, `category` and `author` sitemaps are from 2024-04 and were dropped since, so those URLs are probably noindex or gone. **Step W0.2 of the plan replaces it with the live sitemap before any page of this locale is ported.**

**Found in**: `sitemap:<type>` = Yoast sitemap · `crawl` = archived page reached from the menu · `live-2026-home` = linked from the live homepage (Common Crawl) · `en-hreflang` = named by an English page's hreflang · `archive` = some capture exists in the Internet Archive · `linked` = linked but never archived.

| Action | URLs |
|---|---|
| Port | 36 |
| Verify first (linked from the live site, never archived) | 11 |
| Decide first (see the plan's decisions) | 3 |
| Redirect (retired URLs) | 69 |
| Drop (test pages: let them 404) | 1 |
| **Total** | **120** |

## Port

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/`](https://meinemusiktranskription.de) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/` | Meine musik transkription - Musik-Transkriptionsdienste | 2025-10 | home (translationKey home) | |
| [`/bedingungen-fur-die-nutzung`](https://meinemusiktranskription.de/bedingungen-fur-die-nutzung) | crawl, archive, live-2026-home, en-hreflang | pages | `/terms-of-use` | Bedingungen für die Nutzung | 2024-05 | translation of EN /terms-of-use | |
| [`/cookie-richtlinien`](https://meinemusiktranskription.de/cookie-richtlinien) | crawl, archive, live-2026-home, en-hreflang | pages | `/cookies` | Cookie Richtlinien | 2024-05 | translation of EN /cookies | |
| [`/datenschutzerklarung`](https://meinemusiktranskription.de/datenschutzerklarung) | crawl, archive, live-2026-home, en-hreflang | pages | `/gdpr` | Datenschutzerklärung | 2024-05 | translation of EN /gdpr | |
| [`/datenschutzrichtlinie`](https://meinemusiktranskription.de/datenschutzrichtlinie) | linked, live-2026-home | pages |  |  | — | legal page (translationKey of the EN legal page) | |
| [`/dienstleistungen`](https://meinemusiktranskription.de/dienstleistungen) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/services-samples` | Dienstleistungen | 2024-05 | translation of EN /services-samples | |
| [`/faq`](https://meinemusiktranskription.de/faq) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/frequent-asked-questions` | FAQs | 2025-10 | translation of EN /frequent-asked-questions | |
| [`/kontakt`](https://meinemusiktranskription.de/kontakt) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/contact` | Kontaktieren Sie den Transkriptionsservice | 2025-10 | translation of EN /contact | |
| [`/kundenbewertungen`](https://meinemusiktranskription.de/kundenbewertungen) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/customer-reviews` | Kundenbewertungen | 2024-05 | translation of EN /customer-reviews | |
| [`/preisgestaltung`](https://meinemusiktranskription.de/preisgestaltung) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/pricing` | Preise und Beispiele für Musiktranskriptionen | 2024-05 | translation of EN /pricing | |
| [`/uber-uns`](https://meinemusiktranskription.de/uber-uns) | sitemap:page, crawl, archive, live-2026-home, en-hreflang | pages | `/about-us` | Lerne unser Team kennen | 2024-05 | translation of EN /about-us | |
| [`/musikblog`](https://meinemusiktranskription.de/musikblog) | linked, live-2026-home | (route) |  |  | — | blog index route (routes.blogIndex) | |
| [`/bass`](https://meinemusiktranskription.de/bass) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/bass-tab-transcription-service` | Bass-Transkriptionsdienst | 2024-05 | translation of EN /bass-tab-transcription-service | |
| [`/blaskapellen-transkriptionsdienst`](https://meinemusiktranskription.de/blaskapellen-transkriptionsdienst) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/concert-brass-band-transcriptions` | Blaskapellen-Transkriptionsdienst | 2024-05 | translation of EN /concert-brass-band-transcriptions | |
| [`/gitarren-tab`](https://meinemusiktranskription.de/gitarren-tab) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/guitar-tab` | Gitarren-Tab-Transkriptionsdienst | 2025-10 | translation of EN /guitar-tab | |
| [`/klavier`](https://meinemusiktranskription.de/klavier) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/piano` | Klavier-Transkriptionen | 2024-05 | translation of EN /piano | |
| [`/klavier-jazz-solo`](https://meinemusiktranskription.de/klavier-jazz-solo) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/jazz-piano-solo-transcriptions` | Klavier Jazz Solo Transkriptionsdienst | 2024-05 | translation of EN /jazz-piano-solo-transcriptions | |
| [`/klavier-und-gesangs-transkriptionsservice`](https://meinemusiktranskription.de/klavier-und-gesangs-transkriptionsservice) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/piano-vocal` | Klavier und Gesangs-Transkriptionsservice | 2024-05 | translation of EN /piano-vocal | |
| [`/musikarrangement-service`](https://meinemusiktranskription.de/musikarrangement-service) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/music-arrangement-service` | Musikarrangement-Service | 2024-05 | translation of EN /music-arrangement-service | |
| [`/orchestrierungsdienst`](https://meinemusiktranskription.de/orchestrierungsdienst) | sitemap:services, crawl, archive, live-2026-home, en-hreflang | services | `/orchestration-service` | Orchestrierungsdienst | 2024-05 | translation of EN /orchestration-service | |
| [`/10-jahre-meine-musik-transkriptionen`](https://meinemusiktranskription.de/10-jahre-meine-musik-transkriptionen) | sitemap:post | posts |  |  | — |  | |
| [`/alles-sie-uber-musikwettbewerbe-wissen-solten`](https://meinemusiktranskription.de/alles-sie-uber-musikwettbewerbe-wissen-solten) | sitemap:post | posts |  |  | — |  | |
| [`/anc-technologie-kopfhorer`](https://meinemusiktranskription.de/anc-technologie-kopfhorer) | sitemap:post, archive | posts |  |  | 2024-07 |  | |
| [`/das-finale-von-finale`](https://meinemusiktranskription.de/das-finale-von-finale) | sitemap:post | posts |  |  | — |  | |
| [`/einfluss-musik-korper-und-gehirn`](https://meinemusiktranskription.de/einfluss-musik-korper-und-gehirn) | sitemap:post | posts |  |  | — |  | |
| [`/finale-vs-sibelius`](https://meinemusiktranskription.de/finale-vs-sibelius) | sitemap:post | posts |  |  | — |  | |
| [`/last-minute-musikfestivals-in-barcelona`](https://meinemusiktranskription.de/last-minute-musikfestivals-in-barcelona) | sitemap:post, archive | posts |  |  | 2024-07 |  | |
| [`/mainstream-kunstler-crossover-alben`](https://meinemusiktranskription.de/mainstream-kunstler-crossover-alben) | sitemap:post | posts |  |  | — |  | |
| [`/meine-musik-transkription-hallo`](https://meinemusiktranskription.de/meine-musik-transkription-hallo) | sitemap:post, archive | posts |  |  | 2024-07 |  | |
| [`/meine-musik-transkription-namm-2025`](https://meinemusiktranskription.de/meine-musik-transkription-namm-2025) | sitemap:post | posts |  |  | — |  | |
| [`/nach-dem-sommer-wieder-fit`](https://meinemusiktranskription.de/nach-dem-sommer-wieder-fit) | sitemap:post | posts |  |  | — |  | |
| [`/noten-transponieren`](https://meinemusiktranskription.de/noten-transponieren) | sitemap:post, archive | posts |  |  | 2024-07 |  | |
| [`/schlagzeugnoten-lesen-und-schreiben`](https://meinemusiktranskription.de/schlagzeugnoten-lesen-und-schreiben) | sitemap:post, archive | posts |  |  | 2024-07 |  | |
| [`/tipps-zum-vorspielen`](https://meinemusiktranskription.de/tipps-zum-vorspielen) | sitemap:post | posts |  |  | — |  | |
| [`/tonleitern-dur-tonleiter-vs-moll-tonleiter`](https://meinemusiktranskription.de/tonleitern-dur-tonleiter-vs-moll-tonleiter) | sitemap:post, archive | posts |  |  | 2024-07 |  | |
| [`/welches-programm-ist-besser-sibelius-finale-oder-musescore`](https://meinemusiktranskription.de/welches-programm-ist-besser-sibelius-finale-oder-musescore) | sitemap:post, archive | posts |  |  | 2024-07 |  | |

## Verify first (linked from the live site, never archived)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/avis-des-clients`](https://meinemusiktranskription.de/avis-des-clients) | linked, live-2026-home | — |  |  | — | French slug linked from the German menu (leftover of the FR clone); the German page is /kundenbewertungen | |
| [`/bewertungen`](https://meinemusiktranskription.de/bewertungen) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/conditions-dutilisation`](https://meinemusiktranskription.de/conditions-dutilisation) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/ensembles`](https://meinemusiktranskription.de/ensembles) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/jazz-piano-solo`](https://meinemusiktranskription.de/jazz-piano-solo) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/opiniones`](https://meinemusiktranskription.de/opiniones) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/orchestrations`](https://meinemusiktranskription.de/orchestrations) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/piano-voix`](https://meinemusiktranskription.de/piano-voix) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/politique-de-confidentialite`](https://meinemusiktranskription.de/politique-de-confidentialite) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/politique-de-cookies`](https://meinemusiktranskription.de/politique-de-cookies) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |
| [`/qui-sommes-nous`](https://meinemusiktranskription.de/qui-sommes-nous) | linked | — |  |  | — | slug of another locale linked from this site (leftover of a cloned site): fix the link, no page expected | |

## Decide first (see the plan's decisions)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/comment-payer`](https://meinemusiktranskription.de/comment-payer) | archive | pages |  |  | 2024-05 | payment page (D4) | |
| [`/jellynote`](https://meinemusiktranskription.de/jellynote) | archive | pages |  |  | 2024-05 | partner landing / thank-you (noindex) | |
| [`/jellynote-merci`](https://meinemusiktranskription.de/jellynote-merci) | archive | pages |  |  | 2024-05 | partner landing / thank-you (noindex) | |

## Redirect (retired URLs)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/a-propos`](https://meinemusiktranskription.de/a-propos) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/albert`](https://meinemusiktranskription.de/albert) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/anandi`](https://meinemusiktranskription.de/anandi) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/anne-c`](https://meinemusiktranskription.de/anne-c) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/arrangements-musicaux`](https://meinemusiktranskription.de/arrangements-musicaux) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/author/webmaster-msmtgmail-com`](https://meinemusiktranskription.de/author/webmaster-msmtgmail-com) | sitemap:author, archive | — |  |  | 2024-05 | WP archive → blog index | |
| [`/basse`](https://meinemusiktranskription.de/basse) | sitemap:faqs, linked | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/batterie`](https://meinemusiktranskription.de/batterie) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/black-friday-2024`](https://meinemusiktranskription.de/black-friday-2024) | sitemap:page | — |  |  | — | expired promo → pricing page | |
| [`/black-friday-23`](https://meinemusiktranskription.de/black-friday-23) | archive | — |  |  | 2024-05 | expired promo → pricing page | |
| [`/bruno`](https://meinemusiktranskription.de/bruno) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/carla`](https://meinemusiktranskription.de/carla) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/caryl-mansfield`](https://meinemusiktranskription.de/caryl-mansfield) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/category/bievenus`](https://meinemusiktranskription.de/category/bievenus) | sitemap:category | — |  |  | — | WP archive → blog index | |
| [`/category/logiciels-de-notation-musicale`](https://meinemusiktranskription.de/category/logiciels-de-notation-musicale) | sitemap:category | — |  |  | — | WP archive → blog index | |
| [`/celine-m`](https://meinemusiktranskription.de/celine-m) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/claire-r`](https://meinemusiktranskription.de/claire-r) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/claude-l`](https://meinemusiktranskription.de/claude-l) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/colome`](https://meinemusiktranskription.de/colome) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/david`](https://meinemusiktranskription.de/david) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/elena`](https://meinemusiktranskription.de/elena) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/ensembles-vocaux`](https://meinemusiktranskription.de/ensembles-vocaux) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/eric`](https://meinemusiktranskription.de/eric) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/fall-25`](https://meinemusiktranskription.de/fall-25) | sitemap:page | — |  |  | — | expired promo → pricing page | |
| [`/francesc`](https://meinemusiktranskription.de/francesc) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/gemma`](https://meinemusiktranskription.de/gemma) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/guillem`](https://meinemusiktranskription.de/guillem) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/guitare`](https://meinemusiktranskription.de/guitare) | sitemap:faqs, linked | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/jean-christophe-m`](https://meinemusiktranskription.de/jean-christophe-m) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/jean-r`](https://meinemusiktranskription.de/jean-r) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/joan`](https://meinemusiktranskription.de/joan) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/joel`](https://meinemusiktranskription.de/joel) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/joel-r`](https://meinemusiktranskription.de/joel-r) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/laurence-d`](https://meinemusiktranskription.de/laurence-d) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/maja`](https://meinemusiktranskription.de/maja) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/maragda`](https://meinemusiktranskription.de/maragda) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/marc`](https://meinemusiktranskription.de/marc) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/marc-l`](https://meinemusiktranskription.de/marc-l) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/mauricio`](https://meinemusiktranskription.de/mauricio) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/mauro`](https://meinemusiktranskription.de/mauro) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/michael`](https://meinemusiktranskription.de/michael) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/michel-d`](https://meinemusiktranskription.de/michel-d) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/michel-d-2`](https://meinemusiktranskription.de/michel-d-2) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/nathan`](https://meinemusiktranskription.de/nathan) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/ona`](https://meinemusiktranskription.de/ona) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/oriol`](https://meinemusiktranskription.de/oriol) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/oriol-v`](https://meinemusiktranskription.de/oriol-v) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/oscar-j`](https://meinemusiktranskription.de/oscar-j) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/pablo`](https://meinemusiktranskription.de/pablo) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/paul-m`](https://meinemusiktranskription.de/paul-m) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/philippe-q`](https://meinemusiktranskription.de/philippe-q) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/piano`](https://meinemusiktranskription.de/piano) | sitemap:faqs, linked | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/piano-et-voix`](https://meinemusiktranskription.de/piano-et-voix) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/piano-jazz`](https://meinemusiktranskription.de/piano-jazz) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/processus-de-commande`](https://meinemusiktranskription.de/processus-de-commande) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/questions-techniques`](https://meinemusiktranskription.de/questions-techniques) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/quim`](https://meinemusiktranskription.de/quim) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/roc`](https://meinemusiktranskription.de/roc) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/sabas`](https://meinemusiktranskription.de/sabas) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/sebastien-l`](https://meinemusiktranskription.de/sebastien-l) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/service`](https://meinemusiktranskription.de/service) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/services`](https://meinemusiktranskription.de/services) | sitemap:services, archive | — |  |  | 2024-05 | services CPT archive → /dienstleistungen | |
| [`/stephane-l`](https://meinemusiktranskription.de/stephane-l) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/summer-25`](https://meinemusiktranskription.de/summer-25) | sitemap:page | — |  |  | — | expired promo → pricing page | |
| [`/summer-26`](https://meinemusiktranskription.de/summer-26) | live-2026-home | — |  |  | — | expired promo → pricing page | |
| [`/summer-discounts-23`](https://meinemusiktranskription.de/summer-discounts-23) | archive | — |  |  | 2024-05 | expired promo → pricing page | |
| [`/tiffany-p`](https://meinemusiktranskription.de/tiffany-p) | sitemap:review | reviews |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/victor`](https://meinemusiktranskription.de/victor) | sitemap:team | team |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/vocal-lead-sheet`](https://meinemusiktranskription.de/vocal-lead-sheet) | sitemap:faqs | faqs |  |  | — | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |

## Drop (test pages: let them 404)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/home-new`](https://meinemusiktranskription.de/home-new) | archive | — |  |  | 2024-05 | test/draft page: let it 404 | |
