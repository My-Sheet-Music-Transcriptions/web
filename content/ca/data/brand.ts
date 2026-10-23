import heroPhonePicture from '~/assets/images/bands/hero-phone.jpg?w=480;800;1125&as=picture'
import studioBandPicture from '~/assets/images/bands/included-bg.jpg?w=1000;1600&as=picture'
import sheetMusicBandPicture from '~/assets/images/bands/sheet-music-bg.jpg?w=900;1282;2000&as=picture'
import pianoBandPicture from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import logoFile from '~/assets/images/brand/lockup-ca.png?format=png&as=url'
import edicionsLogoFile from '~/assets/images/brand/lockup-ca-edicions.png?format=png&as=url'
import musicBookLogoFile from '~/assets/images/brand/my-music-book.png?format=png&as=url'
import videoPosterPicture from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import type { BrandLogo } from '~/content/types'

/** Brand pictures a page passes to blocks, named so CMS pages can pick them (src/components/blocks/cms.ts). */

/** The piano behind the ratings band. */
export const pianoBand = pianoBandPicture

/** The sheet music behind the Catalan homepage's ratings. */
export const sheetMusicBand = sheetMusicBandPicture

/** The studio behind a band of cards. */
export const studioBand = studioBandPicture

/** The still of every video until it is played (CMS pages get it without a field). */
export const videoPoster = videoPosterPicture

/** The photo faded behind the homepage header on phones (CMS pages get it without a field). */
export const heroPhone = heroPhonePicture

/** The Catalan lockup above the homepage title, with its words. */
export const logo: BrandLogo = {
  image: logoFile,
  alt: 'Logo de La Meva Partitura',
  label: 'La Meva Partitura – inici',
}

/** The publishing imprint's lockup, in white, over the photo at the top of /edicions. */
export const edicionsLogo: BrandLogo = {
  image: edicionsLogoFile,
  alt: 'La Meva Partitura Edicions',
  label: 'La Meva Partitura – inici',
}

/** The My Music Book wordmark, with its handwritten line, at the top of /my-musicbook. */
export const musicBookLogo: BrandLogo = {
  image: musicBookLogoFile,
  alt: 'My Music Book: tan personal com les teves cançons',
  label: 'La Meva Partitura – inici',
}
