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
  /** Small uppercase label above the heading (optional). */
  eyebrow?: string
  /** The steps, in order. */
  steps: Step[]
  /** Background: white (default), cream, peach or surface. */
  tone?: 'white' | 'cream' | 'peach' | 'surface'
  /** Anchor id; also labels the section by its heading. */
  id?: string
}

const tones = { white: 'bg-white', peach: 'bg-peach', cream: 'bg-cream', surface: 'bg-surface' }

/** Numbered list: each step is an icon, a "Step n" eyebrow and one line of text, separated by hairlines. */
export function Steps({ title, eyebrow, steps, tone = 'white', id }: StepsProps) {
  return (
    <section
      className={cn('py-section', tones[tone])}
      id={id}
      aria-labelledby={title && id ? `${id}-title` : undefined}
    >
      <div className="container-narrow">
        {title ? (
          <SectionHeading
            id={id ? `${id}-title` : undefined}
            eyebrow={eyebrow}
            rule="none"
            className="mb-12"
          >
            {title}
          </SectionHeading>
        ) : null}
        <div>
          <ol className="m-0 flex list-none flex-col p-0">
            {steps.map((step, i) => (
              <li key={step.text} className="flex items-start gap-5 border-t border-line py-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ui bg-primary text-white">
                  <Icon name={step.icon} size={20} />
                </span>
                <div className="pt-1">
                  <span className="eyebrow text-accent-text">Step {i + 1}</span>
                  <p className="mt-1.5 text-[18px] font-semibold leading-[1.5] text-ink">
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
