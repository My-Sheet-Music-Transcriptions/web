import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { FeatureItem } from '~/components/primitives/FeatureItem'
import { Icon, type IconName } from '~/components/primitives/Icon'
import { RevealGroup, RevealItem } from '~/components/primitives/Motion'
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
  /** timeline: numbered vertical list (default). bubbles: a vertical line of illustrated icons, each step a speech bubble. columns: side by side, each with its picture or video. */
  variant?: 'timeline' | 'bubbles' | 'columns'
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

/**
 * A process step by step. `timeline`: a numbered vertical list with a glyph or number per step. `bubbles`:
 * a vertical line with each step's illustrated icon on it and its title and text in a speech bubble.
 * `columns`: the steps side by side, each with its picture or video (the homepage adds one wide
 * illustration on desktop).
 */
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
  if (variant === 'bubbles')
    return (
      <BlockShell {...shell} width="narrow" cascade>
        <ol className="m-0 flex list-none flex-col p-0">
          {items.map((step, i) => (
            <RevealGroup
              as="li"
              key={step.title ?? step.body}
              className="flex items-center gap-5 md:gap-8"
            >
              {/* The icon sits on a line that runs from the first step to the last; in a revealed block the
                  line draws itself down to each icon, which pops in, then the bubble slides in beside it. */}
              <div className="flex w-[72px] shrink-0 flex-col items-center self-stretch md:w-28">
                <RevealItem
                  preset="draw"
                  aria-hidden="true"
                  className={cn('w-px flex-1 origin-top bg-line', i === 0 && 'invisible')}
                />
                <RevealItem
                  preset="pop"
                  className="flex w-full items-center justify-center py-2 text-h3 font-bold text-primary"
                >
                  {step.icon ? (
                    <Picture image={step.icon} alt="" sizes="96px" className="w-full" />
                  ) : step.glyph ? (
                    <Icon name={step.glyph} size={32} />
                  ) : (
                    i + 1
                  )}
                </RevealItem>
                <RevealItem
                  preset="draw"
                  aria-hidden="true"
                  className={cn(
                    'w-px flex-1 origin-top bg-line',
                    i === items.length - 1 && 'invisible',
                  )}
                />
              </div>
              <RevealItem preset="side" className="my-2 min-w-0 flex-1">
                <FeatureItem
                  item={{ ...step, icon: undefined }}
                  surface="bubble"
                  labels={labels}
                  videoPoster={videoPoster}
                />
              </RevealItem>
            </RevealGroup>
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
