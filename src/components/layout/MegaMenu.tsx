import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { NavItem } from '~/i18n/types'
import { cn } from '~/lib/cn'

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
        className={cn(
          'inline-flex items-center gap-1 rounded px-3 py-2 text-small font-semibold text-[#333] hover:text-accent-deep',
          open && 'text-accent-deep',
        )}
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
      <div
        id={id}
        className={cn(
          'absolute left-1/2 top-full z-50 w-[min(1100px,calc(100vw-40px))] -translate-x-1/2 rounded-b-card border border-line bg-white p-6 shadow-float',
          open ? 'block' : 'hidden',
        )}
      >
        <div className="grid grid-cols-4 gap-x-8 gap-y-6">
          {groups.map((g) => (
            <div key={g.title}>
              {g.href && g.href !== '#' ? (
                <SmartLink
                  href={g.href}
                  className="block text-small font-bold text-ink hover:text-accent-deep"
                >
                  {g.title}
                </SmartLink>
              ) : (
                <p className="text-small font-bold text-ink">{g.title}</p>
              )}
              {g.links.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <SmartLink
                        href={l.href}
                        className="block py-0.5 text-[13px] text-[#444] hover:text-accent-deep"
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
        <div className="mt-6 border-t border-line pt-4 text-right">
          <SmartLink
            href={item.href}
            className="text-small font-bold uppercase text-primary hover:underline"
          >
            {item.label} →
          </SmartLink>
        </div>
      </div>
    </div>
  )
}

/** @deprecated use SmartLink */
export const NavLink = SmartLink
