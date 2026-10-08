# WordPress → this repo: migration plan

Status: **plan, nothing executed yet** beyond what was already in the repo (English home page and `/gift-card`).
Written 2026-10-08. This file is the general plan; the specifics live in the files it links to. Follow it wave by wave
in later sessions: tick the checklists here, fill the **PR** column of the inventories, and add a line to the
[session log](#10-session-log) at the end of every session.

| File | What it is |
|---|---|
| **this file** | scope, findings, principles, decisions, the waves and their checklists, the cutover runbook, risks |
| [`inventory/en.md`](./inventory/en.md) | every English URL (320) with its target collection, wave, action, translations and archived title |
| [`inventory/es.md`](./inventory/es.md) · [`fr.md`](./inventory/fr.md) · [`de.md`](./inventory/de.md) · [`ja.md`](./inventory/ja.md) | the same for the other live sites (less complete until step W0.2) |
| [`inventory/ca.md`](./inventory/ca.md) | the Catalan draft site and the page set to create for its launch |
| [`inventory/*.json`](./inventory/) | machine-readable copy (titles, descriptions, canonicals, hreflang pairs): input for the importer, the hreflang fallback and the cutover test |
| [`redirects.md`](./redirects.md) | draft redirect map per domain |

## 1. Goal and definition of done

Serve every domain from its own Netlify site built from this repository, with **no loss of URLs, rankings or
conversions**, and switch off WordPress:

| Locale | Domain (unchanged) | Today | Work |
|---|---|---|---|
| en | www.mysheetmusictranscriptions.com | WordPress (Elementor, WooCommerce, Yoast) on SiteGround | migrate ~300 pages |
| es | www.mistranscripcionesmusicales.com | WordPress, same stack | migrate ~30 pages |
| fr | mapartitionsurmesure.com | WordPress, same stack | migrate ~30 pages |
| de | meinemusiktranskription.de | WordPress, same stack (cloned from the French site) | migrate ~40 pages |
| ja | mysheetmusictranscriptions.jp | WordPress, same stack | migrate ~20 pages |
| ca | lamevapartitura.cat | an **unfinished** WordPress draft (title "My WordPress", Catalan/Spanish homepage, 7 URLs) | **launch** ~22 new pages; pilot of the cutover |

A locale is done when: every URL in its inventory answers 200 from the new site at the same path or 301s in one hop
to its successor; its pages declare hreflang to every other live locale; the domain points at Netlify; Search Console
reads the new sitemap with no rise in 404s two weeks later; its WordPress install is switched off. The migration is
done when all six are.

Out of scope (they stay where they are, but their DNS records must survive each cutover): `hub.` (customer app, login
and sign-up), `catalog.` (the sheet-music shop that already took over `/shop` products), the other subdomains found in
the archive (`pay.`, `msmtmusic.`, `mysongproductions.`…), and email (MX records).

## 2. What is on the live sites (research of 2026-10-08)

**Access.** All six domains sit behind SiteGround's bot protection. From this cloud environment every request gets a
captcha page (HTTP 202, `/.well-known/sgcaptcha`), headless Chromium included; the WordPress REST API answered once with
`curl -A "Mozilla/5.0"` and was blocked on the next calls. The inventories were therefore built from the **Internet
Archive** (sitemaps captured up to 2026-05, every captured URL since 2013, the latest capture of each page's `<head>`)
and **Common Crawl** (live menus of Sept 2026). Porting needs reliable access to the live content: step W0.1.

**Stack seen in the HTML.** Elementor 4 + Elementor Pro + Ultimate Addons, WooCommerce (+ Realex/Global Payments,
PayPal, "name your price"), Yoast SEO, WP Rocket, Complianz (consent), startklar Elementor forms, honeypot/WP Armour,
Tidio chat, Trustpilot widget, Google Tag Manager, Bing UET, reCAPTCHA.

**URL counts** (details and per-URL actions in the inventories):

| Locale | URLs listed | port / create | decide first | redirect | verify | Sources |
|---|---|---|---|---|---|---|
| en | 320 | 283 + 4 noindex (+2 done) | 23 | 3 | 5 | live Yoast sitemaps (2026-05): post 126, page 89, services 41, popular 33, endorsed 19, partner 3, product 2; + legal pages and `/careers` linked from the footer but not in the sitemap; + 5 mega-menu entries of `nav.ts` never seen live |
| es | 111 | 25 | 58 | 24 | 1 | no sitemap ever archived: menu crawl, English hreflang, archive (incl. 34 team, 19 review, 4 FAQ entries) |
| fr | 49 | 29 | 2 | 14 | 3 | no sitemap archived: live menu (Common Crawl, 2026-09), English hreflang, archive |
| de | 120 | 36 | 62 | 10 | 11 | sitemap 2025-10 (10 pages, 16 posts, 9 services) + 2024 sitemaps since dropped (30 team, 16 reviews, 13 FAQs) |
| ja | 28 | 18 | 4 | 4 | 2 | 2022 sitemap (10 pages) + live menu (2026-09) |
| ca | 7 existing + 19 new | 22 (3 replace + 19 create) | — | 2 | — | 2023 `wp-sitemap.xml` + homepage (2025-07); new page set proposed in [`inventory/ca.md`](./inventory/ca.md) |

So the work is about **290 English pages** (126 of them blog posts), **~110 pages across es/fr/de/ja**, most of them
translations of ~25 English pages (home, pricing, contact, about, reviews, FAQ, services overview, legal, 6–12
services), and **~22 Catalan pages to write**.

**Findings that shape the plan**

1. **Flat URLs everywhere.** WordPress serves pages, posts, services, artists and musicians at `/<slug>`, which is
   exactly how `pathFor()` maps collections here. URLs can be kept 1:1; only retired things need redirects.
2. **hreflang is page-level but sparse.** Only 23 English pages declare translations (home, pricing, contact,
   about-us, customer-reviews, FAQ, services overview, the legal pages, how-to-pay and ~10 services). Those pairs are
   recorded in the inventories and become shared `translationKey`s. Live inconsistencies the migration fixes: the
   Spanish alternate points at the non-www host (which 301s), some point at `www.mysheetmusictranscriptions.jp`, the
   Spanish homepage declares `es-ES` while every other page says `es`, and **Catalan is in no hreflang set and not in
   the language switcher** (neither live nor in `src/i18n/sites/en.ts`).
3. **Catalan was started and abandoned.** `lamevapartitura.cat` has an Elementor homepage with a Catalan hero, Spanish
   "how it works" steps and the English service list, a menu (Home, Serveis, Reviews, Sobre nosaltres, Preus,
   Contacte) whose items lead nowhere, and draft pages `/sobre-nosaltres`, `/contacte`, `/la-meva-partitura`,
   `/contacte-2`, `/descartes`. It has no traffic or links to protect, which makes it the safest domain to move first.
4. **Canonical mismatch on artist pages.** "Popular" and "endorsed" pages are listed flat in the sitemap
   (`/bill-evans-sheet-music-transcriptions`), but 2024 captures declare `/popular/<slug>` and `/endorsed/<slug>` as
   canonical. Keep the flat URL, 301 both prefixes ([redirects](./redirects.md)).
5. **Slug collisions.** `/musicnotes` is both a page and a partner; `/music-4-humans` is both an endorsed musician and
   a partner. The repo requires unique slugs per locale: one entry wins, the content of the other is merged (D8).
   Spanish has `/orquestaciones` and `/orquestraciones`, both translating `/orchestration-service`.
6. **Cloned-site leftovers.** The German site was cloned from the French one: its 2024 FAQ sitemap has French slugs
   (`/piano-et-voix`, `/a-propos`), its menu links French slugs (`/avis-des-clients`); French and Japanese menus link
   Spanish slugs (`/opiniones`, `/precios`). Those are marked `verify` (fix the link, no page expected).
7. **Legacy URLs with live redirects.** Blogger-era URLs (`/2017/01/<slug>.html`, `/p/<page>.html`, ~500 archived)
   still 301 on the live site, and vanity links exist (`/caitlinOfficial`). They come from a redirect plugin whose
   export is needed (W0.1); see [`redirects.md`](./redirects.md) for everything else that needs a rule.
8. **Commerce lives elsewhere already.** `/shop/<product>` 301s to `catalog.mysheetmusictranscriptions.com`; login and
   sign-up go to `hub.`; what remains on WordPress are payment pages per currency (`/payments-eur`, `/uk-pay`,
   `/pay-australia`, `/how-to-pay`, Japanese `/pay*`) and WooCommerce endpoints (D4).
9. **Many pages share a template**: 9 "AI music → sheet music" pages, 15 notation-software conversion pages, 4
   glossaries, ~40 service pages with audio/PDF samples. Building the template first makes each page cheap.
10. **SEO rule conflicts.** CI enforces a `<title>` of 30–65 characters, a description of 50–160 and exactly one
    `<h1>`. Many legacy titles are shorter ("Despacito", "Covid-19 update") or longer, and the home page has two
    `<h1>`s. The CI rules win; adjust with `seoTitle` while keeping the wording (D13).

## 3. Principles

1. **Same URL, same host, same words.** A port reproduces the page at the same path with the same title, description
   and copy; redesign happens after the migration, through the `page` skill. Improvements are allowed only where CI
   forces them (D13) or the plan says so. (Catalan has no legacy to preserve: it is written new.)
2. **Porting is automatic; people decide, they do not review pages.** The importer turns every WordPress page into
   MDX and automated parity checks prove each port matches the live page (W1.13). Nobody previews or approves pages
   one by one. Human input is limited to the owner's inputs and decisions up front (W0) and one go/no-go per domain
   at cutover. This is compatible with CLAUDE.md's "nothing reaches `main` unseen" rule because `main` reaches no
   real domain until that domain's cutover, and the cutover go/no-go is where a person looks at the whole site (D1).
3. **Co-location, no hotlinking.** Every image, PDF and audio sample is downloaded into the page's folder; nothing
   points at `wp-content` (CLAUDE.md conventions).
4. **The inventory is the source of truth.** Every URL has exactly one action. A page found later is added to the
   inventory first. The cutover test reads the inventory, so a domain cannot move with a URL unaccounted for.
5. **One domain at a time, all of it at once.** A domain moves to Netlify only when all its URLs are covered (D2).
   Until then its WordPress site stays untouched and `legacyOrigin` keeps preview links working.
6. **The hreflang cluster never breaks.** Because URLs are preserved, a page on the new stack can keep declaring its
   translations that still live on WordPress (and vice versa); the build must do so (W1.10).

## 4. Decisions needed

Each has a recommendation; the waves that depend on it say so. Record the answer here (and in the session log).

| # | Question | Recommendation | Blocks |
|---|---|---|---|
| D1 | Who reviews the ports? | **Nobody, page by page.** Ports run unattended: importer → parity checks (W1.13) → one PR per batch that auto-merges when CI and the parity report are green. A port that fails parity is fixed by the next session, never handed to a person. People act only at W0 (inputs, decisions) and at each domain's cutover go/no-go, where they browse the whole new site on its Netlify URL with the parity report. The `page` skill and its previews stay for **new** pages and **changes** after the migration. Record this exception to CLAUDE.md's page workflow in CLAUDE.md when W1.6 lands. | W2+ |
| D2 | Cutover style? | Big-bang per domain once its inventory is complete (no proxying unported paths to WordPress: SiteGround's bot protection would challenge Netlify's proxy, and mixed hosting complicates caching and analytics). | C2, W8+ |
| D3 | Order of the domains? | **ca first** (pilot: nothing to lose, exercises the locale checklist, the Netlify site setup, DNS and the cutover runbook end to end), then **en** (most value, most work), then es → fr → de → ja (business value, then size). | C1, W8+ |
| D4 | Payments and shop: per-currency payment pages, how-to-pay, WooCommerce endpoints, regional prices (USD/GBP/AUD/EUR/JPY). | The static site takes no payments. Payment links point to the hub (or Stripe/PayPal payment links decided by the business); payment pages become plain pages with those links, or 301 to the hub. Shop URLs 301 to `catalog.` (already live for products). Needs the owner's input on where customers pay today and which currency each site quotes. | W7 |
| D5 | Single FAQ, review and team entries (es `/review/*`, `/equipo/*`, `/faqs/*`; de flat slugs; ja `/review/*`; en `/team/*`). | Keep them as data (the `reviews`/`faqs` collections and `data/*.ts` feed the listing pages and JSON-LD), no indexable pages; 301 each old URL to its listing page. Exception: an entry with real search traffic (Search Console). | W2, W9+ |
| D6 | Catalogue and archive pages (`/jazz-piano`, `/blues-piano`, `/popular-sheet-music`, `/sheet-music-catalogue`, `/catalog-grid`, `/midi-catalog`). | Port the ones Search Console shows traffic for as static lists linking to `catalog.`; 301 the rest to `catalog.`. | W6 |
| D7 | Third-party scripts. CLAUDE.md forbids runtime third-party URLs; the live site runs GTM, Bing UET, Tidio, Trustpilot, reCAPTCHA, YouTube embeds. | Keep **measurement** (needed to prove the migration did no harm): consent-gated GA4/GTM through the existing ConsentBanner, written into CLAUDE.md as the one exception. Trustpilot widget → static rating from `data/`. Tidio → drop unless sales depends on it. YouTube → click-to-load facade. reCAPTCHA → honeypot + server checks in `/api`. | W1 |
| D8 | May any URL change? | No, except: collisions (finding 5), duplicate Spanish orchestration pages, Japanese nested `/services/<slug>` (keep nested through a frontmatter `path` override, recommended, or flatten + 301). | W1, W6, W12 |
| D9 | Prune old blog posts (2017–2021 news, covid update, "top albums 2021")? | Port all 126 verbatim first (cheap with the importer, zero SEO risk); prune afterwards from Search Console data. | W5 |
| D10 | Media: old `/wp-content/uploads/*` URLs and audio/PDF samples. | Let upload URLs 404 unless Search Console shows image traffic to specific files; commit samples next to their page (MP3 at 128 kbps, PDFs as-is). Measure the total in W0.3; past ~300 MB, decide on Git LFS or a Netlify Blobs-backed `/assets/samples`. | W1, W3 |
| D11 | RSS: `/feed` exists on every site. | Generate `/feed` (RSS 2.0) from the `posts` collection at build; keeps subscribers and integrations working. | W5 |
| D12 | Forms: contact, B2B, educators, careers/transcriber application, catalog download, gift card (done). | All post to `/api/*` functions modelled on `src/server/contact.*` (Resend), same recipients as the Elementor forms; confirmation inline (no thank-you pages). Needs the recipients and any webhook the forms feed (hub, CRM). | W2, W4, W7 |
| D13 | Legacy titles/descriptions that break CI rules. | CI wins; the importer applies a fixed rule (append the brand suffix to short titles, trim long ones at a word boundary, fall back to the first paragraph for missing descriptions) and lists every change in the parity report. | W2+ |
| D14 | Catalan is new copy, not a port: who writes and checks it? | Generated automatically like the ports: Claude translates each page from English with the Spanish page as reference, slugs as proposed in [`inventory/ca.md`](./inventory/ca.md). A Catalan speaker reads the whole site once, at C2's go/no-go, instead of page by page. | C1 |
| D15 | Catalan in the other sites: language switcher, hreflang, footer languages. | Add `ca` to every site's `languageSwitcher` and to the hreflang sets the day Catalan launches (the build does hreflang automatically from shared `translationKey`s; the switcher is config). WordPress sites still live at that point keep linking without Catalan; acceptable until they move. | C1 |

## 5. Inputs needed from the site owner (W0.1)

Without these the plan still works (archives), but each one removes guesswork:

- [ ] **Access**: allowlist this environment in SiteGround (Site Tools → Security → bot protection, for the duration of
      the migration) **or** provide per site a WordPress export (Tools → Export → All content, WXR) and a media library
      archive (`wp-content/uploads`).
- [ ] **Redirects**: export of the redirect plugin of each site and the `_wp_old_slug` query result
      ([`redirects.md`](./redirects.md)).
- [ ] **Search Console**: per property, Performance → Pages (last 16 months, clicks/impressions) and Links → Top linked
      pages, as CSV. Drives D5, D6, D9, D10 and the post-cutover watch list. Is `lamevapartitura.cat` verified at all?
- [ ] **Analytics**: which tool is the source of truth (GA4 property, GTM container) and which conversions are tracked
      (form submits, hub sign-ups, payments).
- [ ] **Everything else that points at a URL**: Google Ads final URLs and sitelinks, Google Business Profile, links in
      hub emails/invoices/templates (payment and thank-you pages!), partner flows (Jellynote, Cantamus landing and
      thank-you pages), social profiles, printed QR codes. These become `port` or redirect rows, never 404s.
- [ ] **Forms**: recipients and integrations of every Elementor form (D12).
- [ ] **Payments**: where customers pay per currency today (D4).
- [ ] **DNS**: where each domain's DNS is hosted and who can change it; current MX/SPF/DKIM records (email must keep
      working); TTLs.
- [ ] **Catalan**: a Catalan speaker who reads the finished Catalan site once, at C2's go/no-go (D14).
- [ ] **Content freeze**: from which date WordPress edits stop per domain, or how changes made during the migration are
      reported.

## 6. The waves

Waves are sized for one to a few sessions each. English content waves (W2–W7) can run in any order after W1, but its
cutover (W8) needs all of them. The inventories carry the wave of every English URL.

```
W0 inputs ─► W1 foundations ─► W2 en core ─► C1 Catalan launch ─► C2 Catalan cutover (pilot)
                                   │
                                   └─► W3–W7 en content ─► W8 en cutover ─► W9 es ─► W10 fr ─► W11 de ─► W12 ja ─► W13 decommission
```

### W0 · Inputs and audit (1 session, mostly the owner)

- [ ] W0.1 Collect the inputs of section 5.
- [ ] W0.2 With access: fetch every live `sitemap_index.xml` (all six sites) and diff it against the inventories; add
      missing URLs (expected: Spanish/French/Japanese blog posts and service pages), regenerate the `.md` tables.
- [ ] W0.3 Media census: list every `wp-content/uploads` file the inventory pages use (images, MP3, PDF), total size per
      locale → decide D10.
- [ ] W0.4 Record the answers to D1–D15 in section 4.

### W1 · Foundations (2–4 sessions, engineering PRs, normal review path)

- [ ] W1.1 **Redirect pipeline**: `src/content/<locale>/redirects.ts` → `dist/client/_redirects` in `postbuild.ts`
      (domain mode as is, path mode with `/<locale>` prefixes so previews can test them) + unit test (no chains,
      loops, shadowing; internal targets exist). Seed with the "planned" rules of `redirects.md`.
- [ ] W1.2 **Cutover test**: `tests/migration/inventory.test.ts` over `dist/client`: every `port`/`port-noindex`/
      `create`/`done` path of the build's locale exists, every `redirect` path matches a rule, `noindex` rows are out of
      the sitemap. Runs in the SEO job; reports progress (n of m) instead of failing until a locale is flagged
      `cutoverReady` in its site config.
- [ ] W1.3 **Trailing slash and 404 behaviour on Netlify**: on a deploy preview check `/gift-card` (200, no redirect),
      `/gift-card/` (single 301 to no slash), an unknown path (404 page with status 404); fix with
      `autoSubfolderIndex: false` or rules if needed. Check that the query string (`?gclid=`) survives a 301.
- [ ] W1.4 **Templates and collections** (each with a story and catalogue entry): `service` (hero, audio/PDF sample,
      included items, pricing link, FAQ), `post` + blog index with `/<blogIndex>/page/<n>` pagination, `artist`
      (popular), `musician` (endorsed), `partner`, `legal` (long prose with table of contents), `glossary` (terms with
      anchors), FAQ page (from `faqs`, FAQPage JSON-LD), reviews page. Optional frontmatter `path` override (D8).
- [ ] W1.5 **New blocks the legacy pages need** (confirm while porting): `AudioSample` (native `<audio>`, local file),
      `PdfSample` (thumbnail + download), `FaqList` (accordion), `VideoEmbed` (click-to-load facade, D7),
      `ComparisonTable` (software conversions), `PriceTable` per service.
- [ ] W1.6 **Importer, run in bulk without input**: `scripts/import-wp.ts <locale> <path>` reads the page (REST API
      `/wp-json/wp/v2/<type>?slug=` with `yoast_head_json`, or the WXR export) into `.cache/wp/` (git-ignored),
      downloads its media (with the media library's alt texts) into the page folder, converts the Elementor HTML to an
      MDX draft with the blocks, **rewrites links** (absolute same-site URLs → locale-free paths, other sites' URLs →
      `siteUrl()`), fills frontmatter (title, description, `seoTitle`, `translationKey` from the inventory, `updated`),
      and writes what it could not map to the parity report instead of asking. `scripts/import-wp.ts --wave <W> |
      --locale <l>` ports every row of the inventory in one run. Single ports already run through `/new-page` with
      `.claude/skills/page/reference/wordpress.md` (REST API recipe); point that recipe at the importer, and turn the hidden `new-blog-post`/`new-service-page` stubs into real skills once their
      templates exist.
- [ ] W1.7 **Forms** (D12): generalize `/api/contact` for the other forms; alert on delivery failures.
- [ ] W1.8 **Consent and analytics** (D7); update the cookie and privacy policies for the new processors (Netlify,
      Resend, analytics) in the same PR as the consent change.
- [ ] W1.9 **RSS** `/feed` (D11); `/sitemap_index.xml` and Yoast child sitemaps → `/sitemap.xml`.
- [ ] W1.10 **hreflang and switcher across hosts**: today hreflang and `localeSwitchHref` only know locales that have
      the page in the repo, so after the English cutover English pages would drop their Spanish/French/German/Japanese
      alternates until those sites move. Read the legacy pairs from `inventory/*.json` as a fallback for locales not
      ported yet (absolute URL on the live WordPress domain), and drop the fallback per locale at its cutover.
- [ ] W1.11 **Structured data parity**: Organization/LocalBusiness (address, phones per locale), `AggregateRating` only
      where Google's review-snippet policy allows it, FAQPage, BlogPosting, BreadcrumbList; compare with Yoast's output.
- [ ] W1.12 **Build cost**: every merge to `main` rebuilds every locale's Netlify site; extend
      `scripts/netlify-ignore.sh` so a production site skips builds that touch neither shared code nor its locale's
      content.

- [ ] W1.13 **Parity checks (the replacement for human review)**: `scripts/parity.ts <locale>` compares each ported
      page with its WordPress original (live HTML via the REST API or export, archived capture as fallback) and writes
      `docs/migration/parity/<locale>.md`: visible text diff (≥ 98 % of the words, every heading, every price and
      number), same images (count, alt), same internal links (resolving or redirected), same title/description/
      canonical (or the D13 change), forms present. Plus a screenshot pair per template (desktop + phone) for the
      cutover go/no-go. A batch merges only with a green report; failures go back to the importer, not to a person.
### W2 · English core pages (12 pages)

`/pricing`, `/contact`, `/about-us`, `/customer-reviews`, `/frequent-asked-questions`, `/services-samples`,
`/music-transcription-service`, `/cookies`, `/gdpr`, `/legal-notice`, `/terms-of-use`, `/careers`. These carry the
translations of the other sites, so give them their `translationKey` now (inventory "Translations" column). Needs D5,
D12, D13.

### C1 · Catalan launch (2 sessions, after W1 and W2)

The page set is in [`inventory/ca.md`](./inventory/ca.md): home, the eleven core and legal pages, gift card and ten
services, generated automatically from the English pages (D14).
- [ ] Locale chrome: `src/i18n/sites/ca.ts` strings in Catalan (today it inherits English), `src/content/ca/data/`
      (`nav.ts`, `footer.ts`, `home.ts`, `reviews.ts`, prices in EUR), the `ca` logo lockup, the Catalan legal entity
      text. This is the checklist the `add-locale` skill stub becomes.
- [ ] Pages: core first (home, preus, contacte, sobre-nosaltres, opinions, preguntes-frequents, serveis-musicals,
      legal), then the services, each sharing its English `translationKey`.
- [ ] Redirects: the two Catalan rules of [`redirects.md`](./redirects.md).
- [ ] D15: `ca` in every site config's `languageSwitcher` (label `CA`) and a flag/label asset.

### C2 · Catalan cutover, the pilot (1 session)

Run the [cutover runbook](#7-cutover-runbook-per-domain) for `lamevapartitura.cat` exactly as it will be run for the
big domains: Netlify site (`SITE_LOCALE=ca`), DNS (keep MX), TLS, Search Console property and sitemap, analytics, forms.
Write down every surprise in the runbook before W8.

### W3 · English services (41 + 5 to verify)

All rows of the `services` sitemap (the `services` collection, `group` from the mega menu in `nav.ts`), plus the five
mega-menu entries never seen live (`/horns-transcription-service`, `/lap-steel-guitar-transcription-service`,
`/string-orchestra`, `/strings-transcription-service`, `/trombone-transcription-service`): confirm they exist, else
remove them from `nav.ts`. Batch by group (keys, vocal, strings, guitar, winds, drums, ensembles, jazz, editing).

### W4 · English landing pages (45)

Audience and B2B pages (`/artists`, `/b2b`, `/music-educators`, publishers, partners, printing…), use cases (weddings,
Christmas, auditions, MIDI/YouTube/productions into scores), 9 AI-music pages and 15 notation-software conversion pages
(two templates, filled from data), 4 glossaries.

### W5 · English blog (126 posts + index)

Importer-driven, one unattended run for all 126 posts. Index at `/music-blog` with the same pagination scheme. RSS. Keep `date`,
`updated`, author, cover image, tags as data (tag archives are not rebuilt: redirects). WordPress comments, if any,
are not migrated.

### W6 · Artists, endorsed musicians, partners, catalogues (66)

33 "popular" artist pages → `artists`, 18 endorsed musicians → `musicians`, partners → `partners`, the listing pages,
the slug collisions (D8) and the catalogue/archive pages (D6). Add the `/popular/*` and `/endorsed/*` rules.

### W7 · Utility, payment, promo and shop (22)

Thank-you pages (noindex, or retired with their forms once nothing links to them: check hub emails and partner flows),
payment pages (D4), per-person pages (`/mauricio`, `/colome`, `/quim`, `/cristina`, `/oriol`, `/mir`: ask what they
are for), internal pages (`/transcriber`, `/sign-up`, `/b2b-deck`), the current promo, expired promos → redirects,
shop → `catalog.`.

### W8 · English cutover (1 session + 2 weeks of watching)

[Cutover runbook](#7-cutover-runbook-per-domain), with the lessons of C2.

### W9–W12 · Spanish, French, German, Japanese (≈2 sessions each)

Per locale, in the D3 order:
- [ ] Locale chrome (same checklist as C1).
- [ ] Inventory refresh from the live sitemap (W0.2 for this locale).
- [ ] Port the translated core pages and services with the English `translationKey`s, then the locale-only pages
      (French `/accordeon`, `/compositeurs-en-ligne`, `/fanfares`; Japanese `/how-does-it-work`; the blog posts).
- [ ] Redirects from [`redirects.md`](./redirects.md) (D5 singles, promos, WooCommerce, cloned-slug leftovers).
- [ ] Drop this locale's hreflang fallback (W1.10) once its pages are in the repo.
- [ ] Create the locale's Netlify site (`SITE_LOCALE=<locale>`, `NETLIFY_TARGET=site`; previews are skipped by
      `scripts/netlify-ignore.sh`), then cut over.

### W13 · Decommission (per domain, ~3 months after its cutover)

- [ ] Remove `legacyOrigin` from the locale's site config (links must then resolve internally; the SEO suite enforces it).
- [ ] Keep a full WordPress backup (files + database) offline; cancel the SiteGround plan once the last domain using it
      has moved and DNS/email no longer depend on it.
- [ ] Close the inventory's `decide`/`verify` leftovers; mark the locale done in the session log.
- [ ] Colleagues who edited WordPress now request changes through the `page` skill's commands (`/new-page`,
      `/edit-page`, `/translate`…); walk each team through `docs/content-managers.{md,es.md,ca.md}`.

## 7. Cutover runbook (per domain)

**One week before**
- [ ] All inventory rows of the locale are done, redirected or explicitly dropped; the cutover test passes for
      `SITE_LOCALE=<locale> pnpm build`; `pnpm release-check` green; Lighthouse thresholds met on the key templates.
- [ ] Final delta: diff the live sitemap against the inventory one last time; port anything new; content freeze starts.
- [ ] Crawl the production build locally (`pnpm serve:dist`) with every legacy URL of the inventory and of the redirect
      export: 200 or a single 301 to a 200, nothing else.
- [ ] **Go/no-go** (the one human step per domain): the owner browses the new site on its Netlify URL with the
      parity report and the screenshot pairs, and says go.
- [ ] Netlify site ready: custom domain + aliases, environment variables, form API keys, TLS ready to issue.
- [ ] Baseline exported: Search Console clicks per page, analytics conversions of the last 4 weeks.
- [ ] DNS: lower TTLs to 300 s; copy every record that is not the website (MX, SPF, DKIM, DMARC, `hub.`, `catalog.`,
      verification TXT records) to the target DNS if the nameservers change.

**Switch (low-traffic hour, Europe/Madrid early morning)**
- [ ] Point the apex/www records at Netlify; wait for TLS; check `http→https`, secondary host → primary, five core
      pages, five redirects, every form end to end, analytics receiving hits, a test email to the domain.
- [ ] Search Console (and Bing Webmaster Tools): submit `/sitemap.xml`, inspect the home page and the top 10 pages.
- [ ] Update Google Ads final URLs that changed (should be none) and the Business Profile link if needed.

**Two weeks after**
- [ ] Daily: Search Console 404s and crawl errors, Netlify 404 logs → add redirects for anything real.
- [ ] Weekly: clicks/impressions of the top pages against the baseline; conversions (forms, hub sign-ups).
- [ ] Uptime and form-delivery monitoring in place.
- [ ] Keep the old WordPress reachable on a private hostname (read-only) for content lookups until W13.

**Rollback**: point DNS back to SiteGround (kept untouched, TTL 300 s) if the site is broken in a way that cannot be
fixed within the hour.

## 8. Risks

| Risk | Mitigation |
|---|---|
| Live sites unreachable for tooling (bot protection) | W0.1 allowlist or exports; archives as a fallback (titles/hreflang already captured in `inventory/*.json`) |
| Hidden URLs (pages not in sitemaps, plugin redirects, old slugs, URLs in emails/ads/partner flows) lose traffic or break flows | redirect export, `_wp_old_slug`, the "everything that points at a URL" input, Search Console 404 watch |
| hreflang cluster breaks while domains are on different stacks | W1.10 fallback from the inventory |
| Content drifts on WordPress during the migration | content freeze per domain; final delta crawl |
| A locale's Netlify site is reachable on `*.netlify.app` before cutover | canonicals point at the real domain; optionally password-protect or `noindex` the Netlify subdomain until cutover |
| Email or subdomains break when nameservers move | copy all non-web DNS records first; test mail on switch day; rehearsed in C2 |
| An automatic port silently loses content | W1.13 parity report gates every batch; the cutover go/no-go reads it |
| Catalan copy quality (machine-written) | D14: a Catalan speaker reads the whole site once at C2 |
| Repo size from media | W0.3 census, D10 |
| Build minutes: six production sites rebuild on every merge | W1.12 |
| Analytics gap hides a regression | D7 decided and live before the first cutover; baseline exported before |

## 9. Open questions found while reviewing this plan

Not blocking the start, but each needs an answer before the wave named:
- What are `/mauricio`, `/colome`, `/quim`, `/cristina`, `/oriol`, `/mir` (per-person landing pages, payment links,
  team profiles)? (W7)
- Is the German site's French-slug FAQ/review/team content still reachable, or already removed? (W11)
- Does the Japanese site get maintained content, or should it shrink to the core pages? Its legal pages are in English
  today. (W12)
- Which currency does the English site quote (it has USD, GBP, AUD and EUR payment pages)? (D4)
- Should Catalan get a blog, and which services beyond the launch set? (after C2)

## 10. Session log

| Date | Session | Done | Next |
|---|---|---|---|
| 2026-10-08 | Plan | Researched the six sites (archives; live access blocked), wrote this plan, the inventories and the redirect draft; Catalan reworked as the pilot launch; porting made fully automatic (importer + parity checks, one human go/no-go per domain) | W0.1 inputs from the owner; W1.1–W1.3 can start in parallel |
