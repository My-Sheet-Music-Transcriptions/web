import * as m from 'motion/react-m'
import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from '~/components/primitives/Icon'
import { sites } from '~/i18n/sites'
import { localeSwitchHref } from '~/i18n/switch'
import type { Locale } from '~/i18n/types'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'

export interface LangSwitcherProps {
  /** locale -> locale-free path of this page's translations (from the hreflang map). */
  alternates?: Partial<Record<string, string>>
  className?: string
}

/** A language's name in that language ("Español", "日本語"), capitalised. */
export function nativeName(locale: Locale): string {
  const lang = sites[locale].lang
  const name = new Intl.DisplayNames([lang], { type: 'language' }).of(lang) ?? lang
  return name.charAt(0).toLocaleUpperCase(lang) + name.slice(1)
}

/** The bare host of a locale's site ("mistranscripcionesmusicales.com"). */
export function siteHost(locale: Locale): string {
  return new URL(sites[locale].domain).hostname.replace(/^www\./, '')
}

// Hidden (not just transparent) once closed, so it never reads as faint text or takes focus.
const list = {
  closed: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.14 },
    transitionEnd: { visibility: 'hidden' },
  },
  open: { opacity: 1, y: 0, visibility: 'visible', transition: { duration: 0.22 } },
} as const

/**
 * Language menu: a globe and the current language's own name ("English"; the globe alone on phones)
 * open the other languages, each by its own name with its site's address. Opens on hover (mouse),
 * click, tap or keyboard; Escape closes it. Links go to the other locale's TLD in production and to
 * /<locale>/... in previews (localeSwitchHref). Plain <a>: a language change is a full document change.
 */
export function LangSwitcher({ alternates = {}, className }: LangSwitcherProps) {
  const site = useSite()
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  // A click right after a hover opened the list keeps it open instead of toggling it shut.
  const hovered = useRef(false)
  const current = nativeName(site.locale)

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
          className="inline-flex h-11 items-center gap-1.5 text-[14px] font-semibold text-charcoal transition-colors hover:text-ink"
          aria-expanded={open}
          aria-controls={id}
          aria-label={`Language: ${current}`}
          onClick={() => {
            if (hovered.current) {
              hovered.current = false
              setOpen(true)
            } else setOpen((v) => !v)
          }}
        >
          <Icon name="globe" size={20} className="lg:size-[18px]" />
          <span className="hidden sm:inline">{current}</span>
          <Icon
            name="chevron-down"
            size={12}
            className={cn('hidden transition-transform sm:block', open && 'rotate-180')}
          />
        </button>
        <m.ul
          id={id}
          className={cn(
            'absolute right-[-12px] top-full z-50 w-[300px] max-w-[calc(100vw-24px)] rounded-ui border border-line bg-white p-2 shadow-float',
          )}
          variants={list}
          initial={false}
          animate={open ? 'open' : 'closed'}
        >
          {site.languageSwitcher.map(({ locale }) => {
            const target = sites[locale]
            const isCurrent = locale === site.locale
            return (
              <li key={locale}>
                <a
                  href={localeSwitchHref(locale, alternates[locale] ?? '/')}
                  hrefLang={target.lang}
                  lang={target.lang}
                  aria-current={isCurrent ? 'true' : undefined}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3 rounded-[4px] px-3 py-2.5 transition-colors hover:bg-surface"
                >
                  <span
                    className={cn(
                      'text-[15px] font-semibold',
                      isCurrent ? 'text-primary' : 'text-ink',
                    )}
                  >
                    {nativeName(locale)}
                  </span>
                  {isCurrent ? (
                    <Icon name="check" size={16} className="row-span-2 text-primary" />
                  ) : (
                    <span className="row-span-2" />
                  )}
                  <span className="text-[12px] text-muted">{siteHost(locale)}</span>
                </a>
              </li>
            )
          })}
        </m.ul>
      </div>
    </nav>
  )
}
