import { useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { stripLocale } from '~/i18n/routing'
import { useSite } from '~/site'
import { ConsentBanner } from './ConsentBanner'
import { Footer } from './Footer'
import { Header } from './Header'
import { TopBar } from './TopBar'

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
        {site.strings.skipToContent}
      </a>
      <TopBar />
      <Header home={home} />
      {children}
      <Footer />
      <ConsentBanner />
    </>
  )
}
