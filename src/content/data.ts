import type { Locale, NavItem } from '~/i18n/types'
import { menuToNav, parseMenu } from './menu'
import type { FooterData } from './types'

/**
 * The data lists the layout needs (blocks get theirs from the page): the main menu and the footer of each locale,
 * read from content/<locale>/data/menu.json (edited in the CMS, src/content/menu.ts) and footer.ts. A locale without
 * them yet shows the English ones (the scaffolds of the locales still to be ported).
 */
const menus = import.meta.glob<unknown>('/content/*/data/menu.json', {
  eager: true,
  import: 'default',
})
const footers = import.meta.glob<{ footer: FooterData }>('/content/*/data/footer.ts', {
  eager: true,
})

const navs = new Map<string, NavItem[]>()

/** The main navigation of a locale. */
export function navFor(locale: Locale): NavItem[] {
  const own = `/content/${locale}/data/menu.json`
  const file = own in menus ? own : '/content/en/data/menu.json'
  let nav = navs.get(file)
  if (!nav) {
    nav = file in menus ? menuToNav(parseMenu(menus[file], file.slice(1))) : []
    navs.set(file, nav)
  }
  return nav
}

/** The footer columns of a locale. */
export function footerFor(locale: Locale): FooterData {
  const found =
    footers[`/content/${locale}/data/footer.ts`] ?? footers['/content/en/data/footer.ts']
  if (!found) throw new Error('content/en/data/footer.ts is missing')
  return found.footer
}
