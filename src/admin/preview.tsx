import '~/design-system/export/asset-base'
import '@fontsource-variable/montserrat'
import '~/design-system/export/entry.css'
import { createRoot, type Root } from 'react-dom/client'
import { isCmsBlock } from '~/components/blocks/cms'
import { MotionProvider } from '~/components/primitives/Motion'
import type { PictureSource } from '~/components/primitives/Picture'
import { BlockPage, type BlockWords } from '~/content/BlockPage'
import { resolveBlock, splitDataPage } from '~/content/data-page'
import { CMS_LOCALES } from './locales'
import { type Decap, registerWidgets } from './widgets'

/**
 * The CMS preview (/admin, Decap): the entry being edited rendered with the real blocks, as the site renders its
 * page.json (src/content/BlockPage.tsx). Built by vite.admin.config.ts into dist/client/admin/preview.{js,css};
 * src/admin/index.html loads it after Decap, and it registers one preview template per collection of
 * src/admin/config.ts (`pages-<locale>`, `home-<locale>`). Decap renders templates with its own React, so each template only
 * gives this bundle an element to render into.
 */

// Every locale's data (content/<locale>/data/*.ts): the block words, and the lists data fields name. Loaded before
// the first render, not eagerly: the bundler would hoist their pictures' URLs above asset-base.
const loaders = import.meta.glob<Record<string, unknown>>('/content/*/data/*.ts')
const modules: Record<string, Record<string, unknown>> = {}
let ready = false
const loaded = Promise.all(
  Object.entries(loaders).map(async ([file, load]) => {
    modules[file] = await load()
  }),
).then(() => {
  ready = true
})
const dataOf = (locale: string, file: string) =>
  modules[`/content/${locale}/data/${file}.ts`] ?? modules[`/content/en/data/${file}.ts`] ?? {}
const wordsFor = (locale: string) => dataOf(locale, 'labels') as unknown as BlockWords

// A picture's size is known once it has loaded; until then a stand-in keeps the layout plausible.
const sizes = new Map<string, { w: number; h: number }>()
function pictureOf(url: string, rerender: () => void): PictureSource {
  const size = sizes.get(url)
  if (!size) {
    const img = new Image()
    img.onload = () => {
      sizes.set(url, { w: img.naturalWidth, h: img.naturalHeight })
      rerender()
    }
    img.src = url
  }
  return { sources: {}, img: { src: url, ...(size ?? { w: 800, h: 600 }) } }
}

const roots = new WeakMap<Element, Root>()

function render(el: Element, data: unknown, assetUrl: (file: string) => string, locale: string) {
  const again = () => render(el, data, assetUrl, locale)
  if (!ready) {
    void loaded.then(again)
    return
  }
  let node: React.ReactNode
  try {
    const { blocks } = splitDataPage({ blocks: [], ...(data as object) }, 'the page being edited', {
      check: false,
    })
    const resolved = blocks
      .filter((b) => isCmsBlock(b.type))
      .map((b) =>
        resolveBlock(b, {
          picture: (file) => pictureOf(assetUrl(file), again),
          data: (file, name) => dataOf(locale, file)[name],
        }),
      )
    node = (
      <MotionProvider>
        <main>
          <BlockPage blocks={resolved} words={wordsFor(locale)} />
        </main>
      </MotionProvider>
    )
  } catch (e) {
    node = <pre style={{ padding: 24, whiteSpace: 'pre-wrap' }}>{String(e)}</pre>
  }
  let root = roots.get(el)
  if (!root) {
    root = createRoot(el)
    roots.set(el, root)
  }
  root.render(node)
}

// Decap's globals (decap-cms.js, loaded first by src/admin/index.html).
interface DecapEntry {
  getIn(path: string[]): { toJS(): unknown } | undefined
}
interface DecapPreviewProps {
  entry: DecapEntry
  getAsset(path: string): { toString(): string }
}
type Globals = Decap & {
  CMS: Decap['CMS'] & {
    registerPreviewStyle(url: string): void
    registerPreviewTemplate(name: string, component: unknown): void
  }
}

const decap = window as unknown as Partial<Globals>

if (decap.CMS && decap.createClass && decap.h) {
  const { CMS, createClass, h } = decap as Globals
  registerWidgets(decap as Globals)
  CMS.registerPreviewStyle(
    new URL('preview.css', (document.currentScript as HTMLScriptElement).src).href,
  )
  // One per collection of pages, and per homepage (a file collection's template goes by its file's name).
  for (const [name, locale] of CMS_LOCALES.flatMap(({ code }) => [
    [`pages-${code}`, code] as const,
    [`home-${code}`, code] as const,
  ]))
    CMS.registerPreviewTemplate(
      name,
      createClass({
        componentDidMount(this: { draw(): void }) {
          this.draw()
        },
        componentDidUpdate(this: { draw(): void }) {
          this.draw()
        },
        draw(this: { el?: Element; props: DecapPreviewProps }) {
          if (!this.el) return
          const data = this.props.entry.getIn(['data'])?.toJS()
          render(this.el, data, (file) => this.props.getAsset(file).toString(), locale)
        },
        render(this: { el?: Element }) {
          return h('div', {
            ref: (el: Element | null) => {
              this.el = el ?? undefined
            },
          })
        },
      }),
    )
}
