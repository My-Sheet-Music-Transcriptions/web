# Bringing copy and pictures over from the live WordPress site

The live sites (`legacyOrigin` in `src/i18n/sites/<locale>.ts`) block headless browsers, but their WordPress
REST API answers a normal user agent:

```sh
curl -sA "Mozilla/5.0" "https://www.mysheetmusictranscriptions.com/wp-json/wp/v2/pages?slug=<slug>&_fields=title,content,yoast_head_json"
```

- `title.rendered` and `content.rendered` are the page; `yoast_head_json` has the SEO title and description
  (use them as the starting point for `title`/`description`, trimmed to the schema's lengths).
- Pictures are under `wp-content/uploads/…`: download them the same way (`curl -sA "Mozilla/5.0" -o
  mockups/<slug>/img/<descriptive-name>.<ext> <url>`), never link them. Keep the largest size, ≤ 2000px long
  side, descriptive file names.
- The copy is the live page's, verbatim, American spelling; nothing is invented or "improved" unless asked.
  Map each section of the live page to a block of the catalogue; what fits nothing becomes a proposed block.
- Keep the live slug so the URL survives the port; `SmartLink` stops sending that path to the legacy site
  once the page is built (`paths.generated.json` is regenerated at build).
- Other languages: the same API on that language's `legacyOrigin` (the Spanish site is
  `https://www.mistranscripcionesmusicales.com`, and so on).
