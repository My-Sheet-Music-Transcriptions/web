---
name: cms
description: How the site's Decap CMS (/admin) is wired and how to change it - offer a block or a field to writers, add a collection, a language or a singleton, register a widget, fix the editor or its preview - plus a condensed reference of Decap 3.17's configuration and JavaScript API (reference/decap.md). Use before touching src/admin, src/components/blocks/cms.ts, src/content/cms-*.ts, vite.admin.config.ts or a page.json, and when someone asks what the CMS can do.
---

# The CMS (Decap, at /admin)

Writers edit **data pages** (`content/<locale>/<collection>/<slug>/page.json`) in Decap CMS; hand-built pages
(`index.tsx` + `meta.ts`) are never listed there. Logins are Netlify Identity through Git Gateway, and every save is a
pull request (editorial workflow) that merges on green CI like any content PR. Decap and the Identity widget are pinned
devDependencies (`decap-cms`, `netlify-identity-widget`) copied from `node_modules` into `dist/client/admin` at build:
nothing loads from a CDN, and updating Decap is bumping the version in `package.json` (read §11 of the reference first).

For anything Decap itself does (options, widgets, collections, i18n, media, the JS API, the gotchas), read
`reference/decap.md`, a condensed copy of decapcms.org/docs for 3.17, before guessing or fetching the site.

## Where things live

