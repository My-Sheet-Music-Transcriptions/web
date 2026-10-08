import { nav } from '@content/en/data/nav'
import { useEffect, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'
import { LangSwitcher } from './LangSwitcher'
import { Logo } from './Logo'
import { MegaMenu } from './MegaMenu'
import { MobileNav } from './MobileNav'

/** Sticky white header: logo, main navigation with one mega-menu, orange CTA. */
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
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow',
        scrolled && 'shadow-[0_2px_12px_rgba(0,0,0,0.08)]',
      )}
    >
      <div className="mx-auto flex h-[57px] max-w-[1440px] items-center justify-between gap-4 px-4 lg:h-[71px] lg:px-5">
        <Logo
          width={183}
          priority
          className="w-[150px] lg:w-[183px] [&_img]:h-auto [&_img]:w-full"
        />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) =>
              item.groups ? (
                <li key={item.label} className="relative">
                  <MegaMenu item={item} />
                </li>
              ) : (
                <li key={item.label}>
                  <SmartLink
                    href={item.href}
                    className="block rounded px-3 py-2 text-small font-semibold text-[#333] hover:text-accent-deep"
                    activeProps={{ className: 'text-accent-deep' }}
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
          <Button asChild>
            <SmartLink href={site.routes.contactAnchor}>{site.strings.requestCta}</SmartLink>
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LangSwitcher className="text-[13px]" />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded text-ink"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={site.strings.menu}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" size={28} />
          </button>
        </div>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
