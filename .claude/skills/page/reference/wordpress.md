# Bringing copy and pictures over from the live WordPress site

The live sites (`legacyOrigin` in `src/i18n/sites/<locale>.ts`) sit behind SiteGround's bot protection, which
judges the network more than the tool: from a cloud session every request, headless Chromium included, gets
a captcha page (`/.well-known/sgcaptcha`). Never try to look human (fake headers, stealth plugins, captcha
solving); take the first source that answers:

1. **A real browser, when this session has one**: Claude in Chrome (`mcp__claude-in-chrome__*`) or the Claude
   app's built-in browser (`mcp__Claude_Browser__*`, `mcp__remote-devices__Claude_Browser__*`); read its skill
   first. It browses from the person's own computer and network, so the live page opens like for any visitor.
   Read the copy from the page and collect every picture's `wp-content/uploads/…` URL (the largest size in
   `srcset`).
2. **The WordPress REST API** (it answered once from the cloud, then blocked):
   ```sh
   curl -sA "Mozilla/5.0" "https://www.mysheetmusictranscriptions.com/wp-json/wp/v2/pages?slug=<slug>&_fields=title,content,yoast_head_json"
   ```
   `title.rendered` and `content.rendered` are the page; `yoast_head_json` has the SEO title and description
   (use them as the starting point for `title`/`description`, trimmed to the schema's lengths).
3. **The Internet Archive**: the latest capture, `https://web.archive.org/web/2026/<live URL>` (say how old it
   is), or Common Crawl. `docs/migration/inventory/<locale>.json` has the titles already.

When none answers, say so in one line and ask the person for the text and pictures (pasted or attached);
never write the page from memory.

## Pictures: download them, every time

- Download every picture the page shows into `mockups/<slug>/img/<descriptive-name>.<ext>` as soon as you find
  it, never link it and never leave a placeholder for a picture that exists somewhere. Keep the largest size,
  ≤ 2000px long side, descriptive file names.
- Try in order: `curl -sA "Mozilla/5.0" -o <file> <url>`; the archived original
  `https://web.archive.org/web/2026im_/<url>` (`im_` serves the raw file); then ask the person for it. Check
  what arrived (`file <file>`): a captcha comes back as HTML, which is not a picture.

## Copy and slugs

- The copy is the live page's, verbatim, American spelling; nothing is invented or "improved" unless asked.
  Map each section of the live page to a block of the catalogue; what fits nothing becomes a proposed block.
- Keep the live slug so the URL survives the port; `SmartLink` stops sending that path to the legacy site
  once the page is built (`paths.generated.json` is regenerated at build).
- Other languages: the same sources on that language's `legacyOrigin` (the Spanish site is
  `https://www.mistranscripcionesmusicales.com`, and so on).
- The lasting fix is the migration plan's W0.1 (`docs/migration/PLAN.md`): the owner allowlists the cloud
  sessions in SiteGround or hands over WordPress exports; then source 2 always answers.
