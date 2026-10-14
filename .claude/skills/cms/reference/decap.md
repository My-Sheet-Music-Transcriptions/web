# Decap CMS reference (decap-cms 3.17.0)

Working reference for configuring Decap from TypeScript (the config object is the same shape as `config.yml`).
Compiled 2026-10-14 from the docs at https://decapcms.org/docs/ (Markdown sources:
`https://raw.githubusercontent.com/decaporg/decap-website/main/content/docs/<page>.md`) and the package
changelogs. Only options the docs state are listed; anything that is changelog-only is marked so.

Version note: `decap-cms` 3.17.0 (npm, 2026-10-14) bundles `decap-cms-core` 3.20.x; version tags in the docs
(`3.8`, `3.12.0`…) are `decap-cms` versions, the changelog in §11 uses core versions.

## 1. Top-level config options

Source: https://decapcms.org/docs/configuration-options/
Config file: `config.yml` next to the admin page, or a custom URL via
`<link href="path/to/config.yml" type="text/yaml" rel="cms-config-url">` (both attributes required).
With manual init the object can be passed to `init({ config })` (see §7).

| Option | Type | Meaning |
| --- | --- | --- |
| `backend` | object, **required** | How content is read/written; see §1.1. |
| `publish_mode` | `'simple' \| 'editorial_workflow' \| ''` | `editorial_workflow` adds drafts/review/PRs (§8). `''` = `simple`. |
| `media_folder` | string, **required** | Repo path (from repo root) where uploads are saved. |
| `public_folder` | string | Path written into fields for uploads, relative to the built site. Default: `media_folder` with a leading `/`. May be an absolute URL (discouraged). |
| `media_processing` | object | In-browser image transforms before upload (§6.1). Also allowed on image fields. |
| `media_library` | `{ name: string, config?: object }` | External media library (uploadcare, cloudinary…; §6.2). |
| `site_url` | string | Published site URL; with `preview_path` makes links to live content. |
| `display_url` | string | Link shown in the CMS header back to the site. Default `site_url`. |
| `logo` | `{ src: string, show_in_header?: boolean }` | Login-page logo; `show_in_header: true` (3.8) also shows it in the header. `logo_url: string` is the deprecated alias of `logo.src`. |
| `locale` | string | UI language, default `en`. Non-English must be registered with `CMS.registerLocale` unless using the `decap-cms` bundle (all locales pre-registered). Missing keys fall back to English. |
| `show_preview_links` | boolean | `false` disables deploy preview links. |
| `search` | boolean (default `true`) | `false` disables search (search loads every entry; can exhaust API rate limits). |
| `slug` | `{ encoding?, clean_accents?, sanitize_replacement? }` | Filename sanitising; see §1.2. |
| `issue_reports` | `{ url: string }` | Where "report issue" links go (default: Decap GitHub). Non-GitHub URL: also override locale key `ui.errorBoundary.reportIt`. |
| `collections` | array, **required** | §2. |
| `i18n` | object | Multi-language editing (§4). |
| `editor` | `{ preview: boolean }` | At top level sets the default for every collection . |
| `local_backend` | `true \| { url?, allowed_hosts? }` | Use `decap-server` on a local repo (§9). |
| `load_config_file` | boolean | Manual init only: `false` ignores `config.yml` (§7). |

### 1.1 `backend`

Sources: https://decapcms.org/docs/backends-overview/ , https://decapcms.org/docs/configuration-options/#backend ,
https://decapcms.org/docs/git-gateway-backend/ , https://decapcms.org/docs/editorial-workflows/
`name`: `git-gateway`, `github`, `gitlab`, `gitea`, `bitbucket`, `azure`, `test-repo`, `turbo-github`, `turbo-gitlab`.

| Field | Default | Meaning |
| --- | --- | --- |
| `repo` | – | `org/repo`. Required for github, gitlab, azure, gitea, bitbucket; **ignored by git-gateway**. |
| `branch` | `master` | Branch commits/PRs target. Set `main` explicitly. |
| `api_root` | GitHub `https://api.github.com`, GitLab `https://gitlab.com/api/v4`, … | API endpoint (enterprise/self-hosted). |
| `site_domain` | `location.hostname` (`cms.netlify.com` on localhost) | `site_id` sent to the auth endpoint. |
| `base_url` | `https://api.netlify.com` (GitHub, Bitbucket) | OAuth host (no path). |
| `auth_endpoint` | `auth` (GitHub, Bitbucket), `oauth/authorize` (GitLab) | Path appended to `base_url`. |
| `cms_label_prefix` | `decap-cms/` | PR/MR label prefix (editorial workflow). |
| `commit_messages` | see below | Commit message templates. |
| `squash_merges` | `false` | Editorial workflow on github / GitHub git-gateway: squash-merge the PR on publish. |
| `open_authoring` | `false` | GitHub backend only, needs editorial workflow (§8). |
| `auth_scope` | – | e.g. `repo` (needed for open authoring on private repos). |
| `use_large_media_transforms_in_media_library` | `true` | Netlify Large Media thumbnails in the media library. |

