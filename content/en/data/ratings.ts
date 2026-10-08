import type { Counter, RatingSource } from '~/content/types'

/**
 * The ratings and the counter every page quotes (hero card, rating banners, page headers). Update the numbers
 * here only; pages pass `google` or a list of these to the blocks.
 */
export const google: RatingSource = {
  id: 'google',
  label: '5.0 on Google Reviews',
  score: '5.0',
  count: '854',
  countLabel: '854 reviews',
  href: 'https://www.google.com/maps/place/My+Sheet+Music+Transcriptions/@41.54571,1.98091,17z/data=!4m7!3m6!1s0x12a4933dfee41643:0x4e967d39cf62b25d!8m2!3d41.54571!4d1.98091!9m1!1b1',
  linkLabel: 'See on Google',
}

export const trustpilot: RatingSource = {
  id: 'trustpilot',
  label: '4.9 on Trustpilot',
  score: '4.9',
  href: 'https://www.trustpilot.com/review/mysheetmusictranscriptions.com',
  linkLabel: 'See on Trustpilot',
}

export const facebook: RatingSource = {
  id: 'facebook',
  label: '5.0 on Facebook Reviews',
  score: '5.0',
  count: '300',
  countLabel: '300 reviews',
  href: 'https://www.facebook.com/mysheetmusictranscriptions/reviews/',
  linkLabel: 'See on Facebook',
}

export const customers: RatingSource = {
  id: 'customers',
  label: 'Based in the US, UK & Europe',
  count: '26,330',
  countLabel: 'happy customers until October 2026',
}

/** The homepage's three cards. */
export const homeRatings: RatingSource[] = [google, customers, facebook]

/** The three review platforms, as service and landing pages show them. */
export const platforms: RatingSource[] = [google, trustpilot, facebook]

export const counter: Counter = { value: 71844, label: 'transcriptions delivered since 2011' }
