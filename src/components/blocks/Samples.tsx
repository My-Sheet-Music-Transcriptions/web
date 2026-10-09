import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { Media } from '~/components/primitives/Media'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import type { Video } from '~/components/primitives/VideoEmbed'
import type { MediaLabels } from '~/content/types'

/** One piece we transcribed: the recording and the first page of our score. */
export interface Sample {
  /** What it is ("Piano cover transcription"). */
  title: string
  /** The recording on YouTube. */
  video: Video
  /** The first page of the score, from the page folder. */
  image: PictureSource
  /** Alt text of the score ("Piano score of On Eagle's Wings, page 1"). */
  alt: string
}

export interface SamplesProps extends ShellProps {
  items: Sample[]
  /** The words of the carousel arrows and the play button: `media` from content/<locale>/data/labels. */
  labels?: MediaLabels
  /** The still shown over each video until it is played (`~/assets/images/brand/video-poster.jpg`). */
  videoPoster?: PictureSource
}

/**
 * Our work, to compare: one row per sample, its title and the YouTube recording (loaded on click) beside the
 * score we wrote from it.
 */
export function Samples({ items, labels, videoPoster, ...shell }: SamplesProps) {
  return (
    <BlockShell {...shell}>
      <ul className="flex flex-col gap-14">
        {items.map((s) => (
          <li key={s.title} className="grid items-center gap-8 md:grid-cols-[3fr_2fr]">
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-h3 font-bold text-ink md:text-left">{s.title}</h3>
              <Media video={s.video} labels={labels} videoPoster={videoPoster} sizes="560px" />
            </div>
            <Picture
              image={s.image}
              alt={s.alt}
              sizes="(min-width: 768px) 420px, 100vw"
              className="mx-auto w-full max-w-[360px] rounded-card shadow-card"
            />
          </li>
        ))}
      </ul>
    </BlockShell>
  )
}
