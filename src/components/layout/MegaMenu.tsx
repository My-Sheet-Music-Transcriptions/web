import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { NavItem } from '~/i18n/types'
import { cn } from '~/lib/cn'
import { navItemClass } from './nav-styles'

/**
 * "Services & Samples" drop-down: a button that opens on hover, focus or Enter/Space and lists
 * every service group in columns. Escape closes it and returns focus to the trigger.
 */
export function MegaMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hide = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        wrap.current?.querySelector('button')?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open])

  const groups = item.groups ?? []
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover intent only; keyboard users open the menu with the button below
    <div
      ref={wrap}
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) hide()
      }}
    >
      <button
        type="button"
        className={cn(navItemClass, open && 'bg-surface text-ink')}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        {item.label}
        <Icon
          name="chevron-down"
          size={14}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>
      {/* The padding keeps the pointer inside the wrapper while it crosses from the trigger to the panel. */}
      <div
        id={id}
        className={cn(
          'absolute left-1/2 top-full z-50 w-[min(1120px,calc(100vw-40px))] -translate-x-1/2 pt-3',
          open ? 'block' : 'hidden',
        )}
      >
        <div className="rounded-card border border-line bg-white p-8 shadow-float">
          <div className="grid grid-cols-4 gap-x-10 gap-y-8">
            {groups.map((g) => (
              <div key={g.title}>
                {g.href && g.href !== '#' ? (
                  <SmartLink
                    href={g.href}
                    className="block text-[15px] font-bold text-ink hover:text-primary"
                  >
                    {g.title}
                  </SmartLink>
                ) : (
                  <p className="text-[15px] font-bold text-ink">{g.title}</p>
                )}
                {g.links.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {g.links.map((l) => (
                      <li key={l.label}>
                        <SmartLink
                          href={l.href}
                          className="block text-small text-charcoal hover:text-primary"
                        >
                          {l.label}
                        </SmartLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
            <p className="text-small text-muted">Every instrument, genre and format.</p>
            <SmartLink
              href={item.href}
              className="inline-flex items-center gap-1.5 text-small font-bold text-primary hover:underline"
            >
              {item.label}
              <Icon name="arrow-right" size={14} />
            </SmartLink>
          </div>
        </div>
      </div>
    </div>
  )
}

/** @deprecated use SmartLink */
export const NavLink = SmartLink
