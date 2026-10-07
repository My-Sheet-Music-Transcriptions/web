import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { resolveLocaleRouting } from '../../scripts/lib/site-locale'
import {
  isLocalized,
  localeFromPathname,
  localeHref,
  localePrefixRewrite,
  localizePath,
  stripLocale,
} from '../../src/i18n/routing'

describe('locale paths', () => {
  it('reads and strips the locale prefix', () => {
    expect(localeFromPathname('/es/precios')).toBe('es')
    expect(localeFromPathname('/es')).toBe('es')
    expect(localeFromPathname('/pricing')).toBeUndefined()
    expect(localeFromPathname('/esp')).toBeUndefined()
    expect(stripLocale('/es/precios')).toEqual({ locale: 'es', path: '/precios' })
    expect(stripLocale('/ca')).toEqual({ locale: 'ca', path: '/' })
    expect(stripLocale('/pricing')).toEqual({ path: '/pricing' })
  })

  it('adds the prefix once and never to shared paths', () => {
    expect(localizePath('es', '/')).toBe('/es')
    expect(localizePath('es', '/precios')).toBe('/es/precios')
    expect(localizePath('es', '/gift-card?sent=1#contact')).toBe('/es/gift-card?sent=1#contact')
    expect(localizePath('es', '/es/precios')).toBe('/es/precios')
    expect(localizePath('es', '/api/contact')).toBe('/api/contact')
    expect(localizePath('es', '/og/es/pages/home.png')).toBe('/og/es/pages/home.png')
    expect(isLocalized('/assets/app.js')).toBe(false)
  })

  it('links to another locale by TLD in production and by prefix in previews', () => {
    expect(localeHref('domain', 'es', '/')).toBe('https://www.mistranscripcionesmusicales.com/')
    expect(localeHref('domain', 'ca', '/preus')).toBe('https://lamevapartitura.cat/preus')
    expect(localeHref('path', 'es', '/')).toBe('/es')
    expect(localeHref('path', 'ca', '/preus', 'https://deploy-preview-1--x.netlify.app')).toBe(
      'https://deploy-preview-1--x.netlify.app/ca/preus',
    )
  })

  it('picks the mode from SITE_LOCALE', () => {
    expect(resolveLocaleRouting('es')).toMatchObject({ mode: 'domain', locales: ['es'] })
    expect(resolveLocaleRouting(undefined).mode).toBe('path')
    expect(resolveLocaleRouting('all').locales).toContain('ca')
    expect(() => resolveLocaleRouting('xx')).toThrow()
  })
})

describe('router rewrite (path mode)', () => {
  function routerAt(url: string) {
    const root = createRootRoute()
    const routeTree = root.addChildren([
      createRoute({ getParentRoute: () => root, path: '/' }),
      createRoute({ getParentRoute: () => root, path: '$' }),
    ])
    const history = createMemoryHistory({ initialEntries: [url] })
    return createRouter({
      routeTree,
      history,
      rewrite: localePrefixRewrite(() => history.location.pathname),
    })
  }

  it('routes on the locale-free path and keeps the real URL public', () => {
    const router = routerAt('/es/precios')
    expect(router.latestLocation.pathname).toBe('/precios')
    expect(router.latestLocation.publicHref).toBe('/es/precios')
  })

  it("prefixes hrefs with the current page's locale", () => {
    const router = routerAt('/ca/preus')
    expect(router.buildLocation({ to: '/' }).publicHref).toBe('/ca')
    expect(router.buildLocation({ to: '/gift-card', hash: 'contact' }).publicHref).toBe(
      '/ca/gift-card#contact',
    )
    expect(router.buildLocation({ to: '/api/contact' }).publicHref).toBe('/api/contact')
  })

  it('falls back to the default locale on a bare URL', () => {
    expect(routerAt('/').buildLocation({ to: '/pricing' }).publicHref).toBe('/en/pricing')
  })
})
