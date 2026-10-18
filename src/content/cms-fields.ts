import type { PictureSource } from '../components/primitives/Picture.tsx'
import type { FaqGroup, FaqItem } from './types.ts'

/**
 * The CMS fields of a block (src/components/blocks/cms.ts): what a writer can fill in for each prop, in one typed
 * vocabulary that three things are made from, so they cannot disagree:
 *   - Decap's form for the block (`decapField`, written into /admin/config.yml by vite.admin.config.ts),
 *   - the check of every stored page.json (`checkFields`, at build and in the unit tests),
 *   - the props the block gets from what was stored (`decodeFields`: pictures, recordings, lists from the locale's
 *     data, table rows).
 * Each field carries the type of the value it produces, and `CmsFields<Props>` only accepts a field for a prop of a
 * matching type (a required prop needs a required field), so a field that no longer fits its block is a type error.
 *
 * Imported by Node directly (the admin build's config): relative imports with extensions and type imports only.
 */

type Kind =
  | 'string'
  | 'text'
  | 'link'
  | 'number'
  | 'boolean'
  | 'select'
  | 'image'
  | 'file'
  | 'data'
  | 'object'
  | 'list'

export interface Field<V = unknown, R extends boolean = boolean> {
  readonly kind: Kind
  readonly label: string
  readonly hint?: string
  readonly required: R
  /** select: the values offered; data: the names of the exports offered. */
  readonly options?: readonly (string | number)[]
  /** data: the file of content/<locale>/data each export offered is in (`{ homeReviews: 'reviews' }`). */
  readonly sources?: Readonly<Record<string, string>>
  /** image: the srcset widths the picture is built at, where they differ from its block's (`1000;1600`). */
  readonly widths?: string
  /** number: the range, whole numbers only. */
  readonly min?: number
  readonly max?: number
  /** object, and a list of objects: their fields. */
  readonly fields?: Readonly<Record<string, Field>>
  /** A list of single values: the field of one value. */
  readonly of?: Field
  /** The line Decap shows for a collapsed list item or object (`{{fields.alt}}`). */
  readonly summary?: string
  readonly default?: unknown
  /** What the block gets when the field is left empty (`''`: a decorative picture's alt). */
  readonly empty?: unknown
  /** What the block gets where its props need another shape than the CMS can edit (a table row). */
  readonly decode?: (stored: never) => unknown
  /** More of Decap's own options for this field (a `pattern`, another `widget`, a date `format`), as they are. */
  readonly decap?: Readonly<Record<string, unknown>>
  /** The value's type, for `CmsFields`; never set. */
  readonly __value?: V
}

type Opts<R extends boolean> = {
  hint?: string
  required?: R
  default?: unknown
  empty?: unknown
  decap?: Readonly<Record<string, unknown>>
}
// `Is<R>` rather than `R` in the result: TypeScript would otherwise infer R from where the field is used (a required
// prop) and accept a field the writer may leave empty.
type Is<R> = R extends true ? true : false
const make = <V, R extends boolean>(
  kind: Kind,
  label: string,
  { required, ...rest }: Opts<R> & Partial<Field> = {},
) => ({ kind, label, required: required ?? false, ...rest }) as Field<V, Is<R>>

/** One line of text. */
export const line = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<string, R>('string', label, o)
/**
 * Several lines: light markdown (paragraphs, "- " lists, **bold**, [links](/path)), edited in the CMS's `prose` widget
 * (a link button that picks a page of the language; links checked as they are written).
 */
export const prose = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<string, R>('text', label, o)
/**
 * Where a button or a card leads: a page of the language (`/precios`, `/#contact`), another site, mailto: or tel:
 * (src/content/links.ts), edited in the CMS's `link` widget (the language's pages offered by title, checked as typed).
 */
