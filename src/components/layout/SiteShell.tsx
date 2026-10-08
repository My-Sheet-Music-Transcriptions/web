import type { ReactNode } from 'react'
import { MotionProvider } from '~/components/motion/MotionProvider'
import { useSite } from '~/site'
import { ConsentBanner } from './ConsentBanner'
import { Footer } from './Footer'
import { Header } from './Header'

/** Site chrome around every page: motion provider, skip link, sticky header, footer, consent banner. */
export function SiteShell({ children }: { children: ReactNode }) {
  const site = useSite()
  return (
    <MotionProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-ui focus:bg-primary focus:px-5 focus:py-3 focus:text-white focus:font-semibold"
      >
        {site.strings.skipToContent}
      </a>
      <Header />
      {children}
      <Footer />
      <ConsentBanner />
    </MotionProvider>
  )
}
