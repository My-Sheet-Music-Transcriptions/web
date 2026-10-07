import wide from '~/assets/images/home/how-it-works.jpg?w=700;974;1460&as=picture'
import step1 from '~/assets/images/home/step-1-send-audio.png?w=240;403&as=picture'
import step2 from '~/assets/images/home/step-2-transcribe.png?w=240;403&as=picture'
import step3 from '~/assets/images/home/step-3-print-play.jpg?w=200;255&as=picture'
import { Picture } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'
import { howItWorks } from '~/content/en/data/home'

const stepImages = { 'step-1': step1, 'step-2': step2, 'step-3': step3 }

export interface HowItWorksProps {
  title?: string
  id?: string
}

/** "How does it work?": three numbered steps; one wide illustration on desktop, stacked on mobile. */
export function HowItWorks({ title = 'How does it work?', id = 'how-it-works' }: HowItWorksProps) {
  return (
    <section id={id} className="scroll-mt-20 pb-16 pt-20 lg:pt-24" aria-labelledby={`${id}-title`}>
      <div className="container-content">
        <SectionHeading id={`${id}-title`} rule="grey">
          {title}
        </SectionHeading>
        <div className="mx-auto mt-12 hidden max-w-[974px] lg:block">
          <Picture
            image={wide}
            alt="Three steps: send us the audio, we transcribe it, print and play the PDF"
            sizes="974px"
          />
        </div>
        <ol className="mx-auto mt-10 grid max-w-[1000px] gap-12 md:grid-cols-3 md:gap-6 lg:mt-8">
          {howItWorks.map((step) => (
            <li key={step.title} className="flex flex-col items-center text-center">
              <Picture
                image={stepImages[step.image]}
                alt=""
                sizes="(min-width: 768px) 160px, 200px"
                className="mb-6 h-auto w-[160px] lg:hidden"
              />
              <h3 className="text-h3 font-extrabold">{step.title}</h3>
              <p className="mt-3 max-w-[280px] text-small leading-6 text-ink">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
