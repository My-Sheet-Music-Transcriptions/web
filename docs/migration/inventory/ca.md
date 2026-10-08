# Catalan site inventory: lamevapartitura.cat

Part of the migration plan ([`../PLAN.md`](../PLAN.md)); machine-readable copy: [`ca.json`](./ca.json). Catalan is a
**launch, not a port**: the live domain runs a WordPress site that was started in 2023 and never finished. Its title
is still "My WordPress", it appears in no other site's hreflang tags, and its homepage mixes Catalan and Spanish copy.
It has a menu (Home, Serveis, Reviews, Sobre nosaltres, Preus, Contacte, "Demana pressupost"), the English service list
in English, and logos and photos under `wp-content/uploads/2023/`. Its 2023 `wp-sitemap.xml` lists the URLs below; none
of the inner pages was ever archived.

Sources: `wp-sitemap-posts-page-1.xml` (Internet Archive, 2023-07), the homepage (Internet Archive, 2025-07).

## Existing URLs

| Path | Found in | What it is | Action | Notes | PR |
|---|---|---|---|---|---|
| [`/`](https://lamevapartitura.cat/) | sitemap, archive | draft Elementor homepage, Catalan with Spanish fragments | replace | becomes the new Catalan home (`translationKey: home`) | |
| [`/sobre-nosaltres`](https://lamevapartitura.cat/sobre-nosaltres/) | sitemap | draft page, never archived | replace | keep this slug for the about page | |
| [`/contacte`](https://lamevapartitura.cat/contacte/) | sitemap | draft page, never archived | replace | keep this slug for the contact page | |
| [`/la-meva-partitura`](https://lamevapartitura.cat/la-meva-partitura/) | sitemap | draft page, never archived | redirect | → `/` | |
| [`/contacte-2`](https://lamevapartitura.cat/contacte-2/) | sitemap | duplicate draft | redirect | → `/contacte` | |
| [`/descartes`](https://lamevapartitura.cat/descartes/) | sitemap | "discards" page (parking for removed sections) | drop | let it 404 | |
| [`/sample-page`](https://lamevapartitura.cat/sample-page/) | sitemap | WordPress default page | drop | let it 404 | |

The old URLs end with a slash (WordPress default on this install); the new site serves them without one and 301s the
slashed form (plan W1.3), so the two pages that keep their slug keep working.

## Pages to create for launch (wave C1)

Mirror of the core set that every other locale has, translated from English with the Spanish page as a reference.
The slugs below are decided here so C1 can run unattended; nothing indexes them yet, so a Catalan speaker can still
rename any of them at C2's go/no-go at no cost. The services list follows what the Spanish and French sites offer
today; extend it later through the `page` skill.

| Proposed path | Collection | translationKey (= EN page) | Spanish reference | PR |
|---|---|---|---|---|
| `/` | pages | `home` (`/`) | `/` | |
| `/preus` | pages | `/pricing` | `/precios` | |
| `/contacte` | pages | `/contact` | `/contacto` | |
| `/sobre-nosaltres` | pages | `/about-us` | `/sobre-nosotros` | |
| `/opinions` | pages | `/customer-reviews` | `/opiniones` | |
| `/preguntes-frequents` | pages | `/frequent-asked-questions` | `/preguntas-frecuentes` | |
| `/serveis-musicals` | pages | `/services-samples` | `/servicios-musicales` | |
| `/targeta-regal` | pages | `/gift-card` | — | |
| `/avis-legal` | pages | `/legal-notice` | `/aviso-legal` | |
| `/politica-de-cookies` | pages | `/cookies` | `/politica-de-cookies` | |
| `/politica-de-privacitat` | pages | `/gdpr` | `/politica-de-privacidad` | |
| `/condicions-d-us` | pages | `/terms-of-use` | `/terminos-de-uso` | |
| `/piano` | services | `/piano` | `/piano` | |
| `/piano-i-veu` | services | `/piano-vocal` | `/piano-vocal` | |
| `/piano-jazz-solo` | services | `/jazz-piano-solo-transcriptions` | `/jazz-piano-solo` | |
| `/guitarra` | services | `/guitar-tab` | `/guitarra` | |
| `/baix` | services | `/bass-tab-transcription-service` | `/bajo` | |
| `/bateria` | services | `/drums-transcription-service` | — (fr `/transcriptions-de-batterie`) | |
| `/conjunts-vocals` | services | `/vocal-ensemble-transcription-service` | — (fr `/transcriptions-ensembles-vocaux`) | |
| `/arranjaments` | services | `/music-arrangement-service` | `/arreglos` | |
| `/orquestracions` | services | `/orchestration-service` | `/orquestraciones` | |
| `/bandes` | services | `/concert-brass-band-transcriptions` | `/bandas` | |

Later (not needed for launch): `/blog` with posts, the rest of the English services.
