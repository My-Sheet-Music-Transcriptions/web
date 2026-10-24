import { BlockShell, type ShellProps } from '~/components/primitives/BlockShell'
import { FeatureItem } from '~/components/primitives/FeatureItem'
import { Icon } from '~/components/primitives/Icon'
import { RevealItem } from '~/components/primitives/Motion'
import { Picture, type PictureSource } from '~/components/primitives/Picture'
import type { CardItem, MediaLabels } from '~/content/types'
import { cn } from '~/lib/cn'
import { gridCols } from '~/lib/grid'
import { inlineMarkdown, lightMarkdown } from '~/lib/light-markdown'
import { fill } from '~/lib/strings'

export interface StepsProps extends ShellProps {
  /** The steps, in order: three to seven. Each a title, a text and, in columns, a picture or video; in a timeline, its glyph in the disc, or its illustrated icon, instead of the step number ("dollar", "gift"). */
  items: CardItem[]
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

/** "1. Send us audio" → the number "1." (drawn in the accent colour) and the title after it. */
function numbered(step: CardItem): { item: CardItem; number?: string } {
  const m = step.title ? /^(\d+\.)\s+(.+)$/.exec(step.title) : null
  return m ? { item: { ...step, title: m[2] }, number: m[1] } : { item: step }
}

/**
 * A process step by step. `timeline`: a vertical list on a line, each step with its number, its glyph in a disc or
 * its illustrated icon. `columns`: the steps side by side, each with its picture or video (the homepage adds one wide
 * illustration on desktop). A title that opens with its number ("1. Send us audio") shows the number in the
 * accent colour.
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
          <RevealItem className="mx-auto mb-heading-gap hidden w-full max-w-244 lg:block">
            <Picture image={illustration} alt={illustrationAlt} sizes="974px" className="w-full" />
          </RevealItem>
        ) : null}
        <ol
          className={cn(
            items.length === 2
              ? gridCols(2)
              : gridCols(items.length === 4 || items.length > 6 ? 4 : 3, {
                  tablet: items.length === 4 || items.length > 6 ? 2 : 3,
                }),
            'gap-grid-gap-lg',
          )}
        >
          {items.map((step) => (
            <RevealItem as="li" key={step.title ?? step.body}>
              <FeatureItem
                {...numbered(step)}
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
        <span aria-hidden="true" className="absolute top-7 bottom-7 left-7 w-px bg-line" />
        <ol className="relative m-0 flex list-none flex-col gap-8 p-0">
          {items.map((step, i) => {
            const { item, number } = numbered(step)
            return (
              <RevealItem as="li" key={step.title ?? step.body} className="flex items-start gap-6">
                {step.icon ? (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-white">
                    <Picture
                      image={step.icon}
                      alt=""
                      sizes="56px"
                      className="size-14 object-contain"
                    />
                  </span>
                ) : (
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-primary text-h3 text-white">
                    {step.glyph ? <Icon name={step.glyph} size={24} /> : i + 1}
                  </span>
                )}
                <div className="pt-3">
                  {item.title ? (
                    <>
                      <h3 className="text-h3 text-ink">
                        {number ? <span className="text-accent-deep">{number} </span> : null}
                        {item.title}
                      </h3>
                      <div className="mt-2 flex flex-col gap-2 text-body text-ink">
                        {lightMarkdown(step.body)}
                      </div>
                    </>
                  ) : (
                    <>
                      {stepLabel ? (
                        <span className="label-caps block text-accent-deep">
                          {fill(stepLabel, { n: i + 1 })}
                        </span>
                      ) : null}
                      <p className="mt-2 text-lead font-semibold text-ink">
                        {inlineMarkdown(step.body)}
                      </p>
                    </>
                  )}
                </div>
              </RevealItem>
            )
          })}
        </ol>
      </div>
    </BlockShell>
  )
}
