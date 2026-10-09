import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { FeatureItem } from '~/components/primitives/FeatureItem'
import { Icon, type IconName } from '~/components/primitives/Icon'
import { RevealItem } from '~/components/primitives/Motion'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import type { CardItem, MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { gridCols } from '~/lib/grid'
import { inlineMarkdown, lightMarkdown } from '~/lib/light-markdown'
import { fill } from '~/lib/strings'

/** One step: a title, a text and, in columns, a picture or video (the shape of a card). */
export interface StepItem extends CardItem {
  /** A glyph in the timeline's disc instead of the step number ("dollar", "gift"). */
  glyph?: IconName
}

export interface StepsProps extends ShellProps {
  /** The steps, in order: three to seven. */
  items: StepItem[]
  /** timeline: numbered vertical list (default). columns: side by side, each with its picture or video. */
  variant?: 'timeline' | 'columns'
  /** One wide picture shown instead of the step pictures from 1025px up (columns). */
  illustration?: PictureSource
  /** Alt text of the wide picture. */
  illustrationAlt?: string
  /** The small label above each untitled timeline step; `{n}` is its number ("Step {n}"). */
  stepLabel?: string
  /** The words of the play button: `media` from content/<locale>/data/labels (steps with a video). */
  labels?: MediaLabels
  /** The still shown over each video until it is played (`~/assets/images/brand/video-poster.jpg`). */
  videoPoster?: PictureSource
}

/** A process step by step: how to order, how a gift card works, what happens to your audio. */
export function Steps({
  items,
  variant = 'timeline',
  illustration,
  illustrationAlt = '',
  stepLabel,
  labels,
  videoPoster,
  ...shell
}: StepsProps) {
  if (variant === 'columns')
    return (
      <BlockShell {...shell} cascade>
        {illustration ? (
          <RevealItem className="mx-auto mb-10 hidden w-[974px] max-w-full lg:block">
            <Picture image={illustration} alt={illustrationAlt} sizes="974px" className="w-full" />
          </RevealItem>
        ) : null}
        <ol
          className={cn(
            gridCols(items.length === 4 || items.length > 6 ? 4 : 3, {
              tablet: items.length === 4 || items.length > 6 ? 2 : 3,
            }),
            'gap-[30px] md:gap-[60px]',
          )}
        >
          {items.map((step) => (
            <RevealItem as="li" key={step.title ?? step.body}>
              <FeatureItem
                item={step}
                surface="plain"
                labels={labels}
                videoPoster={videoPoster}
                imageClassName={illustration ? 'lg:hidden' : undefined}
              />
            </RevealItem>
          ))}
        </ol>
      </BlockShell>
    )
  return (
    <BlockShell {...shell} width="narrow" cascade>
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute top-7 bottom-7 left-[27px] w-0.5 bg-peach-deep"
        />
        <ol className="relative m-0 flex list-none flex-col gap-7 p-0">
          {items.map((step, i) => (
            <RevealItem as="li" key={step.title ?? step.body} className="flex items-start gap-6">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-primary text-[20px] font-bold text-white">
                {step.glyph ? <Icon name={step.glyph} size={24} /> : i + 1}
              </span>
              <div className="pt-1">
                {step.title ? (
                  <>
                    <h3 className="text-[18px] font-bold leading-[1.5] text-ink">{step.title}</h3>
                    <div className="mt-1 flex flex-col gap-1 text-ink">
                      {lightMarkdown(step.body)}
                    </div>
                  </>
                ) : (
                  <>
                    {stepLabel ? (
                      <span className="block text-[13px] font-extrabold uppercase tracking-[0.08em] text-accent-hover">
                        {fill(stepLabel, { n: i + 1 })}
                      </span>
                    ) : null}
                    <p className="mt-1 text-[18px] font-semibold leading-[1.5] text-ink">
                      {inlineMarkdown(step.body)}
                    </p>
                  </>
                )}
              </div>
            </RevealItem>
          ))}
        </ol>
      </div>
    </BlockShell>
  )
}
