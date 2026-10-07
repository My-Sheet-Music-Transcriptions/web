import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import { nav } from '~/content/en/data/nav'
import { cn } from '~/lib/cn'
import { site } from '~/site'

/** Full-screen mobile menu (dialog) with collapsible service groups. */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('button, a')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
      prev?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button
        type="button"
        aria-label={site.strings.closeMenu}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={site.strings.menu}
        className="absolute inset-y-0 right-0 flex w-[min(360px,90vw)] flex-col bg-white shadow-float"
      >
        <div className="flex h-[57px] items-center justify-between border-b border-line px-4">
          <span className="text-small font-bold uppercase text-ink">{site.strings.menu}</span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded"
            aria-label={site.strings.closeMenu}
            onClick={onClose}
          >
            <Icon name="close" size={24} />
          </button>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 py-2">
          <ul>
            {nav.map((item) => (
              <li key={item.label} className="border-b border-line last:border-0">
                {item.groups ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-3.5 text-left text-body font-semibold text-ink"
                      aria-expanded={expanded === item.label}
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    >
                      {item.label}
                      <Icon
                        name="chevron-down"
                        size={18}
                        className={cn(
                          'transition-transform',
                          expanded === item.label && 'rotate-180',
                        )}
                      />
                    </button>
                    {expanded === item.label && (
                      <ul className="pb-3 pl-3">
                        <li>
                          <SmartLink
                            href={item.href}
                            className="block px-3 py-2 text-small font-bold text-primary"
                            onClick={onClose}
                          >
                            All services & samples
                          </SmartLink>
                        </li>
                        {item.groups.map((g) => (
                          <li key={g.title} className="mt-1">
                            {g.href && g.href !== '#' ? (
                              <SmartLink
                                href={g.href}
                                className="block px-3 py-1.5 text-small font-bold text-ink"
                                onClick={onClose}
                              >
                                {g.title}
                              </SmartLink>
                            ) : (
                              <p className="px-3 py-1.5 text-small font-bold text-ink">{g.title}</p>
                            )}
                            {g.links.length > 0 && (
                              <ul className="pl-3">
                                {g.links.map((l) => (
                                  <li key={l.label}>
                                    <SmartLink
                                      href={l.href}
                                      className="block px-3 py-1.5 text-small text-[#444]"
                                      onClick={onClose}
                                    >
                                      {l.label}
                                    </SmartLink>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <SmartLink
                    href={item.href}
                    className="block px-3 py-3.5 text-body font-semibold text-ink"
                    onClick={onClose}
                  >
                    {item.label}
                  </SmartLink>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 px-3">
            <Button asChild size="block">
              <a href={site.routes.contactAnchor} onClick={onClose}>
                {site.strings.requestCta}
              </a>
            </Button>
            <div className="flex justify-center gap-6 text-small">
              <a href={site.hub.login} className="inline-flex items-center gap-1.5 text-ink">
                <Icon name="users" size={16} className="text-primary" />
                {site.strings.login}
              </a>
              <a href={site.hub.signup} className="inline-flex items-center gap-1.5 text-ink">
                <Icon name="user-plus" size={16} className="text-primary" />
                {site.strings.signup}
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
