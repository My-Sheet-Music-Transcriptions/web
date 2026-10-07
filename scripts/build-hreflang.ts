import { writeHreflangMap, writePortedPaths } from './lib/content-fs'
import { resolveSiteLocale } from './lib/site-locale'

const map = writeHreflangMap()
writePortedPaths(resolveSiteLocale(process.env.SITE_LOCALE))
console.log(`hreflang map: ${Object.keys(map).length} translation keys`)
