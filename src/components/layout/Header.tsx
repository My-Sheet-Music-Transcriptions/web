import { type ReactNode, useEffect, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { BrandLogo, Link } from '~/content/types'
import type { NavItem } from '~/i18n/types'
import { cn } from '~/lib/cn'
import { Arrowed } from './Arrowed'
import { Logo } from './Logo'
import { MegaMenu } from './MegaMenu'
import { type MenuLabels, MobileNav } from './MobileNav'

export interface HeaderProps {
  /** The brand lockup, linked home. */
  logo: BrandLogo
  /** The main navigation (one level of groups opens the mega-menu). */
  nav: NavItem[]
  /** The orange button ("Request your sheet music"). */
  cta: Link
  /** The menus' words for screen readers and the phone menu. */
  labels: MenuLabels
  /** The hub's login and sign-up links, in the phone menu. */
  account: { login: Link; signup: Link }
  /** What sits beside the menu button on phones: the language switcher. */
  languages?: ReactNode
  /** On the homepage the logo waits for the first scroll from tablets up (the hero carries the lockup). */
  home?: boolean
}

/**
 * Sticky white header: logo, main navigation with one mega-menu, orange CTA from `nav` (1400px, where they fit
 * on one line), the phone menu below. On the homepage the logo fades in only once the page scrolls, from
 * tablets up (the hero carries the lockup), as on the live site; its slot stays so the navigation does not move.
 */
export function Header({ logo, nav, cta, labels, account, languages, home = false }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow',
        scrolled && 'shadow-[0_2px_12px_rgba(0,0,0,0.08)]',
      )}
    >
      <div className="mx-auto flex h-[57px] max-w-[1440px] items-center justify-between gap-4 px-4 nav:h-[71px] nav:px-5">
        <Logo
          logo={logo}
          width={183}
          priority
          className={cn(
            'w-[150px] transition-opacity duration-300 nav:ml-[10px] nav:w-[183px] [&_img]:h-auto [&_img]:w-full',
            home && !scrolled && 'md:pointer-events-none md:opacity-0',
          )}
        />

        <nav aria-label={labels.main} className="hidden nav:block">
          <ul className="flex items-center gap-[5px]">
            {nav.map((item) =>
              item.groups ? (
                <li key={item.label} className="relative">
                  <MegaMenu item={item} />
                </li>
              ) : (
                <li key={item.label}>
                  <SmartLink
                    data-live-colour=""
                    href={item.href}
                    className="block rounded px-[14px] py-[13px] text-[15px] leading-5 font-semibold text-secondary hover:text-[#f2893b] data-[status=active]:text-[#f2893b]"
                    activeOptions={{ exact: item.href === '/' }}
                  >
                    <Arrowed label={item.label} />
                  </SmartLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="hidden nav:block">
          <Button asChild>
            <SmartLink href={cta.href}>{cta.label}</SmartLink>
          </Button>
        </div>

        <div className="flex items-center gap-3 nav:hidden">
          {languages}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={labels.menu}
            onClick={() => setOpen(true)}
          >
            <Icon name="fa-bars" size={24} />
          </button>
        </div>
      </div>
      <MobileNav
        open={open}
        onClose={() => setOpen(false)}
        nav={nav}
        cta={cta}
        labels={labels}
        account={account}
      />
    </header>
  )
}
