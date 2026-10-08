import fs from 'node:fs'
import path from 'node:path'
import { sites } from '../../src/i18n/sites'
import type { Locale } from '../../src/i18n/types'
import { readAllEntries } from '../lib/content-fs'
import { readPreviewMemo } from './preview-lib'

/**
 * What the `/status` command reads: one JSON line per page in flight or recently shipped, from
 * mockups/<slug>/preview.json and src/content. GitHub (PR state, deploy preview) is added by the skill.
 *   pnpm page:status [slug]
 */
const only = process.argv[2]
const entries = readAllEntries()
const root = 'mockups'
const slugs = fs.existsSync(root)
  ? fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'preview.json')))
  : []

for (const slug of slugs) {
  if (only && slug !== only) continue
  const memo = readPreviewMemo(slug)
  const locale = (memo.locale ??
    (memo.source?.split('/')[0] as Locale | undefined) ??
    'en') as Locale
  const pagePath = memo.path ?? `/${slug}`
  const entry = entries.find((e) => e.locale === locale && e.path === pagePath)
  const variants = fs
    .readdirSync(path.join(root, slug))
    .filter((f) => /^sections\.[^.]+\.html$/.test(f))
    .map((f) => f.slice('sections.'.length, -'.html'.length))
  console.log(
    JSON.stringify({
      slug,
      title: memo.title ?? slug,
      locale,
      path: pagePath,
      liveUrl: `${sites[locale].domain}${pagePath === '/' ? '/' : pagePath}`,
      preview: memo.url ?? null,
      canvas: memo.canvas?.url ?? null,
      options: variants,
      pr: memo.pr ?? null,
      /** The page exists in src/content on this checkout (built, maybe not yet live). */
      built: Boolean(entry),
      source: entry ? `${entry.locale}/${entry.collection}/${entry.slug}` : (memo.source ?? null),
    }),
  )
}
if (!slugs.length) console.log('[page:status] no mockups yet')
