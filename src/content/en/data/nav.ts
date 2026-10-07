import type { NavItem } from '~/i18n/types'

/** Main navigation (desktop header + mobile menu). Mirrors the live site, one level of groups. */
export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Audio → Sheet music', href: '/music-transcription-service' },
  {
    label: 'Services & Samples',
    href: '/services-samples',
    groups: [
      { title: 'Piano Transcriptions', href: '/piano', links: [] },
      { title: 'Piano & Vocal Transcriptions', href: '/piano-vocal', links: [] },
      {
        title: 'Guitar & Bass Transcriptions',
        links: [
          { label: 'Guitar Tabs & Sheets', href: '/guitar-tab' },
          { label: 'Bass Tabs & Sheets', href: '/bass-tab-transcription-service' },
          { label: 'Ukulele Tabs & Sheets', href: '/ukulele-transcription-service' },
          { label: 'Mandolin and Oud Tabs & Sheets', href: '/mandolin-and-oud-tabs-sheets' },
          { label: 'Lap Steel Guitar', href: '/lap-steel-guitar-transcription-service' },
          { label: 'Guitar Chord Charts', href: '/chord-charts' },
        ],
      },
      {
        title: 'Jazz & Blues Transcriptions',
        links: [
          { label: 'Piano Jazz', href: '/jazz-piano-solo-transcriptions' },
          { label: 'Piano Jazz Trio', href: '/piano-jazz-trio-transcriptions' },
          { label: 'Piano Blues', href: '/blues-piano-transcription-service' },
          { label: 'Jazz Solos', href: '/jazz-transcription-service' },
          { label: 'Jazz Rhythm Charts', href: '/rhythm-charts' },
          { label: 'Instrumental Lead Sheets', href: '/lead-sheet-transcription-service' },
          { label: 'Big Band Transcriptions', href: '/big-band-arrangement-service' },
        ],
      },
      {
        title: 'Vocal Transcriptions',
        links: [
          { label: 'Vocal Lead Sheets', href: '/vocal-lead-sheet-transcription-service' },
          { label: 'Backing Vocals', href: '/backing-vocals-transcription-service' },
          { label: 'Vocal Ensemble', href: '/vocal-ensemble-transcription-service' },
        ],
      },
      {
        title: 'Horn Transcriptions',
        href: '/horns-transcription-service',
        links: [
          { label: 'Trumpet', href: '/trumpet-transcription-service' },
          { label: 'Trombone', href: '/trombone-transcription-service' },
          { label: 'Saxophone', href: '/saxophone-transcription-service' },
          { label: 'Clarinet', href: '/clarinet-transcription-service' },
          { label: 'Flute', href: '/flute-transcription-service' },
          { label: 'Horn Section', href: '/horn-section-transcription-service' },
          { label: 'Big Band', href: '/big-band-arrangement-service' },
          { label: 'Concert & Brass Band', href: '/concert-brass-band-transcriptions' },
          { label: 'Marching Band', href: '/marching-band-transcription-service' },
        ],
      },
      {
        title: 'String Transcriptions',
        href: '/strings-transcription-service',
        links: [
          { label: 'Violin', href: '/violin-transcription-service' },
          { label: 'Cello', href: '/cello-transcription-service' },
          { label: 'String Quartet', href: '/string-quartet-transcription-service' },
          { label: 'String Orchestra', href: '/string-orchestra' },
        ],
      },
      { title: 'Drums Transcriptions', href: '/drums-transcription-service', links: [] },
      {
        title: 'Other Instruments',
        links: [
          { label: 'Keyboard', href: '/keyboard-transcription-service' },
          { label: 'Accordion', href: '/accordion-transcription-service' },
          { label: 'Harp', href: '/harp-transcription-service' },
          { label: 'Organ', href: '/organ-transcription-service' },
        ],
      },
      {
        title: 'Ensembles & Orchestras',
        links: [
          { label: 'Orchestration Service', href: '/orchestration-service' },
          { label: 'Marching Band Transcriptions', href: '/marching-band-transcription-service' },
          {
            label: 'Concert & Brass Band Transcriptions',
            href: '/concert-brass-band-transcriptions',
          },
          { label: 'Big Band Arrangements', href: '/big-band-arrangement-service' },
          { label: 'Full Band Transcriptions', href: '/full-band-transcription-service' },
          { label: 'Vocal Ensemble Transcriptions', href: '/vocal-ensemble-transcription-service' },
          { label: 'Custom Ensemble Arrangements', href: '/music-arrangement-service' },
        ],
      },
      {
        title: 'Charts & Tutorials',
        links: [
          { label: 'Rhythm Charts', href: '/rhythm-charts' },
          { label: 'Chord Charts', href: '/chord-charts' },
          { label: 'Nashville Numbers Charts', href: '/nashville-numbers-charts' },
          { label: 'Synthesia Tutorials', href: '/synthesia-piano-tutorials' },
          { label: 'Soundslice Tutorials', href: '/soundslice-tutorials' },
        ],
      },
      {
        title: 'Music Digitizing Services',
        links: [
          { label: 'Copying & Digitizing Service', href: '/music-copying-digitizing-service' },
          { label: 'Transposing Service', href: '/sheet-music-transposing-service' },
          {
            label: 'Transcription Services for Publishers',
            href: '/music-transcription-service-for-publishers',
          },
        ],
      },
      { title: 'Music Productions', href: 'https://mysongproductions.com/', links: [] },
      { title: 'Printing Service', href: '/sheet-music-printing', links: [] },
      { title: 'Gift a Transcription!', href: '/gift-card', links: [] },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Reviews', href: '/customer-reviews' },
  { label: 'About us', href: '/about-us' },
  { label: 'Contact', href: '/contact' },
]
