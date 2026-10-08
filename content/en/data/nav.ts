import type { NavItem } from '~/i18n/types'

/**
 * Main navigation (desktop header + phone menu). Four items: Home is the logo and Contact is the header
 * button. The Services panel lists entry points only; every individual service page stays reachable from
 * those pages, the services catalogue and the footer.
 */
export const nav: NavItem[] = [
  {
    label: 'Services',
    href: '/services-samples',
    menu: {
      columns: [
        {
          title: 'By instrument',
          links: [
            { label: 'Piano', href: '/piano' },
            { label: 'Piano & vocal', href: '/piano-vocal' },
            { label: 'Guitar & bass', href: '/guitar-tab' },
            { label: 'Vocal', href: '/vocal-lead-sheet-transcription-service' },
            { label: 'Horns & woodwinds', href: '/horns-transcription-service' },
            { label: 'Strings', href: '/strings-transcription-service' },
            { label: 'Drums', href: '/drums-transcription-service' },
            { label: 'Other instruments', href: '/services-samples' },
          ],
        },
        {
          title: 'By genre & format',
          links: [
            { label: 'Jazz & blues', href: '/jazz-transcription-service' },
            { label: 'Ensembles & orchestras', href: '/orchestration-service' },
            { label: 'Chord & rhythm charts', href: '/chord-charts' },
            { label: 'Piano tutorials', href: '/synthesia-piano-tutorials' },
            { label: 'Copying & transposing', href: '/music-copying-digitizing-service' },
            { label: 'Sheet music printing', href: '/sheet-music-printing' },
            { label: 'Music productions', href: 'https://mysongproductions.com/' },
          ],
        },
        {
          title: 'Most requested',
          links: [
            { label: 'Audio to sheet music', href: '/music-transcription-service' },
            { label: 'Lead sheets', href: '/lead-sheet-transcription-service' },
            { label: 'Big band arrangements', href: '/big-band-arrangement-service' },
            {
              label: 'Services for publishers',
              href: '/music-transcription-service-for-publishers',
            },
          ],
        },
      ],
      features: [
        {
          title: 'All services & samples',
          body: 'Every instrument, genre and format, with sample scores.',
          cta: 'Browse the catalogue',
          href: '/services-samples',
        },
        {
          title: 'Gift a transcription',
          body: 'A custom gift card for any amount, redeemable for any transcription.',
          cta: 'See gift cards',
          href: '/gift-card',
        },
      ],
    },
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Reviews', href: '/customer-reviews' },
  { label: 'About', href: '/about-us' },
]
