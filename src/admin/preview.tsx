import '~/design-system/export/asset-base'
import '@fontsource-variable/montserrat'
import '~/design-system/export/entry.css'
import { Component, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { isCmsBlock } from '~/components/blocks/cms'
import { MotionProvider } from '~/components/primitives/Motion'
import type { PictureSource } from '~/components/primitives/Picture'
import { type BlockBrand, BlockPage, type BlockWords } from '~/content/BlockPage'
import { resolveBlock, splitDataPage } from '~/content/data-page'
import { menuToNav, parseMenu } from '~/content/menu'
import { CMS_LOCALES } from './locales'
import { type Decap, registerWidgets } from './widgets'

/**
 * The CMS preview (/admin, Decap): the entry being edited rendered with the real blocks, as the site renders its
 * page.json (src/content/BlockPage.tsx). Built by vite.admin.config.ts into dist/client/admin/preview.{js,css};
 * src/admin/index.html loads it after Decap, and it registers one preview template per collection of
 * src/admin/config.ts (`pages`, `services`, and the Site entries `home-<locale>`, `menu-<locale>`). Decap renders
 * templates with its own React, so each template only gives this bundle an element to render into.
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
const brandOf = (locale: string) => dataOf(locale, 'brand') as BlockBrand

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

/**
 * One block of the preview: a block that cannot be drawn yet (a required picture not added, a list still empty, as
 * a page started from another has until its own files are added) shows a note instead of blanking the whole preview.
 */
class Unfinished extends Component<
  { type: string; data: unknown; children: ReactNode },
  { failed: boolean; data?: unknown }
> {
  state = { failed: false, data: undefined as unknown }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  static getDerivedStateFromProps(
    props: { data: unknown },
    state: { failed: boolean; data?: unknown },
  ) {
    // a new value of the block (the writer filled something in): try drawing it again
    return props.data === state.data ? null : { failed: false, data: props.data }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <p
        style={{
          margin: 24,
          padding: 16,
          border: '1px dashed #c5c8d1',
          borderRadius: 8,
          color: '#5f6b7a',
        }}
      >
        {this.props.type}: not finished yet (a picture or a required field is missing).
      </p>
    )
  }
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
          file: assetUrl,
          data: (file, name) => dataOf(locale, file)[name],
        }),
      )
    node = (
      <MotionProvider>
        <main>
          {resolved.map((b, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: the stored order is the page's order
            <Unfinished key={i} type={b.type} data={b}>
              <BlockPage blocks={[b]} words={wordsFor(locale)} brand={brandOf(locale)} />
            </Unfinished>
          ))}
        </main>
      </MotionProvider>
    )
  } catch (e) {
    node = <pre style={{ padding: 24, whiteSpace: 'pre-wrap' }}>{String(e)}</pre>
  }
  draw(el, node)
}

function draw(el: Element, node: React.ReactNode) {
  let root = roots.get(el)
  if (!root) {
    root = createRoot(el)
    roots.set(el, root)
  }
  root.render(node)
}

/** A language's menu (`menu-<locale>`) as an outline: each item, its sections and their links, and where each goes. */
function renderMenu(el: Element, data: unknown) {
  let node: React.ReactNode
  try {
    const nav = menuToNav(parseMenu({ items: [], ...(data as object) }, 'the menu being edited'))
    const to = (href?: string) => href && <small style={{ color: '#667' }}> → {href}</small>
    node = (
      <ol
        style={{
          padding: '24px 24px 24px 48px',
          listStyle: 'decimal',
          lineHeight: 1.6,
          fontFamily: 'Montserrat Variable, sans-serif',
        }}
      >
        {nav.map((item) => (
          <li key={`${item.label} ${item.href}`}>
            <strong>{item.label}</strong>
            {to(item.href)}
            {item.groups && (
              <ul style={{ paddingLeft: 24, listStyle: 'disc' }}>
                {item.groups.map((g) => (
                  <li key={`${g.title} ${g.href}`}>
                    {g.title}
                    {to(g.href)}
                    <ul style={{ paddingLeft: 24, listStyle: 'circle' }}>
                      {g.links.map((l) => (
                        <li key={`${l.label} ${l.href}`}>
                          {l.label}
                          {to(l.href)}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    )
  } catch (e) {
    node = <pre style={{ padding: 24, whiteSpace: 'pre-wrap' }}>{String(e)}</pre>
  }
  draw(el, node)
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
    registerPreviewStyle(fileOrCss: string, opts?: { raw: boolean }): void
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
  // Revealed blocks never come in here: this bundle runs in the admin's window and draws into the preview's iframe,
  // and Motion's useInView refuses an element of another window (`instanceof EventTarget`), so it never observes the
  // block and leaves it hidden. Show their pieces as they are, as theme.css does for reduced motion and print.
  CMS.registerPreviewStyle(
    '[data-reveal] { opacity: 1 !important; transform: none !important; stroke-dasharray: none !important; }',
    { raw: true },
  )
  // One per collection (the language is the entry's `language` field) and per Site entry (a file collection's
  // template goes by its file's name, which says the language).
  const templates: (readonly [name: string, locale?: string])[] = [
    ['pages'],
    ['services'],
    ['posts'],
    ...CMS_LOCALES.flatMap(({ code }) => [
      [`home-${code}`, code] as const,
      [`menu-${code}`, code] as const,
    ]),
  ]
  for (const [name, fixed] of templates)
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
          const locale = fixed ?? String((data as { language?: unknown })?.language ?? 'en')
          if (name.startsWith('menu-')) renderMenu(this.el, data)
          else render(this.el, data, (file) => this.props.getAsset(file).toString(), locale)
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
