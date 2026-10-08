import accordionIcon from '~/assets/images/icons/accordion.png?w=150;300&as=picture'
import accuracyIcon from '~/assets/images/icons/accuracy.png?w=150;300&as=picture'
import arrangementIcon from '~/assets/images/icons/arrangement.png?w=150;300&as=picture'
import backingVocalsIcon from '~/assets/images/icons/backing-vocals.png?w=150;300&as=picture'
import bassIcon from '~/assets/images/icons/bass.png?w=150;300&as=picture'
import bluesPianoIcon from '~/assets/images/icons/blues-piano.png?w=150;300&as=picture'
import brassBandIcon from '~/assets/images/icons/brass-band.png?w=150;300&as=picture'
import celloIcon from '~/assets/images/icons/cello.png?w=150;300&as=picture'
import chordChartsIcon from '~/assets/images/icons/chord-charts.png?w=150;300&as=picture'
import clarinetIcon from '~/assets/images/icons/clarinet.png?w=150;300&as=picture'
import copyingIcon from '~/assets/images/icons/copying.png?w=150;300&as=picture'
import drumsIcon from '~/assets/images/icons/drums.png?w=150;300&as=picture'
import fastDeliveryIcon from '~/assets/images/icons/fast-delivery.png?w=150;300&as=picture'
import fluteIcon from '~/assets/images/icons/flute.png?w=150;300&as=picture'
import formatsIcon from '~/assets/images/icons/formats.png?w=150;300&as=picture'
import guitarIcon from '~/assets/images/icons/guitar.png?w=150;300&as=picture'
import harpIcon from '~/assets/images/icons/harp.png?w=150;300&as=picture'
import hornsIcon from '~/assets/images/icons/horns.png?w=150;300&as=picture'
import jazzPianoIcon from '~/assets/images/icons/jazz-piano.png?w=150;300&as=picture'
import keyboardIcon from '~/assets/images/icons/keyboard.png?w=150;300&as=picture'
import lapSteelGuitarIcon from '~/assets/images/icons/lap-steel-guitar.png?w=150;300&as=picture'
import mandolinIcon from '~/assets/images/icons/mandolin.png?w=150;300&as=picture'
import orchestrationIcon from '~/assets/images/icons/orchestration.png?w=150;300&as=picture'
import organIcon from '~/assets/images/icons/organ.png?w=150;300&as=picture'
import pianoIcon from '~/assets/images/icons/piano.png?w=150;300&as=picture'
import pianoTrioIcon from '~/assets/images/icons/piano-trio.png?w=150;300&as=picture'
import pianoVocalIcon from '~/assets/images/icons/piano-vocal.png?w=150;300&as=picture'
import pricingMelodicIcon from '~/assets/images/icons/pricing-melodic.png?w=150;300&as=picture'
import rhythmChartsIcon from '~/assets/images/icons/rhythm-charts.png?w=150;300&as=picture'
import saxophoneIcon from '~/assets/images/icons/saxophone.png?w=150;300&as=picture'
import stringQuartetIcon from '~/assets/images/icons/string-quartet.png?w=150;300&as=picture'
import stringsIcon from '~/assets/images/icons/strings.png?w=150;300&as=picture'
import synthesiaIcon from '~/assets/images/icons/synthesia.png?w=150;300&as=picture'
import transposingIcon from '~/assets/images/icons/transposing.png?w=150;300&as=picture'
import tromboneIcon from '~/assets/images/icons/trombone.png?w=150;300&as=picture'
import trumpetIcon from '~/assets/images/icons/trumpet.png?w=150;300&as=picture'
import ukuleleIcon from '~/assets/images/icons/ukulele.png?w=150;300&as=picture'
import violinIcon from '~/assets/images/icons/violin.png?w=150;300&as=picture'
import vocalIcon from '~/assets/images/icons/vocal.png?w=150;300&as=picture'
import vocalEnsembleIcon from '~/assets/images/icons/vocal-ensemble.png?w=150;300&as=picture'
import type { CardItem, IconLink, PricingTier } from '~/content/types'

/** "What's included?": the three reassurances of the homepage and of every service page. */
export const included: CardItem[] = [
  {
    title: 'Fast turnaround time',
    body: '1-2 days standard delivery time.\nRush orders available',
    icon: fastDeliveryIcon,
  },
  {
    title: 'All sheet music formats',
    body: 'Get the transcription in digital format:',
    emphasis: 'PDF, midi, SIB, MUSX, XML, MSCZ, GP',
    icon: formatsIcon,
  },
  {
    title: '100% accuracy & Customer care',
    body: 'Note-for-note transcriptions and full customer support along the process',
    icon: accuracyIcon,
  },
]

