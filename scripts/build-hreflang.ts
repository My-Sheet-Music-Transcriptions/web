import { writeHreflangMap, writePortedPaths } from './lib/content-fs'

const map = writeHreflangMap()
writePortedPaths()
console.log(`hreflang map: ${Object.keys(map).length} translation keys`)
