import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import {
  DATA_PAGE_FILE,
  pictureWidths,
  resolveBlock,
  splitDataPage,
} from '../../src/content/data-page.ts'

// The resolved id must not end in ".json": Vite's own JSON plugin would parse the module this one returns.
const PREFIX = '\0data-page:'
const REQUEST = new RegExp(`/${DATA_PAGE_FILE.replace('.', '\\.')}\\?(meta|page)$`)

/**
 * Data pages (src/content/data-page.ts) in the Vite build: `page.json?meta` is the page's meta alone (the content
 * index reads every page's meta eagerly, so the blocks stay out of it), and `page.json?page` is the page component,
 * as an index.tsx would be: each picture imported through vite-imagetools at its field's or its block's widths, each
 * recording as its URL, each data field's export imported from content/<locale>/data, the blocks rendered by
 * BlockPage with the locale's block words (content/<locale>/data/labels.ts) and brand (its video poster, brand.ts).
 */
export function dataPages(): Plugin {
  let root = process.cwd()
  return {
    name: 'msmt:data-pages',
    enforce: 'pre',
    configResolved(config) {
      root = config.root
    },
    async resolveId(source, importer) {
      const m = REQUEST.exec(source)
      if (!m) return null
      const bare = source.slice(0, -`?${m[1]}`.length)
      const file = bare.startsWith('/') && !fs.existsSync(bare) ? path.join(root, bare) : bare
      const resolved = path.isAbsolute(file)
        ? file
        : (await this.resolve(bare, importer, { skipSelf: true }))?.id
      return resolved ? `${PREFIX}${resolved}::${m[1]}` : null
    },
    load(id) {
      if (!id.startsWith(PREFIX)) return null
      const [file = '', query] = id.slice(PREFIX.length).split('::')
      this.addWatchFile(file)
      const rel = path.relative(root, file).split(path.sep).join('/')
      const { meta, blocks } = splitDataPage(JSON.parse(fs.readFileSync(file, 'utf8')), rel)
      if (query === 'meta') return `export default ${JSON.stringify(meta)}\n`

      const dir = path.dirname(file)
      const locale = rel.split('/')[1]
      const imports: string[] = []
      const modules = new Map<string, string>()
      const inFolder = (block: string, name: string) => {
        const found = path.join(dir, name)
        if (!fs.existsSync(found))
          throw new Error(`${rel}: ${block} names "${name}", which is not in the page folder`)
        return found
      }
      const resolved = blocks.map((block) =>
        resolveBlock(block, {
          picture(name, widths) {
            const id = `picture${imports.length}`
            imports.push(
              `import ${id} from ${JSON.stringify(`${inFolder(block.type, name)}?w=${widths ?? pictureWidths(block.type)}&as=picture`)}`,
            )
            return `__${id}__`
          },
          file(name) {
            const id = `file${imports.length}`
            imports.push(`import ${id} from ${JSON.stringify(`${inFolder(block.type, name)}?url`)}`)
            return `__${id}__`
          },
          data(dataFile, name) {
            const source = path.join(root, `content/${locale}/data/${dataFile}.ts`)
            if (!new RegExp(`export const ${name}\\b`).test(fs.readFileSync(source, 'utf8')))
              throw new Error(
                `${rel}: ${block.type} names "${name}", which content/${locale}/data/${dataFile}.ts does not export`,
              )
            let id = modules.get(dataFile)
            if (!id) {
              id = `data${modules.size}`
              modules.set(dataFile, id)
              imports.push(`import * as ${id} from ${JSON.stringify(source)}`)
            }
            return `__${id}.${name}__`
          },
        }),
      )
      const data = JSON.stringify(resolved, null, 2).replace(
        /"__((?:picture|file)\d+|data\d+\.\w+)__"/g,
        '$1',
      )
      return [
        "import { createElement } from 'react'",
        // Absolute paths: an importer outside the file system (a \0 id) gets no alias or root resolution.
        `import { BlockPage } from ${JSON.stringify(path.join(root, 'src/content/BlockPage.tsx'))}`,
        `import * as words from ${JSON.stringify(path.join(root, `content/${locale}/data/labels.ts`))}`,
        `import * as brand from ${JSON.stringify(path.join(root, `content/${locale}/data/brand.ts`))}`,
        ...imports,
        `const blocks = ${data}`,
        'export default function DataPage() {',
        '  return createElement(BlockPage, { blocks, words, brand })',
        '}',
        '',
      ].join('\n')
    },
  }
}
