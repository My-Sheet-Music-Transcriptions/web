import type { Locale, NavItem } from '~/i18n/types'
import type { FooterData } from './types'

/**
 * The data lists the layout needs (blocks get theirs from the page): the navigation and the footer of each
 * locale, read from content/<locale>/data/{nav,footer}.ts. A locale without data files yet shows the English
 * ones (the scaffolds of the locales still to be ported).
 */
const navs = import.meta.glob<{ nav: NavItem[] }>('/content/*/data/nav.ts', { eager: true })
const footers = import.meta.glob<{ footer: FooterData }>('/content/*/data/footer.ts', {
  eager: true,
})

/** The main navigation of a locale. */
export function navFor(locale: Locale): NavItem[] {
  return (navs[`/content/${locale}/data/nav.ts`] ?? navs['/content/en/data/nav.ts'])?.nav ?? []
}

/** The footer columns of a locale. */
export function footerFor(locale: Locale): FooterData {
  const found =
    footers[`/content/${locale}/data/footer.ts`] ?? footers['/content/en/data/footer.ts']
  if (!found) throw new Error('content/en/data/footer.ts is missing')
  return found.footer
}