/** The price card of each service page ("Flexible pricing for …"). */
export const pianoPricing: PricingTier = {
  fromLabel: 'from',
  from: '$19-35+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our piano rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

export const guitarTabPricing: PricingTier = {
  fromLabel: 'from',
  from: '$19-35+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our guitar tab rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

export const trumpetPricing: PricingTier = {
  fromLabel: 'from',
  from: '$14-29+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our trumpet rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

export const violinPricing: PricingTier = {
  fromLabel: 'from',
  from: '$19-29+USD',
  unit: 'per minute of music',
  note: 'Every transcription is different and our prices reflect the time and skill required to transcribe the music accurately',
  factorsLabel: 'Our violin rates are based on',
  factors: ['Difficulty', 'Music density and complexity', 'Song length', 'Instrumentation'],
}

/** Every service with its icon, in the live site's order (the service grids of /music-transcription-service). */
export const allServices: IconLink[] = [
  { label: 'Piano Transcriptions', href: '/piano', icon: pianoIcon },
  { label: 'Piano & Vocal Transcriptions', href: '/piano-vocal', icon: pianoVocalIcon },
  {
    label: 'Vocal Lead Sheet Transcriptions',
    href: '/vocal-lead-sheet-transcription-service',
    icon: vocalIcon,
  },
  {
    label: 'Vocal Ensemble Transcriptions',
    href: '/vocal-ensemble-transcription-service',
    icon: vocalEnsembleIcon,
  },
  { label: 'Guitar Tab Transcriptions', href: '/guitar-tab', icon: guitarIcon },
  { label: 'Trumpet Transcriptions', href: '/trumpet-transcription-service', icon: trumpetIcon },
  {
    label: 'Saxophone Transcriptions',
    href: '/saxophone-transcription-service',
    icon: saxophoneIcon,
  },
  { label: 'Drums Transcriptions', href: '/drums-transcription-service', icon: drumsIcon },
  { label: 'Violin Transcriptions', href: '/violin-transcription-service', icon: violinIcon },
  { label: 'String Orchestra Transcription Service', href: '/string-orchestra', icon: violinIcon },
  { label: 'Orchestration Services', href: '/orchestration-service', icon: orchestrationIcon },
  {
    label: 'Strings Transcription Service',
    href: '/strings-transcription-service',
    icon: stringsIcon,
  },
  { label: 'Music Arrangements', href: '/music-arrangement-service', icon: arrangementIcon },
  {
    label: 'Backing Vocals Transcriptions',
    href: '/backing-vocals-transcription-service',
    icon: backingVocalsIcon,
  },
  {
    label: 'Piano Jazz Solo Transcriptions',
    href: '/jazz-piano-solo-transcriptions',
    icon: jazzPianoIcon,
  },
  {
    label: 'Piano Blues Transcriptions',
    href: '/blues-piano-transcription-service',
    icon: bluesPianoIcon,
  },
  {
    label: 'Piano Jazz Trio Transcriptions',
    href: '/piano-jazz-trio-transcriptions',
    icon: pianoTrioIcon,
  },
  { label: 'Jazz Solo Transcriptions', href: '/jazz-transcription-service', icon: jazzPianoIcon },
  {
    label: 'Lead Sheet Transcriptions',
    href: '/lead-sheet-transcription-service',
    icon: vocalEnsembleIcon,
  },
  { label: 'Nashville Numbers Charts', href: '/nashville-numbers-charts', icon: rhythmChartsIcon },
  { label: 'Bass Transcriptions', href: '/bass-tab-transcription-service', icon: bassIcon },
  { label: 'Ukulele Transcriptions', href: '/ukulele-transcription-service', icon: ukuleleIcon },
  {
    label: 'Mandolin & Oud Transcription Service',
    href: '/mandolin-and-oud-tabs-sheets',
    icon: mandolinIcon,
  },
  {
    label: 'Lap Steel Guitar Transcription Service',
    href: '/lap-steel-guitar-transcription-service',
    icon: lapSteelGuitarIcon,
  },
  {
    label: 'Horn Section Transcriptions',
    href: '/horn-section-transcription-service',
    icon: pricingMelodicIcon,
  },
  { label: 'Flute Transcription Service', href: '/flute-transcription-service', icon: fluteIcon },
  { label: 'Clarinet Transcriptions', href: '/clarinet-transcription-service', icon: clarinetIcon },
  {
    label: 'Trombone Transcription Service',
    href: '/trombone-transcription-service',
    icon: tromboneIcon,
  },
  { label: 'Horns Transcription Service', href: '/horns-transcription-service', icon: hornsIcon },
  {
    label: 'String Quartet Transcriptions',
    href: '/string-quartet-transcription-service',
    icon: stringQuartetIcon,
  },
  { label: 'Cello Transcriptions', href: '/cello-transcription-service', icon: celloIcon },
  {
    label: 'Concert & Brass Band Transcriptions',
    href: '/concert-brass-band-transcriptions',
    icon: brassBandIcon,
  },
  {
    label: 'Marching Band Transcriptions',
    href: '/marching-band-transcription-service',
    icon: hornsIcon,
  },
  { label: 'Full Band Transcriptions', href: '/full-band-transcription-service', icon: hornsIcon },
  {
    label: 'Accordion Transcriptions',
    href: '/accordion-transcription-service',
    icon: accordionIcon,
  },
  { label: 'Harp Transcriptions', href: '/harp-transcription-service', icon: harpIcon },
  { label: 'Organ Transcriptions', href: '/organ-transcription-service', icon: organIcon },
  { label: 'Synthesia Transcriptions', href: '/synthesia-piano-tutorials', icon: synthesiaIcon },
  { label: 'Chord Charts Transcriptions', href: '/chord-charts', icon: chordChartsIcon },
  { label: 'Keyboard Transcriptions', href: '/keyboard-transcription-service', icon: keyboardIcon },
  {
    label: 'Sheet Music Transposing',
    href: '/sheet-music-transposing-service',
    icon: transposingIcon,
  },
  { label: 'Big Band Arrangements', href: '/big-band-arrangement-service', icon: hornsIcon },
  {
    label: 'Music Copying & Digitizing',
    href: '/music-copying-digitizing-service',
    icon: copyingIcon,
  },
]
