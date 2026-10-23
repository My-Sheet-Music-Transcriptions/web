import { existsSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { sites } from '../../src/i18n/sites'

/**
 * Every site with pages shows its own lockup in the header: src/assets/images/brand/logo-<site.logo>.svg or .png
 * (src/assets/brand.ts falls back to the English one otherwise, which is how the Spanish site shipped with the
 * English lockup once).
 */
const locales = readdirSync('content').filter((d) => d in sites) as (keyof typeof sites)[]

describe('brand lockups', () => {
  it.each(locales)('%s has its own header lockup', (locale) => {
    const name = sites[locale].logo
    const own = ['svg', 'png'].some((ext) =>
      existsSync(`src/assets/images/brand/logo-${name}.${ext}`),
    )
    expect(own, `src/assets/images/brand/logo-${name}.svg or .png`).toBe(true)
  })
})
