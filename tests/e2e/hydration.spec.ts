import { expect, test } from '@playwright/test'
import { pathModeDist } from './dist-mode'

/**
 * Netlify rewrites the prerendered HTML on the production host: a comment and a line break go into <head>
 * and a script after </html>. The stray whitespace text node used to abort React's hydration of the
 * document (minified error #418) and re-render every page on the client. The client entry strips it.
 */
test('hydrates the HTML as Netlify serves it', async ({ page }) => {
  const home = pathModeDist ? '/en/' : '/'
  await page.route(`**${home}`, async (route) => {
    const response = await route.fetch()
    const html = (await response.text())
      .replace(
        '<meta charSet="utf-8"/>',
        '<meta charSet="utf-8"/>\n<!-- This site is hosted on Netlify. -->',
      )
      .replace(/<\/html>\s*$/, '</html>\n<script async src="/.netlify/scripts/hud"></script>\n')
    await route.fulfill({ response, body: html, headers: response.headers() })
  })
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(home)
  await page.waitForSelector('html[data-hydrated]')
  expect(errors).toEqual([])
})
