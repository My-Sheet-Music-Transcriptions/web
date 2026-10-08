import type { PictureSource } from '~/components/primitives/Picture'

/** The round language flags (src/assets/images/flags/<locale>.png), by locale code. */
const flags = import.meta.glob<PictureSource>('./images/flags/*.png', {
  eager: true,
  import: 'default',
  query: '?w=46;92&as=picture',
})

/** The flag of a locale, or undefined when there is none. */
export function flagPicture(locale: string): PictureSource | undefined {
  return flags[`./images/flags/${locale}.png`]
}