export const link = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<string, R>('link', label, o)
/** A whole number from `min` to `max` (a literal union type when the prop is one: `number<2 | 3>(…)`). */
export const number = <V extends number = number, R extends boolean = false>(
  label: string,
  o: Opts<R> & { min: number; max: number },
) => make<V, R>('number', label, o)
export const toggle = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<boolean, R>('boolean', label, o)
/** One of a few values, offered in a menu. */
export const select = <const O extends readonly (string | number)[], R extends boolean = false>(
  label: string,
  options: O,
  o?: Opts<R>,
) => make<O[number], R>('select', label, { ...o, options })
/** A picture of the page folder, stored as its file name, which a meta field keeps as it is (og.image.src). */
export const pictureFile = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<string, R>('image', label, o)
/** A picture of the page folder, stored as its file name, which a block gets as a picture. */
export const picture = <R extends boolean = false>(
  label: string,
  o?: Opts<R> & { widths?: string },
) => make<PictureSource, R>('image', label, o)
/** A recording of the page folder (an mp3), stored as its file name, which a block gets as its URL. */
export const sound = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<string, R>('file', label, o)
/** A short video of the page folder (an mp4), stored by file name; the block gets its URL. */
export const movie = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<string, R>('file', label, o)
/**
 * One of a few lists or values kept in code, in content/<locale>/data/<file>.ts (the reviews, the prices, a form's
 * words), offered by export name in a menu and stored as that name; the block gets the export of the page's locale.
 * `sources` maps each name to its file. Typed in src/components/blocks/cms.ts (`fromData`) by what the English
 * files export.
 */
export const data = <V, R extends boolean = false>(
  label: string,
  sources: Readonly<Record<string, string>>,
  o?: Opts<R>,
) => make<V, R>('data', label, { ...o, sources, options: Object.keys(sources) })

type Fields = Readonly<Record<string, Field>>
// The constraint of a group's fields as written: not `Fields`, whose `Field<unknown, boolean>` would make TypeScript
// infer every field in it as optional.
type FieldsIn = Readonly<Record<string, object>>
type ValueOf<F> = F extends Field<infer V> ? V : never
type ReqKeys<F extends FieldsIn> = {
  [K in keyof F]: F[K] extends Field<unknown, true> ? K : never
}[keyof F]
/** The value of a group of fields: a required field is a required key. */
type Group<F extends FieldsIn> = { [K in ReqKeys<F>]: ValueOf<F[K]> } & {
  [K in Exclude<keyof F, ReqKeys<F>>]?: ValueOf<F[K]>
}

/** A group of fields (a button: label and link). An optional group is all or nothing. */
export const group = <const F extends FieldsIn, R extends boolean = false>(
  label: string,
  fields: F,
  o?: Opts<R>,
) => make<Group<F>, R>('object', label, { ...o, fields: fields as Fields })
/** A list of items, each a group of fields. */
export const list = <const F extends FieldsIn, R extends boolean = false>(
  label: string,
  fields: F,
  o?: Opts<R> & { summary?: string },
) => make<Group<F>[], R>('list', label, { ...o, fields: fields as Fields })
/** A list of single values (a table's column headings). */
export const listOf = <V, R extends boolean = false>(label: string, of: Field<V>, o?: Opts<R>) =>
  make<V[], R>('list', label, { ...o, of })

/** `[label](href)` alone in a table cell: a link cell. */
const LINK_CELL = /^\[([^\]]+)\]\(([^)\s]+)\)$/
type Cell = string | { label: string; href: string }

/**
 * A table's rows: a list of lists cannot be edited in Decap, so a row is stored `{ "cells": [...] }`, and a link cell
 * is written `[See more](/job/x)`.
 */
export const tableRows = <R extends boolean = false>(label: string, o?: Opts<R>) =>
  make<Cell[][], R>('list', label, {
    ...o,
    summary: '{{fields.cells}}',
    fields: {
      cells: listOf('Cells', line('Cell'), {
        required: true,
        hint: 'One per column. A link cell is written [Label](/path).',
      }),
    },
    decode: (rows: { cells?: string[] }[]) =>
      rows.map((row) =>
        (row.cells ?? []).map((cell): Cell => {
          const link = LINK_CELL.exec(cell.trim())
          return link ? { label: link[1] ?? '', href: link[2] ?? '' } : cell
        }),
      ),
  })

/**
 * A FAQ's groups: each either one of the shared groups kept in code (`shared`, a data field the CMS types by its
 * sources) or the page's own questions, written in place; the block gets FaqGroups either way.
 */
export const faqGroups = <R extends boolean = false>(
  label: string,
  shared: Field<FaqGroup>,
  o?: Opts<R>,
) =>
  make<FaqGroup[], R>('list', label, {
    ...o,
    summary: '{{fields.shared}} {{fields.title}}',
    fields: {
      shared,
      title: line('Heading', { hint: 'Of the page’s own questions, written below.' }),
      id: line('Anchor id', { hint: 'For the jump buttons: lowercase, dashes.' }),
      items: list(
        'Questions',
        {
          question: line('Question', { required: true }),
          answer: prose('Answer', { required: true }),
        },
        { summary: '{{fields.question}}' },
      ),
    },
    decode: (groups: { shared?: FaqGroup; title?: string; id?: string; items?: FaqItem[] }[]) =>
      groups.map((g): FaqGroup => g.shared ?? { title: g.title, id: g.id, items: g.items ?? [] }),
  })

