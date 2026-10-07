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

test('previews are not indexed', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Disallow: /')
  expect((await request.get('/sitemap.xml')).status()).toBe(404)
})

test('unknown paths under a locale render its 404 page', async ({ page }) => {
  const res = await page.goto('/en/does-not-exist')
  expect(res?.status()).toBe(404)
})
