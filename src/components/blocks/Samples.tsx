import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { tones } from '~/components/primitives/tones'
import { type Video, VideoEmbed } from '~/components/primitives/VideoEmbed'
import { cn } from '~/lib/cn'
import { useTitleId } from '~/lib/use-title-id'

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

export interface SamplesProps {
  title?: string
  items: Sample[]
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id. */
  id?: string
}

/** Our work, to compare: each sample's recording beside the score we wrote from it. */
export function Samples({ title, items, tone = 'white', id }: SamplesProps) {
  const titleId = useTitleId(id)
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-[50px]', tones[tone])}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="container-content">
        {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
        <ul className="mt-10 flex flex-col gap-14">
          {items.map((s) => (
            <li key={s.title} className="grid items-center gap-8 md:grid-cols-[3fr_2fr]">
              <div className="flex flex-col gap-4">
                <h3 className="text-center text-h3 font-bold text-ink md:text-left">{s.title}</h3>
                <VideoEmbed {...s.video} />
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
      </div>
    </section>
  )
}
