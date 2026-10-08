import montserratWoff2 from '@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2?url'
import { resolveEntry } from '~/content'
import hreflangMap from '~/i18n/hreflang.generated.json'
import { DEFAULT_LOCALE } from '~/i18n/routing'
import { sites } from '~/i18n/sites'
import type { Locale } from '~/i18n/types'
import { absoluteUrl, getSiteConfig, LOCALE_ROUTING, SITE_LOCALE } from '~/site'
import { entryJsonLd, organizationJsonLd, websiteJsonLd } from './jsonld'

type Meta = Record<string, string>
type LinkTag = Record<string, string>
type ScriptTag = { type?: string; children?: string; src?: string }

export interface HeadResult {
  meta: Meta[]
  links: LinkTag[]
  scripts?: ScriptTag[]
}

export function pageTitle(title: string, locale: Locale = SITE_LOCALE): string {
  const site = getSiteConfig(locale)
  if (title.includes(site.siteName)) return title
  return site.titleTemplate.replace('%s', title)
}

/** Root <head>: charset, viewport, stylesheet, icons, site-wide JSON-LD. */
export function rootHead(appCss: string, locale: Locale = SITE_LOCALE): HeadResult {
  const site = getSiteConfig(locale)
  return {
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
      { property: 'og:site_name', content: site.siteName },
      { property: 'og:locale', content: ogLocale(site.lang) },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      {
        rel: 'preload',
        href: montserratWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      // Path-mode previews have no sitemap (they are not indexed).
      ...(LOCALE_ROUTING === 'domain'
        ? [{ rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' }]
        : []),
    ],
    scripts: [
      { type: 'application/ld+json', children: JSON.stringify(organizationJsonLd(locale)) },
      { type: 'application/ld+json', children: JSON.stringify(websiteJsonLd(locale)) },
    ],
  }
}

/** Per-entry <head>: title, description, canonical, Open Graph, Twitter, hreflang, JSON-LD. */
export function entryHead(locale: Locale = SITE_LOCALE, path = '/'): HeadResult {
  const entry = resolveEntry(locale, path)
  if (!entry)
    return {
      meta: [
        { title: pageTitle(getSiteConfig(locale).strings.notFound.title, locale) },
        { name: 'robots', content: 'noindex' },
      ],
      links: [],
    }
  const m = entry.meta
  const title = pageTitle(m.seoTitle ?? m.title, locale)
  const canonical = absoluteUrl(locale, entry.path)
  const ogImage = absoluteUrl(
    locale,
    m.og?.image?.src ?? `/og/${entry.locale}/${entry.collection}/${entry.slug}.png`,
  )
  const meta: Meta[] = [
    { title },
    { name: 'description', content: m.description },
    { property: 'og:type', content: entry.collection === 'posts' ? 'article' : 'website' },
    { property: 'og:url', content: canonical },
    { property: 'og:title', content: m.og?.title ?? title },
    { property: 'og:description', content: m.og?.description ?? m.description },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: m.og?.image?.alt ?? m.title },
    { name: 'twitter:title', content: m.og?.title ?? title },
    { name: 'twitter:description', content: m.og?.description ?? m.description },
    { name: 'twitter:image', content: ogImage },
  ]
  if (m.noindex) meta.push({ name: 'robots', content: 'noindex, nofollow' })
  if (entry.collection === 'posts' && 'date' in m)
    meta.push({ property: 'article:published_time', content: m.date })
  const links: LinkTag[] = [{ rel: 'canonical', href: canonical }]
  for (const alt of alternatesFor(m.translationKey))
    links.push({ rel: 'alternate', hreflang: alt.hreflang, href: alt.href })
  const jsonLd = entryJsonLd(entry, canonical)
  return {
    meta,
    links,
    scripts: jsonLd.map((d) => ({ type: 'application/ld+json', children: JSON.stringify(d) })),
  }
}

/** hreflang alternates of a translation: every locale's URL (its TLD in production, /<locale>/... in previews). */
export function alternatesFor(translationKey: string): { hreflang: string; href: string }[] {
  const map = (hreflangMap as Record<string, Partial<Record<Locale, string>>>)[translationKey] ?? {}
  const out: { hreflang: string; href: string }[] = []
  for (const [l, path] of Object.entries(map))
    if (path) out.push({ hreflang: sites[l as Locale].lang, href: absoluteUrl(l as Locale, path) })
  if (out.length < 2) return []
  const def = map[DEFAULT_LOCALE]
  if (def) out.push({ hreflang: 'x-default', href: absoluteUrl(DEFAULT_LOCALE, def) })
  return out
}

function ogLocale(lang: string): string {
  const m: Record<string, string> = {
    en: 'en_US',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
    ja: 'ja_JP',
    ca: 'ca_ES',
  }
  return m[lang] ?? 'en_US'
}
