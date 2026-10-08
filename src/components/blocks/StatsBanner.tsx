import { counter, ratings } from '@content/en/data/home'
import bg from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import { Picture } from '~/components/primitives/Picture'
import { RatingCard } from '~/components/primitives/RatingCard'
import { WaveDivider } from '~/components/primitives/WaveDivider'

export interface StatsBannerProps {
  title?: string
  counterValue?: number
  counterLabel?: string
}

/** Full-bleed piano photo with wavy edges, big counter and three rating cards. */
export function StatsBanner({
  title = 'The highest-rated online sheet music transcribers',
  counterValue = counter.value,
  counterLabel = counter.label,
}: StatsBannerProps) {
  return (
    <section
      className="relative isolate overflow-hidden px-4 pt-[140px] pb-[100px] text-white md:my-[50px] md:px-[10px] md:pt-[110px] md:pb-[110px]"
      aria-labelledby="stats-title"
    >
      <Picture
        image={bg}
        alt=""
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_42%]"
        pictureClassName="contents"
      />
      <div className="absolute inset-0 -z-10 bg-[#3a3a3a] opacity-[0.32]" aria-hidden="true" />
      <WaveDivider position="top" width={138} mobileHeight={20} mobileWidth={266} />
      <WaveDivider position="bottom" width={135} mobileHeight={20} mobileWidth={266} />
      <div className="mx-auto max-w-[1140px] text-center">
        <h2
          id="stats-title"
          className="text-[28px] font-bold leading-[32px] text-white md:text-h2 md:leading-8"
        >
          {title}
        </h2>
        <p className="mt-[60px]">
          <span className="block text-[69px] font-semibold leading-[69px]">
            {counterValue.toLocaleString('en-US')}
          </span>
          <span className="block text-body leading-10 text-white md:text-[19px] md:leading-[47.5px]">
            {counterLabel}
          </span>
        </p>
        <ul className="mt-[60px] grid gap-5 md:grid-cols-3">
          {ratings.map((r) => (
            <li key={r.id}>
              <RatingCard source={r} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
