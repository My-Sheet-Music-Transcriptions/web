import type { PictureSource } from '~/components/primitives/Picture'

/**
 * The brand's illustrated icons (src/assets/images/icons: instruments, services, audiences, features), by
 * file name, as responsive pictures. Data and pages name an icon (`icon: 'piano'`); blocks resolve it here.
 */
const pictures = import.meta.glob<PictureSource>('./images/icons/*.{png,webp}', {
  eager: true,
  import: 'default',
  query: '?w=150;300&as=picture',
})

const byName = Object.fromEntries(
  Object.entries(pictures).map(([file, picture]) => [
    file.replace(/^.*\/([^/]+)\.\w+$/, '$1'),
    picture,
  ]),
)

/** The icon called `name` (file name without extension), or undefined when there is none. */
export function iconPicture(name: string | undefined): PictureSource | undefined {
  return name ? byName[name] : undefined
}

/** Every icon name, for stories and checks. */
export const iconNames = Object.keys(byName).sort()
