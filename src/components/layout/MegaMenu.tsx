import * as m from 'motion/react-m'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { NavItem } from '~/i18n/types'
import { cn } from '~/lib/cn'
import { navItemActive, navItemClass } from './nav-styles'

/** Panel drops 6px into place; its columns follow 40ms apart. Closing is quicker than opening. */
const panel = {
  closed: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.14 },
    transitionEnd: { visibility: 'hidden' },
  },
  open: {
    opacity: 1,
    y: 0,
    visibility: 'visible',
    transition: { duration: 0.22, staggerChildren: 0.04 },
  },
} as const
const column = { closed: { opacity: 0, y: 8 }, open: { opacity: 1, y: 0 } }

/**
 * The Services panel: a full-width sheet under the header with three short columns of links and the
 * highlighted destinations on the right, animated in and out with Motion variants. Opens on hover (mouse),
 * on Enter/Space/ArrowDown; Escape closes it and returns focus to the trigger.
 */
export function MegaMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // A click right after a hover opened the panel keeps it open instead of toggling it shut.
  const hovered = useRef(false)

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

  const menu = item.menu
  if (!menu) return null
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover intent only; keyboard users open the menu with the button below
    <div
      ref={wrap}
      className="h-full"
      // Hover is for a mouse only: on a touch tablet a tap would fire enter and click together and close it again.
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        hovered.current = true
        show()
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        hovered.current = false
        hide()
      }}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) hide()
      }}
    >
      <button
        type="button"
        className={cn(navItemClass, open && navItemActive)}
        aria-expanded={open}
        aria-controls={id}
        aria-haspopup="true"
        onClick={() => {
          if (hovered.current) {
            hovered.current = false
            setOpen(true)
          } else setOpen((v) => !v)
        }}
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
          size={12}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>
      {/* Always rendered (its links are in the HTML for crawlers); hidden once the closing animation ends. */}
      <m.div
        id={id}
        className={cn(
          'absolute inset-x-0 top-full z-50 border-b border-line bg-white shadow-float',
        )}
        variants={panel}
        initial={false}
        animate={open ? 'open' : 'closed'}
      >
        <div className="container-content grid grid-cols-[1.1fr_1.1fr_1fr_1.15fr] gap-12 pb-10 pt-9">
          {menu.columns.map((col) => (
            <m.div key={col.title} variants={column}>
              <p className="eyebrow text-muted">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink
                      href={l.href}
                      className="text-[15px] font-medium text-ink hover:text-primary"
                    >
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </m.div>
          ))}
          <m.div variants={column} className="space-y-6 border-l border-line pl-10">
            {menu.features.map((f) => (
              <div key={f.title}>
                <p className="text-[17px] font-bold text-ink">{f.title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-charcoal">{f.body}</p>
                <SmartLink
                  href={f.href}
                  className="group mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-primary hover:underline"
                >
                  {f.cta}
                  <Icon
                    name="arrow-right"
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </SmartLink>
              </div>
            ))}
          </m.div>
        </div>
      </m.div>
    </div>
  )
}

/** @deprecated use SmartLink */
export const NavLink = SmartLink
