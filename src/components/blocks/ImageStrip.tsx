import { Picture, type PictureSource } from '~/components/primitives/Picture'

const images = import.meta.glob<PictureSource>('../../assets/images/home/strip-*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=250;500&as=picture',
})
const alts: Record<string, string> = {
  'strip-guitar-3': 'Guitar tab sheet music next to an acoustic guitar',
  'strip-guitar-4': 'Sheet music pages on a table with a guitar',
  'strip-piano-5': 'Open piano score on a keyboard',
  'strip-piano-6': 'Piano sheet music book open on a music stand',
  'strip-piano-7': 'Close-up of a handwritten-style piano score',
  'strip-piano-8': 'Pianist playing from a printed score',
  'strip-piano-10': 'Vocal and piano score on a digital piano',
}

export interface ImageStripProps {
  /** Image ids under src/assets/images/home (strip-*.jpg). Defaults to the homepage set. */
  items?: string[]
}

/** Horizontal strip of rounded sheet-music photos; scrolls on touch, no autoplay. */
export function ImageStrip({
  items = [
    'strip-guitar-3',
    'strip-piano-10',
    'strip-piano-5',
    'strip-piano-8',
    'strip-piano-7',
    'strip-piano-6',
  ],
}: ImageStripProps) {
  return (
    <section aria-label="Examples of our sheet music" className="pb-section">
      <ul
        className="flex snap-x gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] focus-visible:outline-3 focus-visible:outline-primary lg:justify-center"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a horizontally scrollable region must be keyboard reachable
        tabIndex={0}
        aria-label="Scroll through photos of our sheet music"
      >
        {items.map((id) => {
          const img = images[`../../assets/images/home/${id}.jpg`]
          if (!img) return null
          return (
            <li key={id} className="w-[220px] shrink-0 snap-center overflow-hidden rounded-card">
              <Picture
                image={img}
                alt={alts[id] ?? ''}
                sizes="220px"
                className="h-[300px] w-[220px] object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
