import { Icon, type IconName } from '~/components/primitives/Icon'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { cn } from '~/lib/cn'

export interface Step {
  /** Icon shown in the numbered disc. */
  icon: IconName
  /** One sentence; the step number is added automatically. */
  text: string
}

export interface StepsProps {
  /** Section heading (optional). */
  title?: string
  /** The steps, in order. */
  steps: Step[]
  /** Background: white (default), cream or peach. */
  tone?: 'white' | 'cream' | 'peach'
  /** Anchor id; also labels the section by its heading. */
  id?: string
}

const tones = { white: 'bg-white', peach: 'bg-peach', cream: 'bg-cream' }

/** Numbered vertical timeline: a disc with an icon per step, "Step n" eyebrow and one line of text. */
export function Steps({ title, steps, tone = 'white', id }: StepsProps) {
  return (
    <section
      className={cn('py-16', tones[tone])}
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
    >
      <div className="container-narrow">
        {title ? (
          <SectionHeading id={id ? `${id}-title` : undefined} rule="accent" className="mb-10">
            {title}
          </SectionHeading>
        ) : null}
        <div className="relative">
          <span
            aria-hidden="true"
            className="absolute bottom-7 left-[27px] top-7 w-0.5 bg-peach-deep"
          />
          <ol className="relative m-0 flex list-none flex-col gap-7 p-0">
            {steps.map((step, i) => (
              <li key={step.text} className="flex items-start gap-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-pill bg-primary text-white">
                  <Icon name={step.icon} size={24} />
                </span>
                <div className="pt-1">
                  <span className="block text-[13px] font-extrabold uppercase tracking-[0.08em] text-accent-hover">
                    Step {i + 1}
                  </span>
                  <p className="mt-1 text-[18px] font-semibold leading-[1.5] text-ink">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
