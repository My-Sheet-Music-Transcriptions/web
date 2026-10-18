import fs from 'node:fs'
import { readAllEntries } from '../../scripts/lib/content-fs.ts'
import { cmsBlocks } from '../components/blocks/cms.ts'
import type { AnyCmsBlock, Field } from '../content/cms-fields.ts'
import { decapField } from '../content/cms-fields.ts'
import { metaFields, postFields, serviceFields } from '../content/cms-meta.ts'
import { CMS_LOCALES, type CmsLocale } from './locales.ts'

/**
 * Decap CMS's configuration (/admin/config.yml), written by vite.admin.config.ts at build: the pilot of the file-based
 * CMS. It edits data pages, content/<locale>/<collection>/<slug>/page.json (src/content/data-page.ts), never the
 * hand-built pages (index.tsx + meta.ts), which it does not list. The blocks it offers and their forms are made from
 * src/components/blocks/cms.ts, the same list every page.json is checked against and rendered with.
 * The sidebar: `Site` (every language's homepage, main menu and redirects, one entry each), `Pages`, `Services` and
 * `Blog` (every
 * language's, filed in one collection each: the writer filters or groups the list by language, and a new page says
 * which language it is in, which puts it in that language's folder). Each page.json opens with `language` and
 * `collection` for this (src/content/data-page.ts checks them against the folder).
 * Logins: Netlify Identity through Git Gateway (an email and a password, no GitHub account). Every change is a pull
 * request (editorial workflow) with its Netlify deploy preview, merged by the branch rule like any content PR.
 * Locally: `pnpm build && pnpm serve:dist`, `npx decap-server` in another terminal, then http://localhost:4173/admin/
 * (local_backend writes straight to the working copy, no login).
 *
 * Imported by Node directly (the admin build's config): relative imports with extensions and type imports only.
 */

const blockTypes = Object.entries(cmsBlocks as unknown as Record<string, AnyCmsBlock>).map(
  ([name, block]) => ({
    name,
    label: block.label,
    widget: 'object',
    ...(block.summary && { summary: block.summary }),
    fields: Object.entries(block.fields).map(([field, f]) => decapField(field, f)),
  }),
)

const blocksField = {
  name: 'blocks',
  label: 'Blocks',
  label_singular: 'block',
  widget: 'list',
  summary: '{{fields.title}}',
  types: blockTypes,
}
const fieldsOf = (meta: Record<string, Field>) => [
  ...Object.entries(meta).map(([name, f]) => decapField(name, f)),
  blocksField,
]
/** Every page's fields: its meta, then its blocks; a service page's own meta fields come after the shared ones. */
const fields = fieldsOf(metaFields)
const serviceFormFields = fieldsOf({ ...metaFields, ...serviceFields })
const postFormFields = fieldsOf({ ...metaFields, ...postFields })

/** The language a page is in (its folder), and the collection (its folder, hidden): what a page.json opens with. */
const languageField = {
  name: 'language',
  label: 'Language',
  widget: 'select',
  options: CMS_LOCALES.map(({ code, label }) => ({ label, value: code })),
  hint: 'The language the page is written in: it is filed with that language’s pages.',
}
const collectionField = (collection: string) => ({
  name: 'collection',
  widget: 'hidden',
  default: collection,
})
/**
 * A folder collection of every language's pages of one kind, `content/<language>/<collection>/<slug>/page.json`:
 * `path` files a new page by its language, `filter` keeps the other kinds out (every kind sits at the same depth),
 * and the list can be filtered or grouped by language.
 */
const kind = (
  collection: string,
  label: string,
  singular: string,
  description: string,
  own: object[],
) => ({
  name: collection,
  label,
  label_singular: singular,
  description,
  folder: 'content',
  path: `{{language}}/${collection}/{{slug}}/page`,
  filter: { field: 'collection', value: collection },
  extension: 'json',
  format: 'json',
  create: true,
  slug: '{{slug}}',
  media_folder: '',
  public_folder: '',
  summary: '{{title}} · {{language | upper}}',
  sortable_fields: ['title', 'language'],
  view_filters: CMS_LOCALES.map(({ code, label }) => ({
    label,
    field: 'language',
    pattern: `^${code}$`,
  })),
  view_groups: [{ label: 'Language', field: 'language' }],
  fields: [languageField, collectionField(collection), ...own],
})

/** A language's homepage, when it is a data page (run from the repository root, as the build and tests are). */
const homeFile = (locale: string) => `content/${locale}/pages/home/page.json`

/** A language's main menu (src/content/menu.ts). */
const menuFile = (locale: string) => `content/${locale}/data/menu.json`
/** A language's redirects (src/content/redirects.ts). */
const redirectsFile = (locale: string) => `content/${locale}/data/redirects.json`
const entries = readAllEntries()

