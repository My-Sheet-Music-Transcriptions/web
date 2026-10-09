export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ca'

export const LOCALES: readonly Locale[] = ['en', 'es', 'fr', 'de', 'ja', 'ca'] as const

export interface NavItem {
  label: string
  href: string
  /** Mega-menu groups shown on hover/focus; a group has a title and a list of links. */
  groups?: { title: string; href?: string; links: { label: string; href: string }[] }[]
}

/**
 * The words of the site chrome (top bar, header, menus, footer, consent banner, error and 404 pages), per
 * locale. Only the app (src/app) reads them and passes them to the layout components as props; pages pass
 * the words of their blocks themselves. `{name}` placeholders are filled with `fill()` (src/lib/strings).
 */
export interface Strings {
  nav: {
    login: string
    signup: string
    requestCta: string
    skipToContent: string
    menu: string
    closeMenu: string
    /** Accessible name of the main navigation. */
    main: string
    /** Accessible name of the language switcher. */
    language: string
    /** The link at the top of an expanded menu group on phones. */
    allServices: string
  }
  footer: {
    sitemap: string
    languages: string
    viewSiteIn: string
    services: string
    contactUs: string
    stayConnected: string
    aboutUs: string
    paymentSecurity: string
    compatibleWith: string
    providedBy: string
  }
  brand: {
    /** Accessible name of the logo link: `{brand}`. */
    home: string
    /** Alt text of the lockup: `{brand}`. */
    logoAlt: string
  }
  errorPage: { title: string; body: string; retry: string; home: string; back: string }
  notFound: { title: string; body: string; backHome: string }
  cookies: {
    title: string
    body: string
    accept: string
    deny: string
    cookiesPolicy: string
    privacyPolicy: string
  }
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
  /** Order, labels and names of the cross-domain language switcher (the footer lists them by name). */
  languageSwitcher: { locale: Locale; label: string; name: string }[]
  /** Every word the components show that is not content: typed, so a locale cannot miss one. */
  strings: Strings
  /** External profiles used by JSON-LD sameAs and the footer. */
  social: { label: string; href: string; icon: string }[]
  contact: {
    email: string
    phones: { label: string; number: string; icon?: string }[]
  }
  /** Whether this locale is the x-default for hreflang. */
  isDefault: boolean
  /**
   * During the migration, links to pages that are not ported yet point here (the live WordPress site).
   * Remove once every page of the locale is ported; links then must resolve internally.
   */
  legacyOrigin?: string
}
