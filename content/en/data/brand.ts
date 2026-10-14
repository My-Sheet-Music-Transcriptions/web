import studioBandPicture from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import pianoBandPicture from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import logoFile from '~/assets/images/brand/logo.svg'
import videoPosterPicture from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import type { BrandLogo } from '~/content/types'

/** Brand pictures a page passes to blocks, named so CMS pages can pick them (src/components/blocks/cms.ts). */

/** The piano behind the ratings band. */
export const pianoBand = pianoBandPicture

/** The studio behind "What's included?". */
export const studioBand = studioBandPicture

/** The still of every video until it is played (CMS pages get it without a field). */
export const videoPoster = videoPosterPicture

/** The lockup above the homepage title, with its words. */
export const logo: BrandLogo = {
  image: logoFile,
  alt: 'My Sheet Music Transcriptions logo',
  label: 'My Sheet Music Transcriptions – home',
}
