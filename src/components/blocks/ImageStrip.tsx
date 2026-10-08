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
  'strip-piano-9': 'Printed lead sheet on a wooden table next to a plant',
  'strip-piano-3': 'Piano songbook open on a stand above a digital keyboard',
  'strip-piano-4': 'Piano score resting on the keys of a piano',
}

export interface ImageStripProps {
  /** Image ids under src/assets/images/home (strip-*.jpg). Defaults to the homepage set. */
  items?: string[]
}

/**
 * Strip of 250x374 sheet-music photos that scrolls by on its own, as on the live site (one photo every
 * 8 s, endless: the list is drawn twice and slides by half its width). It stops for reduced-motion users
 * and while hovered or focused. Hidden on phones, like the live site.
 */
export function ImageStrip({
  items = [
    'strip-guitar-3',
    'strip-piano-10',
    'strip-piano-5',
    'strip-piano-8',
    'strip-piano-7',
    'strip-piano-6',
    'strip-piano-9',
    'strip-guitar-4',
    'strip-piano-3',
    'strip-piano-4',
  ],
}: ImageStripProps) {
  const photos = items.flatMap((id) => {
    const img = images[`../../assets/images/home/${id}.jpg`]
    return img ? [{ id, img }] : []
  })
  return (
    <section
      aria-label="Examples of our sheet music"
      className="hidden overflow-hidden pt-[107px] pb-[70px] md:block"
    >
      <div className="group mx-[-80px] flex w-max motion-safe:animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex gap-5 pr-5" aria-hidden={copy === 1 ? 'true' : undefined}>
            {photos.map(({ id, img }) => (
              <li key={id} className="w-[250px] shrink-0">
                <Picture
                  image={img}
                  alt={copy === 0 ? (alts[id] ?? '') : ''}
                  sizes="250px"
                  className="h-[374px] w-[250px] rounded-card object-cover"
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  )
}