git-gateway (https://decapcms.org/docs/git-gateway-backend/): Netlify Identity logins, editors need no Git host
access; GitHub/GitLab only (Bitbucket has its own backend); no open authoring; reconnect Git Gateway in Netlify
after changing repo ownership/visibility. With a custom gateway + PKCE (3.8.3): `auth_type: pkce`, `base_url`, `auth_endpoint`
(`oauth2/authorize`), `auth_token_endpoint` (`oauth2/token`), `app_id`, `gateway_url` (path must end in
`github`/`gitlab`/`bitbucket`), `status_endpoint`, `branch`.

Turbo backends: `turbo_site_id` (required), `branch`, `deploy_status` (`turbo-github` only); `repo` ignored.

```yaml
backend:
  name: git-gateway
  branch: main
  squash_merges: true
  commit_messages:
    create: Create {{collection}} “{{slug}}”
    update: Update {{collection}} “{{slug}}”
    delete: Delete {{collection}} “{{slug}}”
    uploadMedia: Upload “{{path}}”
    deleteMedia: Delete “{{path}}”
    openAuthoring: '{{message}}'
```

| Commit type | Tags |
| --- | --- |
| `create`, `update`, `delete` | `slug`, `path`, `collection` (`label_singular` or `label`), `author-login`, `author-name` |
| `uploadMedia`, `deleteMedia` | `path`, `author-login`, `author-name` |
| `openAuthoring` | `message`, `author-login`, `author-name` |

### 1.2 `slug` (global)

- `encoding`: `unicode` (default; RFC3987, allows non-ASCII) or `ascii` (only `0-9 a-z A-Z _ - ~`).
- `clean_accents`: `true` strips diacritics first (useful with `ascii`).
- `sanitize_replacement`: replacement for unsafe chars, default `-`.
Also applies to filenames of media uploaded through the default media library.

```yaml
slug: { encoding: ascii, clean_accents: true, sanitize_replacement: '_' }
```

## 2. Collections

Source: https://decapcms.org/docs/configuration-options/#collections
Each collection appears in the left sidebar in config order.

| Option | Type / default | Meaning |
| --- | --- | --- |
| `name` | string, **required**, unique | Key used in routes and by `relation`. |
| `label` | string = `name` | Sidebar label. |
| `label_singular` | string = `label` | Used in "New X" and commit `{{collection}}`. |
| `description` | string | Text under the label in the collection view. |
| `folder` \| `files` | one **required** | Folder collection (§2.1) or file collection (§2.2). |
| `filter` | `{ field, value }` | Folder only: show only entries whose `field` equals `value`. |
| `create` | boolean, `false` | Folder only: allow new entries. |
| `publish` | boolean, `true` | Editorial workflow only: `false` hides publish controls. |
| `hide` | boolean, `false` | Hide from the UI (e.g. collections only referenced by `relation`). |
| `delete` | boolean, `true` | `false` prevents deleting entries. |
| `identifier_field` | string, `title` | Field used as entry title and for `{{slug}}`. |
| `extension` | `yml yaml toml json md markdown html` or custom | File extension searched/written. |
| `format` | see below | Parser/serialiser. Inferred from extension/existing files. |
| `frontmatter_delimiter` | string \| `[open, close]` | Custom delimiter, e.g. `~~~` or `["(", ")"]`, with an explicit frontmatter format. |
| `slug` | template, default `{{slug}}` | New-entry filename (§2.3). |
| `path` | template | Folder only: subpath under `folder` (§2.1). |
| `media_folder` / `public_folder` | string | Per-collection media (§6). |
| `preview_path` | template | Path of the entry on the site, appended to deploy preview / `site_url`. |
| `preview_path_date_field` | string | Date field for date tags in `preview_path` (else inferred, e.g. `date`). |
| `fields` | array, **required** | §3. |
| `editor` | `{ preview: boolean }` | `preview: false` hides the preview pane. Also per file in file collections. |
| `summary` | template | Entry title in the list view (§2.4). |
| `sortable_fields` | string[] | Sort options; dot notation for nested (`language.en`); also `commit_date`, `commit_author`. Default infers `title`, `date`, `author`, `description` (+ "Updated On" on git backends). |
| `view_filters` | `{ label, field, pattern }[]` | Predefined filters; `pattern` is a regex string or a literal (`true`). |
| `view_groups` | `{ label, field, pattern? }[]` | Group-by options; `pattern` groups by the matched part (e.g. `\d{4}`). |
| `i18n` | `true` \| object | §4. |
| `nested` / `meta` | object | Nested (tree) collections, beta (§2.5). |

`format` values: `yml`/`yaml`, `toml`, `json`, `frontmatter` (parses YAML/TOML/JSON frontmatter, **saves YAML**;
default when nothing can be inferred), `yaml-frontmatter` (`---`), `toml-frontmatter` (`+++`), `json-frontmatter`
(`{` `}`). Custom formats via `CMS.registerCustomFormat` (§7.6).

```yaml
collections:
  - name: posts
    label: Posts
    label_singular: Post
    folder: content/posts
    create: true
    extension: json
    format: json
    identifier_field: name
    summary: "{{name | upper}} – {{date | date('YYYY-MM-DD')}}"
    sortable_fields: ['commit_date', 'name', 'commit_author']
    view_filters: [{ label: Drafts, field: draft, pattern: true }]
    view_groups: [{ label: Year, field: date, pattern: \d{4} }]
    preview_path: 'blog/{{slug}}'
    editor: { preview: false }
    fields: [...]
```

### 2.1 Folder collections

Source: https://decapcms.org/docs/collection-folder/

- Every file in `folder` shares `fields`. Entries need a `title` field (string widget) or `identifier_field`,
  else error: collection "must have a field that is a valid entry identifier".
- `filter: { field, value }` lets several collections share one folder (e.g. one per `language`).
- `path: '{{year}}/{{slug}}'` saves under subfolders of `folder` (`posts/2019/post-title.md`).
  `path: '{{slug}}/index'` gives one folder per entry.
- **When `path` is set, the collection's `media_folder` defaults to `''`** (media next to the entry).
- Template tags in `path`/`media_folder`: all `slug` tags plus `{{dirname}}`, `{{filename}}`, `{{extension}}`,
  `{{media_folder}}` (global), `{{public_folder}}` (global).

```yaml
media_folder: static/media
public_folder: /media
collections:
  - name: posts
    folder: content/posts
    path: '{{slug}}/index'
    media_folder: ''      # image saved beside index.md
    public_folder: ''     # field value "image.png"
    fields: [{ label: Title, name: title, widget: string }, { label: Cover Image, name: image, widget: image }]
```

### 2.2 File collections (singletons)

Source: https://decapcms.org/docs/collection-file/
A `files` collection lists explicitly configured files, each a single editable entry (settings, unique pages).
Each item: `name` (required), `label`, `file` (repo path, required), `fields`, optionally `preview_path`,
`editor`, `i18n` (required per file when the collection has i18n).

- **The file must already exist** on the configured branch, and be valid for its format (empty YAML is fine;
  a JSON file must contain at least `{}`). (`create` applies to folder collections only.)
- `default` values on fields only apply in folder collections.
- Preview templates register under the **file `name`**, not the collection name.
- Edit link: `/#/edit/<collection>/<file name>`.

```yaml
collections:
  - name: settings
    label: Settings
    files:
      - name: general
        label: General
        file: content/en/data/site.json
        preview_path: ''
        editor: { preview: false }
        fields:
          - { label: Title, name: title, widget: string }
          - { label: Team, name: team, widget: list, fields: [{ label: Name, name: name, widget: string }] }
```

### 2.3 `slug` template (collection)

Tags: `{{<field>}}` (any field), `{{fields.<field>}}` (when a field name clashes with a tag, e.g. a field named
`slug`), `{{slug}}` (url-safe identifier field), `{{year}} {{month}} {{day}} {{hour}} {{minute}} {{second}}`
(entry creation date). All collections with `create: true` need the identifier field.

```yaml
slug: '{{year}}-{{month}}-{{day}}_{{fields.slug}}'
```

`preview_path` uses the same tags, except: `{{slug}}` is the **entire entry slug** (not the sanitised title),
date tags come from a date field (`preview_path_date_field`; if none found, `preview_path` is ignored), plus
`{{dirname}}`, `{{filename}}`, `{{extension}}`.

### 2.4 `summary` and transformations

Source: https://decapcms.org/docs/summary-strings/
Tags: those of `slug`, plus `{{dirname}}`, `{{filename}}`, `{{extension}}`, `{{commit_date}}`, `{{commit_author}}`.
Filters: `upper`, `lower`, `date('<dayjs format>')`, `default('x')`, `ternary('ifTrue','ifFalse')`,
`truncate(n)`, `truncate(n, '…')`.

```yaml
summary: "{{title | upper}} - {{date | date('YYYY-MM-DD')}} – {{body | truncate(20, '***')}}"
```

Changelog (core 3.14.0): "slugs: allow filters in template strings", i.e. the same filters in slug templates.

### 2.5 Nested collections (beta)

Source: https://decapcms.org/docs/collection-nested/
```yaml
collections:
  - name: pages
    label: Pages
    label_singular: Page
    folder: content/pages
    create: true
    nested:
      depth: 100            # max tree depth shown
      summary: '{{title}}'  # tree node label (default: inferred title)
      subfolders: true      # 3.6; false = leaf entries may be plain files (author-1.md)
    meta: { path: { widget: string, label: 'Path', index_file: '_index' } }
    fields: [{ name: title, label: Title, widget: string }, { name: body, label: Body, widget: markdown }]
```

`meta.path` lets editors change an entry's location; moving an entry moves its whole subtree. With
`subfolders: true` every node is `<dir>/_index.md`.

### 2.6 Dynamic default values (URL prefill)

Source: https://decapcms.org/docs/dynamic-default-values/
`/admin/#/collections/posts/new?title=first&object.title=second&body=%23%20content` prefills fields (dot paths for
nested; repeat a key for a multiple relation: `?authors=first&authors=second`). URL-encode values.
Edit link: `/#/edit/<collection>/<entry>` (folder: slug without extension; files: the file `name`)
(https://decapcms.org/docs/open-authoring/#linking-to-specific-entries-in-the-cms).

## 3. Fields and widgets

Sources: https://decapcms.org/docs/widgets/ (all widgets are on this one page),
https://decapcms.org/docs/configuration-options/#fields

### 3.1 Options on every field

| Option | Type | Meaning |
| --- | --- | --- |
| `name` | string, **required** | Key in the saved data. A field named `body` in a frontmatter format is the text after the frontmatter. |
| `label` | string = `name` | UI label. |
| `widget` | string, default `string` | Widget name (built-in or registered). |
| `default` | widget-dependent | Default value (folder collections only). |
| `required` | boolean, `true` | `false` makes it optional. |
| `hint` | string | Help text under the widget; markdown bold/italic/strike/links. |
| `pattern` | `[regex: string, message: string]` | Validation, e.g. `['.{12,}', 'Must have at least 12 characters']`. |
| `comment` | string | Comment written above the field (YAML output only). |
| `i18n` | `true \| 'translate' \| 'duplicate' \| false` | §4. |
| `media_library` | object | `file`/`image` fields (and Uploadcare/Cloudinary field config). |

### 3.2 Widgets

Value shapes are what lands in the file.

**boolean** – toggle. Value: `true|false`.
- `default`: boolean; defaults to `false` when `required: false`.
```yaml
- { label: Draft, name: draft, widget: boolean, default: true }
```
**code** – CodeMirror editor. Value: string, or `{ code, lang }` object.
- `default_language`: string. `allow_language_selection`: boolean, `false`.
- `keys`: `{ code: 'code', lang: 'lang' }` (key names of the object form).
- `output_code_only`: boolean, `false` (`true` → plain string).
```yaml
- { label: Snippet, name: snippet, widget: code, default_language: js, output_code_only: true }
```
**color** – picker. Value: string (e.g. `#ff0000`).
- `default`: string, `''`. `allowInput`: boolean, `false` (typeable). `enableAlpha`: boolean, `false`.
```yaml
- { label: Color, name: color, widget: color, enableAlpha: true, allowInput: true }
```
**datetime** – Value: Day.js-formatted string (ISO 8601 by default).
- `default`: datetime string or `'{{now}}'`; otherwise `''` (until 3.2.1 it defaulted to now).
- `format`: Day.js storage format; full date+time UI; overrides `date_format`/`time_format`.
- `date_format`: boolean or Day.js format → date-only picker. `time_format`: boolean or format → time-only;
  both together → datetime picker.
- `picker_utc`: boolean, `false` (`true` shows UTC; useful for date-only fields across time zones).
```yaml
- { label: Date, name: date, widget: datetime, date_format: 'YYYY-MM-DD', time_format: false, picker_utc: true }
```
**file** – media picker. Value: path string (`public_folder` + filename, or relative per §6).
- `default`: path, `null`. `media_library`: object (`config` passed to the library;
  `media_library.config.max_file_size` in bytes, default library only).
- `allow_multiple`: boolean, `true` (`false` blocks multi-select where the library supports it).
- `config`: object passed to the media library.
- `media_folder` (beta): relative to the collection folder (`files`) or repo-absolute with leading `/` (`/static/files`).
- `choose_url`: boolean, `true` (`false` hides "Insert from URL").
```yaml
- { label: Manual PDF, name: manual_pdf, widget: file, choose_url: false, media_library: { config: { max_file_size: 1024000 } } }
```
**hidden** – not shown. Value: any.
- `default`: any (set it on `create: true` collections).
```yaml
- { label: Layout, name: layout, widget: hidden, default: blog }
```
**image** – as `file`, image types only (jpg, jpeg, webp, gif, png, bmp, tiff, svg), shows a thumbnail. Value: path string.
- `default`, `media_library`, `allow_multiple` (`true`), `config`, `media_folder` (beta), `choose_url` (`true`),
- `public_folder`: default `media_folder` with leading `/`; prefix written into the value.
- `media_processing`: per-field override of the global one (§6.1).
```yaml
- { label: Hero, name: image, widget: image, choose_url: false, media_library: { config: { max_file_size: 512000 } } }
```
**list** – repeatable. Value: array (strings without `field(s)`; values with `field`; objects with `fields`/`types`).
- No `field`/`fields`: a comma-separated text input → string array.
- `default`: array; without one, with `field(s)`, one item using child defaults is created.
- `allow_add` (`false` hides add), `allow_remove` (3.8), `allow_reorder` (3.8): booleans.
- `collapsed`: boolean (items collapsed by default). `minimize_collapsed`: boolean (collapse hides all items).
- `summary`: template for collapsed items, `{{fields.quote}}`, nested `{{fields.author.name}}`.
- `label_singular`: add-button text. `add_to_top`: boolean.
- `field`: one field → array of scalars. `fields`: array of fields → array of objects.
- `min` / `max`: numbers; **each works only if the other is also set**.
- `types` + `typeKey` (default `type`): variable types (§3.3).
```yaml
- label: Testimonials
  name: testimonials
  widget: list
  summary: '{{fields.quote}} - {{fields.author}}'
  min: 1
  max: 6
  fields: [{ label: Quote, name: quote, widget: string }, { label: Author, name: author, widget: string }]
```
**map** – Value: GeoJSON **string** (WGS84).
- `decimals`: number, 7. `default`: GeoJSON string, `''`. `type`: `Point` (default) | `LineString` | `Polygon`.
```yaml
- { label: Location, name: location, widget: map, type: Point }
```
**richtext** (beta, 3.12.0) – successor of `markdown`, same options. Value: markdown string.
- `default`: markdown. `minimal`: boolean, `false`.
- `buttons`: subset of `bold italic strikethrough code link heading-one … heading-six quote bulleted-list numbered-list`.
- `editor_components`: names (built-ins `image`, `code-block`, plus registered ones).
- `modes`: `raw`, `rich_text` (toggle shown when >1).
- `sanitize_preview`: boolean, `true` since 3.13.0 (was `false`).
```yaml
- { label: Body, name: body, widget: richtext, buttons: [bold, italic, link, bulleted-list], editor_components: [], modes: [rich_text] }
```
**markdown** (deprecated in favour of `richtext`) – identical options and value.
```yaml
- { label: Body, name: body, widget: markdown, minimal: true, modes: [rich_text, raw] }
```
Remark plugins: `CMS.registerRemarkPlugin(plugin)`; settings for all: `CMS.registerRemarkPlugin({ settings: { bullet: '-' } })`.
The editor uses `remark@10` – check plugin compatibility.

**number** – Value: string by default; int/float with `value_type`.
- `default`: string|number, `''`. `value_type`: `int` | `float` (anything else → string).
- `min`, `max`: numbers, unset. `step`: number, 1.
```yaml
- { label: Rating, name: rating, widget: number, value_type: int, min: 1, max: 5, step: 1 }
```
**object** – group of fields. Value: object (map).
- `fields` (**required**). `default`: set on the subfields. `collapsed`: boolean. `summary`: template.
```yaml
- { label: CTA, name: cta, widget: object, collapsed: true, summary: '{{fields.label}}', fields: [{ label: Label, name: label, widget: string }, { label: Link, name: href, widget: string }] }
```
**relation** – references entries of another collection. Value: the `value_field` value (array if `multiple`).
- `collection` (**required**), `value_field` (**required**; dot paths `name.first`, list wildcard `cities.*.id`,
  or a template like `'{{slug}}'`), `search_fields` (**required**, string[]).
- `file`: file name when the target is a files collection.
- `display_fields`: string[] or templates, default `value_field`.
- `default`: any, `''`. `multiple`: boolean, `false`. `min`/`max` (only with `multiple`).
- `options_length`: integer, 20.
- `filters` (3.1.5): `[{ field, values: [...] }]`, all must match.
```yaml
- label: Author
  name: author
  widget: relation
  collection: authors
  search_fields: ['name.first', 'twitterHandle']
  value_field: '{{slug}}'
  display_fields: ['{{twitterHandle}} - {{followerCount}}']
  filters: [{ field: draft, values: [false] }]
```
Large collections: populating it fetches many entries from the Git API (slow / rate limits).

**select** – Value: string, or array with `multiple`.
- `options` (**required**): strings, or `{ label, value }` (value saved).
- `default`: must be among `options`; string `''` / array `[]` with `multiple`.
- `multiple`: boolean, `false`. `min` / `max`: only with `multiple`.
```yaml
- { label: Tone, name: tone, widget: select, default: plain, options: [{ label: Plain, value: plain }, { label: Tinted, value: tint }] }
```
**string** – one-line input. Value: string. `default`: string, `''`.
```yaml
- { label: Title, name: title, widget: string }
```
**text** – textarea. Value: string. `default`: string, `''`.
```yaml
- { label: Description, name: description, widget: text }
```

### 3.3 Variable types (list `types`)

Source: https://decapcms.org/docs/variable-type-widgets/
`types`: array of `object` fields (the default widget there); each item stored with `typeKey` (default `type`) =
the type's `name`. Each type may have its own `summary`. **No default preview: you must register a preview
template to see these in the preview pane.**

```yaml
- label: Blocks
  name: blocks
  widget: list
  typeKey: type   # default
  types:
    - { label: Carousel, name: carousel, widget: object, summary: '{{fields.header}}', fields: [
        { label: Header, name: header, widget: string, default: 'Image Gallery' },
        { label: Images, name: images, widget: list, field: { label: Image, name: image, widget: image } } ] }
    - { label: Spotlight, name: spotlight, widget: object, fields: [{ label: Text, name: text, widget: text }] }
```
Output: `blocks: [{ type: carousel, header: …, images: [...] }, { type: spotlight, text: … }]`.

## 4. i18n

Source: https://decapcms.org/docs/i18n/
Three levels: top, collection, field. Side-by-side editing of locales.

```yaml
i18n:
  structure: multiple_folders   # required
  locales: [en, es, ca]         # required
  default_locale: en            # optional, default first locale; used for validation and as baseline
```

| `structure` | Files written |
| --- | --- |
| `multiple_folders` | `<folder>/<locale>/<slug>.<ext>` |
| `multiple_files` | `<folder>/<slug>.<locale>.<ext>` |
| `single_file` | `<folder>/<slug>.<ext>` with every locale inside |

Collection: `i18n: true` (inherit top level) or an object overriding any of the top-level keys.
File collections: set `i18n` on the collection **and** `i18n: true` on each file.

Field: `i18n: true` (= `translate`, edited per locale), `i18n: duplicate` (copied from the default locale),
omitted (field only in the default locale).

```yaml
collections:
  - name: posts
    folder: content/posts
    create: true
    i18n: true
    fields:
      - { label: Title, name: title, widget: string, i18n: true }
      - { label: Date, name: date, widget: datetime, i18n: duplicate }
      - { label: Body, name: body, widget: markdown }   # default locale only
```

Limitations (docs):
1. File collections support only `structure: single_file`.
2. `list` supports only `i18n: true`; `i18n` on its subfields is ignored.
3. `object` supports only `i18n: true`, with `i18n` set per subfield.

Inference (not a docs statement): a layout with the locale *above* the collection folder
(`<locale>/<collection>/<slug>/…`) matches none of the three structures, so such a repo needs one collection per
locale instead of `i18n`.

## 5. Collection-level media and relative paths

Source: https://decapcms.org/docs/collection-folder/#media-and-public-folder ,
https://decapcms.org/docs/configuration-options/#media-and-public-folders
Resolution order: field `media_folder`/`public_folder` (image/file widgets, beta) → collection
`media_folder`/`public_folder` → global.

- Global: `media_folder: static/images/uploads`, `public_folder: /images/uploads` → file saved to
  `static/images/uploads/x.png`, field value `/images/uploads/x.png`.
- Collection `media_folder: ''` + `public_folder: ''` → saved beside the entry file, value `x.png` (relative).
- Collection with `path` set → `media_folder` defaults to `''`.
- Field `media_folder: images` → `<collection folder>/images`; `media_folder: /static/files` → repo-absolute.
- Templates usable in collection media paths: `{{media_folder}}`, `{{public_folder}}`, `{{dirname}}`,
  `{{filename}}`, `{{extension}}`, plus slug tags. Example: `media_folder: '{{media_folder}}/posts'`.
- Changelog (lib-util, core 3.10.0): root-relative media paths are treated as absolute.

## 6. Media

Folders: see §1 and §5.

### 6.1 `media_processing`

Source: https://decapcms.org/docs/configuration-options/#media-processing
Runs in the browser before upload; JPEG, PNG, WebP only (GIF, SVG untouched). Top level or on an image field
(field overrides top level).

| Key | Type | Meaning |
| --- | --- | --- |
| `enabled` | boolean, **required** | On/off. |
| `format.enabled` | boolean | Convert format. |
| `format.default` | `jpeg \| webp` | Output format; extension rewritten (`hero.png` → `hero.webp` / `hero.jpg`). |
| `quality` | 1–100 | JPEG/WebP quality. |
| `strip_metadata` | boolean | Re-encode to drop metadata. |
| `width` / `height` | number \| null | Output size; one alone → other from `aspect_ratio` or source ratio; both → exact. |
| `aspect_ratio` | number or `'16x9' \| '16:9' \| '16_9'` | Center-crop before resizing; without dimensions keeps cropped source size. |

```yaml
media_processing: { enabled: true, format: { enabled: true, default: webp }, quality: 80, strip_metadata: true, width: 1600, height: null, aspect_ratio: 16x9 }
```

### 6.2 Media libraries

Sources: https://decapcms.org/docs/uploadcare/ , https://decapcms.org/docs/cloudinary/ ,
https://decapcms.org/docs/netlify-large-media/
```yaml
media_library:
  name: uploadcare          # or cloudinary
  config: { publicKey: KEY }
```
- Uploadcare/Cloudinary extensions are **not included in `decap-cms-app`**; register them yourself. Field-level `media_library.config` overrides global.
- Cloudinary-specific (beside `config`): `output_filename_only` (`false`), `use_transformations` (`true`),
  `use_secure_url` (`true`); `config`: `cloud_name`, `api_key`, `default_transformations`, `max_files`, `multiple`.
- Default library: `media_library.config.max_file_size` (bytes) on a field.
- Netlify Large Media: deprecated by Netlify (Sept 2023).
- Changelog (core 3.20.0-beta.0): an S3-compatible media library was added (`decap-cms-media-library-s3`, documented
  under Decap Turbo).

## 7. JavaScript API

Sources: https://decapcms.org/docs/custom-widgets/ , https://decapcms.org/docs/customization/ ,
https://decapcms.org/docs/registering-events/ , https://decapcms.org/docs/manual-initialization/ ,
https://decapcms.org/docs/custom-mounting/ , https://decapcms.org/docs/editor-tooling/
`window.CMS` (script tag) or `import CMS from 'decap-cms-app'` (npm default export). Globals for build-less
components: `createClass` and `h` (= `React.createElement`). Values passed to components are **Immutable.js**
(`entry.getIn(['data', 'title'])`, `field.get('name')`).

### 7.1 `CMS.registerWidget(name, control, [preview], [schema])`

- `control`: React component, or the name of an existing widget whose control to reuse.
  Props: `value`, `field` (Immutable map of the field config), `forID`, `classNameWrapper`, `onChange(value)`.
- `preview` props: `value`, `field`, `metadata`, `getAsset(path)`, `entry` (Immutable), `fieldsMetaData`.
- `schema`: JSON Schema for the field's extra options (validated in the config).
- Validation: the control may define `isValid()` returning `true`, `false`, `{ error: { message } }` or a Promise
  (field is "in error" while pending; do not create a new promise inside `isValid`, it is called on every save).

```js
CMS.registerWidget('categories', CategoriesControl, CategoriesPreview, {
  properties: { separator: { type: 'string' } },
})
```

### 7.2 `CMS.registerPreviewTemplate(name, Component)`

`name`: the collection name (folder collections) or the **file name** (file collections). Props:
- `entry`: Immutable entry (`entry.getIn(['data', 'title'])`).
- `widgetFor(fieldName)`: the field's preview widget element.
- `widgetsFor(fieldName)`: list field → array of `{ data, widgets }` (Immutable); object field → one `{ data, widgets }`.
- `getAsset(path)`: resolved URL or in-memory blob for (unsaved) uploads; call `.toString()` for a `src`.
- `getCollection(collection, [slug])`: Promise of a collection's entries (or one).
- `fieldsMetaData`: metadata (e.g. relation widget's selected entry: `fieldsMetaData.getIn(['authors', value])`).
- `document`, `window`: the preview **iframe's** document/window.

```js
const PagePreview = ({ entry, widgetFor, getAsset }) =>
  h('div', {}, h('h1', {}, entry.getIn(['data', 'title'])), widgetFor('body'))
CMS.registerPreviewTemplate('careers', PagePreview)
```

### 7.3 `CMS.registerPreviewStyle(fileOrCss, [opts])`

`CMS.registerPreviewStyle('/admin/preview.css')` (URL), or raw CSS: `CMS.registerPreviewStyle(cssString, { raw: true })`.
The preview renders in an iframe, so site styles must be registered here to apply.

### 7.4 `CMS.registerEventListener({ name, handler })`

Events: `prePublish`, `postPublish`, `preUnpublish`, `postUnpublish`, `preSave`, `postSave`.
Handler receives `{ author, entry }` (`entry` Immutable). `preSave` may return modified data:

```js
CMS.registerEventListener({
  name: 'preSave',
  handler: ({ entry }) => entry.get('data').set('title', 'new title'),
})
```
Changelog (core 3.14.0): `invokeEvent` returns the full entry object instead of just data.

### 7.5 `CMS.registerEditorComponent(definition)`

Block component for the markdown/richtext editor. Required: `id`, `label`, `fields`, `pattern` (RegExp, run on the
whole document, use `m`/`s` flags and non-greedy groups), `fromBlock(match) → data`, `toBlock(data) → string`,
`toPreview(data) → string | React element`. Extra keys go to the underlying object control (e.g. `collapsed: true`).
Changelog (core 3.19.0): inline custom editor components are supported (syntax not documented).

### 7.6 Other registries in the docs

- `CMS.registerLocale('de', de)` (`import { de } from 'decap-cms-locales'`).
- `CMS.registerRemarkPlugin(plugin | { settings })`.
- `CMS.registerCustomFormat(name, extension, { fromFile(text), toFile(value) })`; then `format: <name>`; can
  override built-ins (`yml`).
- No `registerAdditionalLink`, sidebar links, collection icons or collection dividers are documented for Decap.

### 7.7 Manual initialization

```js
window.CMS_MANUAL_INIT = true            // must be set BEFORE the CMS module is imported/evaluated
import CMS, { init } from 'decap-cms-app' // script tag: const { CMS, initCMS: init } = window
init()                                   // same as auto-init (loads config.yml)
init({ config: { backend: { name: 'git-gateway' } } })   // merged over config.yml; arrays replaced, not concatenated
init({ config: { load_config_file: false, backend: {...}, media_folder: '...', collections: [...] } })
```
`load_config_file: false` skips fetching `config.yml` (recommended when the full config is passed). Registries can
be called before or after `init`. The custom-widget starter sets the flag in a `bootstrap.js` imported before `decap-cms-app` (ES imports are hoisted).

### 7.8 Custom mount element

Put `<div id="nc-root"></div>` in the admin page; Decap mounts inside it instead of taking the whole page. Load the
script after the DOM is ready (`defer`).

## 8. Editorial workflow, preview links, open authoring

Sources: https://decapcms.org/docs/editorial-workflows/ , https://decapcms.org/docs/deploy-preview-links/ ,
https://decapcms.org/docs/open-authoring/
`publish_mode: editorial_workflow`:

| UI action | Git |
| --- | --- |
| Save draft | Commit to new branch `cms/<collection>/<slug>` and open a PR |
| Edit draft | Another commit on that branch/PR |
| Approve and publish | Merge PR, delete branch |

- GitHub, GitLab (MR labels), Bitbucket (PR comments) supported. `backend.squash_merges: true` squashes on publish.
- Without the workflow, every save commits straight to `backend.branch` (no PR).
- Collection `publish: false` hides publish controls.
- Deploy preview links: need editorial workflow plus a CI that posts a commit status (GitHub) or PR status
  (GitLab/Bitbucket/Azure) whose name contains **"deploy"** (Netlify does). Link = status URL + `preview_path`.
  "Check for Preview" button polls. `site_url` + `preview_path` give links for published entries (works without
  the workflow). `show_preview_links: false` disables.
- Open authoring: `github` backend only (**not git-gateway**), workflow on, `backend.open_authoring: true`;
  non-writers work on a fork, "Ready to Review" opens the PR.

## 9. Local backend (decap-server)

Source: https://decapcms.org/docs/decap-proxy/ (was /docs/working-with-a-local-git-repository/)
```yaml
local_backend: true          # or:
local_backend:
  url: http://localhost:8082/api/v1
  allowed_hosts: ['192.168.0.1']   # hosts other than localhost/127.0.0.1
backend: { name: git-gateway }
```
Run `npx decap-server` in the repo root (port 8081). Env (`.env` or inline): `PORT`, `BIND_HOST` (3.9),
`ORIGIN` (3.9; CORS origin). Since decap-server 3.8.0 CORS defaults to localhost/127.0.0.1 origins only
(was `*`). **`editorial_workflow` is not supported** with the local backend.

`backend: { name: test-repo }` (https://decapcms.org/docs/test-backend/): in-memory, no repo access, lost on reload.

## 10. Gotchas and limitations stated in the docs

Besides the ones marked in each section above:

- Decap always reads/writes the **hosted** repo branch from `backend.branch`, even when the admin runs locally,
  unless `local_backend` is on.
- File-collection files must already exist and parse (JSON needs `{}`); `create` is folder-only.
- Field `default` works only in folder collections.
- i18n: files collections only `single_file`; list/object only `i18n: true`.
- Nested collections are beta; field `media_folder` on file/image is beta; `richtext` is beta, `markdown` deprecated.
- `search` loads every entry (rate limits); relation widget on large collections likewise.

## 11. Changelog notes since 3.0 (decap-cms-core, not on the docs site unless noted)

Source: https://github.com/decaporg/decap-cms/blob/main/packages/decap-cms-core/CHANGELOG.md
(GitHub releases page not reachable from here; decap-cms package changelog lists only version bumps.)
Undocumented means the option name/syntax is not given in the docs; confirm in source before using.

- Documented since: `logo.show_in_header` (3.8.0), list `allow_remove`/`allow_reorder` (3.9.0), `issue_reports`
  (3.11.0), `richtext` (3.12.0), `sanitize_preview: true` default (3.13.0).
- Undocumented options: `default_sort` for sortable fields (3.10.0); `Signed-off-by` in commit messages (3.12.0);
  special characters passing slugification (3.13.0); filters in slug templates (3.14.0).
- core 3.14.0: `invokeEvent` returns the full entry; 3.15.0: responsive collection, workflow and media views.
- core 3.16.0: "New entry" button label is `＋ %{collectionLabel}` in every locale.
- core 3.17.0: "collection size limit" feature (undocumented); sorting/separator for unpublished entries.
- core 3.18.1: collection `filter` applied with i18n `single_file`.
- core 3.19.0: inline custom editor components in the markdown widget.
- core 3.20.0 (ships in decap-cms 3.17.0): S3-compatible media library; Turbo backends and deploy-status pages;
  "editor API, field actions"; create/delete/publish hidden on "view-only collections"; a create no longer
  overwrites an existing i18n entry; generated slugs and i18n deletes kept within what git accepts.
