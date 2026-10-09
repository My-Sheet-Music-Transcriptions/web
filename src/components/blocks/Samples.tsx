import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { Card } from '~/components/primitives/Card'
import { Icon } from '~/components/primitives/Icon'
import { Media } from '~/components/primitives/Media'
import { RevealGroup, RevealItem } from '~/components/primitives/Motion'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import type { Video } from '~/components/primitives/VideoEmbed'
import type { MediaLabels } from '~/content/types'
import { gridCols } from '~/lib/grid'

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
  /** An illustrated icon of the instrument(s), shown with `name` over the video (columns). */
  icon?: PictureSource
  /** The instrument(s) the icon shows, beside it ("Piano - Vocal") (columns). */
  name?: string
}

export interface SamplesProps extends ShellProps {
  items: Sample[]
  /** rows (default): one row per sample, the video beside the score. columns: the samples side by side, each video above its score with an arrow between. */
  variant?: 'rows' | 'columns'
  /** The words of the carousel arrows and the play button: `media` from content/<locale>/data/labels. */
  labels?: MediaLabels
  /** The still shown over each video until it is played (`~/assets/images/brand/video-poster.jpg`). */
  videoPoster?: PictureSource
}

/**
 * Our work, to compare: each sample's title, the YouTube recording (loaded on click) and the score we wrote
 * from it. `rows`: the recording beside the score, one row per sample. `columns`: the samples side by side,
 * the recording in a card with the instrument's icon and name, an arrow, then the score.
 */
export function Samples({ items, variant = 'rows', labels, videoPoster, ...shell }: SamplesProps) {
  if (variant === 'columns')
    return (
      <BlockShell {...shell} cascade>
        <ul className={`${gridCols(3, { tablet: 3 })} gap-x-8 gap-y-14`}>
          {items.map((s) => (
            <RevealGroup as="li" key={s.title} className="flex flex-col items-center gap-5">
              <RevealItem>
                <h3 className="text-center text-h3 font-bold text-ink">{s.title}</h3>
              </RevealItem>
              <RevealItem className="w-full">
                <Card padding="sm" shadow="band">
                  {s.icon || s.name ? (
                    <p className="mb-3 flex items-center gap-3 px-1 text-[13px] font-bold uppercase tracking-wide text-ink lg:text-[15px]">
                      {s.icon ? (
                        <Picture
                          image={s.icon}
                          alt=""
                          sizes="48px"
                          className="h-10 w-10 lg:h-12 lg:w-12"
                        />
                      ) : null}
                      {s.name}
                    </p>
                  ) : null}
                  <Media video={s.video} labels={labels} videoPoster={videoPoster} sizes="360px" />
                </Card>
              </RevealItem>
              <RevealItem preset="pop" className="flex">
                <Icon name="arrow-down" size={32} className="text-ink" aria-hidden="true" />
              </RevealItem>
              <RevealItem className="w-full">
                <Card padding="none" shadow="band" className="overflow-hidden">
                  <Picture
                    image={s.image}
                    alt={s.alt}
                    sizes="(min-width: 1025px) 360px, 100vw"
                    className="w-full"
                  />
                </Card>
              </RevealItem>
            </RevealGroup>
          ))}
        </ul>
      </BlockShell>
    )
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
