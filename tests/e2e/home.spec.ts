import { expect, type Page, test } from '@playwright/test'
import { pathModeDist } from './dist-mode'

/** Pages are prerendered; interactive checks wait until React has hydrated. */
async function open(page: Page, path = '/') {
  await page.goto(path)
  await page.waitForSelector('html[data-hydrated]')
}

test.describe('homepage', () => {
  test.skip(pathModeDist, 'production (single-locale) build only; see locale-paths.spec.ts')
  test('renders the hero and its call to action', async ({ page }, info) => {
    await open(page)
    await expect(page).toHaveTitle(/My Sheet Music Transcriptions/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'sheet music transcription service',
    )
    await expect(page.getByRole('main').getByRole('link', { name: /how it works/i })).toBeVisible()
    if (info.project.name !== 'mobile') {
      await expect(
        page.getByRole('banner').getByRole('link', { name: /request your sheet music/i }),
      ).toBeVisible()
    }
  })

  test('skip link moves focus to main content', async ({ page }) => {
    await open(page)
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: /skip to content/i })
    await expect(skip).toBeFocused()
    await skip.press('Enter')
    await expect(page.locator('#main')).toBeVisible()
  })

  test('language switcher links to the sister domains', async ({ page }) => {
    await open(page)
    const nav = page.getByRole('navigation', { name: 'Language' }).first()
    await nav.getByRole('button', { name: /language/i }).click()
    await expect(nav.getByRole('link', { name: /^Español/ })).toHaveAttribute(
      'href',
      /mistranscripcionesmusicales\.com/,
    )
    await expect(nav.getByRole('link', { name: /^Français/ })).toHaveAttribute(
      'href',
      /mapartitionsurmesure\.com/,
    )
    await expect(nav.getByRole('link', { name: /^日本語/ })).toHaveAttribute(
      'href',
      /mysheetmusictranscriptions\.jp/,
    )
  })

  test('main navigation works at every width', async ({ page }, info) => {
    await open(page)
    if (info.project.name === 'mobile') {
      await page.getByRole('button', { name: /^menu$/i }).click()
      const dialog = page.getByRole('dialog', { name: /menu/i })
      await expect(dialog).toBeVisible()
      await expect(dialog.getByRole('link', { name: 'Pricing' })).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(dialog).toBeHidden()
    } else {
      const mainNav = page.getByRole('navigation', { name: 'Main' })
      const services = mainNav.getByRole('button', { name: /^services/i })
      const link = mainNav.getByRole('link', { name: 'Jazz & blues' })
      await services.hover()
      await expect(link).toBeVisible()
      await page.mouse.move(5, 880)
      await expect(link).toBeHidden()
      await services.focus()
      await page.keyboard.press('Enter')
      await expect(link).toBeVisible()
      await page.keyboard.press('Escape')
      await expect(link).toBeHidden()
      await expect(services).toBeFocused()
    }
  })

  test('contact form validates required fields client-side', async ({ page }) => {
    await open(page)
    const form = page.getByRole('form', { name: /request your sheet music/i })
    await form.getByRole('button', { name: /^send$/i }).click()
    await expect(form.getByLabel(/^name/i)).toBeFocused()
    await expect(form.getByText('Please enter your name')).toBeVisible()
  })

  test('unknown paths render the 404 page with a 404 status', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/not found/i)
  })

  test('links to pages not yet ported point at the live site', async ({ page }) => {
    await open(page)
    const pricing = page.getByRole('contentinfo').getByRole('link', { name: 'Pricing' })
    await expect(pricing).toHaveAttribute(
      'href',
      'https://www.mysheetmusictranscriptions.com/pricing',
    )
  })
})
