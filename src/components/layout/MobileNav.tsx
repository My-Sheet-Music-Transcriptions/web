import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/primitives/Button'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import { nav } from '~/content/en/data/nav'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'

/** Phone menu (dialog): a full-height white sheet with the four items, Services expandable, then the call to action. */
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
  const row =
    'flex w-full items-center justify-between border-b border-line py-4 text-[17px] font-semibold text-ink'
  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={site.strings.closeMenu}
        className="absolute inset-0 bg-navy-deep/40"
        onClick={onClose}
        tabIndex={-1}
      />
      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={site.strings.menu}
        className="absolute inset-y-0 right-0 flex w-[min(400px,100vw)] flex-col bg-white"
      >
        <div className="flex h-16 items-center justify-between border-b border-line pl-5 pr-2">
          <span className="eyebrow text-muted">{site.strings.menu}</span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center"
            aria-label={site.strings.closeMenu}
            onClick={onClose}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        <nav aria-label="Main" className="flex-1 overflow-y-auto px-5 pb-6">
          <ul>
            {nav.map((item) => (
              <li key={item.label}>
                {item.menu ? (
                  <>
                    <button
                      type="button"
                      className={cn(row, 'text-left')}
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
                      <div className="space-y-6 border-b border-line py-5">
                        {item.menu.columns.map((col) => (
                          <div key={col.title}>
                            <p className="eyebrow text-muted">{col.title}</p>
                            <ul className="mt-3 space-y-2.5">
                              {col.links.map((l) => (
                                <li key={l.label}>
                                  <SmartLink
                                    href={l.href}
                                    className="text-[15px] font-medium text-ink"
                                    onClick={onClose}
                                  >
                                    {l.label}
                                  </SmartLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        {item.menu.features.map((f) => (
                          <SmartLink
                            key={f.title}
                            href={f.href}
                            className="flex items-center gap-1.5 text-[15px] font-semibold text-primary"
                            onClick={onClose}
                          >
                            {f.title}
                            <Icon name="arrow-right" size={14} />
                          </SmartLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <SmartLink href={item.href} className={row} onClick={onClose}>
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
          <div className="mt-4 flex justify-center gap-6 text-small font-semibold">
            <a href={site.hub.login} className="text-ink">
              {site.strings.login}
            </a>
            <a href={site.hub.signup} className="text-ink">
              {site.strings.signup}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
