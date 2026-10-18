import { isPictureName, isSoundName } from '~/content/cms-fields'
import { type LinkTargets, linkProblem, markdownLinks, pathOf } from '~/content/links'
import {
  audioLine,
  POST_AUDIO,
  POST_PICTURE,
  POST_VIDEO,
  pictureLine,
  videoLine,
} from '~/content/post-template'
import { CMS_LOCALES } from './locales'

/**
 * The CMS's own widgets (Decap's `CMS.registerWidget`), registered by src/admin/preview.tsx:
 *   translation-key   a text field with the keys the site already uses as suggestions, saying which languages have
 *                     each, and refusing a key another page of the same language has;
 *   image             Decap's own picture field, redrawn once the picture has loaded: Decap draws a picture inside a
 *                     list (the sections, a carousel) before its file arrives and never again, so it stayed blank;
 *   link              where a button, a card or a menu entry leads: the language's pages offered by title, the
 *                     address checked as it is typed (src/content/links.ts);
 *   prose             Decap's text field with a link bar above it (a page of the language, another site, an email),
 *                     every [link](…) in the text checked the same way;
 *   blocks            Decap's list of blocks; while a page has none, it offers to start from another page of the same
 *                     kind and language (a starter: its blocks and words, without its pictures, recordings and
 *                     return address, which belong to that page's folder).
 * And the boxes of a blog post's rich text editor (`CMS.registerEditorComponent`, src/content/post-template.ts): a
 * picture, a YouTube video and a recording between the paragraphs.
 * Pages and their titles come from `__CMS_PAGES__`, written into the bundle by vite.admin.config.ts.
 * Decap renders widgets with its own React: they are built with its `createClass` and `h` globals.
 */

