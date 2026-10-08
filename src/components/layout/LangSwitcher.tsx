import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { sites } from '~/i18n/sites'
import { localeSwitchHref } from '~/i18n/switch'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'

export interface LangSwitcherProps {
  /** locale -> locale-free path of this page's translations (from the hreflang map). */
  alternates?: Partial<Record<string, string>>
  className?: string
  /** Side the list opens towards. */
  align?: 'left' | 'right'
}

/**
 * Language menu: a button with the current code ("EN") that opens the other languages on hover, click or
 * keyboard. Links go to the other locale's TLD in production and to /<locale>/... in previews
 * (localeSwitchHref). Plain <a>: changing language is a full document change, not a client navigation.
 */
export function LangSwitcher({ alternates = {}, className, align = 'right' }: LangSwitcherProps) {
  const site = useSite()
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  // A click right after a hover opened the list keeps it open instead of toggling it shut.
  const hovered = useRef(false)
  const current = site.languageSwitcher.find((l) => l.locale === site.locale)

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

  return (
    <nav aria-label="Language" className={cn('relative flex h-full items-center', className)}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: hover intent only; the button opens it for keyboard and touch */}
      <div
        ref={wrap}
        className="relative flex h-full items-center"
        // Hover opens it for a mouse only: on touch a tap would fire enter and click together and close it again.
        onPointerEnter={(e) => {
          if (e.pointerType !== 'mouse') return
          hovered.current = true
          setOpen(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== 'mouse') return
          hovered.current = false
          setOpen(false)
        }}
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false)
        }}
      >
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[14px] font-semibold text-muted hover:text-ink"
          aria-expanded={open}
          aria-controls={id}
          aria-label={`Language: ${current?.label ?? site.locale.toUpperCase()}`}
          onClick={() => {
            if (hovered.current) {
              hovered.current = false
              setOpen(true)
            } else setOpen((v) => !v)
          }}
        >
          {current?.label ?? site.locale.toUpperCase()}
          <Icon
            name="chevron-down"
            size={12}
            className={cn('transition-transform', open && 'rotate-180')}
          />
        </button>
        <ul
          id={id}
          className={cn(
            'absolute top-full z-50 min-w-[180px] rounded-ui border border-line bg-white py-2 shadow-float',
            align === 'right' ? 'right-0' : 'left-0',
            open ? 'block' : 'hidden',
          )}
        >
          {site.languageSwitcher
            .filter(({ locale }) => locale !== site.locale)
            .map(({ locale, label }) => {
              const target = sites[locale]
              return (
                <li key={locale}>
                  <a
                    href={localeSwitchHref(locale, alternates[locale] ?? '/')}
                    hrefLang={target.lang}
                    lang={target.lang}
                    aria-label={`${label} – ${target.siteName}`}
                    className="flex items-center justify-between gap-4 px-4 py-2 text-[14px] font-medium text-ink hover:bg-surface"
                  >
                    <span>{target.siteName}</span>
                    <span className="text-muted">{label}</span>
                  </a>
                </li>
              )
            })}
        </ul>
      </div>
    </nav>
  )
}