// --- A block's fields, typed by its props ---------------------------------------------------------------------

/**
 * Props the CMS never sets: `children` is the `body` field, `labels` comes from the locale's words, `videoPoster` from
 * its brand.
 */
type Hidden = 'children' | 'labels' | 'videoPoster'
type Req<P> = { [K in keyof P]-?: undefined extends P[K] ? never : K }[keyof P]

/**
 * The fields a block may have: one per prop, of the prop's type, required wherever the prop is (and present: a
 * required prop must have a field); `body` (light markdown) where the block takes children.
 */
export type CmsFields<P> = {
  [K in Exclude<Req<P>, Hidden>]: Field<P[K], true>
} & {
  [K in Exclude<keyof P, Req<P> | Hidden>]?: Field<NonNullable<P[K]>>
} & ('children' extends keyof P ? { body?: Field<string> } : { body?: never })

export interface CmsBlock<P = unknown> {
  /** The block's name in the CMS's "Add block" menu. */
  label: string
  /**
   * A preset: the catalogue block it renders, when the entry's own name is not one (a `ServiceGrid` is a
   * PictureGrid of the services), with `props` set for the writer.
   */
  block?: string
  /** Props the CMS sets itself, whatever the writer fills in (a preset's variant). */
  props?: Partial<P>
  /** The line Decap shows for a collapsed block (`{{fields.title}}`). */
  summary?: string
  /**
   * The locale's words (content/<locale>/data/labels.ts) the block gets as `labels`; with `mediaLabels`, also the
   * brand's video poster (content/<locale>/data/brand.ts) as `videoPoster`.
   */
  words?: 'mediaLabels' | 'reviewLabels' | 'shareLabels'
  /** The srcset widths its pictures are built at (vite-imagetools `w=`), as on hand-built pages. */
  pictureWidths: string
  /** A list the block gets as `items` without a field for it: `posts`, the page's language's blog posts. */
  feed?: 'posts'
  fields: CmsFields<P>
}

/** Any block's CMS entry, its props no longer known (to walk the list). */
export type AnyCmsBlock = Omit<CmsBlock, 'fields'> & { fields: Readonly<Record<string, Field>> }

// --- Decap ----------------------------------------------------------------------------------------------------

const WIDGETS: Record<Kind, string> = {
  string: 'string',
  text: 'prose',
  link: 'link',
  number: 'number',
  boolean: 'boolean',
  select: 'select',
  image: 'image',
  file: 'file',
  data: 'select',
  object: 'object',
  list: 'list',
}

/**
 * The Decap field of a field. Inside an optional group every field is optional for Decap (it refuses to save an
 * empty optional group whose fields are required); `checkFields` keeps such a group all or nothing.
 */
export function decapField(name: string, f: Field, inOptional = false): Record<string, unknown> {
  const fields = f.fields
    ? Object.entries(f.fields).map(([n, sub]) =>
        decapField(n, sub, inOptional || (f.kind === 'object' && !f.required)),
      )
    : undefined
  return {
    name,
    label: f.label,
    widget: WIDGETS[f.kind],
    required: f.required && !inOptional,
    ...(f.hint && { hint: f.hint }),
    ...(f.default !== undefined && { default: f.default }),
    ...(f.options && { options: f.options }),
    ...(f.kind === 'number' && { value_type: 'int', min: f.min, max: f.max }),
    ...((f.kind === 'image' || f.kind === 'file') && { choose_url: false }),
    ...(f.kind === 'object' && !f.required && { collapsed: true }),
    ...(f.summary && { summary: f.summary }),
    ...(fields && { fields }),
    ...(f.of && { field: decapField(name.replace(/s$/, ''), f.of) }),
    ...f.decap,
  }
}

// --- Checking and decoding what was stored --------------------------------------------------------------------

const PICTURE = /^[a-z0-9][a-z0-9._-]*\.(jpe?g|png|webp|avif)$/i

/** A picture of the page folder, as an image field names it. */
export const isPictureName = (value: unknown): value is string =>
  typeof value === 'string' && PICTURE.test(value)

