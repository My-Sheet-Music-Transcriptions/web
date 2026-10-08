import { LogoGrid } from '~/components/blocks'
import avid from './avid-sibelius.png?w=240;480&as=picture'
import cantamus from './cantamus.png?w=240;480&as=picture'
import easysong from './easysong.png?w=240;480&as=picture'
import elPianoEvents from './el-piano-events.png?w=240;480&as=picture'
import engraversMark from './engravers-mark.png?w=240;480&as=picture'
import familyInMusic from './family-in-music.png?w=240;480&as=picture'
import guitarPro from './guitar-pro.png?w=240;480&as=picture'
import music4Humans from './music-4-humans.jpg?w=180;360&as=picture'
import musicnotes from './musicnotes.png?w=240;480&as=picture'
import musicnotesPartner from './musicnotes-partner.png?w=240;480&as=picture'
import mySongProductions from './my-song-productions.png?w=240;480&as=picture'
import nizco from './nizco.jpg?w=240;480&as=picture'
import sepulchralSilence from './sepulchral-silence.png?w=240;480&as=picture'
import songburd from './songburd.png?w=240;480&as=picture'
import soundslice from './soundslice.png?w=240;480&as=picture'

export default function PartnersPage() {
  return (
    <>
      <LogoGrid
        columns={3}
        showNames
        items={[
          { name: 'Music 4 Humans', image: music4Humans, href: '/music-4-humans' },
          {
            name: 'Musicnotes',
            caption: 'Practice. Play. Perform',
            image: musicnotesPartner,
            href: '/musicnotes',
          },
          {
            name: 'Family In Music',
            caption: 'YOUR MUSIC. YOUR RIGHTS. YOUR FUTURE.',
            image: familyInMusic,
            href: '/family-in-music',
          },
        ]}
      />

      <LogoGrid
        tone="cream"
        columns={3}
        showNames
        items={[
          {
            name: 'Avid',
            caption: 'Avid. Sibelius notation software.',
            image: avid,
            href: 'https://avid.8v4lqg.net/VmoKPJ',
          },
          {
            name: 'Guitar Pro',
            caption: 'Best notation software for guitar players.',
            image: guitarPro,
            href: 'https://www.guitar-pro.com/#ae902',
          },
          {
            name: 'Musicnotes',
            caption: 'Practice. Play. Perform.',
            image: musicnotes,
            href: 'https://www.musicnotes.com/?cmpid=AFF_linkshare&c3ch=LinkShare&c3nid=wuXePAkIY98&arp=2&affsid=LS-Affiliate&utm_source=rakuten&utm_medium=affiliates',
          },
          {
            name: 'Sepulchral Silence',
            caption: 'Digital music distribution.',
            image: sepulchralSilence,
            href: 'https://www.musicnotes.com/?cmpid=AFF_linkshare&c3ch=LinkShare&c3nid=wuXePAkIY98&arp=2&affsid=LS-Affiliate&utm_source=rakuten&utm_medium=affiliates',
          },
          {
            name: 'Cantamus',
            caption: 'AI for singers and vocal ensembles',
            image: cantamus,
            href: '/cantamus',
          },
          {
            name: 'My Song Productions',
            caption: 'Music production services',
            image: mySongProductions,
            href: 'https://www.mysongproductions.com',
          },
          {
            name: 'Songburd',
            caption: 'Sheet music distribution services for composers in the US',
            image: songburd,
            href: 'https://songburdmusic.com/',
          },
          {
            name: 'Soundslice',
            caption: 'Any-instrument interactive tutorials',
            image: soundslice,
            href: '/soundslice-tutorials',
          },
          {
            name: 'Engraver’s Mark',
            caption: 'Sheet music printing for orchestras',
            image: engraversMark,
            href: 'https://www.engraversmarkmusic.com/',
          },
          {
            name: 'EasySong',
            caption: 'Licensing and copyrighting',
            image: easysong,
            href: 'https://www.easysong.com/?PartnerID=277',
          },
          {
            name: 'Nizco Music',
            caption: 'We help musicians establish a portfolio career',
            image: nizco,
            href: 'https://www.nizcomusic.com/',
          },
          {
            name: 'El Piano Events',
            caption: 'Live music for events and weddings',
            image: elPianoEvents,
            href: 'https://elpianoevents.com/en',
          },
        ]}
      />
    </>
  )
}
