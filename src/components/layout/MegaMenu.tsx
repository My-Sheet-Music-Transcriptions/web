import * as m from 'motion/react-m'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { closedPanel, dropDown, dropSide } from '~/components/primitives/Motion'
import { SmartLink } from '~/components/primitives/SmartLink'
import type { NavItem } from '~/i18n/types'
import { cn } from '~/lib/cn'

type Group = NonNullable<NavItem['groups']>[number]

const trigger = 'rounded-sm py-3 text-small font-semibold text-ink group-hover:text-accent'
const row =
  'flex w-full items-center gap-4 whitespace-nowrap py-4 text-left text-small font-semibold text-ink hover:text-primary'

/**
 * The drop-down of a main-menu item with groups ("Services & Samples"), as on the live site: the item links
 * to its page, and its caret button opens, on hover, focus or Enter/Space, a list of the groups under it;
 * a group with links opens them beside its row on hover or focus. Escape closes it and returns focus to the
 * caret; following one of its links closes it too. The links stay in the page while closed, so they are
 * prerendered, hidden (`closedPanel`).
 */
export function MegaMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setOpen(false)
    setActive(null)
  }, [])
  const show = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hide = () => {
    closeTimer.current = setTimeout(close, 120)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        wrap.current?.querySelector('button')?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [open, close])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover intent only; keyboard users open the menu with the button below
    <div
      ref={wrap}
      className="group flex items-center"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget as Node)) hide()
      }}
    >
      <SmartLink
        data-live-colour=""
        href={item.href}
        className={cn(trigger, 'pr-2 pl-3 data-[status=active]:text-accent', open && 'text-accent')}
      >
        {item.label}
      </SmartLink>
      <button
        type="button"
        data-live-colour=""
        className={cn(trigger, 'inline-flex items-center pr-3', open && 'text-accent')}
        aria-label={item.label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        <Icon
          name="fa-caret-down"
          size={14}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>
      <m.ul
        id={id}
        initial={false}
        animate={open ? 'open' : 'closed'}
        variants={dropDown}
        onClick={(e) => {
          // A link navigates inside the app while the pointer still rests on the menu: close it, and drop
          // the focus the link keeps so the panel does not open again on focus.
          const link = (e.target as Element).closest('a')
          if (!link) return
          close()
          link.blur()
        }}
        className={cn(
          'absolute top-full left-0 z-50 w-max min-w-72 rounded-card border border-line bg-white shadow-float',
          !open && closedPanel,
        )}
      >
        {(item.groups ?? []).map((g) => (
          <MenuGroup
            key={g.title}
            group={g}
            open={active === g.title}
            onOpen={() => setActive(g.title)}
            onToggle={() => setActive(active === g.title ? null : g.title)}
          />
        ))}
      </m.ul>
    </div>
  )
}

/** One row of the drop-down: the group's page, and its own links beside it when it has some. */
function MenuGroup({
  group: g,
  open,
  onOpen,
  onToggle,
}: {
  group: Group
  open: boolean
  onOpen: () => void
  onToggle: () => void
}) {
  const id = useId()
  const sub = g.links.length > 0
  const href = g.href && g.href !== '#' ? g.href : undefined
  const label = (
    <>
      {g.title}
      {sub ? <Icon name="fa-caret-right" size={14} className="shrink-0" /> : null}
    </>
  )
  const expand = sub ? { 'aria-expanded': open, 'aria-controls': id } : {}
  return (
    <li
      className="relative border-b border-line last:border-b-0"
      onMouseEnter={onOpen}
      onFocus={onOpen}
    >
      {href ? (
        <SmartLink href={href} className={cn(row, 'pr-6 pl-8', open && 'text-primary')} {...expand}>
          {label}
        </SmartLink>
      ) : sub ? (
        <button
          type="button"
          className={cn(row, 'pr-6 pl-8', open && 'text-primary')}
          onClick={onToggle}
          {...expand}
        >
          {label}
        </button>
      ) : (
        <span className={cn(row, 'pr-6 pl-8')}>{label}</span>
      )}
      {sub ? (
        <m.ul
          id={id}
          initial={false}
          animate={open ? 'open' : 'closed'}
          variants={dropSide}
          className={cn(
            'absolute top-0 left-full w-max min-w-48 rounded-card border border-line bg-white shadow-float',
            !open && closedPanel,
          )}
        >
          {g.links.map((l) => (
            <li key={l.label} className="border-b border-line last:border-b-0">
              <SmartLink href={l.href} className={cn(row, 'pr-8 pl-10')}>
                {l.label}
              </SmartLink>
            </li>
          ))}
        </m.ul>
      ) : null}
    </li>
  )
}
