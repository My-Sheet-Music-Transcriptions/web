import { CMS_LOCALES } from './locales'

/**
 * The CMS's own widgets (Decap's `CMS.registerWidget`), registered by src/admin/preview.tsx:
 *   translation-key   a text field with the keys the site already uses as suggestions, saying which languages have
 *                     each, and refusing a key another page of the same language has;
 *   image             Decap's own picture field, redrawn once the picture has loaded: Decap draws a picture inside a
 *                     list (the sections, a carousel) before its file arrives and never again, so it stayed blank.
 * Decap renders widgets with its own React: they are built with its `createClass` and `h` globals.
 */

interface Immutable {
  get(key: string): unknown
}
interface WidgetProps {
  value?: string
  field: Immutable
  forID: string
  classNameWrapper: string
  collection: Immutable
  entry: Immutable
  onChange(value: string): void
  getAsset(path: string, field?: Immutable): { path?: string; toString(): string }
}
interface Widget<S = object> {
  props: WidgetProps
  state: S
  setState(state: Partial<S>): void
}
export interface Decap {
  CMS: {
    registerWidget(name: string, control: unknown, preview?: unknown): void
    getWidget(name: string): { control: unknown; preview?: unknown }
  }
  createClass(spec: Record<string, unknown>): unknown
  h(type: unknown, props: Record<string, unknown> | null, ...children: unknown[]): unknown
}

// --- Translation keys -----------------------------------------------------------------------------------------

interface PageRef {
  locale: string
  slug: string
  title: string
}

/** Every page's translation key, hand-built (meta.ts) and CMS-edited (page.json), at build time. */
const metas = {
  ...import.meta.glob<{ translationKey: string; title: string }>('/content/*/*/*/meta.ts', {
    eager: true,
    import: 'default',
  }),
  ...import.meta.glob<{ translationKey: string; title: string }>('/content/*/*/*/page.json', {
    eager: true,
    import: 'default',
  }),
}
const pagesByKey = new Map<string, PageRef[]>()
for (const [file, meta] of Object.entries(metas)) {
  const [, , locale = '', , slug = ''] = file.split('/')
  const list = pagesByKey.get(meta.translationKey) ?? []
  list.push({ locale, slug, title: meta.title })
  pagesByKey.set(meta.translationKey, list)
}
const languageOf = (code: string) => CMS_LOCALES.find((l) => l.code === code)?.label ?? code
const KEY = /^[a-z0-9][a-z0-9-]*$/

/** The collection's language: `pages-<locale>`. */
const localeOf = (props: WidgetProps) => String(props.collection.get('name')).split('-').pop() ?? ''

function translationKey({ createClass, h }: Decap) {
  return createClass({
    isValid(this: Widget) {
      const { value = '', entry } = this.props
      if (!KEY.test(value))
        return { error: { message: 'Lowercase letters, numbers and dashes only.' } }
      const locale = localeOf(this.props)
      const clash = (pagesByKey.get(value) ?? []).find(
        (p) => p.locale === locale && p.slug !== entry.get('slug'),
      )
      return clash
        ? { error: { message: `“${clash.title}” already uses this key in ${languageOf(locale)}.` } }
        : true
    },
    render(this: Widget) {
      const { value = '', forID, classNameWrapper, onChange, entry } = this.props
      const locale = localeOf(this.props)
      const others = (pagesByKey.get(value) ?? []).filter(
        (p) => !(p.locale === locale && p.slug === entry.get('slug')),
      )
      const note = !value
        ? ''
        : others.length
          ? `Linked to: ${others.map((p) => `${p.title} (${languageOf(p.locale)})`).join(', ')}`
          : 'No other page uses this key yet: this page has no translations.'
      return h(
        'div',
        null,
        h('input', {
          id: forID,
          className: classNameWrapper,
          type: 'text',
          list: `${forID}-keys`,
          autoComplete: 'off',
          value,
          onChange: (e: { target: { value: string } }) => onChange(e.target.value.trim()),
        }),
        h(
          'datalist',
          { id: `${forID}-keys` },
          ...[...pagesByKey].map(([key, pages]) =>
            h('option', {
              key,
              value: key,
              label: pages.map((p) => `${p.title} (${languageOf(p.locale)})`).join(', '),
            }),
          ),
        ),
        note && h('p', { style: { margin: '8px 0 0', fontSize: 13, color: '#5f6b7a' } }, note),
      )
    },
  })
}

// --- Pictures -------------------------------------------------------------------------------------------------

/** Decap's stand-in while a picture loads. */
const LOADING = 'empty.svg'

function picture({ CMS, createClass, h }: Decap) {
  const image = CMS.getWidget('image')
  return createClass({
    getInitialState: () => ({ loaded: false }),
    componentDidMount(this: Widget<{ loaded: boolean }> & { wait(): void }) {
      this.wait()
    },
    componentDidUpdate(this: Widget<{ loaded: boolean }> & { wait(): void }, before: WidgetProps) {
      if (before.value !== this.props.value) this.setState({ loaded: false })
      this.wait()
    },
    componentWillUnmount(this: { timer?: number }) {
      clearTimeout(this.timer)
    },
    wait(this: Widget<{ loaded: boolean }> & { timer?: number; wait(): void }) {
      clearTimeout(this.timer)
      const { value, field, getAsset } = this.props
      if (!value || this.state.loaded) return
      if (getAsset(value, field).path === LOADING)
        this.timer = window.setTimeout(() => this.wait(), 250)
      else this.setState({ loaded: true })
    },
    render(this: Widget<{ loaded: boolean }>) {
      // A new key once loaded: Decap's control only draws the picture it had when it mounted.
      return h(image.control, { ...this.props, key: this.state.loaded ? 'loaded' : 'loading' })
    },
  })
}

export function registerWidgets(decap: Decap) {
  decap.CMS.registerWidget('translation-key', translationKey(decap))
  decap.CMS.registerWidget('image', picture(decap), decap.CMS.getWidget('image').preview)
}
