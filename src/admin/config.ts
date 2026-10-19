import fs from 'node:fs'
import { readAllEntries } from '../../scripts/lib/content-fs.ts'
import { cmsBlocks } from '../components/blocks/cms.ts'
import type { AnyCmsBlock, Field } from '../content/cms-fields.ts'
import { decapField } from '../content/cms-fields.ts'
import { metaFields, postFields, serviceFields } from '../content/cms-meta.ts'
import { postBody } from '../content/post-template.ts'
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
  label: 'Bloques',
  label_singular: 'bloque',
  // Decap's list, offering a new page to start from another page's blocks (src/admin/widgets.ts)
  widget: 'blocks',
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
/**
 * A post's fields: no blocks, its layout is fixed (src/content/post-template.ts). What a writer fills in for every post
 * comes first (title, date, cover, the text in a rich text editor, the card's summary), then the search fields.
 */
const { title, ...searchFields } = metaFields
const { date, cover, ...cardFields } = postFields
const postFormFields = Object.entries({
  title: {
    ...title,
    hint: 'El titular del artículo: en el artículo, en su tarjeta del blog y en los resultados de búsqueda.',
  },
  date,
  cover,
  body: postBody,
  ...cardFields,
  ...searchFields,
}).map(([name, f]) => decapField(name, f))

/** The language a page is in (its folder), and the collection (its folder, hidden): what a page.json opens with. */
const languageField = {
  name: 'language',
  label: 'Idioma',
  widget: 'select',
  options: CMS_LOCALES.map(({ code, label }) => ({ label, value: code })),
  hint: 'El idioma en que está escrita la página: se guarda con las páginas de ese idioma.',
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
  view_groups: [{ label: 'Idioma', field: 'language' }],
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
    ? [{ name: `home-${code}`, label: `${label} · Portada`, file: homeFile(code), fields }]
    : []),
  ...(fs.existsSync(menuFile(code))
    ? [
        {
          name: `menu-${code}`,
          label: `${label} · Menú`,
          file: menuFile(code),
          fields: menuFields(code),
        },
      ]
    : []),
  ...(fs.existsSync(redirectsFile(code))
    ? [
        {
          name: `redirects-${code}`,
          label: `${label} · Redirecciones`,
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
    label: 'Redirecciones',
    label_singular: 'redirección',
    widget: 'list',
    collapsed: true,
    summary: '{{fields.from}} → {{fields.to}}',
    hint: 'Direcciones antiguas de la web y adónde se envía en su lugar a los visitantes y a los buscadores.',
    fields: [
      {
        name: 'from',
        label: 'Dirección antigua',
        widget: 'string',
        hint: 'Una ruta: /verano-25, o /review/* para todo lo que hay bajo /review/.',
        pattern: ['^/\\S*$', 'una ruta que empiece por /'],
      },
      {
        name: 'to',
        label: 'Lleva a',
        widget: 'string',
        hint: 'Una página de este idioma (/opiniones) u otra web (https://…).',
        pattern: ['^(/\\S*|https://\\S+)$', 'una ruta o una dirección https://'],
      },
      {
        name: 'status',
        label: 'Tipo',
        widget: 'select',
        required: false,
        default: 301,
        options: [
          { label: 'Traslado definitivo (301)', value: 301 },
          { label: 'Temporal (302)', value: 302 },
        ],
      },
      { name: 'note', label: 'Motivo', widget: 'string', required: false },
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
  const label = (hint: string) => ({ name: 'label', label: 'Texto', widget: 'string', hint })
  const page = {
    name: 'page',
    label: 'Página',
    widget: 'select',
    required: false,
    options,
    hint: 'Una página de este idioma. Déjalo vacío para escribir una dirección.',
  }
  const href = {
    name: 'href',
    label: 'Dirección',
    widget: 'link',
    required: false,
    hint: 'Solo si no eliges página: una página que aún no está en la web nueva (/pricing) u otra web (https://…).',
  }
  const links = {
    name: 'links',
    label: 'Enlaces',
    label_singular: 'enlace',
    widget: 'list',
    required: false,
    collapsed: true,
    summary: '{{fields.label}}',
    fields: [label('El texto en el menú.'), page, href],
  }
  const sections = {
    name: 'sections',
    label: 'Secciones',
    label_singular: 'sección',
    widget: 'list',
    required: false,
    collapsed: true,
    summary: '{{fields.label}}',
    hint: 'El panel que se abre desde este elemento: un encabezado por sección, con sus enlaces debajo.',
    fields: [
      label('El encabezado de la sección.'),
      { ...page, hint: 'Opcional: la página que abre el encabezado.' },
      href,
      links,
    ],
  }
  return [
    {
      name: 'items',
      label: 'Elementos del menú',
      label_singular: 'elemento del menú',
      widget: 'list',
      collapsed: true,
      summary: '{{fields.label}}',
      hint: 'Arrastra para reordenar: el orden de aquí es el de la web.',
      fields: [label('El texto en la barra del menú.'), page, href, sections],
    },
  ]
}

export const decapConfig = {
  // The CMS speaks Spanish: Decap's own words (its bundle carries every locale), and ours in this file, cms.ts and
  // cms-meta.ts; the login window too (index.html).
  locale: 'es',
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
      label: 'Web',
      description: 'La portada, el menú principal y las redirecciones de cada idioma.',
      media_folder: '',
      public_folder: '',
      files: CMS_LOCALES.flatMap(siteFiles),
    },
    kind(
      'pages',
      'Páginas',
      'página',
      'Las páginas de todos los idiomas (filtra o agrupa la lista por idioma). Las páginas hechas a mano (las landing pages) se cambian pidiéndoselo a Claude.',
      fields,
    ),
    kind(
      'services',
      'Servicios',
      'página de servicio',
      'Las páginas de servicio de todos los idiomas: una por instrumento o servicio, en los menús y las cuadrículas.',
      serviceFormFields,
    ),
    kind(
      'posts',
      'Blog',
      'artículo',
      'Los artículos del blog de todos los idiomas: cada uno aparece en el blog de su idioma, los más recientes primero, con su portada, resumen y fecha.',
      postFormFields,
    ),
  ],
}
