import { Fragment } from 'react'
import { cn } from '~/lib/cn'

/** One language of the switcher: its short label, where it goes and its full name for screen readers. */
export interface LanguageLink {
  /** "EN", "ES"… */
  label: string
  href: string
  /** BCP-47 language of the target ("es"). */
  lang: string
  /** Accessible name ("ES – Mis Transcripciones Musicales"). */
  title: string
  /** The language of the page being shown. */
  current?: boolean
}

export interface LangSwitcherProps {
  /** Accessible name of the navigation ("Language"). */
  label: string
  items: LanguageLink[]
  className?: string
  tone?: 'dark' | 'light'
}

/**
 * "EN | ES | FR | DE | JP" switcher; the current language is highlighted in orange. Plain <a>: changing
 * language is a full document change (<html lang>, strings), not a client-side navigation.
 */
export function LangSwitcher({ label, items, className, tone = 'dark' }: LangSwitcherProps) {
  return (
    <nav
      aria-label={label}
      className={cn(
        'flex items-center text-small leading-[21px]',
        tone === 'light' ? 'text-white' : 'text-ink',
        className,
      )}
    >
      {items.map((item, i) => (
        <Fragment key={item.lang}>
          {i > 0 && (
            <span aria-hidden="true" className="px-1">
              |
            </span>
          )}
          <a
            href={item.href}
            hrefLang={item.lang}
            lang={item.lang}
            aria-current={item.current ? 'true' : undefined}
            data-live-colour={item.current ? '' : undefined}
            aria-label={item.title}
            className={cn(
              'rounded hover:underline',
              item.current ? 'text-accent' : tone === 'light' ? '' : 'text-[#575757]',
            )}
          >
            {item.label}
          </a>
        </Fragment>
      ))}
    </nav>
  )
}
