export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ca'

export const LOCALES: readonly Locale[] = ['en', 'es', 'fr', 'de', 'ja', 'ca'] as const

export interface NavItem {
  label: string
  href: string
  /** Mega-menu groups shown on hover/focus; a group has a title and a list of links. */
  groups?: { title: string; href?: string; links: { label: string; href: string }[] }[]
}

export interface FooterColumnLink {
  label: string
  href: string
  icon?: string
}

export interface SiteConfig {
  locale: Locale
  /** BCP-47 language used in <html lang> and hreflang. */
  lang: string
  /** Absolute origin without trailing slash; also the sitemap host. */
  domain: string
  /** Shown in <title> templates and schema.org Organization. */
  siteName: string
  titleTemplate: string
  /** Brand name as it appears in copy. */
  brand: string
  /** Logo lockup variant under src/assets/images/brand. */
  logo: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ca'
  currency: 'USD' | 'EUR' | 'GBP' | 'AUD' | 'JPY'
  /** Slugs of the fixed routes that are not content-driven. */
  routes: { blogIndex: string; faqPrefix: string; contactAnchor: string }
  /** Paths that must not be prerendered (served by a function). */
  ssrOnlyPaths: string[]
  hub: { login: string; signup: string }
  /** Order and labels of the cross-domain language switcher. */
  languageSwitcher: { locale: Locale; label: string }[]
  strings: Record<string, string>
  /** External profiles used by JSON-LD sameAs and the footer. */
  social: { label: string; href: string; icon: string }[]
  contact: { email: string; phones: { label: string; number: string; icon?: string }[] }
  /** Whether this locale is the x-default for hreflang. */
  isDefault: boolean
  /**
   * During the migration, links to pages that are not ported yet point here (the live WordPress site).
   * Remove once every page of the locale is ported; links then must resolve internally.
   */
  legacyOrigin?: string
}