const SOUND = /^[a-z0-9][a-z0-9._-]*\.(mp3|m4a|ogg|wav|mp4|webm)$/i

/** A recording (or a clip's mp4) of the page folder, as a file field names it. */
export const isSoundName = (value: unknown): value is string =>
  typeof value === 'string' && SOUND.test(value)

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v)

/** What is wrong with a stored value, one line per problem (`at` is where: `blocks[2].cta.href`). */
export function checkField(f: Field, value: unknown, at: string): string[] {
  switch (f.kind) {
    case 'string':
    case 'text':
    case 'link':
      return typeof value === 'string' ? [] : [`${at}: expected text`]
    case 'boolean':
      return typeof value === 'boolean' ? [] : [`${at}: expected true or false`]
    case 'number':
      return Number.isInteger(value) &&
        (value as number) >= (f.min ?? -Infinity) &&
        (value as number) <= (f.max ?? Infinity)
        ? []
        : [`${at}: expected a whole number from ${f.min} to ${f.max}`]
    case 'select':
    case 'data':
      return f.options?.includes(value as string)
        ? []
        : [`${at}: expected one of ${f.options?.join(', ')}`]
    case 'image':
      return isPictureName(value) ? [] : [`${at}: expected a picture's file name (photo.jpg)`]
    case 'file':
      return isSoundName(value)
        ? []
        : [`${at}: expected a recording's or a video's file name (piece.mp3, clip.mp4)`]
    case 'object':
      return isRecord(value)
        ? checkFields(f.fields ?? {}, value, at)
        : [`${at}: expected a group of fields`]
    case 'list':
      if (!Array.isArray(value)) return [`${at}: expected a list`]
      return value.flatMap((item, i) =>
        f.of
          ? checkField(f.of, item, `${at}[${i}]`)
          : isRecord(item)
            ? checkFields(f.fields ?? {}, item, `${at}[${i}]`)
            : [`${at}[${i}]: expected a group of fields`],
      )
  }
}

/** What is wrong with a stored group of fields: unknown keys, missing required fields, wrong values. */
export function checkFields(fields: Fields, value: Record<string, unknown>, at: string): string[] {
  const unknown = Object.keys(value)
    .filter((k) => !(k in fields))
    .map((k) => `${at}.${k}: not a field here (fields: ${Object.keys(fields).join(', ')})`)
  return [
    ...unknown,
    ...Object.entries(fields).flatMap(([k, f]) =>
      value[k] === undefined
        ? f.required
          ? [`${at}.${k}: required (${f.label})`]
          : []
        : checkField(f, value[k], `${at}.${k}`),
    ),
  ]
}

/** How stored names become values: a picture or a recording of the page folder, an export of the locale's data. */
export interface Resolve {
  /** `widths`: the field's own srcset widths, when it has them. */
  picture(file: string, widths?: string): unknown
  file(file: string): unknown
  data(file: string, name: string): unknown
}

/**
 * A stored group of fields as the block's props: pictures, recordings and data through `resolve` at any depth, then
 * each field's decoder on the result (a table's rows, a FAQ's groups).
 */
export function decodeFields(
  fields: Fields,
  value: Record<string, unknown>,
  resolve: Resolve,
): Record<string, unknown> {
  const decode = (f: Field | undefined, v: unknown): unknown => {
    if (!f || v === undefined) return v
    let out: unknown = v
    if (f.kind === 'image') out = isPictureName(v) ? resolve.picture(v, f.widths) : v
    else if (f.kind === 'file') out = isSoundName(v) ? resolve.file(v) : v
    else if (f.kind === 'data')
      out = typeof v === 'string' && f.sources?.[v] ? resolve.data(f.sources[v], v) : v
    else if (f.kind === 'object' && isRecord(v)) out = decodeFields(f.fields ?? {}, v, resolve)
    else if (f.kind === 'list' && Array.isArray(v))
      out = v.map((item) =>
        f.of
          ? decode(f.of, item)
          : isRecord(item)
            ? decodeFields(f.fields ?? {}, item, resolve)
            : item,
      )
    return f.decode ? (f.decode as (s: unknown) => unknown)(out) : out
  }
  const empties = Object.entries(fields).flatMap(([k, f]) =>
    f.empty !== undefined && value[k] === undefined ? [[k, f.empty] as const] : [],
  )
  return Object.fromEntries([
    ...empties,
    ...Object.entries(value).map(([k, v]) => [k, decode(fields[k], v)] as const),
  ])
}
