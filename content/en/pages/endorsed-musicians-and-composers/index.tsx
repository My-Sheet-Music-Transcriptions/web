import { ContactSection, LogoGrid, PageHeader, Section } from '~/components/blocks'
import { Text } from '~/components/typography'
import caitlinDeVille from './caitlin-de-ville.png?w=180;360&as=picture'
import cameronCody from './cameron-cody.png?w=180;360&as=picture'
import costantinoCarrara from './costantino-carrara.jpg?w=180;360&as=picture'
import eduardFreixa from './eduard-freixa.png?w=180;360&as=picture'
import emilePandolfi from './emile-pandolfi.png?w=180;360&as=picture'
import gavinLuke from './gavin-luke.png?w=180;360&as=picture'
import georgeCollier from './george-collier.png?w=180;360&as=picture'
import katherineCordova from './katherine-cordova.jpg?w=180;360&as=picture'
import leikiUeda from './leiki-ueda.png?w=180;360&as=picture'
import lindseyStirling from './lindsey-stirling.png?w=180;360&as=picture'
import marcoPoingt from './marco-poingt.jpg?w=180;360&as=picture'
import musicFourHumans from './music-4-humans.jpg?w=180;360&as=picture'
import natalieRaynes from './natalie-raynes.png?w=180;360&as=picture'
import nathanAllen from './nathan-allen.png?w=180;360&as=picture'
import neilArcher from './neil-archer.png?w=180;360&as=picture'
import peterVamos from './peter-vamos.png?w=180;360&as=picture'
import phianonize from './phianonize.webp?w=180;360&as=picture'
import pianomusings from './pianomusings.png?w=180;360&as=picture'
import ralucaBojor from './raluca-bojor.png?w=180;360&as=picture'
import robLandes from './rob-landes.png?w=180;360&as=picture'
import taylorDavis from './taylor-davis.webp?w=180;360&as=picture'

export default function EndorsedMusiciansPage() {
  return (
    <>
      <PageHeader
        title="My Sheet Music Transcriptions Artists"
        subtitle="Composers, arrangers, songwriters, and Youtube cover artists"
      />

      <Section width="narrow">
        <Text className="text-center text-[18px]">
          Meet some of the most celebrated and extraordinarily gifted artists with whom we have
          partnered over the years. Since we have longstanding and thriving professional
          relationships with them, they have become our proudest ambassadors! We love assisting them
          with their tasks, and they regard us as their go-to provider of sheet music
          transcriptions.{' '}
          <strong>Visit their custom pages and learn more about them and our relationship!</strong>
        </Text>
      </Section>

      <LogoGrid
        shape="portrait"
        showNames
        columns={5}
        items={[
          { name: 'Katherine Cordova', image: katherineCordova, href: '/katherine-cordova' },
          { name: 'Costantino Carrara', image: costantinoCarrara, href: '/costantino-carrara' },
          { name: 'Marco Poingt', image: marcoPoingt, href: '/marco-poingt' },
          { name: 'Lindsey Stirling', image: lindseyStirling, href: '/lindsey-stirling' },
          { name: 'PHianonize', image: phianonize, href: '/phianonize-sheet-music-transcriptions' },
          { name: 'George Collier', image: georgeCollier, href: '/george-collier' },
          { name: 'Taylor Davis', image: taylorDavis, href: '/taylor-davis' },
          { name: 'Gavin Luke', image: gavinLuke, href: '/gavin-luke' },
          { name: 'Rob Landes', image: robLandes, href: '/rob-landes' },
          { name: 'Music 4 Humans', image: musicFourHumans, href: '/music-4-humans' },
          { name: 'Eduard Freixa', image: eduardFreixa, href: '/eduard-freixa-sheet-music' },
          { name: 'Cameron Cody', image: cameronCody, href: '/cameron-cody-sheet-music' },
          { name: 'Raluca Bojor', image: ralucaBojor, href: '/raluca-bojor-sheet-music' },
          { name: 'Neil Archer', image: neilArcher, href: '/neil-archer-sheet-music' },
          { name: 'Leiki Ueda', image: leikiUeda, href: '/leiki-ueda' },
          {
            name: 'Caitlin De Ville',
            image: caitlinDeVille,
            href: '/caitlin-de-ville-violin-sheet-music',
          },
          { name: 'Natalie Raynes', image: natalieRaynes, href: '/natalie-raynes-sheet-music' },
          { name: 'Peter Vamos', image: peterVamos, href: '/peter-vamos-transcription-service' },
          {
            name: 'Emile Pandolfi',
            image: emilePandolfi,
            href: '/emile-pandolfi-sheet-music-transcription',
          },
          { name: 'Pianomusings', image: pianomusings, href: '/pianomusings-sheet-music' },
          { name: 'Nathan Allen', image: nathanAllen, href: '/nathan-allen-transcription-service' },
        ]}
      />

      <ContactSection returnTo="/endorsed-musicians-and-composers" />
    </>
  )
}
