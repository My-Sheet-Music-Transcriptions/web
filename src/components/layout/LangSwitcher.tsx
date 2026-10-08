import { Fragment } from 'react'
import { sites } from '~/i18n/sites'
import { localeSwitchHref } from '~/i18n/switch'
import { cn } from '~/lib/cn'
import { useSite } from '~/site'

export interface LangSwitcherProps {
  /** translationKey of the current page: links go to the page's translation when one exists. */
  translationKey?: string
  /** locale -> locale-free path of this page's translations (from the hreflang map). */
  alternates?: Partial<Record<string, string>>
  className?: string
  tone?: 'dark' | 'light'
  /** Tighter separators for the phone header. */
  compact?: boolean
}

/**
 * "EN | ES | FR | DE | JP" switcher; the current locale is highlighted in orange. Links go to the other
 * locale's TLD in production and to /<locale>/... in previews (localeSwitchHref). Plain <a>: changing
 * language is a full document change (<html lang>, strings), not a client-side navigation.
 */
export function LangSwitcher({
  alternates = {},
  className,
  tone = 'dark',
  compact,
}: LangSwitcherProps) {
  const site = useSite()
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
        const href = localeSwitchHref(locale, alternates[locale] ?? '/')
        const current = locale === site.locale
        return (
          <Fragment key={locale}>
            {i > 0 && (
              <span aria-hidden="true" className={cn('opacity-60', compact ? 'px-px' : 'px-1')}>
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
                current ? (tone === 'light' ? 'text-accent-light' : 'text-accent-deep') : '',
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
