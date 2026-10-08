import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import { nav } from '~/content/en/data/nav'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'

/** Right-hand drawer (dialog) with collapsible service groups, the CTA and the hub links. */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const site = useSite()
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
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={site.strings.closeMenu}
        className="absolute inset-0 bg-navy-deep/50 backdrop-blur-[2px]"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={site.strings.menu}
        className="absolute inset-y-0 right-0 flex w-[min(380px,92vw)] flex-col rounded-l-[28px] bg-white shadow-float"
      >
        <div className="flex h-16 items-center justify-between pl-6 pr-3">
          <span className="eyebrow text-muted">{site.strings.menu}</span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill hover:bg-surface"
            aria-label={site.strings.closeMenu}
            onClick={onClose}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 pb-6">
          <ul className="space-y-0.5">
            {nav.map((item) => (
              <li key={item.label}>
                {item.groups ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[17px] font-semibold text-ink hover:bg-surface"
                      aria-expanded={expanded === item.label}
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    >
                      {item.label}
                      <Icon
                        name="chevron-down"
                        size={18}
                        className={cn(
                          'text-muted transition-transform',
                          expanded === item.label && 'rotate-180',
                        )}
                      />
                    </button>
                    {expanded === item.label && (
                      <ul className="mb-2 ml-3 border-l-2 border-line pb-1 pl-3">
                        <li>
                          <SmartLink
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-small font-bold text-primary"
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
                                className="block rounded-lg px-3 py-1.5 text-small font-bold text-ink"
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
                                      className="block rounded-lg px-3 py-1.5 text-small text-charcoal"
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
                    className="block rounded-xl px-3 py-3 text-[17px] font-semibold text-ink hover:bg-surface"
                    onClick={onClose}
                  >
                    {item.label}
                  </SmartLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-line p-5">
          <Button asChild size="block">
            <SmartLink href={site.routes.contactAnchor} onClick={onClose}>
              {site.strings.requestCta}
            </SmartLink>
          </Button>
          <div className="mt-4 flex justify-center gap-6 text-small font-medium">
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
      </div>
    </div>
  )
}
