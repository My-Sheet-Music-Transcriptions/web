import { Fragment } from 'react'
import { sites } from '~/i18n/sites'
import { cn } from '~/lib/cn'
import { site } from '~/site'

export interface LangSwitcherProps {
  /** translationKey of the current page: links go to the page's translation when one exists. */
  translationKey?: string
  alternates?: Partial<Record<string, string>>
  className?: string
  tone?: 'dark' | 'light'
}

/** "EN | ES | FR | DE | JP" cross-domain switcher; the current locale is highlighted in orange. */
export function LangSwitcher({ alternates = {}, className, tone = 'dark' }: LangSwitcherProps) {
  return (
    <nav
      aria-label="Language"
      className={cn(
        'flex items-center text-small',
        tone === 'light' ? 'text-white' : 'text-ink',
        className,
      )}
    >
      {site.languageSwitcher.map(({ locale, label }, i) => {
        const target = sites[locale]
        const href = alternates[locale] ?? `${target.domain}/`
        const current = locale === site.locale
        return (
          <Fragment key={locale}>
            {i > 0 && (
              <span aria-hidden="true" className="px-1 opacity-60">
                |
              </span>
            )}
            <a
              href={href}
              hrefLang={target.lang}
              lang={target.lang}
              aria-current={current ? 'true' : undefined}
              aria-label={`${label} – ${target.siteName}`}
              className={cn(
                'rounded px-0.5 font-semibold hover:underline',
                current ? 'text-accent-hover' : '',
              )}
            >
              {label}
            </a>
          </Fragment>
        )
      })}
    </nav>
  )
}
