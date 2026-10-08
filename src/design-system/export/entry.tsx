import './asset-base'
import './entry.css'
import type { ComponentType } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import samplePhoto from '~/assets/images/samples/office-transcriber.jpg?w=480;960&as=picture'
import { blocks } from '~/components/blocks'
import { catalogue } from '~/components/blocks/catalogue'
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header'
import { TopBar } from '~/components/layout/TopBar'
import { lightMarkdown } from '~/lib/light-markdown'

/**
 * Browser bundle of the design system (`window.MSMT`). Used by the published Design System
 * artifact's previews and by Design canvas mockups to render the real blocks.
 *
 *   MSMT.mount('Hero', element, { title: '...' })      // render a block into an element
 *   MSMT.renderAll()                                   // mount every [data-msmt] element
 *   <div data-msmt="ReviewCards" data-props='{"limit":2}'></div>
 */
// biome-ignore lint/suspicious/noExplicitAny: heterogeneous component map
const components: Record<string, ComponentType<any>> = { ...blocks, Header, Footer, TopBar }
const roots = new WeakMap<Element, Root>()

/** Preview-only placeholders: `"sample:photo"` anywhere in the props (a list item too) becomes a bundled picture. */
const samples: Record<string, unknown> = { 'sample:photo': samplePhoto }
function withSamples(value: unknown): unknown {
  if (typeof value === 'string') return value in samples ? samples[value] : value
  if (Array.isArray(value)) return value.map(withSamples)
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withSamples(v)]))
  return value
}

function mount(name: string, el: Element, props: Record<string, unknown> = {}) {
  const C = components[name]
  if (!C)
    throw new Error(
      `MSMT: unknown component "${name}". Known: ${Object.keys(components).join(', ')}`,
    )
  const { children, ...rest } = withSamples(props) as Record<string, unknown>
  const node = <C {...rest}>{typeof children === 'string' ? lightMarkdown(children) : undefined}</C>
  let root = roots.get(el)
  if (!root) {
    root = createRoot(el)
    roots.set(el, root)
  }
  root.render(node)
  return () => unmount(el)
}

function unmount(el: Element) {
  roots.get(el)?.unmount()
  roots.delete(el)
}

function renderAll(scope: ParentNode = document) {
  for (const el of scope.querySelectorAll<HTMLElement>('[data-msmt]')) {
    const name = el.dataset.msmt ?? ''
    let props: Record<string, unknown> = {}
    try {
      props = el.dataset.props ? JSON.parse(el.dataset.props) : {}
    } catch (e) {
      console.error(`MSMT: invalid data-props on ${name}`, e)
    }
    mount(name, el, props)
  }
}

const api = {
  version: __MSMT_VERSION__,
  components: Object.keys(components),
  catalogue,
  mount,
  unmount,
  renderAll,
}
;(window as unknown as { MSMT: typeof api }).MSMT = api
if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', () => renderAll())
else renderAll()

export default api
