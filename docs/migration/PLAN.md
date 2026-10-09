# WordPress → this repo: migration plan

Status: **W1.4–W1.6 under way.** Fourteen English pages are in the repo: home, `/gift-card` and the twelve ported on
2026-10-08 ahead of their waves (see the [session log](#10-session-log)); nothing is cut over.
Written 2026-10-08. This file is the general plan; the specifics live in the files it links to. Follow it wave by wave
in later sessions: tick the checklists here, fill the **PR** column of the inventories, and add a line to the
[session log](#10-session-log) at the end of every session.

| File | What it is |
|---|---|
| **this file** | scope, findings, principles, decisions, the waves and their checklists, the cutover runbook, risks |
| [`inventory/en.md`](./inventory/en.md) | every English URL (320) with its target collection, wave, action, translations and archived title |
| [`inventory/es.md`](./inventory/es.md) · [`fr.md`](./inventory/fr.md) · [`de.md`](./inventory/de.md) · [`ja.md`](./inventory/ja.md) | the same for the other live sites (less complete until step W0.2) |
| [`inventory/ca.md`](./inventory/ca.md) | the Catalan draft site and the page set to create for its launch |
| [`inventory/*.json`](./inventory/) | machine-readable copy (titles, descriptions, canonicals, hreflang pairs): what the importer, the parity checks and the cutover test read |
| [`redirects.md`](./redirects.md) | draft redirect map per domain |
| `parity/<locale>.md` (from W1 on) | the parity report of each ported locale: the record that replaces page-by-page review |

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
to its successor; its pages declare hreflang to every other locale that has the page; the domain points at Netlify;
Search Console reads the new sitemap with no rise in 404s two weeks later; its WordPress install is switched off. The
migration is done when all six are.

Out of scope (they stay where they are, but their DNS records must survive each cutover): `hub.` (customer app, login
and sign-up), `catalog.` (the sheet-music shop that already took over `/shop` products; itself a WordPress site on
SiteGround, so the hosting plan outlives this migration), the other subdomains found in the archive (`pay.`,
`msmtmusic.`, `mysongproductions.`…), and email (MX records).

## 2. What is on the live sites (research of 2026-10-08)

**Access.** All six domains sit behind SiteGround's bot protection. From this cloud environment every request gets a
captcha page (HTTP 202, `/.well-known/sgcaptcha`), headless Chromium included; the WordPress REST API answered once with
`curl -A "Mozilla/5.0"` and was blocked on the next calls. The inventories were therefore built from the **Internet
Archive** (sitemaps captured up to 2026-05, every captured URL since 2013, the latest capture of each page's `<head>`)
and **Common Crawl** (live menus of Sept 2026). Porting needs reliable access to the live content: step W0.1.

**Stack seen in the HTML.** Elementor 4 + Elementor Pro + Ultimate Addons, WooCommerce (+ Realex/Global Payments,
PayPal, "name your price"), Yoast SEO, WP Rocket, Complianz (consent), startklar Elementor forms, honeypot/WP Armour,
Tidio chat, Trustpilot widget, Google Tag Manager, Bing UET, reCAPTCHA.

**URL counts** (details and per-URL actions in the inventories; `redirect` already includes the D5 default for single
review/FAQ/team entries):

| Locale | URLs listed | port / create | decide first | redirect | verify | Sources |
|---|---|---|---|---|---|---|
| en | 320 | 283 + 4 noindex (+2 done) | 23 | 3 | 5 | live Yoast sitemaps (2026-05): post 126, page 89, services 41, popular 33, endorsed 19, partner 3, product 2; + legal pages and `/careers` linked from the footer but not in the sitemap; + 5 mega-menu entries of `nav.ts` never seen live |
| es | 111 | 25 | 1 | 81 | 1 | no sitemap ever archived: menu crawl, English hreflang, archive (incl. 34 team, 19 review, 4 FAQ entries) |
| fr | 49 | 29 | 2 | 14 | 3 | no sitemap archived: live menu (Common Crawl, 2026-09), English hreflang, archive |
| de | 120 | 36 | 3 | 69 | 11 | sitemap 2025-10 (10 pages, 16 posts, 9 services) + 2024 sitemaps since dropped (30 team, 16 reviews, 13 FAQs) |
| ja | 28 | 18 | 3 | 5 | 2 | 2022 sitemap (10 pages) + live menu (2026-09) |
| ca | 7 existing + 19 new | 22 (3 replace + 19 create) | — | 2 | — | 2023 `wp-sitemap.xml` + homepage (2025-07); new page set in [`inventory/ca.md`](./inventory/ca.md) |

So the work is about **290 English pages** (126 of them blog posts), **~110 pages across es/fr/de/ja**, most of them
translations of ~25 English pages (home, pricing, contact, about, reviews, FAQ, services overview, legal, 6–12
services), and **~22 Catalan pages to generate**.

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
   glossaries, ~40 service pages with audio/PDF samples. The importer is built template by template, and each
   template pays for itself many times.
10. **SEO rule conflicts.** CI enforces a `<title>` of 30–65 characters, a description of 50–160 and exactly one
    `<h1>`. Many legacy titles are shorter ("Despacito", "Covid-19 update") or longer, and the home page has two
    `<h1>`s. The CI rules win; the importer adjusts them by a fixed rule (D13).

## 3. Principles

1. **Same URL, same host, same words.** A port reproduces the page at the same path with the same title, description
   and copy; redesign happens after the migration, through the `page` skill. Improvements are allowed only where CI
   forces them (D13) or the plan says so. (Catalan has no legacy to preserve: it is written new.)
2. **Porting is automatic; people decide, they do not review pages.** The importer turns every WordPress page into
   page components and automated parity checks prove each port matches the live page (W1.7). Nobody previews or approves pages
   one by one. Human input is limited to the owner's inputs and decisions up front (W0) and one go/no-go per domain
   at cutover. This is compatible with CLAUDE.md's "nothing reaches `main` unseen" rule because `main` reaches no
   real domain until that domain's cutover, and the cutover go/no-go is where a person looks at the whole site (D1).
3. **Co-location, no hotlinking.** Every image, PDF and audio sample is downloaded into the page's folder; nothing
   points at `wp-content` (CLAUDE.md conventions).
4. **The inventory is the source of truth.** Every URL has exactly one action. A page found later is added to the
   inventory first. The importer refuses to run on a `decide` or `verify` row, and the cutover test reads the
   inventory, so a domain cannot move with a URL unaccounted for.
5. **One domain at a time, all of it at once.** A domain moves to Netlify only when all its URLs are covered (D2).
   Until then its WordPress site stays untouched and `legacyOrigin` keeps preview links working.
6. **The hreflang cluster never breaks, without special code.** hreflang and sitemap alternates are built from
   `translationKey` with each locale's own domain + path. Because URLs are preserved, a page in the repo declares the
   right alternate whether that locale is already on Netlify or still on WordPress. So the only rule is: **a page's
   translations enter the repo together** (W2 ports the core pages of every locale at once), and a page is never
   ported alone in one locale when its hreflang twins exist.

## 4. Decisions

Each has a recommendation, and **the recommendation is the default**: W0.4 records objections; where there is none, the
recommendation applies and the waves run on it. Record the answer here (and in the session log).

| # | Question | Recommendation | Blocks |
|---|---|---|---|
| D1 | Who reviews the ports? | **Nobody, page by page.** Ports run unattended: importer → parity checks (W1.7) → one PR per batch that auto-merges when CI is green and the committed parity report covers every page of the batch without failures. A port that fails parity is fixed by the next session, never handed to a person. People act only at W0 (inputs, decisions) and at each domain's cutover go/no-go, where they browse the whole new site on its Netlify URL with the parity report. The `page` skill and its previews stay for **new** pages and **changes** after the migration. Record this exception to CLAUDE.md's page workflow in CLAUDE.md when W1.6 lands. | W2+ |
| D2 | Cutover style? | Big-bang per domain once its inventory is complete (no proxying unported paths to WordPress: SiteGround's bot protection would challenge Netlify's proxy, and mixed hosting complicates caching and analytics). | C2, W8+ |
| D3 | Order of the domains? | **ca → es → en → fr → de → ja.** Catalan first (nothing to lose: rehearses the locale checklist, the Netlify site, DNS and the runbook). Spanish second: a real site with real rankings but ~30 pages, so the first cutover that can hurt is the smallest. English third with everything learned; the other three follow by size. The alternative (en right after ca) gets the main site over sooner at the cost of taking the biggest risk untested. | C1, W8+ |
| D4 | Payments and shop: per-currency payment pages, how-to-pay, WooCommerce endpoints, regional prices (USD/GBP/AUD/EUR/JPY). | The static site takes no payments. Payment links point to the hub (or Stripe/PayPal payment links decided by the business); payment pages become plain pages with those links, or 301 to the hub. Shop URLs 301 to `catalog.` (already live for products). Needs the owner's input on where customers pay today and which currency each site quotes. | W7 |
| D5 | Single FAQ, review and team entries (es `/review/*`, `/equipo/*`, `/faqs/*`; de flat slugs; ja `/review/*`; en `/team/*`). | Keep them as data (the `reviews`/`faqs` collections and `data/*.ts` feed the listing pages and JSON-LD), no indexable pages; 301 each old URL to its listing page. The inventories already carry this as `redirect`. Exception: an entry with real search traffic (Search Console) is ported as a page. | W2, W8+ |
| D6 | Catalogue and archive pages (`/jazz-piano`, `/blues-piano`, `/popular-sheet-music`, `/sheet-music-catalogue`, `/catalog-grid`, `/midi-catalog`). | Port the ones Search Console shows traffic for as static lists linking to `catalog.`; 301 the rest to `catalog.`. Without Search Console data: port all six (cheap, zero risk). | W6 |
| D7 | Third-party scripts. CLAUDE.md forbids runtime third-party URLs; the live site runs GTM, Bing UET, Tidio, Trustpilot, reCAPTCHA, YouTube embeds. | Keep **measurement** (needed to prove the migration did no harm): consent-gated GA4/GTM through the existing ConsentBanner, written into CLAUDE.md as the one exception. Trustpilot widget → static rating from `data/`. Tidio → drop unless sales depends on it. YouTube → click-to-load facade. reCAPTCHA → honeypot + server checks in `/api`. | W1 |
| D8 | May any URL change? | No, except: collisions (finding 5: the page wins over the partner entry, the musician over the partner), the duplicate Spanish orchestration page (`/orquestraciones` stays, it is the one in the hreflang tags), Japanese nested `/services/<slug>` (kept through a `path` override in `meta.ts`). | W1, W6, W12 |
| D9 | Prune old blog posts (2017–2021 news, covid update, "top albums 2021")? | Port all 126 verbatim first (free with the importer, zero SEO risk); prune afterwards from Search Console data. | W5 |
| D10 | Media: old `/wp-content/uploads/*` URLs and audio/PDF samples. | Let upload URLs 404 unless Search Console shows image traffic to specific files; commit samples next to their page (MP3 at 128 kbps, PDFs as-is). Measure the total in W0.3; past ~300 MB, decide on Git LFS or a Netlify Blobs-backed `/assets/samples`. | W1, W3 |
| D11 | RSS: `/feed` exists on every site. | Generate `/feed` (RSS 2.0) from the `posts` collection at build; keeps subscribers and integrations working. | W5 |
| D12 | Forms: contact, B2B, educators, careers/transcriber application, catalog download, gift card (done). | All post to `/api/*` functions modelled on `src/server/contact.*` (Resend), same recipients as the Elementor forms; confirmation inline (no thank-you pages). Needs the recipients and any webhook the forms feed (hub, CRM). | W2, W4, W7 |
| D13 | Legacy titles/descriptions that break CI rules. | CI wins; the importer applies a fixed rule (append the brand suffix to short titles, trim long ones at a word boundary, fall back to the first paragraph for missing descriptions, demote a second `<h1>` to `<h2>`) and lists every change in the parity report. | W2+ |
| D14 | Catalan is new copy, not a port: who writes and checks it? | Generated automatically like the ports: Claude translates each page from English with the Spanish page as reference, slugs as decided in [`inventory/ca.md`](./inventory/ca.md). A Catalan speaker reads the whole site once, at C2's go/no-go (renaming a slug costs nothing then: nothing indexes them yet). | C1 |
| D15 | Catalan in the other sites: language switcher, hreflang, footer languages. | Add `ca` to every site's `languageSwitcher` the day Catalan launches (hreflang follows from shared `translationKey`s automatically). WordPress sites still live at that point keep linking without Catalan; acceptable until they move. | C1 |

## 5. Inputs needed from the site owner (W0.1)

Without these the plan still works (archives), but each one removes guesswork:

- [ ] **Access**: allowlist this environment in SiteGround (Site Tools → Security → bot protection; the cloud sessions
      came from `160.79.106.0/24` during the research) or switch the protection off for the migration, **or** provide
      per site a WordPress export (Tools → Export → All content, WXR) and a media library archive (`wp-content/uploads`).
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

```
W0 inputs ─► W1 foundations ─► W2 core pages, every locale ─► C1 Catalan launch ─► C2 Catalan cutover (pilot)
                                        │
                                        ├─► W8 Spanish port + cutover
                                        │
                                        └─► W3–W7 English content ─► W9 English cutover ─► W10 fr ─► W11 de ─► W12 ja ─► W13 decommission
```

Rough effort: W0 1 session (mostly the owner) · W1 4 · W2 1 · C1 2 · C2 1 · W3–W7 8 · W8 2 · W9 1 · W10–W12 2 each ·
W13 1, about **27 sessions**, plus two weeks of watching after each cutover (the watching needs no session unless
something shows up). The English content waves (W3–W7) can run in any order once W1 and W2 are in, and W8 can run in
parallel with them. The inventories carry the wave of every English URL.

### W0 · Inputs and audit (1 session, mostly the owner)

- [ ] W0.1 Collect the inputs of section 5.
- [ ] W0.2 With access: fetch every live `sitemap_index.xml` (all six sites) and diff it against the inventories; add
      missing URLs (expected: Spanish/French/Japanese blog posts and service pages), regenerate the `.md` tables.
- [ ] W0.3 Media census: list every `wp-content/uploads` file the inventory pages use (images, MP3, PDF), total size per
      locale → decide D10.
- [ ] W0.4 Record objections to D1–D15 in section 4 (silence = the recommendation). Then resolve every `decide` and
      `verify` row of the inventories to `port`, `redirect` or `drop`: `verify` rows by fetching the live URL (a script,
      once access exists), `decide` rows from the decisions. After W0.4 the inventories contain no open rows.

### W1 · Foundations (≈4 sessions, engineering PRs, normal review path)

The critical path to the first port (W1.1–W1.9), then what every cutover needs (W1.10–W1.12).

- [ ] W1.1 **Redirect pipeline**: `content/<locale>/redirects.ts` → `dist/client/_redirects` in `postbuild.ts`
      (domain mode as is, path mode with `/<locale>` prefixes so previews can test them) + unit test (no chains,
      loops, shadowing; internal targets exist). Seed with the "planned" rules of `redirects.md`.
- [ ] W1.2 **Cutover test**: `tests/migration/inventory.test.ts` over `dist/client`: every `port`/`port-noindex`/
      `create`/`done` path of the build's locale exists, every `redirect` path matches a rule, `noindex` rows are out of
      the sitemap, no open `decide`/`verify` rows. Runs in the SEO job; reports progress (n of m) instead of failing
      until a locale is flagged `cutoverReady` in its site config.
- [ ] W1.3 **Trailing slash and 404 behaviour on Netlify**: on a deploy preview check `/gift-card` (200, no redirect),
      `/gift-card/` (single 301 to no slash), an unknown path (404 page with status 404); fix with
      `autoSubfolderIndex: false` or rules if needed. Check that the query string (`?gclid=`) survives a 301.
- [ ] W1.4 **Collections and their header blocks** (each with a story and catalogue entry; there are no templates, a page
      is blocks only and opens with its header block): `service` (PageHeader with icon and rating, audio/PDF sample,
      included items, pricing link, FAQ), `post` + blog index with `/<blogIndex>/page/<n>` pagination, `artist`
      (popular), `musician` (endorsed), `partner`, `legal` (long prose with table of contents), `glossary` (terms with
      anchors), FAQ page (from `faqs`, FAQPage JSON-LD), reviews page (from `reviews`). Frontmatter `path` override
      (D8). Prices and counts that appear on several pages go to `content/<locale>/data/*.ts`, as CLAUDE.md wants.
      *Done 2026-10-08:* `service` (services collection: the page opens with `<PageHeader icon rating>` and composes
      Steps, RatingBanner, Samples, Section, CardGrid, PricingCards, FaqList) and landing pages (open with
      `<PageHeader variant="split">`). Templates were removed the same day: `meta.ts` is SEO data only, and components
      hold no words or pictures (the page passes them, from `data/labels.ts`, `data/forms.ts` and its folder; the
      importer must emit them). Shared data: `data/ratings.ts`,
      `data/services.ts` (included, per-service prices, `allServices`), `data/faqs.ts` (shared and category groups),
      `data/reviews.ts`. *Open:* post + blog index, artist, musician, partner, legal, glossary, FAQ page, reviews page.
- [ ] W1.5 **New blocks the legacy pages need** (confirm while porting): `AudioSample` (native `<audio>`, local file),
      `PdfSample` (thumbnail + download), `FaqList` (accordion), `VideoEmbed` (click-to-load facade, D7),
      `ComparisonTable` (software conversions), `PriceTable` per service.
      *Done 2026-10-08, with semantic names (catalogue in `src/components/blocks`, by role):* `FaqList` (native
      accordion + FAQPage JSON-LD), `VideoEmbed` (primitive: click-to-load facade on youtube-nocookie, used by `Samples`,
      `Steps` and `MediaText`), `Samples` (video beside the score), `Table` (covers the comparison and price tables),
      `PricingCards` (one wide card per service), plus `PictureGrid` (logos, portraits, photos, service icons),
      `Stats`, `CardGrid` tabs (currencies). *Open:* `AudioSample`, `PdfSample` (no page of the first batch had audio or PDFs).
- [ ] W1.6 **Importer, run in bulk without input**: `scripts/import-wp.ts --locale <l> [--wave <W> | <path>…]` ports
      every eligible row of the inventory in one run. Per page: reads it (REST API `/wp-json/wp/v2/<type>?slug=` with
      `yoast_head_json`, or the WXR export) into `.cache/wp/` (git-ignored); downloads its media at the original size
      (not the `-1024x768` derivative) with the media library's alt texts into the page folder; converts the Elementor
      HTML to page components (`index.tsx`) by a **widget → block mapping table** (heading/text-editor → `Section` prose, image+text → `MediaText`,
      accordion → `FaqList`, audio/file → `AudioSample`/`PdfSample`, video → `VideoEmbed`, button → link…), built up
      template by template with the parity report as the feedback loop; what no rule maps becomes `Section` prose, never
      a question to a person; **rewrites links** (absolute same-site URLs → locale-free paths, other sites' URLs →
      `siteUrl()`); fills `meta.ts` (title, description, `seoTitle`, `translationKey` from the inventory, `updated`,
      D13 rule); and imports custom post type entries (reviews, FAQs, team) into their collections or `data/*.ts`
      instead of pages (D5). Single ports already run through `/new-page` with
      `.claude/skills/page/reference/wordpress.md` (REST API recipe); point that recipe at the importer, and turn the
      hidden `new-blog-post`/`new-service-page` stubs into real skills once their templates exist.
      *Learned 2026-10-08 (12 pages ported by hand from the REST API and Archive captures):* the REST API answered from the
      cloud session for pages; the `services` post type exposes no `content`, so services came from Archive captures
      (`web.archive.org/web/2026id_/…`, gzip). Uploads download directly. Widget → block map that held up:

      | Elementor widget | Block |
      |---|---|
      | heading + text-editor | `Section` prose, or the `title` of the block it introduces |
      | image + text-editor / image-box | `MediaText` (image-carousel → `images`; before/after → `layout="pair"`) |
      | uael-video + score image ("Play to compare") | `Samples`; inside "How does it work?" → `Steps variant="columns"` |
      | uael-timeline | `Steps` (timeline) |
      | counter + three rating boxes | `RatingBanner` (numbers from `data/ratings.ts`) |
      | icon-box "What's included" | `CardGrid image={studioBand} items={included}` |
      | "Flexible pricing for …" headings | `PricingCards` with one tier from `data/services.ts` |
      | custom_acf_accordion | `FaqList` (the shared "Music services" group is identical on every service page) |
      | loop-grid / loop-carousel of services | `PictureGrid items={allServices}` (`limit` for a short list) |
      | image-box grids of people or logos | `PictureGrid shape="portrait"` / `"logo"` (`name`, or `alt` alone) |
      | image grid, scrolling photo strip | `PictureGrid shape="photo"` (`variant="marquee"` for the strip) |
      | centred heading + one button band | `Section align="center" rule={false} width="narrow"` |
      | nested-tabs ($ / €) | `CardGrid tabs` |
      | af_jobs_table | `Table` |
      | slides | `CardGrid` with `linkLabel` |
      | form | `ContactSection` |
- [ ] W1.7 **Parity checks (the replacement for human review)**: `scripts/parity.ts <locale>` compares each ported
      page with its WordPress original (the cached HTML from W1.6, archived capture as fallback) and writes
      `docs/migration/parity/<locale>.md`, committed with the batch: visible text of the main content area (Elementor's
      page container, not header/footer/cookie banner) ≥ 98 % of the words, every heading, every price and number, same
      images (count, alt), same internal links (resolving or redirected), same title/description/canonical (or the D13
      change), forms present; plus a screenshot pair per template (desktop + phone) for the cutover go/no-go. It runs
      where the live site is reachable (the session); CI only checks that the committed report covers every page the
      PR adds and has no failure. A batch merges only on a green report; failures go back to the importer rules.
- [ ] W1.8 **Forms** (D12): generalize `/api/contact` for the other forms; alert on delivery failures.
- [ ] W1.9 **Consent and analytics** (D7); update the cookie and privacy policies for the new processors (Netlify,
      Resend, analytics) in the same PR as the consent change.
- [ ] W1.10 **RSS** `/feed` (D11).
- [x] W1.10 Sitemaps split like Yoast's (index at `/sitemap.xml`, one per collection, `scripts/lib/sitemap.ts`);
      `/sitemap_index.xml` and the other Yoast and WordPress sitemap URLs → `/sitemap.xml` (`LEGACY_SITEMAPS`).
- [ ] W1.11 **Structured data parity**: Organization/LocalBusiness (address, phones per locale), `AggregateRating` only
      where Google's review-snippet policy allows it, FAQPage, BlogPosting, BreadcrumbList; compare with Yoast's output.
- [ ] W1.12 **Build cost**: every merge to `main` rebuilds every locale's Netlify site; extend
      `scripts/netlify-ignore.sh` so a production site skips builds that touch neither shared code nor its locale's
      content.

### W2 · Core pages, every locale (1 session)

The pages that carry hreflang between the sites, ported together (principle 6): the 12 English core pages
(`/pricing`, `/contact`, `/about-us`, `/customer-reviews`, `/frequent-asked-questions`, `/services-samples`,
`/music-transcription-service`, `/cookies`, `/gdpr`, `/legal-notice`, `/terms-of-use`, `/careers`) and their Spanish,
French, German and Japanese twins from the inventories' "Translations"/"EN counterpart" columns (~60 pages), each pair
on one `translationKey`. First real run of the importer and the parity report. Needs D5, D12, D13.

*Ported 2026-10-08 ([#32](https://github.com/My-Sheet-Music-Transcriptions/web/pull/32)):* `/music-transcription-service`
and `/careers` (neither has a twin in the inventories). 10 of the 12 English core pages remain.

### C1 · Catalan launch (2 sessions, after W1 and W2)

The page set is in [`inventory/ca.md`](./inventory/ca.md): home, the eleven core and legal pages, gift card and ten
services, generated automatically from the English pages (D14).
- [ ] Locale chrome: `src/i18n/sites/ca.ts` strings in Catalan (today it inherits English), `content/ca/data/`
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
`/string-orchestra`, `/strings-transcription-service`, `/trombone-transcription-service`), resolved in W0.4 (exist →
port, else drop from `nav.ts`). One importer run per group (keys, vocal, strings, guitar, winds, drums, ensembles, jazz,
editing) while the mapping rules settle, then the rest in one.

*Ported 2026-10-08 ([#32](https://github.com/My-Sheet-Music-Transcriptions/web/pull/32), English only):* `/piano`,
`/guitar-tab`, `/trumpet-transcription-service`, `/violin-transcription-service`, on the service page pattern that the
importer fills. The es/fr/de/ja twins of `/piano` and `/guitar-tab` follow in their locale waves. 37 to port and 5 to
verify remain.

### W4 · English landing pages (45)

Audience and B2B pages (`/artists`, `/b2b`, `/music-educators`, publishers, partners, printing…), use cases (weddings,
Christmas, auditions, MIDI/YouTube/productions into scores), 9 AI-music pages and 15 notation-software conversion pages
(two page patterns, filled from data), 4 glossaries.

*Ported 2026-10-08 ([#32](https://github.com/My-Sheet-Music-Transcriptions/web/pull/32)):* `/artists`,
`/music-educators`, `/sheet-music-printing`, `/partners`, `/endorsed-musicians-and-composers` and
`/convert-from-sibelius-to-musescore` (the model for the other 14 conversion pages). 39 remain.

### W5 · English blog (126 posts + index)

One unattended importer run for all 126 posts. Index at `/music-blog` with the same pagination scheme. RSS. Keep
`date`, `updated`, author, cover image, tags as data (tag archives are not rebuilt: redirects). WordPress comments, if
any, are not migrated.

### W6 · Artists, endorsed musicians, partners, catalogues (66)

33 "popular" artist pages → `artists`, 18 endorsed musicians → `musicians`, partners → `partners`, the listing pages,
the slug collisions (D8) and the catalogue/archive pages (D6). Add the `/popular/*` and `/endorsed/*` rules.

### W7 · Utility, payment, promo and shop (22)

Thank-you pages (noindex, or retired with their forms once nothing links to them: check hub emails and partner flows),
payment pages (D4), per-person pages (`/mauricio`, `/colome`, `/quim`, `/cristina`, `/oriol`, `/mir`: resolved in
W0.4), internal pages (`/transcriber`, `/sign-up`, `/b2b-deck`), the current promo, expired promos → redirects,
shop → `catalog.`.

### W8 · Spanish port and cutover (2 sessions; the first cutover with rankings at stake)

- [ ] Locale chrome (same checklist as C1) and the inventory refresh from the live sitemap (W0.2 for es).
- [ ] Port the rest of the Spanish inventory (the core pages are in since W2): services, the three posts, the blog
      index; redirects from [`redirects.md`](./redirects.md) (D5 singles, promos, WooCommerce, the orchestration
      duplicate).
- [ ] Create the Spanish Netlify site (`SITE_LOCALE=es`, `NETLIFY_TARGET=site`; previews are skipped by
      `scripts/netlify-ignore.sh`), then the [runbook](#7-cutover-runbook-per-domain).

### W9 · English cutover (1 session + 2 weeks of watching)

[Cutover runbook](#7-cutover-runbook-per-domain), with the lessons of C2 and W8.

### W10–W12 · French, German, Japanese (≈2 sessions each)

Same checklist as W8 per locale: chrome, inventory refresh, the locale-only pages (French `/accordeon`,
`/compositeurs-en-ligne`, `/fanfares`; Japanese `/how-does-it-work`; the German posts), redirects (cloned-slug
leftovers included), Netlify site, runbook.

### W13 · Decommission (per domain, ~3 months after its cutover)

- [ ] Keep a full WordPress backup (files + database) offline; delete the WordPress install of the domain. The
      SiteGround plan itself stays as long as `catalog.` lives there.
- [ ] Close the inventory's leftovers; mark the locale done in the session log.
- [ ] Colleagues who edited WordPress now request changes through the `page` skill's commands (`/new-page`,
      `/edit-page`, `/translate`…); walk each team through `docs/content-managers.{md,es.md,ca.md}`.

## 7. Cutover runbook (per domain)

**One week before**
- [ ] All inventory rows of the locale are done, redirected or dropped; the cutover test passes for
      `SITE_LOCALE=<locale> pnpm build`; `pnpm release-check` green; Lighthouse thresholds met on the key templates.
- [ ] `legacyOrigin` removed from the locale's site config: every internal link must now resolve in the build (the
      SEO suite enforces it); after the switch there is no WordPress to fall back to.
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
| Live sites unreachable for tooling (bot protection); GitHub Actions is blocked too | W0.1 allowlist or exports; archives as a fallback (titles/hreflang already in `inventory/*.json`); parity runs in the session and commits its report, CI only reads it |
| The Elementor → blocks conversion loses or mangles content | mapping table grown template by template; unmapped widgets become prose, never silently dropped; the parity gate (words, headings, numbers, images, links) blocks the batch |
| Hidden URLs (pages not in sitemaps, plugin redirects, old slugs, URLs in emails/ads/partner flows) lose traffic or break flows | redirect export, `_wp_old_slug`, the "everything that points at a URL" input, Search Console 404 watch |
| hreflang cluster breaks while domains are on different stacks | principle 6: twins ported together (W2), same URLs on both stacks |
| Links to pages that only existed on WordPress 404 after a cutover | `legacyOrigin` removed before cutover; the SEO suite's broken-link check then covers them |
| Content drifts on WordPress during the migration | content freeze per domain; final delta crawl |
| A locale's Netlify site is reachable on `*.netlify.app` before cutover | canonicals point at the real domain; optionally password-protect or `noindex` the Netlify subdomain until cutover |
| Email or subdomains break when nameservers move | copy all non-web DNS records first; test mail on switch day; rehearsed in C2 |
| Catalan copy quality (machine-written) | D14: a Catalan speaker reads the whole site once at C2 |
| Repo size from media | W0.3 census, D10 |
| Build minutes: six production sites rebuild on every merge | W1.12 |
| Analytics gap hides a regression | D7 decided and live before the first cutover; baseline exported before |

## 9. Open questions

Not blocking the start; each is resolved in W0.4 or before the wave named:
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
| 2026-10-08 | Plan | Researched the six sites (archives; live access blocked), wrote this plan, the inventories and the redirect draft; Catalan reworked as the pilot launch; porting made fully automatic (importer + parity checks, one human go/no-go per domain); review pass: recommendations are defaults, D5 applied to the inventories, hreflang handled by porting twins together, Spanish cut over before English, `legacyOrigin` dropped at cutover | W0.1 inputs from the owner; W1.1–W1.3 can start in parallel |
| 2026-10-08 | Blocks + first ports | Block catalogue reshaped into semantic blocks filed by role (Storybook `Blocks/<Role>/<Name>`); blocks take their data as props; `service` and `landing` templates. Ported English-only, verbatim, pictures in the page folders: `/piano`, `/guitar-tab`, `/trumpet-transcription-service`, `/violin-transcription-service`, `/music-transcription-service`, `/artists`, `/music-educators`, `/sheet-music-printing`, `/convert-from-sibelius-to-musescore`, `/careers`, `/partners`, `/endorsed-musicians-and-composers`. Exception to principle 6: `/piano` and `/guitar-tab` have es/fr/de/ja twins, ported later in their waves. Titles shortened where they broke the 65-character rule (D13); review counts from data (854, not the captures' 791). `/faqs/*` rule added to the redirect map | Same pattern for the remaining W3 services (a `scripts/import-wp.ts` for the service template is now a small step), then W4 conversion pages from the Sibelius → MuseScore page |
| 2026-10-08 | Components refactor | Blocks filed by category (Headers, Text & media, Lists & grids, Reviews & ratings, Calls to action); the four page templates removed (every page opens with its own `PageHeader`, `meta.ts` is SEO only); components made agnostic of the content (no copy, no pictures, no site strings: pages pass them from `data/labels.ts`, `data/forms.ts` and their folder; `src/app` wires the chrome, which now reads each locale's own `nav.ts`/`footer.ts`); Storybook has its own data in `src/stories`; `tests/unit/components.test.ts` enforces the rule | Remaining W3 services and W4 conversion pages through an importer that emits the new page shape |
| 2026-10-09 | One block shell | Every story's DOM and screenshots reviewed: 18 blocks became 14 on one `BlockShell` (section, tone, container, heading, lead, closing buttons, photo band) with presets instead of pixels; `PictureGrid` replaces IconGrid/LogoGrid/Gallery, `Section` absorbs CtaBand, `PageHeader variant="photo"` replaces Hero, CardGrid and Steps share `FeatureItem`, media goes through `Media`; one prop vocabulary (`variant`, `lead`, `body`…) guarded by `tests/unit/blocks.test.ts`; the `component` skill documents the ladder (prop → item shape → primitive → block). Homepage 403px shorter at 1440px, visual baselines re-captured | The importer emits the new names (`PictureGrid`, centred `Section`, `variant`), remaining W3 services and W4 pages |
| 2026-10-09 | Sitemaps | Sitemaps made from `content/` instead of TanStack's prerender crawl (which had listed `/#contact` and published `pages.json`): an index at `/sitemap.xml` and one sitemap per collection with Yoast's names, hreflang alternates from the same function as the `<head>`, `lastmod` omitted on a shallow clone; the WordPress sitemap URLs 301 to the index (sitemap half of W1.10); unit test over every locale plus a multi-language fixture, SEO suite checks sitemaps == indexable pages and alternates == `<head>` | RSS (rest of W1.10); W1.1's redirect pipeline adds its rules to the `_redirects` file `postbuild.ts` now writes in domain mode |
| 2026-10-09 | Sitemaps in all-languages mode | msmt-web.netlify.app builds every locale under `/<locale>` (no `SITE_LOCALE` on its production deploy), which had no sitemap: each locale now gets its index and per-collection sitemaps under its prefix, a parent `/sitemap.xml` lists them all, `robots.txt` (still `Disallow: /`) names it and old WordPress sitemap URLs redirect per locale; canonicals and sitemap URLs use the site's address on production deploys instead of `main--msmt-web.netlify.app` | Set `SITE_LOCALE=en` on the English Netlify site at its cutover (production build of one locale) |
