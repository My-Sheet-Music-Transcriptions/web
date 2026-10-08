# Changing an existing page

A change starts from the real page, never from memory of it.

1. Find the page: `src/content/<locale>/<collection>/<slug>/index.mdx` (or `<slug>.mdx`). The person names
   it by title or URL; `pnpm page:status` lists the pages with a mockup; `src/content/paths.generated.json`
   lists every built page's path per locale. A page that is on the live WordPress site but not in
   `src/content` yet is a port, not an edit: mode **new** with `wordpress.md`, keeping the live slug.
2. `pnpm ds:mockup <slug>` (or `<locale>/<collection>/<slug>` when the slug exists in several locales)
   writes `mockups/<slug>/sections.html` from the MDX, copies the page's pictures into `img/` and fills
   `preview.json` (title, path, locale, source). It refuses to overwrite a mockup that exists: that mockup
   may be a preview someone approved, so check `preview.json` and `git log` for it first and rerun with
   `--force` when the page itself is the newer truth. Pages outside English land in
   `mockups/<locale>-<slug>/`.
   It fails, naming the line, on anything a mockup cannot show faithfully (an expression, a nested
   component, a non-picture import): then write that section by hand from the MDX and say so in the
   summary.
3. Change only what was asked in `sections.html`; everything else stays byte for byte. Preview with
   `pnpm ds:review <slug>` (or the canvas, in design mode) as usual.
4. Phase 3 for an edit touches only the page folder (and data files when a number changed); the diff of
   `index.mdx` must read like the change the person asked for and nothing else. Changed numbers that live in
   `src/content/<locale>/data/*.ts` (prices, counts, ratings) change there, once, and the preview shows the
   new value through the block that reads it.
