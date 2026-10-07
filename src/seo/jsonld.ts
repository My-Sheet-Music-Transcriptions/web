import type { Organization, Thing, WebSite, WithContext } from 'schema-dts'
import type { Entry } from '~/content'
import type { Locale } from '~/i18n/types'
import { absoluteUrl, getSiteConfig } from '~/site'

export function organizationJsonLd(locale: Locale): WithContext<Organization> {
  const site = getSiteConfig(locale)
  const home = absoluteUrl(locale, '/')
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${home}#organization`,
    name: site.siteName,
    url: home,
    logo: absoluteUrl(locale, '/apple-touch-icon.png'),
    email: site.contact.email,
    sameAs: site.social.map((s) => s.href),
    foundingDate: '2011',
    areaServed: 'Worldwide',
  }
}

export function websiteJsonLd(locale: Locale): WithContext<WebSite> {
  const site = getSiteConfig(locale)
  const home = absoluteUrl(locale, '/')
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${home}#website`,
    url: home,
    name: site.siteName,
    inLanguage: site.lang,
    publisher: { '@id': `${home}#organization` },
  }
}

/** Entry-specific structured data; each template may add more via its blocks. */
export function entryJsonLd(entry: Entry, canonical: string): WithContext<Thing>[] {
  const m = entry.meta
  const site = getSiteConfig(entry.locale)
  const home = absoluteUrl(entry.locale, '/')
  const common = {
    url: canonical,
    name: m.title,
    description: m.description,
    inLanguage: site.lang,
    isPartOf: { '@id': `${home}#website` },
  }
  switch (entry.collection) {
    case 'posts':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: m.title,
          description: m.description,
          url: canonical,
          datePublished: 'date' in m ? m.date : undefined,
          dateModified: m.updated ?? ('date' in m ? m.date : undefined),
          author: { '@type': 'Organization', name: site.siteName },
          publisher: { '@id': `${home}#organization` },
          inLanguage: site.lang,
        },
      ]
    case 'services':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          ...common,
          provider: { '@id': `${home}#organization` },
          serviceType: m.title,
        },
      ]
    case 'faqs':
      return [{ '@context': 'https://schema.org', '@type': 'WebPage', ...common }]
    default:
      return [{ '@context': 'https://schema.org', '@type': 'WebPage', ...common }]
  }
}
