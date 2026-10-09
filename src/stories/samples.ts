import type { PictureSource } from '~/components/primitives/Picture'
import flag from './images/flag.png?w=46;92&as=picture'
import icon from './images/icon.png?w=150;300&as=picture'
import logo from './images/logo.svg'
import mark from './images/mark.png?w=58;116;192&as=picture'
import photo from './images/photo.jpg?w=480;960&as=picture'

/**
 * Storybook's pictures, by marker: `'sample:photo'` (a studio photo), `'sample:icon'` (an illustrated icon),
 * `'sample:logo'` (the lockup, an SVG URL), `'sample:mark'` (a partner mark), `'sample:flag'`. The fixtures
 * (./data.ts) and the catalogue examples name them; stories and the design-system bundle resolve them here.
 * These files are Storybook's own copies: no story shows a picture of the site.
 */
const samples: Record<string, unknown> = {
  'sample:photo': photo,
  'sample:icon': icon,
  'sample:logo': logo,
  'sample:mark': mark,
  'sample:flag': flag,
}

/** The pictures themselves, for stories that pass one directly. */
export const sample = {
  photo: photo as PictureSource,
  icon: icon as PictureSource,
  mark: mark as PictureSource,
  flag: flag as PictureSource,
  logo: logo as string,
}

/** `value` with every sample marker (in lists and objects too) replaced by its picture. */
export function withSamples<T = unknown>(value: unknown): T {
  const resolve = (v: unknown): unknown => {
    if (typeof v === 'string') return v in samples ? samples[v] : v
    if (Array.isArray(v)) return v.map(resolve)
    if (v && typeof v === 'object')
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, resolve(x)]))
    return v
  }
  return resolve(value) as T
}
