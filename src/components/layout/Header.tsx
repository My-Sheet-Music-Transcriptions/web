import { nav } from '@content/en/data/nav'
import { AnimatePresence } from 'motion/react'
import { useCallback, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import { useSite } from '~/site'
import { LangSwitcher } from './LangSwitcher'
import { Logo } from './Logo'
import { MegaMenu } from './MegaMenu'
import { MobileNav } from './MobileNav'
import { navItemActive, navItemClass } from './nav-styles'

/**
 * Sticky white header with a hairline under it: logo (home), four navigation items with the Services panel,
 * then the language menu, log in and the orange call to action. Phones get the logo, language and a menu
 * button that opens the drawer.
 */
export function Header() {
  const site = useSite()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="container-content flex h-16 items-center justify-between gap-5 lg:h-20 xl:gap-8">
          <Logo
            width={176}
            priority
            className="w-[132px] sm:w-[148px] lg:w-[150px] xl:w-[176px] [&_img]:h-auto [&_img]:w-full"
          />

          <nav aria-label="Main" className="hidden h-full lg:block">
            <ul className="flex h-full items-center gap-6 xl:gap-8">
              {nav.map((item) =>
                item.menu ? (
                  <li key={item.label} className="h-full">
                    <MegaMenu item={item} />
                  </li>
                ) : (
                  <li key={item.label} className="h-full">
                    <SmartLink
                      href={item.href}
                      className={navItemClass}
                      activeProps={{ className: navItemActive }}
                    >
                      {item.label}
                    </SmartLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex h-full items-center gap-3 lg:gap-5 xl:gap-6">
            <LangSwitcher />
            <a
              href={site.hub.login}
              className="hidden whitespace-nowrap text-[14px] font-semibold text-charcoal hover:text-ink xl:inline"
            >
              {site.strings.login}
            </a>
            <Button asChild className="hidden whitespace-nowrap lg:inline-flex">
              <SmartLink href={site.routes.contactAnchor}>{site.strings.requestCta}</SmartLink>
            </Button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={site.strings.menu}
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>{open && <MobileNav onClose={close} />}</AnimatePresence>
    </>
  )
}
