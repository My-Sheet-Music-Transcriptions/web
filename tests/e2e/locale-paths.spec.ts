import { expect, type Page, test } from '@playwright/test'
import { pathModeDist } from './dist-mode'

/**
 * Path-mode previews (`pnpm build` without SITE_LOCALE): every locale under /<locale>, links keep the
 * prefix and stay router links (preloaded on hover). See src/i18n/routing.ts.
 */
test.skip(!pathModeDist, 'path-mode build only (pnpm build without SITE_LOCALE)')

type TsrRouter = {
  preloadRoute: (opts: unknown) => Promise<unknown>
  buildLocation: (opts: unknown) => { pathname: string }
}

async function open(page: Page, path: string) {
  await page.goto(path)
  await page.waitForSelector('html[data-hydrated]')
}

test('the bare root goes to the default locale', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/en$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('internal links carry the locale prefix', async ({ page }) => {
  await open(page, '/en/gift-card')
  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))
  expect(hrefs.length).toBeGreaterThan(0)
  for (const href of hrefs) expect(href).toMatch(/^\/en(\/|#|$)/)
  await expect(page.locator('input[name="returnTo"]')).toHaveValue('/en/gift-card')
})

test('links preload on hover and navigate client-side', async ({ page }, info) => {
  test.skip(info.project.name === 'mobile', 'hover preloading is a pointer interaction')
  await open(page, '/en')
  const link = page.locator('footer a[href="/en/gift-card"]').first()
  // Record what the router preloads (Link calls router.preloadRoute on hover).
  await page.evaluate(() => {
    const w = window as unknown as { __TSR_ROUTER__: TsrRouter; __preloaded: string[] }
    const router = w.__TSR_ROUTER__
    const preload = router.preloadRoute.bind(router)
    w.__preloaded = []
    router.preloadRoute = (opts) => {
      w.__preloaded.push(router.buildLocation(opts).pathname)
      return preload(opts)
    }
  })
  await link.hover()
  // The locale-free route behind the prefixed href is what gets preloaded.
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __preloaded: string[] }).__preloaded))
    .toContain('/gift-card')
  // Client-side navigation: the document is not reloaded.
  await page.evaluate(() => {
    ;(window as unknown as { __sameDocument: boolean }).__sameDocument = true
  })
  await link.click()
  await expect(page).toHaveURL(/\/en\/gift-card$/)
  expect(
    await page.evaluate(() => (window as unknown as { __sameDocument?: boolean }).__sameDocument),
  ).toBe(true)
})

test('previews are not indexed, but name their sitemaps', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Disallow: /')
  expect(robots).toMatch(/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m)
  // The parent lists every language's sitemaps; each language has its own index, as a production domain does.
  const parent = await request.get('/sitemap.xml')
  expect(parent.status()).toBe(200)
  expect(await parent.text()).toMatch(/<loc>[^<]*\/en\/page-sitemap\.xml<\/loc>/)
  const index = await request.get('/en/sitemap.xml')
  expect(index.status()).toBe(200)
  expect(await index.text()).toMatch(/<loc>[^<]*\/en\/page-sitemap\.xml<\/loc>/)
  expect(await (await request.get('/en/page-sitemap.xml')).text()).toMatch(
    /<loc>[^<]*\/en\/gift-card<\/loc>/,
  )
  const legacy = await request.get('/en/sitemap_index.xml', { maxRedirects: 0 })
  expect(legacy.status()).toBe(301)
  expect(legacy.headers().location).toBe('/en/sitemap.xml')
})

test('pages link their language’s sitemap', async ({ page }) => {
  await page.goto('/en/gift-card')
  await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute('href', '/en/sitemap.xml')
})

test('unknown paths under a locale render its 404 page', async ({ page }) => {
  const res = await page.goto('/en/does-not-exist')
  expect(res?.status()).toBe(404)
})
