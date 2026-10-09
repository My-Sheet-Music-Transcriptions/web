# Translating a page into another of the site's languages

Each language is its own site on its own domain in production (`src/i18n/sites/<locale>.ts`: en, es, fr,
de, ja, ca) and shows under `/<locale>/…` on deploy previews and in `pnpm dev`. Content lives in
`content/<locale>/…`; pages that are translations of each other share a `translationKey`, which drives
the language switcher and hreflang.

What is ready today, to tell the person plainly before promising a translated page:
- A translated **page** can be built and previewed: `content/<locale>/<collection>/<slug>/` with the
  translated `meta.ts` and `index.tsx`, the same `translationKey` as the original, pictures copied beside
  it (or shared ones re-imported). The slug is the translated URL as the live site of that language uses it
  (check it there; keep it if the page exists, choose a short translated slug otherwise; slugs are unique per
  locale and never a locale code or a reserved word, `pnpm exec tsx scripts/check-slugs.ts`).
- The **menu and footer** come from `content/<locale>/data/{nav,footer}.ts` and the chrome's words from
  `src/i18n/sites/<locale>.ts`; a language without those files yet shows the English ones. The page's own
  words around its blocks (`labels.ts`, `forms.ts`) and its lists (ratings, prices, reviews) are imported by
  the page from `content/<locale>/data/`, so a translation imports the target language's files, creating
  them (translated from `content/en/data/`) when they do not exist yet. Until a language is scaffolded (the
  planned `add-locale` work: its data files and strings), say what stays English on the preview, and offer:
  translate the page now and live with the English frame, or wait for the language scaffold.
- A language with no `pages/home` yet has no home page on its site: the language switcher sends people to
  the live legacy site for that language (`localeSwitchHref`), and `SmartLink` links to pages that are not
  ported yet go to the legacy site too. Nothing breaks; the person should know the translated page will sit
  among legacy pages until more are ported.

Doing it:
1. Mockup: `pnpm ds:mockup <slug>` on the source page (`edit.md`), then translate every string in
   `mockups/<locale>-<slug>/sections.html` by hand (copy the English mockup folder to the new name first;
   `preview.json` gets `locale`, `path` as the translated path and a translated `title`). Pictures with text
   in them need a translated picture or stay as placeholders. Numbers stay numbers; currency follows the
   site (`currency` in its config).
2. Preview with `pnpm ds:review <locale>-<slug> "<Translated title>" /<translated-path>` as usual. Tell
   the person what is English by necessity (menu, footer, data blocks) so they do not comment on it.
3. Build: the page folder under `content/<locale>/…`, `translationKey` identical to the source,
   `title`/`description` in the target language within the length limits, the same blocks. The build
   serves it at `/<locale>/<translated-path>` on the deploy preview; the live URL is on that language's
   domain. The hreflang map and the language switcher pick the translation up by `translationKey`
   (`tests/unit/content.test.ts` fails on a key used twice in one locale).
4. Everything else as in `build.md` and `publish.md`.
