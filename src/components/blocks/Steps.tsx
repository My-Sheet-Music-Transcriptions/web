import { Icon, type IconName } from '~/components/primitives/Icon'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { tones } from '~/components/primitives/tones'
import { type Video, VideoEmbed } from '~/components/primitives/VideoEmbed'
import type { MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { inlineMarkdown } from '~/lib/light-markdown'
import { fill } from '~/lib/strings'
import { useTitleId } from '~/lib/use-title-id'

/** One step of a process. */
export interface StepItem {
  /** Short heading ("1. Send us audio"); untitled timeline steps show `stepLabel`. */
  title?: string
  /** What happens; **bold** and [links](/path) kept, blank lines start a paragraph. */
  text: string
  /** Icon in the timeline's disc (instead of the step number). */
  icon?: IconName
  /** Picture above the step (columns), from the page folder. */
  image?: PictureSource
  /** Width of that picture in px. */
  imageWidth?: number
  /** A video above the step instead of a picture (columns). */
  video?: Video
}

export interface StepsProps {
  title?: string
  /** The steps, in order: three to seven. */
  items: StepItem[]
  /** timeline: numbered vertical list (default). columns: side by side, each with its picture or video. */
  layout?: 'timeline' | 'columns'
  /** One wide picture shown instead of the step pictures from 1025px up (columns). */
  illustration?: PictureSource
  /** Alt text of the wide picture. */
  illustrationAlt?: string
  /** The small label above each untitled timeline step; `{n}` is its number ("Step {n}"). */
  stepLabel?: string
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** The words of the carousel arrows and the play button: `media` from content/<locale>/data/labels. */
  labels?: MediaLabels
  /** The still shown over each video until it is played (`~/assets/images/brand/video-poster.jpg`). */
  videoPoster?: PictureSource
  /** Anchor id. */
  id?: string
}

const paragraphs = (text: string) => text.split(/\n\s*\n/)

/** A process step by step: how to order, how a gift card works, what happens to your audio. */
export function Steps({
  title,
  items,
  layout = 'timeline',
  illustration,
  illustrationAlt = '',
  stepLabel,
  tone = 'white',
  labels,
  videoPoster,
  id,
}: StepsProps) {
  const titleId = useTitleId(id)
  if (layout === 'columns')
    return (
      <section
        id={id}
        className={cn(
          'scroll-mt-20 md:mt-5 px-[10px] pt-[50px] pb-[50px] lg:px-[55px] lg:pb-[84px]',
          tones[tone],
        )}
        aria-labelledby={title ? titleId : undefined}
      >
        <div className="mx-auto max-w-[1140px] pt-[10px]">
          {title ? <SectionHeading id={titleId}>{title}</SectionHeading> : null}
          {illustration ? (
            <div className="mx-auto mt-5 hidden w-[974px] max-w-full lg:block">
              <Picture image={illustration} alt={illustrationAlt} sizes="974px" />
            </div>
          ) : null}
          <ol
            className={cn(
              'mx-auto -mt-[10px] grid max-w-[1080px] gap-[30px] md:gap-[60px] lg:mt-0',
              items.length === 4 || items.length > 6
                ? 'md:grid-cols-2 lg:grid-cols-4'
                : 'md:grid-cols-3',
            )}
          >
            {items.map((step) => (
              <li
                key={step.title ?? step.text}
                className="flex flex-col items-center py-[10px] text-center lg:pt-0"
              >
                {step.video ? (
                  <VideoEmbed
                    {...step.video}
                    poster={videoPoster}
                    playLabel={
                      labels && step.video && fill(labels.play, { title: step.video.title })
                    }
                    className="mb-5 w-full"
                  />
                ) : step.image ? (
                  <Picture
                    image={step.image}
                    alt=""
                    sizes="200px"
                    className={cn('mb-5 h-auto', illustration && 'lg:hidden')}
                    style={{ width: step.imageWidth ?? 180 }}
                  />
                ) : null}
                {step.title ? (
                  <h3 className="text-h3 leading-[23px] font-extrabold lg:leading-[26px]">
                    {step.title}
                  </h3>
                ) : null}
                {paragraphs(step.text).map((p) => (
                  <p
                    key={p}
                    className={cn(
                      'mt-5 mb-[14.4px] text-body text-secondary lg:mb-0',
                      !step.video && 'max-w-[310px] md:max-w-[280px]',
                    )}
                  >
                    {inlineMarkdown(p)}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-16', tones[tone])}
      aria-labelledby={title ? titleId : undefined}
    >
      <div className="container-narrow">
        {title ? (
          <SectionHeading id={titleId} rule="accent" className="mb-10">
            {title}
          </SectionHeading>
        ) : null}
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-7 left-[27px] top-7 w-0.5 bg-peach-deep"
          />
          <ol className="relative m-0 flex list-none flex-col gap-7 p-0">
            {items.map((step, i) => (
              <li key={step.title ?? step.text} className="flex items-start gap-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-primary text-[20px] font-bold text-white">
                  {step.icon ? <Icon name={step.icon} size={24} /> : i + 1}
                </span>
                <div className="pt-1">
                  {step.title ? (
                    <>
                      <h3 className="text-[18px] font-bold leading-[1.5] text-ink">{step.title}</h3>
                      {paragraphs(step.text).map((p) => (
                        <p key={p} className="mt-1 text-body text-ink">
                          {inlineMarkdown(p)}
                        </p>
                      ))}
                    </>
                  ) : (
                    <>
                      {stepLabel ? (
                        <span className="block text-[13px] font-extrabold uppercase tracking-[0.08em] text-accent-hover">
                          {fill(stepLabel, { n: i + 1 })}
                        </span>
                      ) : null}
                      <p className="mt-1 text-[18px] font-semibold leading-[1.5] text-ink">
                        {inlineMarkdown(step.text)}
                      </p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
