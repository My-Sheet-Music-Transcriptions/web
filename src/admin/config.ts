import fs from 'node:fs'
import { readAllEntries } from '../../scripts/lib/content-fs.ts'
import { cmsBlocks } from '../components/blocks/cms.ts'
import type { AnyCmsBlock, Field } from '../content/cms-fields.ts'
import { decapField } from '../content/cms-fields.ts'
import { metaFields, serviceFields } from '../content/cms-meta.ts'
import { CMS_LOCALES } from './locales.ts'

/**
 * Decap CMS's configuration (/admin/config.yml), written by vite.admin.config.ts at build: the pilot of the file-based
 * CMS. It edits data pages, content/<locale>/<collection>/<slug>/page.json (src/content/data-page.ts), never the
 * hand-built pages (index.tsx + meta.ts), which it does not list. The blocks it offers and their forms are made from
 * src/components/blocks/cms.ts, the same list every page.json is checked against and rendered with.
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

/** A language's homepage, when it is a data page (run from the repository root, as the build and tests are). */
const homeFile = (locale: string) => `content/${locale}/pages/home/page.json`

/** A language's main menu (src/content/menu.ts). */
const menuFile = (locale: string) => `content/${locale}/data/menu.json`
const entries = readAllEntries()

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
  // A page's language is the collection it is in, so that a language's collections sit together in the sidebar:
  // `<Language> · Home` (a single entry: the language's homepage, once it is a data page), `<Language> · Menu` (the
  // main menu, once the language has its own), then `<Language> · Pages` and `<Language> · Services`.
  collections: CMS_LOCALES.flatMap(({ code, label }) => [
    ...(fs.existsSync(homeFile(code))
      ? [
          {
            name: `home-${code}`,
            label: `${label} · Home`,
            description: `The homepage in ${label}.`,
            media_folder: '',
            public_folder: '',
            files: [{ name: `home-${code}`, label: 'Homepage', file: homeFile(code), fields }],
          },
        ]
      : []),
    ...(fs.existsSync(menuFile(code))
      ? [
          {
            name: `menu-${code}`,
            label: `${label} · Menu`,
            description: `The main menu in ${label}: its items, the sections of each panel and their links.`,
            files: [
              {
                name: `menu-${code}`,
                label: 'Menu',
                file: menuFile(code),
                fields: menuFields(code),
              },
            ],
          },
        ]
      : []),
    {
      name: `pages-${code}`,
      label: `${label} · Pages`,
      label_singular: `${label} page`,
      description: `Pages in ${label}. Hand-built pages (the landing pages) are changed by asking Claude.`,
      folder: `content/${code}/pages`,
      path: '{{slug}}/page',
      extension: 'json',
      format: 'json',
      create: true,
      slug: '{{slug}}',
      media_folder: '',
      public_folder: '',
      summary: '{{title}}',
      fields,
    },
    {
      name: `services-${code}`,
      label: `${label} · Services`,
      label_singular: `${label} service page`,
      description: `Service pages in ${label}: one per instrument or service, listed in the menus and grids.`,
      folder: `content/${code}/services`,
      path: '{{slug}}/page',
      extension: 'json',
      format: 'json',
      create: true,
      slug: '{{slug}}',
      media_folder: '',
      public_folder: '',
      summary: '{{title}}',
      fields: serviceFormFields,
    },
  ]),
}
