import type { Organization, Thing, WebSite, WithContext } from 'schema-dts'
import type { Entry } from '~/content'
import { absoluteUrl, site } from '~/site'

export function organizationJsonLd(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.domain}/#organization`,
    name: site.siteName,
    url: `${site.domain}/`,
    logo: absoluteUrl('/apple-touch-icon.png'),
    email: site.contact.email,
    sameAs: site.social.map((s) => s.href),
    foundingDate: '2011',
    areaServed: 'Worldwide',
  }
}

export function websiteJsonLd(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.domain}/#website`,
    url: `${site.domain}/`,
    name: site.siteName,
    inLanguage: site.lang,
    publisher: { '@id': `${site.domain}/#organization` },
  }
}

/** Entry-specific structured data; each template may add more via its blocks. */
export function entryJsonLd(entry: Entry, canonical: string): WithContext<Thing>[] {
  const m = entry.meta
  const common = {
    url: canonical,
    name: m.title,
    description: m.description,
    inLanguage: site.lang,
    isPartOf: { '@id': `${site.domain}/#website` },
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
          publisher: { '@id': `${site.domain}/#organization` },
          inLanguage: site.lang,
        },
      ]
    case 'services':
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          ...common,
          provider: { '@id': `${site.domain}/#organization` },
          serviceType: m.title,
        },
      ]
    case 'faqs':
      return [{ '@context': 'https://schema.org', '@type': 'WebPage', ...common }]
    default:
      return [{ '@context': 'https://schema.org', '@type': 'WebPage', ...common }]
  }
}
