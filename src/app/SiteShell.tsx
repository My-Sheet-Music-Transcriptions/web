import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { brandLogo } from '~/assets/brand'
import { flagPicture } from '~/assets/flags'
import { ConsentBanner } from '~/components/layout/ConsentBanner'
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header'
import { LangSwitcher, type LanguageLink } from '~/components/layout/LangSwitcher'
import { TopBar } from '~/components/layout/TopBar'
import { footerFor, navFor } from '~/content/data'
import type { BrandLogo } from '~/content/types'
import { stripLocale } from '~/i18n/routing'
import { sites } from '~/i18n/sites'
import { localeSwitchHref } from '~/i18n/switch'
import type { SiteConfig } from '~/i18n/types'
import { fill } from '~/lib/strings'
import { useSite } from '~/site'

/**
 * The app's side of the site chrome: it reads the locale's config (src/i18n/sites/<locale>.ts), its data
 * (content/<locale>/data/{nav,footer}.ts) and the brand files, and passes them to the layout components,
 * which hold no words or pictures of their own. The design-system bundle mounts these same pieces.
 */

/** The brand lockup of the site's locale with its words. */
export function siteLogo(site: SiteConfig): BrandLogo {
  return {
    image: brandLogo(site.logo),
    alt: fill(site.strings.brand.logoAlt, { brand: site.brand }),
    label: fill(site.strings.brand.home, { brand: site.brand }),
  }
}

/** The language switcher's links: each sister site, or the page's translation when one is known. */
function languageLinks(site: SiteConfig, alternates: Partial<Record<string, string>> = {}) {
  return site.languageSwitcher.map(
    ({ locale, label }): LanguageLink => ({
      label,
      href: localeSwitchHref(locale, alternates[locale] ?? '/'),
      lang: sites[locale].lang,
      title: `${label} – ${sites[locale].siteName}`,
      current: locale === site.locale,
    }),
  )
}

export function SiteTopBar() {
  const site = useSite()
  const s = site.strings.nav
  return (
    <TopBar
      login={{ label: s.login, href: site.hub.login }}
      signup={{ label: s.signup, href: site.hub.signup }}
    >
      <LangSwitcher label={s.language} items={languageLinks(site)} className="ml-6 w-[166px]" />
    </TopBar>
  )
}

export function SiteHeader({ home = false }: { home?: boolean }) {
  const site = useSite()
  const s = site.strings.nav
  return (
    <Header
      logo={siteLogo(site)}
      nav={navFor(site.locale)}
      cta={{ label: s.requestCta, href: site.routes.contactAnchor }}
      labels={{ main: s.main, menu: s.menu, closeMenu: s.closeMenu, allServices: s.allServices }}
      account={{
        login: { label: s.login, href: site.hub.login },
        signup: { label: s.signup, href: site.hub.signup },
      }}
      languages={
        <LangSwitcher label={s.language} items={languageLinks(site)} className="text-[13px]" />
      }
      home={home}
    />
  )
}

export function SiteFooter() {
  const site = useSite()
  return (
    <Footer
      headings={site.strings.footer}
      data={footerFor(site.locale)}
      languages={site.languageSwitcher
        .filter((l) => l.locale !== site.locale)
        .map((l) => ({
          href: localeSwitchHref(l.locale),
          lang: sites[l.locale].lang,
          label: `${site.strings.footer.viewSiteIn} ${l.name}`,
          flag: flagPicture(l.locale),
        }))}
      email={site.contact.email}
      phones={site.contact.phones}
      social={site.social}
    />
  )
}

export function SiteConsent() {
  const s = useSite().strings.cookies
  return (
    <ConsentBanner
      title={s.title}
      body={s.body}
      accept={s.accept}
      deny={s.deny}
      links={[
        { label: s.cookiesPolicy, href: '/cookies' },
        { label: s.privacyPolicy, href: '/gdpr' },
      ]}
    />
  )
}

/** Site chrome around every page: skip link, top bar, sticky header, footer, consent banner. */
export function SiteShell({ children }: { children: ReactNode }) {
  const site = useSite()
  const home = useRouterState({
    select: (s) => stripLocale(s.location.publicHref.split(/[?#]/)[0] ?? '/').path === '/',
  })
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-pill focus:bg-primary focus:px-5 focus:py-3 focus:text-white focus:font-bold"
      >
        {site.strings.nav.skipToContent}
      </a>
      <SiteTopBar />
      <SiteHeader home={home} />
      {children}
      <SiteFooter />
      <SiteConsent />
    </>
  )
}
