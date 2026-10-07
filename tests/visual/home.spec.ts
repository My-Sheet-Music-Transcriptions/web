import { expect, test } from '@playwright/test'

/**
 * Visual regression against committed baselines (tests/visual/__screenshots__).
 * Regenerate deliberately with `pnpm test:visual --update-snapshots` after an intended design change.
 * Motion is reduced (no hero slideshow) and lazy images are forced so captures are deterministic.
 */
test.use({ reducedMotion: 'reduce' })

for (const width of [1440, 1024, 390]) {
  test(`homepage at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.waitForSelector('html[data-hydrated]')
    await page.evaluate(() => document.fonts.ready)
    await page.addStyleTag({ content: '[data-consent-banner]{display:none !important}' })
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = 'eager'
      await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)))
    })
    await expect(page).toHaveScreenshot(`home-${width}.png`, { fullPage: true })
  })
}