interface Immutable {
  get(key: string): unknown
  getIn(path: string[]): unknown
  toList(): { constructor: (items: unknown[]) => unknown }
  size?: number
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
    registerEditorComponent(definition: Record<string, unknown>): void
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

/** The entry's language: its `language` field (pages, services), else its folder's (a homepage, `content/<locale>/…`). */
const localeOf = ({ entry }: WidgetProps) =>
  String(entry.getIn(['data', 'language']) ?? '') ||
  (String(entry.get('path') ?? '').split('/')[1] ?? '')
/** The entry's page folder: `content/<locale>/pages/<slug>/page.json` (a new entry has no path yet). */
const slugOf = (entry: Immutable) =>
  String(entry.get('path') ?? '')
    .split('/')
    .at(-2) ?? ''

function translationKey({ createClass, h }: Decap) {
  return createClass({
    isValid(this: Widget) {
      const { value = '', entry } = this.props
      if (!KEY.test(value))
        return { error: { message: 'Lowercase letters, numbers and dashes only.' } }
      const locale = localeOf(this.props)
      const clash = (pagesByKey.get(value) ?? []).find(
        (p) => p.locale === locale && p.slug !== slugOf(entry),
      )
      return clash
        ? { error: { message: `“${clash.title}” already uses this key in ${languageOf(locale)}.` } }
        : true
    },
    render(this: Widget) {
      const { value = '', forID, classNameWrapper, onChange, entry } = this.props
      const locale = localeOf(this.props)
      const others = (pagesByKey.get(value) ?? []).filter(
        (p) => !(p.locale === locale && p.slug === slugOf(entry)),
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

// --- Links ------------------------------------------------------------------------------------------------------

/** A language's pages and what its links may lead to, as vite.admin.config.ts wrote them at build. */
export interface CmsLinkTargets {
  pages: { path: string; title: string }[]
  migrating: boolean
  moved: [string, string][]
  origins: string[]
}
declare const __CMS_PAGES__: Record<string, CmsLinkTargets> | undefined
const CMS_PAGES: Record<string, CmsLinkTargets> =
  typeof __CMS_PAGES__ === 'undefined' ? {} : __CMS_PAGES__

/** The language's pages, sorted by title, and its link rule. */
function targetsOf(locale: string) {
  const t = CMS_PAGES[locale] ?? { pages: [], migrating: true, moved: [], origins: [] }
  const rule: LinkTargets = {
    pages: new Set(t.pages.map((p) => p.path)),
    migrating: t.migrating,
    moved: new Map(t.moved),
    origins: t.origins,
  }
  const pages = [...t.pages].sort((a, b) => a.title.localeCompare(b.title, locale))
  const titleOf = (href: string) => t.pages.find((p) => p.path === pathOf(href))?.title
  /** The words a new link to a page shows by default: its title without the site's name after it. */
  const wordsOf = (href: string) => titleOf(href)?.replace(/\s+[-–—•|]\s+[^-–—•|]+$/, '')
  return { pages, rule, titleOf, wordsOf }
}

const HINT = { margin: '8px 0 0', fontSize: 13, color: '#5f6b7a' }
const ERROR = { ...HINT, color: '#d60032' }

/** What a link leads to, in a line under the field: the page's title, or the address's kind. */
function linkNote(href: string, titleOf: (href: string) => string | undefined) {
  if (!href) return ''
  if (href.startsWith('#')) return 'A part of this page.'
  if (href.startsWith('mailto:')) return 'Writes an email.'
  if (href.startsWith('tel:')) return 'Calls a phone.'
  if (/^https?:/.test(href)) return 'Another site.'
  const title = titleOf(href)
  return title ? `Page: ${title}` : 'Not on the new site yet: it opens on the current site.'
}

function link({ createClass, h }: Decap) {
  return createClass({
    isValid(this: Widget) {
      const { value = '' } = this.props
      if (!value) return true
      const problem = linkProblem(value, targetsOf(localeOf(this.props)).rule)
      return problem ? { error: { message: problem } } : true
    },
    render(this: Widget) {
      const { value = '', forID, classNameWrapper, onChange } = this.props
      const { pages, rule, titleOf } = targetsOf(localeOf(this.props))
      const problem = value && linkProblem(value, rule)
      return h(
        'div',
        null,
        h('input', {
          id: forID,
          className: classNameWrapper,
          type: 'text',
          list: `${forID}-pages`,
          autoComplete: 'off',
          placeholder: 'Pick a page, or write https://…, mailto:… or #section',
          value,
          onChange: (e: { target: { value: string } }) => onChange(e.target.value.trim()),
        }),
        h(
          'datalist',
          { id: `${forID}-pages` },
          ...pages.map((p) => h('option', { key: p.path, value: p.path, label: p.title })),
        ),
        h('p', { style: problem ? ERROR : HINT }, problem || linkNote(value, titleOf)),
      )
    },
  })
}

function prose({ CMS, createClass, h }: Decap) {
  const text = CMS.getWidget('text')
  return createClass({
    getInitialState: () => ({ picking: false, page: '' }),
    isValid(this: Widget & { problems(): string[] }) {
      const problems = this.problems()
      return problems.length ? { error: { message: problems.join(' · ') } } : true
    },
    problems(this: Widget): string[] {
      const { rule } = targetsOf(localeOf(this.props))
      return markdownLinks(this.props.value ?? '').flatMap((href) => {
        const p = linkProblem(href, rule)
        return p ? [p] : []
      })
    },
    /** Wraps the selected words (or the page's title) in a link to `href`, where the cursor is. */
    insert(this: Widget, href: string, words?: string) {
      const { value = '', forID, onChange } = this.props
      const area = document.getElementById(forID) as HTMLTextAreaElement | null
      const start = area?.selectionStart ?? value.length
      const end = area?.selectionEnd ?? value.length
      const label = value.slice(start, end) || words || href.replace(/^mailto:/, '')
      onChange(`${value.slice(0, start)}[${label}](${href})${value.slice(end)}`)
      this.setState({ picking: false, page: '' })
    },
    render(
      this: Widget<{ picking: boolean; page: string }> & {
        problems(): string[]
        insert(href: string, words?: string): void
      },
    ) {
      const { pages, wordsOf } = targetsOf(localeOf(this.props))
      const button = (label: string, onClick: () => void) =>
        h(
          'button',
          {
            type: 'button',
            onClick,
            style: {
              border: '1px solid #dfdfe3',
              borderRadius: 5,
              background: '#fff',
              padding: '4px 10px',
              fontSize: 13,
              cursor: 'pointer',
            },
          },
          label,
        )
      const ask = (question: string, make: (answer: string) => string) => () => {
        const answer = window.prompt(question)?.trim()
        if (answer) this.insert(make(answer))
      }
      const bar = h(
        'div',
        { style: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '0 0 6px' } },
        this.state.picking
          ? [
              h(
                'select',
                {
                  key: 'pick',
                  value: this.state.page,
                  onChange: (e: { target: { value: string } }) =>
                    this.setState({ page: e.target.value }),
                  style: { fontSize: 13, padding: 4, maxWidth: 360 },
                },
                h('option', { value: '' }, 'Pick a page…'),
                ...pages.map((p) =>
                  h('option', { key: p.path, value: p.path }, `${p.title} (${p.path})`),
                ),
              ),
              h(
                'span',
                { key: 'go' },
                button('Insert link', () => {
                  if (this.state.page) this.insert(this.state.page, wordsOf(this.state.page))
                }),
              ),
              h(
                'span',
                { key: 'cancel' },
                button('Cancel', () => this.setState({ picking: false })),
              ),
            ]
          : [
              h(
                'span',
                { key: 'page' },
                button('Link to a page', () => this.setState({ picking: true })),
              ),
              h(
                'span',
                { key: 'site' },
                button(
                  'Link to another site',
                  ask('Address of the other site (https://…)', (a) =>
                    /^https?:\/\//.test(a) ? a : `https://${a}`,
                  ),
                ),
              ),
              h(
                'span',
                { key: 'mail' },
                button(
                  'Link to an email',
                  ask('Email address', (a) => `mailto:${a.replace(/^mailto:/, '')}`),
                ),
              ),
            ],
      )
      const problems = this.problems()
      return h(
        'div',
        null,
        bar,
        h(text.control, { ...this.props }),
        problems.length ? h('p', { style: ERROR }, problems.join(' · ')) : null,
      )
    },
  })
}

// --- Starting a page from another --------------------------------------------------------------------------------

interface StoredPage {
  language?: string
  collection?: string
  title?: string
  blocks?: Record<string, unknown>[]
}
const stored = import.meta.glob<StoredPage>('/content/*/*/*/page.json', {
  eager: true,
  import: 'default',
})

/** The pages a new page of this kind and language can start from, by title. */
function startersFor(collection: string, locale: string) {
  return Object.entries(stored)
    .filter(([, p]) => p.collection === collection && p.language === locale && p.blocks?.length)
    .map(([file, p]) => ({ file, title: p.title ?? file, blocks: p.blocks ?? [] }))
    .sort((a, b) => a.title.localeCompare(b.title, locale))
}

/** A page's blocks for another page: without the files of its folder (pictures, recordings) and its return address. */
function starterBlocks(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(starterBlocks)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.entries(value)
      .filter(([k, v]) => k !== 'returnTo' && !isPictureName(v) && !isSoundName(v))
      .map(([k, v]) => [k, starterBlocks(v)]),
  )
}

function blocks({ CMS, createClass, h }: Decap) {
  const list = CMS.getWidget('list')
  return createClass({
    getInitialState: () => ({ from: '' }),
    render(this: Widget<{ from: string }>) {
      const { value, entry, collection } = this.props as unknown as WidgetProps & {
        value?: Immutable
      }
      const empty = !value?.size
      const locale = localeOf(this.props)
      const starters = empty ? startersFor(String(collection.get('name')), locale) : []
      // Decap keeps entries as Immutable.js values: the same kinds are made from the entry itself.
      const listOf = entry.toList().constructor
      const mapOf = (entry.get('data') as { constructor: (e: unknown) => unknown }).constructor
      const immutable = (v: unknown): unknown =>
        Array.isArray(v)
          ? listOf(v.map(immutable))
          : v && typeof v === 'object'
            ? mapOf(Object.entries(v).map(([k, x]) => [k, immutable(x)]))
            : v
      const start = () => {
        const page = starters.find((p) => p.file === this.state.from)
        if (page) this.props.onChange(immutable(starterBlocks(page.blocks)) as string)
      }
      const bar = empty
        ? h(
            'div',
            {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 8,
                margin: '0 0 10px',
                padding: 12,
                border: '1px dashed #c5c8d1',
                borderRadius: 5,
                fontSize: 14,
              },
            },
            !locale
              ? 'Pick the language first to start from one of its pages.'
              : starters.length
                ? [
                    h('span', { key: 'l' }, 'Start from another page:'),
                    h(
                      'select',
                      {
                        key: 's',
                        value: this.state.from,
                        onChange: (e: { target: { value: string } }) =>
                          this.setState({ from: e.target.value }),
                        style: { fontSize: 14, padding: 4, maxWidth: 380 },
                      },
                      h('option', { value: '' }, 'Pick a page…'),
                      ...starters.map((p) => h('option', { key: p.file, value: p.file }, p.title)),
                    ),
                    h(
                      'button',
                      {
                        key: 'b',
                        type: 'button',
                        onClick: start,
                        disabled: !this.state.from,
                        style: {
                          border: '1px solid #dfdfe3',
                          borderRadius: 5,
                          background: '#fff',
                          padding: '4px 10px',
                          cursor: 'pointer',
                        },
                      },
                      'Use its blocks',
                    ),
                    h(
                      'span',
                      { key: 'n', style: { flexBasis: '100%', fontSize: 13, color: '#5f6b7a' } },
                      'Its blocks and words are copied; add this page’s own pictures and recordings.',
                    ),
                  ]
                : 'No page of this kind in this language yet: add blocks below.',
          )
        : null
      return h('div', null, bar, h(list.control, { ...this.props }))
    },
  })
}

// --- The post body's editor components --------------------------------------------------------------------------

/**
 * The boxes of the post body's rich text editor (src/content/post-template.ts `postBody`): each is a paragraph of its
 * own in the stored text, in the syntax `postParts` reads. The picture takes the id of Decap's own image box, which
 * it replaces: the editor reads every registered box wherever it is offered, and Decap's would claim our pictures
 * first and drop their width. (Decap saves lists with "* ", which light markdown reads too.)
 */
function registerPostComponents({ CMS }: Decap) {
  CMS.registerEditorComponent({
    id: 'image',
    label: 'Picture',
    fields: [
      { name: 'image', label: 'Picture', widget: 'image', choose_url: false },
      { name: 'alt', label: 'Picture description (alt text)', widget: 'string' },
      { name: 'caption', label: 'Line under the picture', widget: 'string', required: false },
      {
        name: 'width',
        label: 'Width in px',
        widget: 'number',
        value_type: 'int',
        required: false,
        hint: 'Only for a picture smaller than the column (an icon, a small diagram).',
      },
    ],
    pattern: POST_PICTURE,
    fromBlock: (m: RegExpMatchArray) => ({
      alt: m[1],
      image: m[2],
      caption: m[3],
      width: m[4] ? Number(m[4]) : undefined,
    }),
    toBlock: pictureLine,
    toPreview: (p: { alt?: string; image?: string }) => `[${p.image ?? ''}] ${p.alt ?? ''}`,
  })
  CMS.registerEditorComponent({
    id: 'post-video',
    label: 'YouTube video',
    fields: [
      {
        name: 'youtube',
        label: 'Video id',
        widget: 'string',
        hint: 'What follows v= in the video’s address: youtube.com/watch?v=Aa30is9HYFA → Aa30is9HYFA.',
      },
      { name: 'title', label: 'Video title', widget: 'string' },
    ],
    pattern: POST_VIDEO,
    fromBlock: (m: RegExpMatchArray) => ({ youtube: m[1], title: m[2] }),
    toBlock: videoLine,
    toPreview: (v: { title?: string }) => `▶ ${v.title ?? ''}`,
  })
  CMS.registerEditorComponent({
    id: 'post-audio',
    label: 'Recording',
    fields: [
      { name: 'src', label: 'Recording (mp3)', widget: 'file', choose_url: false },
      { name: 'title', label: 'What it is', widget: 'string' },
    ],
    pattern: POST_AUDIO,
    fromBlock: (m: RegExpMatchArray) => ({ src: m[1], title: m[2] }),
    toBlock: audioLine,
    toPreview: (a: { title?: string }) => `♪ ${a.title ?? ''}`,
  })
}

export function registerWidgets(decap: Decap) {
  registerPostComponents(decap)
  decap.CMS.registerWidget('translation-key', translationKey(decap))
  decap.CMS.registerWidget('link', link(decap))
  decap.CMS.registerWidget('blocks', blocks(decap), decap.CMS.getWidget('list').preview)
  decap.CMS.registerWidget('prose', prose(decap), decap.CMS.getWidget('text').preview)
  decap.CMS.registerWidget('image', picture(decap), decap.CMS.getWidget('image').preview)
}
