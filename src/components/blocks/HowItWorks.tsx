import { howItWorks } from '@content/en/data/home'
import wide from '~/assets/images/home/how-it-works.jpg?w=700;974;1460&as=picture'
import step1 from '~/assets/images/home/step-1-send-audio.png?w=240;403&as=picture'
import step2 from '~/assets/images/home/step-2-transcribe.png?w=240;403&as=picture'
import step3 from '~/assets/images/home/step-3-print-play.jpg?w=200;255&as=picture'
import { Picture } from '~/components/primitives/Picture'
import { SectionHeading } from '~/components/primitives/SectionHeading'

const stepImages = { 'step-1': step1, 'step-2': step2, 'step-3': step3 }
/** Phone widths of the step illustrations, as on the live site. */
const stepWidths = { 'step-1': 'w-[177px]', 'step-2': 'w-[188px]', 'step-3': 'w-[112px]' }

export interface HowItWorksProps {
  title?: string
  id?: string
}

/** "How does it work?": three numbered steps; one wide illustration on desktop, stacked on mobile. */
export function HowItWorks({ title = 'How does it work?', id = 'how-it-works' }: HowItWorksProps) {
  return (
    <section
      id={id}
      className="scroll-mt-20 md:mt-5 px-[10px] pt-[50px] pb-[50px] lg:px-[55px] lg:pb-[84px]"
      aria-labelledby={`${id}-title`}
    >
      <div className="mx-auto max-w-[1140px] pt-[10px]">
        <SectionHeading id={`${id}-title`}>{title}</SectionHeading>
        <div className="mx-auto mt-5 hidden w-[974px] max-w-full lg:block">
          <Picture
            image={wide}
            alt="Three steps: send us the audio, we transcribe it, print and play the PDF"
            sizes="974px"
          />
        </div>
        <ol className="mx-auto -mt-[10px] grid max-w-[1080px] gap-[30px] md:grid-cols-3 md:gap-[60px] lg:mt-0">
          {howItWorks.map((step) => (
            <li
              key={step.title}
              className="flex flex-col items-center py-[10px] text-center lg:pt-0"
            >
              <Picture
                image={stepImages[step.image]}
                alt=""
                sizes="200px"
                className={`mb-5 h-auto lg:hidden ${stepWidths[step.image]}`}
              />
              <h3 className="text-h3 leading-[23px] font-extrabold lg:leading-[26px]">
                {step.title}
              </h3>
              <p className="mt-5 mb-[14.4px] max-w-[310px] text-body text-secondary md:max-w-[280px] lg:mb-0">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
