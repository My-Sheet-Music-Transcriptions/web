import type { MediaLabels, ReviewLabels } from '~/content/types'

/**
 * The words blocks show around their content, for screen readers and small labels: pages pass them to the
 * blocks that need them (`<MediaText labels={mediaLabels} …>`, `<Testimonials labels={reviewLabels} …>`).
 */
export const mediaLabels: MediaLabels = {
  previous: 'Previous photo',
  next: 'Next photo',
  position: 'Photo {n} of {total}',
  play: 'Play the video: {title}',
  listen: 'Play the recording: {title}',
  pause: 'Pause',
  carousel: 'carousel',
}

export const reviewLabels: ReviewLabels = {
  stars: '{rating} out of 5 stars',
  roleFrom: '{role} from {country}',
}
