import { cmsBlocks } from '../components/blocks/cms.ts'
import type { AnyCmsBlock } from '../content/cms-fields.ts'
import { decapField } from '../content/cms-fields.ts'

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

/** The languages whose pages the CMS edits (one collection each). */
const LOCALES = [{ code: 'en', label: 'English' }] as const

const blockTypes = Object.entries(cmsBlocks as Record<string, AnyCmsBlock>).map(
  ([name, block]) => ({
    name,
    label: block.label,
    widget: 'object',
    ...(block.summary && { summary: block.summary }),
    fields: Object.entries(block.fields).map(([field, f]) => decapField(field, f)),
  }),
)

const metaFields = [
  {
    name: 'title',
    label: 'Title',
    widget: 'string',
    hint: 'The page name in search results and the browser tab (3–120 characters).',
    pattern: ['^.{3,120}$', '3 to 120 characters'],
  },
  {
    name: 'description',
    label: 'Description',
    widget: 'text',
    hint: 'The line Google shows under the title.',
    pattern: ['^[\\s\\S]{50,160}$', '50 to 160 characters'],
  },
  {
    name: 'translationKey',
    label: 'Translation key',
    widget: 'string',
    hint: 'The same key on every language version of this page links them (lowercase, dashes). A key no other language uses keeps the page on its own.',
    pattern: ['^[a-z0-9][a-z0-9-]*$', 'lowercase letters, numbers and dashes'],
  },
  {
    name: 'updated',
    label: 'Last updated',
    widget: 'datetime',
    format: 'YYYY-MM-DD',
    date_format: 'YYYY-MM-DD',
    time_format: false,
    required: false,
  },
  { name: 'draft', label: 'Draft (hidden from the site)', widget: 'boolean', required: false },
]

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
  collections: LOCALES.map(({ code, label }) => ({
    name: `pages-${code}`,
    label: `Pages (${label})`,
    label_singular: 'Page',
    description:
      'Pages people edit here. Hand-built pages (the homepage, landing pages) are changed by asking Claude.',
    folder: `content/${code}/pages`,
    path: '{{slug}}/page',
    extension: 'json',
    format: 'json',
    create: true,
    slug: '{{slug}}',
    media_folder: '',
    public_folder: '',
    summary: '{{title}}',
    fields: [
      ...metaFields,
      {
        name: 'blocks',
        label: 'Sections',
        label_singular: 'section',
        widget: 'list',
        summary: '{{fields.title}}',
        types: blockTypes,
      },
    ],
  })),
}
