import { z } from 'zod'
import type { NavItem } from '../i18n/types.ts'

/**
 * The main menu of a language (header and phone menu), content/<locale>/data/menu.json, edited in the CMS as
 * `<Language> · Menu` (src/admin/config.ts). Every link points at a page of that language (`page`, its locale-free
 * path, picked from the pages in content/) or at an address (`href`: a page not ported yet, another site). The order
 * of each list is the order on the site. An item may open a panel of sections; a section has an optional heading
 * link and a list of links.
 *
 * Imported by Node directly (scripts/lib/content-fs.ts checks every `page` exists): relative imports with extensions.
 */

// The CMS saves a field it cleared as "" or null: both mean unset.
const unset = (v: unknown) => (v === '' || v === null ? undefined : v)
const target = {
  /** A page of this language, by its path (`/`, `/piano`). */
  page: z.preprocess(
    unset,
    z
      .string()
      .regex(/^\/[\w/-]*$/, 'a page path such as /piano')
      .optional(),
  ),
  /** Any other address: a page not ported yet (`/pricing`) or another site (`https://…`). */
  href: z.preprocess(unset, z.string().optional()),
}
const pointsOnce = (l: { page?: string; href?: string }) => !(l.page && l.href)
const once = { message: 'pick a page or write an address, not both' }

const link = z
  .object({ label: z.string().min(1), ...target })
  .strict()
  .refine(pointsOnce, once)
  .refine((l) => l.page || l.href, { message: 'a link needs a page or an address' })
const section = z
  .object({
    label: z.string().min(1),
    ...target,
    links: z.preprocess(unset, z.array(link).default([])),
  })
  .strict()
  .refine(pointsOnce, once)
const item = z
  .object({
    label: z.string().min(1),
    ...target,
    sections: z.preprocess(unset, z.array(section).default([])),
  })
  .strict()
  .refine(pointsOnce, once)
  .refine((l) => l.page || l.href, { message: 'a menu item needs a page or an address' })

const menuSchema = z.object({ items: z.array(item) }).strict()
export type Menu = z.output<typeof menuSchema>

/** Parses a menu.json, naming the file and the place of each problem. */
export function parseMenu(data: unknown, file: string): Menu {
  const parsed = menuSchema.safeParse(data)
  if (parsed.success) return parsed.data
  const problems = parsed.error.issues.map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`)
  throw new Error(`${file} is not a valid menu:\n${problems.join('\n')}`)
}

/** Every page the menu points at, with where (for the check that each exists). */
export function menuPages(menu: Menu): { page: string; at: string }[] {
  const out: { page: string; at: string }[] = []
  menu.items.forEach((i, n) => {
    if (i.page) out.push({ page: i.page, at: `items.${n}` })
    i.sections.forEach((s, m) => {
      if (s.page) out.push({ page: s.page, at: `items.${n}.sections.${m}` })
      s.links.forEach((l, k) => {
        if (l.page) out.push({ page: l.page, at: `items.${n}.sections.${m}.links.${k}` })
      })
    })
  })
  return out
}

/** The menu as the header draws it. */
export function menuToNav(menu: Menu): NavItem[] {
  return menu.items.map((i) => ({
    label: i.label,
    href: (i.page ?? i.href) as string,
    ...(i.sections.length > 0 && {
      groups: i.sections.map((s) => ({
        title: s.label,
        ...((s.page ?? s.href) && { href: s.page ?? s.href }),
        links: s.links.map((l) => ({ label: l.label, href: (l.page ?? l.href) as string })),
      })),
    }),
  }))
}