| File | What it is |
| --- | --- |
| `src/admin/config.ts` | `decapConfig`, written as `/admin/config.yml` by `vite.admin.config.ts`. Backend, logo, and the three collections: `site` (every language's homepage and menu, a file collection), `pages` and `services` (every language's, filed by `language`). |
| `src/admin/locales.ts` | `CMS_LOCALES`: the languages, in the order of the language filter and of the Site entries; the `language` field's options. |
| `src/content/cms-meta.ts` | `metaFields`: the fields every page opens with (title, description, translation key, SEO, share card, noindex, draft, updated), typed by `baseSchema`; `serviceFields`: what a service page adds (short name, icon, menu group, price from, order), typed by `serviceSchema`. |
| `src/components/blocks/cms.ts` | `cmsBlocks`: every block of the catalogue, in its order, with the fields writers fill in, typed by each block's props; presets (`preset`); `fromData`. |
| `content/<locale>/data/brand.ts` | Brand pictures (photo bands, the lockup) named so data fields can offer them. |
| `src/content/cms-fields.ts` | The field DSL (`line`, `prose`, `picture`, `pictureFile`, `sound`, `data`, `select`, `toggle`, `number`, `group`, `list`, `listOf`, `tableRows`, `faqGroups`), `decapField` (DSL → Decap field; `decap: {…}` passes raw Decap options last), the check of what is stored and `decodeFields` (names → pictures, recordings and data, then each field's decoder). |
| `src/content/data-page.ts`, `BlockPage.tsx`, `scripts/lib/vite-data-pages.ts` | Reading, checking and rendering `page.json` on the site. |
| `src/content/menu.ts`, `content/<locale>/data/menu.json` | A language's main menu (`Site` → `<Language> · Menu`, a file entry with its form in `menuFields` of `config.ts`): items, sections, links; each link a `page` (a select of every page of the language, hand-built included, listed when the admin is built) or an `href`. Checked by zod and `checkSlugs`; the preview draws it as an outline. |
| `src/admin/preview.tsx` | The editor's live preview with the real blocks, and `registerWidgets`. |
| `src/admin/widgets.ts` | Our widgets: `translation-key` (suggests existing keys, shows the linked translations, refuses a duplicate in the same language) and `image` (Decap's own, remounted once the picture has loaded so thumbnails show in lists). |
| `src/admin/index.html`, `vite.admin.config.ts` | The admin page (absolute `/admin/...` paths) and its build: config.yml, scripts, `logo.svg`. |
| `src/app/identity-redirect.ts` | Sends `#invite_token` / `#recovery_token` links that land on the site to `/admin`. |

Files Node imports to write config.yml (`config.ts`, `locales.ts`, `cms-meta.ts`, `cms-fields.ts`, `blocks/cms.ts`) use
relative imports **with** `.ts` extensions and `import type` for everything else.

## Recipes

- **Offer a block**: add it to `cmsBlocks`, in catalogue order, with the props a writer should set: words and
  pictures of the page folder, recordings (`sound`, an mp3 of the folder) and the lists kept in code (below). A field
  that does not fit the prop, or a missing required one, does not compile; the test checks the CMS offers every
  block of the catalogue. `pictureWidths` sets the srcset; `words` names the shared labels from
  `content/<locale>/data/labels.ts` it needs. A prop the CMS cannot edit as the block takes it gets a builder with a
  `decode` (as `tableRows` and `faqGroups` do): the decoder runs on the stored value once its names are resolved.
- **A list kept in code** (reviews, prices, a form, a brand picture): a data field,
  `fromData('Reviews', { homeReviews: 'reviews' })` (export name: its file in `content/<locale>/data`). It is typed
  by what the English file exports, the page stores the name, and the site, the preview and the content test resolve
  it in the page's locale. A brand picture becomes offerable by naming it in `brand.ts`.
- **A block used two ways** (the services grid vs a grid of photos): a preset, `preset('PictureGrid', { …, props })`,
  under a name of its own; `props` are fixed, the fields are what the writer sets. Pictures can override the block's
  widths per field: `picture('Photo', { widths: '1000;1600' })`. A decorative picture's alt takes `empty: ''`.
- **A field on every page**: add it to `baseSchema` (`src/content/schema.ts`) first, then to `metaFields`.
- **A language**: add it to `CMS_LOCALES` (it must be a site `Locale`); its filter, `language` option and Site entries follow.
- **A collection** (posts, artists…; pages and services exist): one `kind(...)` in `config.ts`, which lists every
  language's pages of that kind: `folder: 'content'`, `path: '{{language}}/<kind>/{{slug}}/page'` (a new page is filed
  by the language the writer picks), `filter` on the hidden `collection` field (every kind sits at the same depth under
  `content/`, so the filter is what keeps the others out), language `view_filters` and `view_groups`. Its page.json
  files open with `language` and `collection` (`splitDataPage` checks them against the folder). Keep
  `media_folder: ''`, `public_folder: ''` so pictures stay in the page folder. Add the kind to the preview templates.
- **The homepage** of a language appears in `Site` as `<Language> · Homepage` (a file entry, §2.2 of the reference) as
  soon as its `pages/home/page.json` exists; it is also listed under Pages (Decap's `filter` cannot exclude one entry).
  Other singletons go in `Site` the same way (`siteFiles`): the file must exist first.
- **The menu**: the shape is `src/content/menu.ts` (schema, `menuToNav`); a field there goes into `menuFields` in
  `config.ts` too. A language gets a `Site` → `<Language> · Menu` entry once it has `content/<locale>/data/menu.json`
  (until then it shows the English menu): copy the English file and translate it, picking that language's pages.
- **A widget**: write it in `widgets.ts` with Decap's `createClass` / `h` globals (Decap renders with its own React)
  and register it in `registerWidgets`; reference it from a field with `decap: { widget: '<name>' }`.

Decap has no themes: branding is the logo, labels, descriptions and, if ever needed, CSS overrides of its class names.
Decap's sidebar is flat (no groups or dividers) and its `i18n` cannot express `content/<locale>/<kind>/`, so languages
are a field instead of collections: one collection per kind, filtered and grouped by `language`. Nested collections
(beta) need an index file at every folder level, which our layout does not have.

## Checks

- `tests/unit/data-page.test.tsx`: the config offers every block of the catalogue (then the presets), the three collections (Site, Pages, Services), language then meta fields first; every `page.json` validates; names resolve (pictures, recordings, data, FAQ
  groups, a preset's props); the DSL's types refuse what does not fit (`@ts-expect-error` lines).
- Try it locally: `pnpm build && pnpm serve:dist`, `pnpm dlx decap-server` in another terminal, then
  http://localhost:4173/admin/ (`local_backend` writes straight to the working copy, no login). Look at the result in
  headless Chromium (`executablePath: '/opt/pw-browsers/chromium'`) before saying a UI change works.
- `pnpm check`, then `pnpm check:pr` before pushing. Everything here but `content/` needs a core approval.
