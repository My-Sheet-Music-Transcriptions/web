import type { RatingSource } from '~/content/types'

/**
 * The ratings every page quotes, as the live Catalan site words them (the homepage's "El servei de transcripció de
 * partitures millor valorat"). Update the numbers here only; pages pass `google` or a list of these to the blocks.
 */
export const google: RatingSource = {
  id: 'google',
  label: '5 estrelles de mitjana a Google Reviews',
  score: '5,0',
  starsLabel: '5,0 de 5 estrelles',
  href: 'https://www.google.com/maps/place/My+Sheet+Music+Transcriptions/@41.54571,1.98091,17z/data=!4m7!3m6!1s0x12a4933dfee41643:0x4e967d39cf62b25d!8m2!3d41.54571!4d1.98091!9m1!1b1',
  linkLabel: 'Veure a Google',
  moreLabel: 'Veure més',
}

const facebook: RatingSource = {
  id: 'facebook',
  label: '100% de recomanacions a Facebook',
  score: '5,0',
  starsLabel: '5,0 de 5 estrelles',
  href: 'https://www.facebook.com/mysheetmusictranscriptions/reviews',
  linkLabel: 'Veure a Facebook',
  moreLabel: 'Veure més',
}

const trustpilot: RatingSource = {
  id: 'trustpilot',
  label: '443 ressenyes excel·lents a Trustpilot',
  score: '5,0',
  starsLabel: '5,0 de 5 estrelles',
  href: 'https://www.trustpilot.com/review/mysheetmusictranscriptions.com',
  linkLabel: 'Veure a Trustpilot',
  moreLabel: 'Veure més',
}

/** The homepage's three cards, in the live order. */
export const homeRatings: RatingSource[] = [google, facebook, trustpilot]
