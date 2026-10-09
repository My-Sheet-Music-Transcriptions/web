import path from 'node:path'

/**
 * `output.assetFileNames` of the site build (vite.config.ts) and the design-system bundle (vite.ds.config.ts).
 * Byte-identical images under different names become one asset with several names, and each build keeps
 * whichever name it emitted first, which varies from run to run: the prerendered HTML (server build) could
 * point at a file the client build wrote under the other name, and two design-system exports of the same
 * sources could hash differently (scripts/design-system/lib.ts, exportHash). Here every build picks the
 * alphabetically first name. That only helps when both names reach the bundler: vite-imagetools runs one
 * transform for byte-identical sources imported with the same directives and emits it under the name of
 * whichever import started it. So tests/unit/images.test.ts keeps the same picture from sitting under two
 * names in the first place, and the design-system build resolves every copy to one file (vite.ds.config.ts).
 */
export function assetFileNames({ names }: { names: readonly string[] }): string {
  if (names.length < 2) return 'assets/[name]-[hash][extname]'
  const { dir, name, ext } = path.posix.parse(names.reduce((a, b) => (a < b ? a : b)))
  return path.posix.join('assets', dir, `${name}-[hash]${ext}`)
}
