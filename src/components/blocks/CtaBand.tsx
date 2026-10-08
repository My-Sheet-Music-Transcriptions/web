import { type Cta, CtaLink } from '~/components/primitives/CtaLink'
import { tones } from '~/components/primitives/tones'
import { cn } from '~/lib/cn'
import { lightMarkdown } from '~/lib/light-markdown'
import { useTitleId } from '~/lib/use-title-id'

export interface CtaBandProps {
  /** A short line above the title. */
  eyebrow?: string
  /** The one line that asks ("Unsure about music notation?"). */
  title: string
  /** A sentence or two; **bold**, [links](/path) and paragraphs kept. */
  text?: string
  /** The button. */
  cta?: Cta
  /** Background: cream (default), peach or white. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id. */
  id?: string
}

/** A short centred band that points somewhere: a question, a sentence and one button. */
export function CtaBand({ eyebrow, title, text, cta, tone = 'cream', id }: CtaBandProps) {
  const titleId = useTitleId(id)
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 py-[50px]', tones[tone])}
      aria-labelledby={titleId}
    >
      <div className="container-narrow flex flex-col items-center gap-4 text-center">
        {eyebrow ? (
          <p className="text-small font-bold uppercase tracking-wide text-accent-deep">{eyebrow}</p>
        ) : null}
        <h2 id={titleId} className="text-[26px] leading-8 text-ink md:text-h2 md:leading-10">
          {title}
        </h2>
        {text ? <div className="flex flex-col gap-3 text-ink">{lightMarkdown(text)}</div> : null}
        {cta ? <CtaLink cta={cta} className="mt-2" /> : null}
      </div>
    </section>
  )
}
