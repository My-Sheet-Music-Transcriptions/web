import fs from 'node:fs'
import { cmsBlocks } from '../components/blocks/cms.ts'
import type { AnyCmsBlock } from '../content/cms-fields.ts'
import { decapField } from '../content/cms-fields.ts'
import { metaFields } from '../content/cms-meta.ts'
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

/** Every page's fields: its meta, then its blocks. */
const fields = [
  ...Object.entries(metaFields).map(([name, f]) => decapField(name, f)),
  {
    name: 'blocks',
    label: 'Blocks',
    label_singular: 'block',
    widget: 'list',
    summary: '{{fields.title}}',
    types: blockTypes,
  },
]

/** A language's homepage, when it is a data page (run from the repository root, as the build and tests are). */
const homeFile = (locale: string) => `content/${locale}/pages/home/page.json`

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
  // `<Language> · Home` (a single entry: the language's homepage, once it is a data page), then `<Language> · Pages`.
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
    {
      name: `pages-${code}`,
      label: `${label} · Pages`,
      label_singular: `${label} page`,
      description: `Pages in ${label}. Hand-built pages (landing pages, service pages) are changed by asking Claude.`,
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
  ]),
}
