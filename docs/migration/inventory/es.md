# Spanish site inventory: www.mistranscripcionesmusicales.com

Generated on 2026-10-08 for the migration plan ([`../PLAN.md`](../PLAN.md)); machine-readable copy: [`es.json`](./es.json). This site's inventory is **less complete than the English one**: its sitemap was never archived, so the list is rebuilt from the live menu, the English pages' hreflang tags and every URL the Internet Archive ever captured. **Step W0.2 of the plan replaces it with the live sitemap before any page of this locale is ported.**

**Found in**: `sitemap:<type>` = Yoast sitemap · `crawl` = archived page reached from the menu · `live-2026-home` = linked from the live homepage (Common Crawl) · `en-hreflang` = named by an English page's hreflang · `archive` = some capture exists in the Internet Archive · `linked` = linked but never archived.

| Action | URLs |
|---|---|
| Port | 25 |
| Verify first (linked from the live site, never archived) | 1 |
| Decide first (see the plan's decisions) | 1 |
| Redirect (retired URLs) | 81 |
| Drop (test pages: let them 404) | 3 |
| **Total** | **111** |

## Port

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/`](https://www.mistranscripcionesmusicales.com) | crawl, archive, en-hreflang | pages | `/` | Transcripción de partituras | 2025-03 | home (translationKey home) | |
| [`/aviso-legal`](https://www.mistranscripcionesmusicales.com/aviso-legal) | crawl, archive, en-hreflang | pages | `/legal-notice` | Aviso legal | 2024-05 | translation of EN /legal-notice | |
| [`/como-pagar`](https://www.mistranscripcionesmusicales.com/como-pagar) | archive, en-hreflang | pages | `/how-to-pay` |  | 2022-12 | translation of EN /how-to-pay | |
| [`/contacto`](https://www.mistranscripcionesmusicales.com/contacto) | crawl, archive, en-hreflang | pages | `/contact` | Contacto para transcripción de partituras | 2024-05 | translation of EN /contact | |
| [`/opiniones`](https://www.mistranscripcionesmusicales.com/opiniones) | crawl, archive, en-hreflang | pages | `/customer-reviews` | Opiniones | 2024-05 | translation of EN /customer-reviews | |
| [`/politica-de-cookies`](https://www.mistranscripcionesmusicales.com/politica-de-cookies) | crawl, archive, en-hreflang | pages | `/cookies` | Política de cookies | 2024-02 | translation of EN /cookies | |
| [`/politica-de-privacidad`](https://www.mistranscripcionesmusicales.com/politica-de-privacidad) | crawl, archive, en-hreflang | pages | `/gdpr` | Política de privacidad | 2024-04 | translation of EN /gdpr | |
| [`/precios`](https://www.mistranscripcionesmusicales.com/precios) | crawl, archive, en-hreflang | pages | `/pricing` | Precios para transcripción de partituras | 2024-05 | translation of EN /pricing | |
| [`/preguntas-frecuentes`](https://www.mistranscripcionesmusicales.com/preguntas-frecuentes) | crawl, archive, en-hreflang | pages | `/frequent-asked-questions` | Preguntas frecuentes | 2024-06 | translation of EN /frequent-asked-questions | |
| [`/servicios-musicales`](https://www.mistranscripcionesmusicales.com/servicios-musicales) | crawl, archive, en-hreflang | pages | `/services-samples` | Servicios musicales | 2024-07 | translation of EN /services-samples | |
| [`/sobre-nosotros`](https://www.mistranscripcionesmusicales.com/sobre-nosotros) | crawl, archive, en-hreflang | pages | `/about-us` | Sobre Nosotros | 2024-05 | translation of EN /about-us | |
| [`/terminos-de-uso`](https://www.mistranscripcionesmusicales.com/terminos-de-uso) | crawl, archive, en-hreflang | pages | `/terms-of-use` | Términos de uso | 2023-12 | translation of EN /terms-of-use | |
| [`/blog`](https://www.mistranscripcionesmusicales.com/blog) | crawl, archive | (route) |  | Blog | 2024-06 | blog index route (routes.blogIndex) | |
| [`/arreglos`](https://www.mistranscripcionesmusicales.com/arreglos) | crawl, archive, en-hreflang | services | `/music-arrangement-service` | Arreglos musicales | 2024-05 | translation of EN /music-arrangement-service | |
| [`/bajo`](https://www.mistranscripcionesmusicales.com/bajo) | crawl, archive, en-hreflang | services | `/bass-tab-transcription-service` | Transcripciones para bajo | 2024-07 | translation of EN /bass-tab-transcription-service | |
| [`/bandas`](https://www.mistranscripcionesmusicales.com/bandas) | crawl, archive, en-hreflang | services | `/concert-brass-band-transcriptions` | Transcripciones y arreglos para bandas | 2024-05 | translation of EN /concert-brass-band-transcriptions | |
| [`/guitarra`](https://www.mistranscripcionesmusicales.com/guitarra) | crawl, archive, en-hreflang | services | `/guitar-tab` | Transcripciones para guitarra | 2024-04 | translation of EN /guitar-tab | |
| [`/jazz-piano-solo`](https://www.mistranscripcionesmusicales.com/jazz-piano-solo) | crawl, archive, en-hreflang | services | `/jazz-piano-solo-transcriptions` | Transcripciones de jazz para piano | 2024-06 | translation of EN /jazz-piano-solo-transcriptions | |
| [`/orquestaciones`](https://www.mistranscripcionesmusicales.com/orquestaciones) | crawl, archive | services | `/orchestration-service` | Orquestaciones | 2024-06 | translation of EN /orchestration-service; **two es URLs claim EN /orchestration-service**: keep one, 301 the other | |
| [`/orquestraciones`](https://www.mistranscripcionesmusicales.com/orquestraciones) | crawl, archive, en-hreflang | services | `/orchestration-service` | Orquestaciones | 2020-10 | translation of EN /orchestration-service; **two es URLs claim EN /orchestration-service**: keep one, 301 the other | |
| [`/piano`](https://www.mistranscripcionesmusicales.com/piano) | crawl, archive, en-hreflang | services | `/piano` | Transcripciones para piano | 2024-06 | translation of EN /piano | |
| [`/piano-vocal`](https://www.mistranscripcionesmusicales.com/piano-vocal) | crawl, archive, en-hreflang | services | `/piano-vocal` | Transcripciones para piano y voz | 2024-04 | translation of EN /piano-vocal | |
| [`/finale-vs-sibelius`](https://www.mistranscripcionesmusicales.com/finale-vs-sibelius) | crawl, archive | posts | `/finale-vs-sibelius` | Finale vs Sibelius - Análisis de | 2024-07 | translation of EN /finale-vs-sibelius | |
| [`/presentacion-blog-mis-transcripciones-musicales`](https://www.mistranscripcionesmusicales.com/presentacion-blog-mis-transcripciones-musicales) | crawl, archive | posts |  | Os presentamos el blog de | 2023-09 | linked from the blog index: probably a post | |
| [`/transcribir-como-un-profesional`](https://www.mistranscripcionesmusicales.com/transcribir-como-un-profesional) | crawl, archive | posts |  | Transcribir como un profesional | 2024-04 | linked from the blog index: probably a post | |

## Verify first (linked from the live site, never archived)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/5-festivales-de-musica-de-barcelona-para-este-verano`](https://www.mistranscripcionesmusicales.com/5-festivales-de-musica-de-barcelona-para-este-verano) | linked | pages |  |  | — | linked from the live menu but never archived: check it exists (likely a dead link) | |

## Decide first (see the plan's decisions)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/jellynote`](https://www.mistranscripcionesmusicales.com/jellynote) | archive | pages |  |  | 2021-04 | partner landing / thank-you (noindex) | |

## Redirect (retired URLs)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/2021/01/12`](https://www.mistranscripcionesmusicales.com/2021/01/12) | archive | — |  |  | 2022-12 | WP archive → blog index | |
| [`/2022/09/15`](https://www.mistranscripcionesmusicales.com/2022/09/15) | archive | — |  |  | 2023-12 | WP archive → blog index | |
| [`/author/c-msmt`](https://www.mistranscripcionesmusicales.com/author/c-msmt) | archive | — |  |  | 2021-01 | WP archive → blog index | |
| [`/author/marina-junquera-msmtgmail-com`](https://www.mistranscripcionesmusicales.com/author/marina-junquera-msmtgmail-com) | archive | — |  |  | 2024-07 | WP archive → blog index | |
| [`/author/mtmadmin`](https://www.mistranscripcionesmusicales.com/author/mtmadmin) | archive | — |  |  | 2021-01 | WP archive → blog index | |
| [`/author/oriol`](https://www.mistranscripcionesmusicales.com/author/oriol) | archive | — |  |  | 2024-04 | WP archive → blog index | |
| [`/author/quim-msmtgmail-com`](https://www.mistranscripcionesmusicales.com/author/quim-msmtgmail-com) | archive | — |  |  | 2022-10 | WP archive → blog index | |
| [`/author/webmaster-msmtgmail-com`](https://www.mistranscripcionesmusicales.com/author/webmaster-msmtgmail-com) | archive | — |  |  | 2024-04 | WP archive → blog index | |
| [`/black-friday-22`](https://www.mistranscripcionesmusicales.com/black-friday-22) | archive | — |  |  | 2023-02 | expired promo → pricing page | |
| [`/black-friday-23`](https://www.mistranscripcionesmusicales.com/black-friday-23) | archive | — |  |  | 2023-12 | expired promo → pricing page | |
| [`/carrito`](https://www.mistranscripcionesmusicales.com/carrito) | archive | — |  |  | 2020-10 | WooCommerce → home / hub (D4) | |
| [`/category/actualidad-musical`](https://www.mistranscripcionesmusicales.com/category/actualidad-musical) | archive | — |  |  | 2024-07 | WP archive → blog index | |
| [`/category/programas-y-apps`](https://www.mistranscripcionesmusicales.com/category/programas-y-apps) | archive | — |  |  | 2022-10 | WP archive → blog index | |
| [`/category/quienes-somos-2`](https://www.mistranscripcionesmusicales.com/category/quienes-somos-2) | archive | — |  |  | 2022-10 | WP archive → blog index | |
| [`/category/tutoriales`](https://www.mistranscripcionesmusicales.com/category/tutoriales) | archive | — |  |  | 2022-10 | WP archive → blog index | |
| [`/category/uncategorized`](https://www.mistranscripcionesmusicales.com/category/uncategorized) | archive | — |  |  | 2021-01 | WP archive → blog index | |
| [`/equipo/albert`](https://www.mistranscripcionesmusicales.com/equipo/albert) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/anandi`](https://www.mistranscripcionesmusicales.com/equipo/anandi) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/brett`](https://www.mistranscripcionesmusicales.com/equipo/brett) | archive | team |  |  | 2024-05 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/carla`](https://www.mistranscripcionesmusicales.com/equipo/carla) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/colome`](https://www.mistranscripcionesmusicales.com/equipo/colome) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/david`](https://www.mistranscripcionesmusicales.com/equipo/david) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/elena`](https://www.mistranscripcionesmusicales.com/equipo/elena) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/eric`](https://www.mistranscripcionesmusicales.com/equipo/eric) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/francesc`](https://www.mistranscripcionesmusicales.com/equipo/francesc) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/gemma`](https://www.mistranscripcionesmusicales.com/equipo/gemma) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/guillem`](https://www.mistranscripcionesmusicales.com/equipo/guillem) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/isaac`](https://www.mistranscripcionesmusicales.com/equipo/isaac) | archive | team |  |  | 2024-05 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/joan`](https://www.mistranscripcionesmusicales.com/equipo/joan) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/joel`](https://www.mistranscripcionesmusicales.com/equipo/joel) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/joel-2`](https://www.mistranscripcionesmusicales.com/equipo/joel-2) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/joel-3`](https://www.mistranscripcionesmusicales.com/equipo/joel-3) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/jofre`](https://www.mistranscripcionesmusicales.com/equipo/jofre) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/leandro`](https://www.mistranscripcionesmusicales.com/equipo/leandro) | archive | team |  |  | 2024-03 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/maja`](https://www.mistranscripcionesmusicales.com/equipo/maja) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/maragda`](https://www.mistranscripcionesmusicales.com/equipo/maragda) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/marc`](https://www.mistranscripcionesmusicales.com/equipo/marc) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/marina`](https://www.mistranscripcionesmusicales.com/equipo/marina) | archive | team |  |  | 2024-05 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/mauricio`](https://www.mistranscripcionesmusicales.com/equipo/mauricio) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/mauro`](https://www.mistranscripcionesmusicales.com/equipo/mauro) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/ona`](https://www.mistranscripcionesmusicales.com/equipo/ona) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/oriol`](https://www.mistranscripcionesmusicales.com/equipo/oriol) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/oriol-lc`](https://www.mistranscripcionesmusicales.com/equipo/oriol-lc) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/oscar`](https://www.mistranscripcionesmusicales.com/equipo/oscar) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/pablo`](https://www.mistranscripcionesmusicales.com/equipo/pablo) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/quim`](https://www.mistranscripcionesmusicales.com/equipo/quim) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/roc`](https://www.mistranscripcionesmusicales.com/equipo/roc) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/sabas`](https://www.mistranscripcionesmusicales.com/equipo/sabas) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/victor`](https://www.mistranscripcionesmusicales.com/equipo/victor) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/equipo/xavi`](https://www.mistranscripcionesmusicales.com/equipo/xavi) | archive | team |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/faqs/faqs-servicios`](https://www.mistranscripcionesmusicales.com/faqs/faqs-servicios) | archive | faqs |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/faqs/preguntas-tecnicas`](https://www.mistranscripcionesmusicales.com/faqs/preguntas-tecnicas) | archive | faqs |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/faqs/proceso-de-solicitud`](https://www.mistranscripcionesmusicales.com/faqs/proceso-de-solicitud) | archive | faqs |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/faqs/sobre-nosotros`](https://www.mistranscripcionesmusicales.com/faqs/sobre-nosotros) | archive | faqs |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/finalizar-compra`](https://www.mistranscripcionesmusicales.com/finalizar-compra) | archive | — |  |  | 2020-10 | WooCommerce → home / hub (D4) | |
| [`/mi-cuenta`](https://www.mistranscripcionesmusicales.com/mi-cuenta) | archive | — |  |  | 2020-10 | WooCommerce → home / hub (D4) | |
| [`/política-de-cookies`](https://www.mistranscripcionesmusicales.com/política-de-cookies) | linked | — |  |  | — | accented duplicate of /politica-de-cookies | |
| [`/review/alex-gomez-o`](https://www.mistranscripcionesmusicales.com/review/alex-gomez-o) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/alvaro-n`](https://www.mistranscripcionesmusicales.com/review/alvaro-n) | archive | reviews |  |  | 2024-07 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/angel-r`](https://www.mistranscripcionesmusicales.com/review/angel-r) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/anne-c`](https://www.mistranscripcionesmusicales.com/review/anne-c) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/arnau-s`](https://www.mistranscripcionesmusicales.com/review/arnau-s) | archive | reviews |  |  | 2024-05 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/carlos-b`](https://www.mistranscripcionesmusicales.com/review/carlos-b) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/carlos-b-2`](https://www.mistranscripcionesmusicales.com/review/carlos-b-2) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/carmen-s`](https://www.mistranscripcionesmusicales.com/review/carmen-s) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/chalo-y`](https://www.mistranscripcionesmusicales.com/review/chalo-y) | archive | reviews |  |  | 2024-05 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/claudio-mendez`](https://www.mistranscripcionesmusicales.com/review/claudio-mendez) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/dani-b-2`](https://www.mistranscripcionesmusicales.com/review/dani-b-2) | archive | reviews |  |  | 2024-05 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/daniela`](https://www.mistranscripcionesmusicales.com/review/daniela) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/erik-y`](https://www.mistranscripcionesmusicales.com/review/erik-y) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/ezequiel-g`](https://www.mistranscripcionesmusicales.com/review/ezequiel-g) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/geoff-r`](https://www.mistranscripcionesmusicales.com/review/geoff-r) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/helena-u`](https://www.mistranscripcionesmusicales.com/review/helena-u) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/moises-b`](https://www.mistranscripcionesmusicales.com/review/moises-b) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/pablo-lopez-r`](https://www.mistranscripcionesmusicales.com/review/pablo-lopez-r) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/review/pedro-j`](https://www.mistranscripcionesmusicales.com/review/pedro-j) | archive | reviews |  |  | 2023-12 | single entry of a custom post type: becomes data for the listing page, URL → 301 to the listing (D5 default) | |
| [`/servicios/orquestraciones`](https://www.mistranscripcionesmusicales.com/servicios/orquestraciones) | linked | — |  |  | — | old nested service URL → /orquestraciones | |
| [`/summer-24`](https://www.mistranscripcionesmusicales.com/summer-24) | linked | — |  |  | — | expired promo → pricing page | |
| [`/summer-discounts-23`](https://www.mistranscripcionesmusicales.com/summer-discounts-23) | archive | — |  |  | 2023-09 | expired promo → pricing page | |
| [`/tienda`](https://www.mistranscripcionesmusicales.com/tienda) | archive | — |  |  | 2020-10 | WooCommerce → home / hub (D4) | |
| [`/transcribe-como-un-profesional`](https://www.mistranscripcionesmusicales.com/transcribe-como-un-profesional) | archive | — |  |  | 2021-09 | older slug of /transcribir-como-un-profesional (verify) | |

## Drop (test pages: let them 404)

| Path | Found in | Target | EN counterpart | Title (archived) | Archived | Notes | PR |
|---|---|---|---|---|---|---|---|
| [`/blog-post-test-1`](https://www.mistranscripcionesmusicales.com/blog-post-test-1) | archive | — |  |  | 2021-11 | test/draft page: let it 404 | |
| [`/test`](https://www.mistranscripcionesmusicales.com/test) | archive | — |  |  | 2023-09 | test/draft page: let it 404 | |
| [`/testing`](https://www.mistranscripcionesmusicales.com/testing) | archive | — |  |  | 2023-09 | test/draft page: let it 404 | |
