import type { Audio } from '~/components/primitives/AudioPlayer'
import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { Card } from '~/components/primitives/Card'
import { CtaLink } from '~/components/primitives/CtaLink'
import { Icon } from '~/components/primitives/Icon'
import { Lightbox } from '~/components/primitives/Lightbox'
import { Media } from '~/components/primitives/Media'
import { RevealGroup, RevealItem } from '~/components/primitives/Motion'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { PriceTag } from '~/components/primitives/PriceTag'
import { Tabs, useTabs } from '~/components/primitives/Tabs'
import type { Video } from '~/components/primitives/VideoEmbed'
import type { MediaLabels, Price, PriceTone } from '~/content/types'
import { gridCols } from '~/lib/grid'
import { fill } from '~/lib/strings'

/** One piece we transcribed: the recording (a video or an audio file) and the first page of our score. */
export interface Sample {
  /** What it is ("Piano cover transcription"), or, when priced, the level or instrument ("Easy", "Guitar tabs"). */
  title: string
  /** The recording on YouTube. */
  video?: Video
  /** The recording as an audio file from the page folder, instead of a video. */
  audio?: Audio
  /** The first page of the score, from the page folder. */
  image: PictureSource
  /** Alt text of the score ("Piano score of On Eagle's Wings, page 1"). */
  alt: string
  /** An illustrated icon of the instrument(s), shown with `name` over the recording (columns). */
  icon?: PictureSource
  /** The instrument(s) the icon shows, beside it ("Piano - Vocal") (columns). */
  name?: string
  /** The price of this kind of transcription: the title becomes a coloured header above it (a pricing chart). */
  price?: Price
  /** The colour of the price header (teal by default). */
  tone?: PriceTone
  /** Where the sample leads: its service page, as a button under the score. */
  href?: string
  /** The button's words ("Go to guitar tabs page"). */
  linkLabel?: string
}

/** One set of samples to switch to: the same samples priced in another currency. */
export interface SampleTab {
  label: string
  items: Sample[]
}

export interface SamplesProps extends ShellProps {
  items?: Sample[]
  /** Instead of items: sets of samples behind buttons (one per currency). */
  tabs?: SampleTab[]
  /** rows (default): one row per sample, the video beside the score. columns: the samples side by side, each recording above its score with an arrow between. */
  variant?: 'rows' | 'columns'
  /** Samples per row from desktop up (columns): three (default) or two, larger. */
  columns?: 2 | 3
  /** The words of the carousel arrows and the play buttons: `media` from content/<locale>/data/labels. */
  labels?: MediaLabels
  /** The still shown over each video until it is played (`~/assets/images/brand/video-poster.jpg`). */
  videoPoster?: PictureSource
  /** Each score opens larger when clicked, to be read (the pricing chart). */
  zoom?: boolean
}

/** The first page of a sample's score, which opens larger when clicked with `zoom`. */
function Score({
  sample,
  sizes,
  className,
  zoom,
  labels,
}: {
  sample: Sample
  sizes: string
  className: string
  zoom?: boolean
  labels?: MediaLabels
}) {
  const picture = (
    <Picture image={sample.image} alt={sample.alt} sizes={sizes} className={className} />
  )
  if (!zoom || !labels?.enlarge || !labels.close) return picture
  return (
    <Lightbox
      image={sample.image}
      alt={sample.alt}
      openLabel={fill(labels.enlarge, { alt: sample.alt })}
      closeLabel={labels.close}
    >
      {picture}
    </Lightbox>
  )
}

/**
 * Our work, to compare: each sample's title, the recording (a YouTube video loaded on click, or an audio file
 * in a player) and the score we wrote from it. `rows`: the recording beside the score, one row per sample.
 * `columns`: side by side, the recording in a card with the instrument's icon and name, an arrow, then the
 * score. A `price` makes the title a price header, a link adds a button, `tabs` switch currencies (a pricing
 * chart), and `zoom` opens a score larger when clicked.
 */
export function Samples({
  items = [],
  tabs,
  variant = 'rows',
  labels,
  videoPoster,
  zoom,
  columns = 3,
  ...shell
}: SamplesProps) {
  const [tab, setTab] = useTabs(tabs ? tabs.map((t) => t.label) : [])
  const shown = tabs ? (tabs[tab]?.items ?? []) : items
  if (variant === 'columns')
    return (
      <BlockShell {...shell} cascade>
        {tabs ? <Tabs tabs={tabs.map((t) => t.label)} active={tab} onChange={setTab} /> : null}
        <ul className={`${gridCols(columns, { tablet: columns })} gap-x-grid-gap-lg gap-y-14`}>
          {shown.map((s) => (
            <RevealGroup as="li" key={s.title} className="flex flex-col items-center gap-5">
              <RevealItem className="w-full">
                {s.price ? (
                  <PriceTag title={s.title} tone={s.tone} price={s.price} surface="cream" />
                ) : (
                  <h3 className="text-center text-h3 text-ink">{s.title}</h3>
                )}
              </RevealItem>
              <RevealItem className="w-full">
                <Card>
                  {s.icon || s.name ? (
                    <p className="label-caps mb-3 flex items-center gap-3 px-1 text-ink">
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
                  <Media
                    video={s.video}
                    audio={s.audio}
                    labels={labels}
                    videoPoster={videoPoster}
                    sizes="360px"
                  />
                </Card>
              </RevealItem>
              <RevealItem preset="pop" className="flex">
                <Icon name="arrow-down" size={32} className="text-ink" aria-hidden="true" />
              </RevealItem>
              <RevealItem className="w-full">
                <Card padding="none" className="overflow-hidden">
                  <Score
                    sample={s}
                    sizes="(min-width: 1025px) 360px, 100vw"
                    className="w-full"
                    zoom={zoom}
                    labels={labels}
                  />
                </Card>
              </RevealItem>
              {s.href && s.linkLabel ? (
                <RevealItem>
                  <CtaLink cta={{ label: s.linkLabel, href: s.href }} />
                </RevealItem>
              ) : null}
            </RevealGroup>
          ))}
        </ul>
      </BlockShell>
    )
  return (
    <BlockShell {...shell}>
      {tabs ? <Tabs tabs={tabs.map((t) => t.label)} active={tab} onChange={setTab} /> : null}
      <ul className="flex flex-col gap-14">
        {shown.map((s) => (
          <li key={s.title} className="grid items-center gap-8 md:grid-cols-[3fr_2fr]">
            <div className="flex flex-col gap-4">
              {s.price ? (
                <PriceTag title={s.title} tone={s.tone} price={s.price} surface="cream" />
              ) : (
                <h3 className="text-center text-h3 text-ink md:text-left">{s.title}</h3>
              )}
              <Media
                video={s.video}
                audio={s.audio}
                labels={labels}
                videoPoster={videoPoster}
                sizes="560px"
              />
              {s.href && s.linkLabel ? (
                <div className="flex justify-center md:justify-start">
                  <CtaLink cta={{ label: s.linkLabel, href: s.href }} />
                </div>
              ) : null}
            </div>
            <div className="mx-auto w-full max-w-90">
              <Score
                sample={s}
                sizes="(min-width: 768px) 420px, 100vw"
                className="w-full rounded-card shadow-card"
                zoom={zoom}
                labels={labels}
              />
            </div>
          </li>
        ))}
      </ul>
    </BlockShell>
  )
}
