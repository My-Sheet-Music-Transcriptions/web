import { useEffect, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import { nav } from '~/content/en/data/nav'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'
import { LangSwitcher } from './LangSwitcher'
import { Logo } from './Logo'
import { MegaMenu } from './MegaMenu'
import { MobileNav } from './MobileNav'
import { navItemClass } from './nav-styles'

/** Sticky translucent header: logo, pill navigation with one mega-menu, orange CTA. */
export function Header() {
  const site = useSite()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[border-color,box-shadow]',
          scrolled
            ? 'border-line shadow-[0_1px_0_rgb(2_48_71/0.04),0_8px_24px_-12px_rgb(2_48_71/0.15)]'
            : 'border-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between gap-3 px-4 lg:h-[76px] xl:gap-5 xl:px-5 min-[1400px]:gap-6">
          <Logo
            width={176}
            priority
            className="w-[128px] sm:w-[148px] lg:w-[130px] xl:w-[150px] min-[1400px]:w-[176px] [&_img]:h-auto [&_img]:w-full"
          />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {nav.map((item) =>
                item.groups ? (
                  <li key={item.label} className="relative">
                    <MegaMenu item={item} />
                  </li>
                ) : (
                  <li key={item.label}>
                    <SmartLink
                      href={item.href}
                      className={navItemClass}
                      activeProps={{ className: 'text-primary' }}
                      activeOptions={{ exact: item.href === '/' }}
                    >
                      {item.label}
                    </SmartLink>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <Button
              asChild
              className="whitespace-nowrap lg:px-4 lg:py-2.5 lg:text-[13px] xl:px-5 xl:py-3 xl:text-[14px] min-[1400px]:px-6 min-[1400px]:py-3.5 min-[1400px]:text-[15px]"
            >
              <SmartLink href={site.routes.contactAnchor}>{site.strings.requestCta}</SmartLink>
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
            <LangSwitcher className="text-[12px] sm:text-[13px]" compact />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill text-ink hover:bg-surface"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={site.strings.menu}
              onClick={() => setOpen(true)}
            >
              <Icon name="menu" size={26} />
            </button>
          </div>
        </div>
      </header>
      {/* Outside the header: its backdrop blur would make it the containing block of the fixed drawer. */}
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  )
}
