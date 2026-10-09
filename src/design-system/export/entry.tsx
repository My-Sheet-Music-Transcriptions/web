import './asset-base'
import './entry.css'
import type { ComponentType } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { SiteFooter, SiteHeader, SiteTopBar } from '~/app/SiteShell'
import { blocks } from '~/components/blocks'
import { catalogue } from '~/components/blocks/catalogue'
import { MotionProvider } from '~/components/primitives/Motion'
import { lightMarkdown } from '~/lib/light-markdown'
import { withSamples } from '~/stories/samples'

/**
 * Browser bundle of the design system (`window.MSMT`). Used by the published Design System
 * artifact's previews and by Design canvas mockups to render the real blocks.
 *
 *   MSMT.mount('PageHeader', element, { title: '...' })      // render a block into an element
 *   MSMT.renderAll()                                   // mount every [data-msmt] element
 *   <div data-msmt="Testimonials" data-props='{"title":"Reviews","items":[…]}'></div>
 */
// The layout comes as the app composes it (the site's own nav, footer and words), as on the real page.
// biome-ignore lint/suspicious/noExplicitAny: heterogeneous component map
const components: Record<string, ComponentType<any>> = {
  ...blocks,
  Header: SiteHeader,
  Footer: SiteFooter,
  TopBar: SiteTopBar,
}
const roots = new WeakMap<Element, Root>()

function mount(name: string, el: Element, props: Record<string, unknown> = {}) {
  const C = components[name]
  if (!C)
    throw new Error(
      `MSMT: unknown component "${name}". Known: ${Object.keys(components).join(', ')}`,
    )
  const { children, ...rest } = withSamples(props) as Record<string, unknown>
  const node = (
    <MotionProvider>
      <C {...rest}>{typeof children === 'string' ? lightMarkdown(children) : undefined}</C>
    </MotionProvider>
  )
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
