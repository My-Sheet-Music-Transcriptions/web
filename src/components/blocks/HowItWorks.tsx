import step1 from '~/assets/images/home/step-1-send-audio.png?w=240;403&as=picture'
import step2 from '~/assets/images/home/step-2-transcribe.png?w=240;403&as=picture'
import step3 from '~/assets/images/home/step-3-print-play.jpg?w=200;255&as=picture'
import { Picture } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { howItWorks } from '~/content/en/data/home'

const stepImages = { 'step-1': step1, 'step-2': step2, 'step-3': step3 }

export interface HowItWorksProps {
  title?: string
  eyebrow?: string
  id?: string
}

/** "How does it work?": three numbered columns under a hairline (send audio, we transcribe, print & play). */
export function HowItWorks({
  title = 'How does it work?',
  eyebrow = 'Three simple steps',
  id = 'how-it-works',
}: HowItWorksProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-line py-section lg:py-section-lg"
      aria-labelledby={`${id}-title`}
    >
      <div className="container-content">
        <SectionHeading id={`${id}-title`} eyebrow={eyebrow}>
          {title}
        </SectionHeading>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 lg:mt-14 lg:gap-10">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 border-t border-line pt-6">
              <span className="eyebrow tabular-nums text-muted">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Picture
                image={stepImages[step.image]}
                alt=""
                sizes="96px"
                className="h-[72px] w-auto self-start object-contain"
              />
              <h3 className="mt-2 text-h3">{step.title.replace(/^\d+\.\s*/, '')}</h3>
              <p className="text-[15px] leading-relaxed text-charcoal">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
