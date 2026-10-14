import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
import { readAllEntries } from '../../scripts/lib/content-fs'
import { navFor } from '../../src/content/data'
import { menuPages, menuToNav, parseMenu } from '../../src/content/menu'
import { LOCALES } from '../../src/i18n/types'

const entries = readAllEntries()

describe('menus (content/<locale>/data/menu.json)', () => {
  const files = LOCALES.map((l) => [l, `content/${l}/data/menu.json`] as const).filter(([, f]) =>
    fs.existsSync(f),
  )
  it('English and Spanish have their own', () => {
    expect(files.map(([l]) => l)).toEqual(expect.arrayContaining(['en', 'es']))
  })
  it.each(files)('%s: every page it picks is a page of the language', (locale, file) => {
    const menu = parseMenu(JSON.parse(fs.readFileSync(file, 'utf8')), file)
    const paths = new Set(entries.filter((e) => e.locale === locale).map((e) => e.path))
    expect(menuPages(menu).filter(({ page }) => !paths.has(page))).toEqual([])
  })
  it('the header gets the menu of its language, and English where a language has none yet', () => {
    expect(navFor('es')[0]?.href).toBe('/')
    expect(navFor('es').some((i) => i.href === '/sobre-nosotros')).toBe(true)
    expect(navFor('de')).toEqual(navFor('en'))
  })
  it('turns pages and addresses into links, sections into panel groups', () => {
    const nav = menuToNav(
      parseMenu(
        {
          items: [
            { label: 'Home', page: '/', href: '' },
            {
              label: 'Services',
              href: '/services',
              sections: [
                { label: 'Piano', page: '/piano', links: null },
                { label: 'Strings', links: [{ label: 'Violin', href: 'https://example.com/v' }] },
              ],
            },
          ],
        },
        'test',
      ),
    )
    expect(nav).toEqual([
      { label: 'Home', href: '/' },
      {
        label: 'Services',
        href: '/services',
        groups: [
          { title: 'Piano', href: '/piano', links: [] },
          { title: 'Strings', links: [{ label: 'Violin', href: 'https://example.com/v' }] },
        ],
      },
    ])
  })
  it('refuses a link with both a page and an address, or with neither', () => {
    expect(() => parseMenu({ items: [{ label: 'X', page: '/', href: '/y' }] }, 'm.json')).toThrow(
      /items\.0: pick a page or write an address, not both/,
    )
    expect(() =>
      parseMenu(
        {
          items: [{ label: 'X', href: '/x', sections: [{ label: 'S', links: [{ label: 'L' }] }] }],
        },
        'm.json',
      ),
    ).toThrow(/items\.0\.sections\.0\.links\.0: a link needs a page or an address/)
  })
})