/** The Site entries of a language: its homepage, its menu and its redirects, those it has. */
const siteFiles = ({ code, label }: CmsLocale) => [
  ...(fs.existsSync(homeFile(code))
    ? [{ name: `home-${code}`, label: `${label} · Homepage`, file: homeFile(code), fields }]
    : []),
  ...(fs.existsSync(menuFile(code))
    ? [
        {
          name: `menu-${code}`,
          label: `${label} · Menu`,
          file: menuFile(code),
          fields: menuFields(code),
        },
      ]
    : []),
  ...(fs.existsSync(redirectsFile(code))
    ? [
        {
          name: `redirects-${code}`,
          label: `${label} · Redirects`,
          file: redirectsFile(code),
          fields: redirectFields,
        },
      ]
    : []),
]

/** The redirects' form: each old address and where it leads (src/content/redirects.ts checks them at build). */
const redirectFields = [
  {
    name: 'rules',
    label: 'Redirects',
    label_singular: 'redirect',
    widget: 'list',
    collapsed: true,
    summary: '{{fields.from}} → {{fields.to}}',
    hint: 'Old addresses of the site and where visitors and search engines are sent instead.',
    fields: [
      {
        name: 'from',
        label: 'Old address',
        widget: 'string',
        hint: 'A path: /summer-25, or /review/* for everything under /review/.',
        pattern: ['^/\\S*$', 'a path starting with /'],
      },
      {
        name: 'to',
        label: 'Leads to',
        widget: 'string',
        hint: 'A page of this language (/opiniones) or another site (https://…).',
        pattern: ['^(/\\S*|https://\\S+)$', 'a path or an https:// address'],
      },
      {
        name: 'status',
        label: 'Kind',
        widget: 'select',
        required: false,
        default: 301,
        options: [
          { label: 'Moved for good (301)', value: 301 },
          { label: 'For now (302)', value: 302 },
        ],
      },
      { name: 'note', label: 'Why', widget: 'string', required: false },
    ],
  },
]

/**
 * The menu's form. Each link picks a page of the language (every page in content/, hand-built ones included, as the
 * site has them when the CMS was built) or takes an address; the order of each list is the order on the site.
 */
function menuFields(locale: string) {
  const options = entries
    .filter((e) => e.locale === locale)
    .map((e) => ({
      label: `${'shortTitle' in e.meta ? e.meta.shortTitle : e.meta.title} (${e.path})`,
      value: e.path,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale))
  const label = (hint: string) => ({ name: 'label', label: 'Label', widget: 'string', hint })
  const page = {
    name: 'page',
    label: 'Page',
    widget: 'select',
    required: false,
    options,
    hint: 'A page of this language. Leave it empty to write an address instead.',
  }
  const href = {
    name: 'href',
    label: 'Address',
    widget: 'string',
    required: false,
    hint: 'Only when no page is picked: a page not on the new site yet (/pricing) or another site (https://…).',
  }
  const links = {
    name: 'links',
    label: 'Links',
    label_singular: 'link',
    widget: 'list',
    required: false,
    collapsed: true,
    summary: '{{fields.label}}',
    fields: [label('The words in the menu.'), page, href],
  }
  const sections = {
    name: 'sections',
    label: 'Sections',
    label_singular: 'section',
    widget: 'list',
    required: false,
    collapsed: true,
    summary: '{{fields.label}}',
    hint: 'The panel that opens from this item: one heading per section, with its links under it.',
    fields: [
      label('The heading of the section.'),
      { ...page, hint: 'Optional: the page the heading opens.' },
      href,
      links,
    ],
  }
  return [
    {
      name: 'items',
      label: 'Menu items',
      label_singular: 'menu item',
      widget: 'list',
      collapsed: true,
      summary: '{{fields.label}}',
      hint: 'Drag to reorder: the order here is the order on the site.',
      fields: [label('The words in the menu bar.'), page, href, sections],
    },
  ]
}

export const decapConfig = {
  backend: {
    name: 'git-gateway',
    branch: 'main',
    commit_messages: {
      create: 'CMS: create {{collection}} “{{slug}}”',
      update: 'CMS: update {{collection}} “{{slug}}”',
      delete: 'CMS: delete {{collection}} “{{slug}}”',
      uploadMedia: 'CMS: upload “{{path}}”',
      deleteMedia: 'CMS: delete “{{path}}”',
    },
  },
  local_backend: true,
  publish_mode: 'editorial_workflow',
  // Every picture lives in its page's folder (the collection's media_folder); this global one is unused.
  media_folder: 'content/media',
  public_folder: '',
  // The brand on the login page (Decap 3.17's `show_in_header` draws nothing).
  logo: { src: '/admin/logo.svg' },
  collections: [
    {
      name: 'site',
      label: 'Site',
      description: 'Each language’s homepage, main menu and redirects.',
      media_folder: '',
      public_folder: '',
      files: CMS_LOCALES.flatMap(siteFiles),
    },
    kind(
      'pages',
      'Pages',
      'page',
      'The pages of every language (filter or group the list by language). Hand-built pages (the landing pages) are changed by asking Claude.',
      fields,
    ),
    kind(
      'services',
      'Services',
      'service page',
      'The service pages of every language: one per instrument or service, listed in the menus and grids.',
      serviceFormFields,
    ),
    kind(
      'posts',
      'Blog',
      'post',
      'The blog posts of every language: each lists itself on its language’s blog, newest first, with its cover, summary and date.',
      postFormFields,
    ),
  ],
}
