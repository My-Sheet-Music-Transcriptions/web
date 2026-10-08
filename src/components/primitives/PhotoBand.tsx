import type { ReactNode } from 'react'
import { cn } from '~/lib/cn'
import { Picture, type PictureSource } from './Picture'
import { WaveDivider } from './WaveDivider'

export interface PhotoBandProps {
  /** The full-bleed photo behind the band (darkened by a 32% grey veil). */
  image: PictureSource
  /** The band's white, centred heading. */
  title: string
  /** Id of the heading; the section is labelled by it. */
  titleId: string
  /** Anchor id of the section. */
  id?: string
  /** Spacing and photo crop: `stats` (the rating banner) or `cards` (white cards over the photo). */
  preset?: 'stats' | 'cards'
  children: ReactNode
}

const presets = {
  stats: {
    section: 'px-4 pt-[140px] pb-[100px] md:my-[50px] md:px-[10px] md:pt-[110px] md:pb-[110px]',
    image: 'object-[center_42%]',
    inner: 'mx-auto max-w-[1140px] text-center',
    heading: 'leading-[32px]',
    bottomHeight: undefined,
  },
  cards: {
    section: 'my-[50px] pt-[30px] pb-[113px] md:min-h-[700px] md:pt-[100px] md:pb-[100px]',
    image: 'object-center',
    inner: 'mx-auto max-w-[1140px] px-[10px] pt-10 text-center md:px-0 md:pt-[50px]',
    heading: 'leading-8',
    bottomHeight: 39,
  },
}

/**
 * Full-bleed photo band with white wavy edges and a white heading: the backdrop of the rating banner and of
 * white cards set over a photo (CardGrid `background="photo"`). One place for the veil, waves and spacing.
 */
export function PhotoBand({
  image,
  title,
  titleId,
  id,
  preset = 'cards',
  children,
}: PhotoBandProps) {
  const p = presets[preset]
  return (
    <section
      id={id}
      className={cn('relative isolate overflow-hidden text-white', p.section)}
      aria-labelledby={titleId}
    >
      <Picture
        image={image}
        alt=""
        sizes="100vw"
        className={cn('absolute inset-0 -z-20 h-full w-full object-cover', p.image)}
        pictureClassName="contents"
      />
      <div className="absolute inset-0 -z-10 bg-[#3a3a3a] opacity-[0.32]" aria-hidden="true" />
      <WaveDivider position="top" width={138} mobileHeight={20} mobileWidth={266} />
      <WaveDivider
        position="bottom"
        height={p.bottomHeight}
        width={135}
        mobileHeight={20}
        mobileWidth={266}
      />
      <div className={p.inner}>
        <h2
          id={titleId}
          className={cn('text-[28px] font-bold text-white md:text-h2 md:leading-8', p.heading)}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}
