/**
 * The links writers put in content: a button's or a card's `href`, a menu address and the `[words](/path)` of light
 * markdown. Each is a page of the language (a locale-free path, `/precios`, optionally with `#id`), a part of the same
 * page (`#contact`), another site (`https://…`) or an email or phone (`mailto:`, `tel:`). The site renders pages with
 * the router (a client-side transition, SmartLink) and the rest as plain anchors; `linkProblem` is the one rule the
 * build (`checkLinks`, scripts/lib/content-fs.ts) and the CMS's link and text widgets (src/admin/widgets.ts) apply.
 *
 * Imported by Node directly (scripts/lib/content-fs.ts): no imports.
 */

/** What a language's links may lead to, besides other sites. */
export interface LinkTargets {
  /** Its pages' paths (`/`, `/precios`). */
  pages: ReadonlySet<string>
  /**
   * The language is still being migrated (its inventory has pages left to port): a path that is not one of its pages
   * yet opens on the old site (SmartLink), so it is accepted. Once the last page is ported, every path must be a page.
   */
  migrating?: boolean
  /** Old addresses and where each now leads (the language's redirects), to suggest the page itself. */
  moved?: ReadonlyMap<string, string>
  /** The language's own domains (`https://www.mistranscripcionesmusicales.com`), written as paths instead. */
  origins?: readonly string[]
}

const EXTERNAL = /^(https?:\/\/\S+|mailto:\S+@\S+|tel:[+\d][\d\s().-]*)$/

/** The page path of an internal href: `/precios#faq` → `/precios`, `/blog/` → `/blog`. */
export const pathOf = (href: string) => href.split(/[?#]/)[0]?.replace(/(.)\/+$/, '$1') || '/'

/** What is wrong with a link, in words a writer can act on, or undefined when it leads somewhere. */
export function linkProblem(href: string, to: LinkTargets): string | undefined {
  const h = href.trim()
  if (!h) return 'el enlace está vacío'
  if (/^#[\w-]+$/.test(h)) return undefined
  const own = to.origins?.find((o) => h === o || h.startsWith(`${o}/`))
  if (own) return `${h} es esta misma web: escríbelo como ${h.slice(own.length) || '/'}`
  if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(h))
    return `${h} es una dirección de email: escríbela como mailto:${h}`
  if (EXTERNAL.test(h)) return undefined
  if (!h.startsWith('/') || /\s/.test(h))
    return `${h} no es un enlace: elige una página (/precios), una parte de la página (#contacto), otra web (https://…), mailto: o tel:`
  const path = pathOf(h)
  if (to.pages.has(path)) return undefined
  const moved = to.moved?.get(path)
  if (moved) return `${path} se ha movido a ${moved}: enlaza directamente ahí`
  if (to.migrating) return undefined
  return `${path} no es una página de este idioma`
}

/** The hrefs of light markdown's links, `[words](href)`. */
export const markdownLinks = (text: string): string[] =>
  [...text.matchAll(/(?<!!)\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1] as string)

/**
 * Every link of a stored page, with where it is (`blocks[2].cta.href`): the `href` fields and the markdown links of
 * every text, at any depth.
 */
export function linksIn(value: unknown, at = ''): { href: string; at: string }[] {
  if (typeof value === 'string') return markdownLinks(value).map((href) => ({ href, at }))
  if (Array.isArray(value)) return value.flatMap((v, i) => linksIn(v, `${at}[${i}]`))
  if (!value || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([k, v]) => {
    const where = at ? `${at}.${k}` : k
    return k === 'href' && typeof v === 'string' ? [{ href: v, at: where }] : linksIn(v, where)
  })
}
