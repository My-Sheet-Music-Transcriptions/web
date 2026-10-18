import { z } from 'zod'

/**
 * A language's redirects, content/<locale>/data/redirects.json, edited in the CMS as `<Language> · Redirects`
 * (src/admin/config.ts): the old addresses of the WordPress site (retired pages, expired promotions, single reviews
 * and questions, author archives) and where each now leads. scripts/postbuild.ts writes them into Netlify's
 * `_redirects` (with the `/<locale>` prefix in an all-languages preview), and `checkRedirects`
 * (scripts/lib/content-fs.ts) fails the build on a rule that hides a page, leads to a page that does not exist or
 * leads to another rule.
 *
 * Imported by Node directly (scripts/postbuild.ts): relative imports with extensions.
 */

const path = z
  .string()
  .regex(/^\/[^\s]*$/, 'a path on this site such as /review/* or /summer-25')
  .refine((p) => !p.slice(0, -1).includes('*'), 'a * only at the end')

const rule = z
  .object({
    /** The old address: a path, or a path ending in /* for everything under it. */
    from: path,
    /** Where it leads: a page of this language (/opiniones) or another site (https://…). */
    to: z
      .string()
      .regex(/^(\/[^\s*]*|https:\/\/\S+)$/, 'a page path (/opiniones) or an https:// address'),
    /** 301 (moved for good, the default) or 302 (for now). */
    status: z.preprocess(
      (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
      z.union([z.literal(301), z.literal(302)]).default(301),
    ),
    /** Why the rule exists (for whoever reads the list). */
    note: z.preprocess((v) => (v === '' || v === null ? undefined : v), z.string().optional()),
  })
  .strict()

const schema = z.object({ rules: z.array(rule).default([]) }).strict()

export type RedirectRule = z.infer<typeof rule>

/** Validates a redirects.json; throws with every issue listed. */
export function parseRedirects(data: unknown, file: string): RedirectRule[] {
  const result = schema.safeParse(data)
  if (!result.success)
    throw new Error(
      `${file}:\n  ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n  ')}`,
    )
  return result.data.rules
}

/** The rules as Netlify `_redirects` lines, every path behind `prefix` (`/es` in an all-languages preview). */
export function redirectLines(rules: readonly RedirectRule[], prefix = ''): string[] {
  return rules.map(({ from, to, status }) => {
    const target = to.startsWith('/') ? `${prefix}${to}`.replace(/(.)\/$/, '$1') : to
    return `${prefix}${from}  ${target}  ${status}`
  })
}

/** Where a rule's old address matches a path: exactly, or under it for a rule ending in `/*`. */
export function matches(from: string, path: string): boolean {
  return from.endsWith('/*') ? path.startsWith(from.slice(0, -1)) : from === path
}

/**
 * What is wrong with a language's rules, given its pages' paths: a rule that hides a page (Netlify would never
 * serve it), leads to a page the language does not have, leads to another rule's old address (a chain) or repeats
 * an old address.
 */
export function redirectProblems(
  rules: readonly RedirectRule[],
  pages: ReadonlySet<string>,
  file: string,
): string[] {
  const problems: string[] = []
  const seen = new Set<string>()
  for (const r of rules) {
    if (seen.has(r.from)) problems.push(`${file}: ${r.from} is redirected twice`)
    seen.add(r.from)
    for (const page of pages)
      if (matches(r.from, page)) problems.push(`${file}: ${r.from} hides the page ${page}`)
    if (!r.to.startsWith('/')) continue
    const to = r.to.split(/[?#]/)[0] || '/'
    if (!pages.has(to)) problems.push(`${file}: ${r.from} leads to ${to}, which is not a page`)
    for (const other of rules)
      if (other !== r && matches(other.from, to))
        problems.push(`${file}: ${r.from} leads to ${to}, which ${other.from} redirects again`)
  }
  return problems
}
