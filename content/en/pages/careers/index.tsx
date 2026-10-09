import { mediaLabels } from '@content/en/data/labels'
import { MediaText, PageHeader, PictureGrid, Section, Table } from '~/components/blocks'
import { Text, TextLink } from '~/components/typography'
import office8 from './office-8.jpg?w=560;1000&as=picture'
import office9 from './office-9.jpg?w=560;1000&as=picture'
import office10 from './office-10.jpg?w=560;1000&as=picture'
import office11 from './office-11.jpg?w=560;1000&as=picture'
import office12 from './office-12.jpg?w=560;1000&as=picture'
import office14 from './office-14.jpg?w=560;1000&as=picture'
import officeTranscriber from './office-transcriber.jpg?w=560;1000&as=picture'
import teamAnandi from './team-anandi.jpg?w=180;360&as=picture'
import teamArnau from './team-arnau.png?w=180;360&as=picture'
import teamAviana from './team-aviana.jpg?w=180;360&as=picture'
import teamBenjamin from './team-benjamin.jpg?w=180;360&as=picture'
import teamBernardo from './team-bernardo.jpg?w=180;360&as=picture'
import teamBrett from './team-brett.jpg?w=180;360&as=picture'
import teamBruno from './team-bruno.jpg?w=180;360&as=picture'
import teamBryn from './team-bryn.jpg?w=180;360&as=picture'
import teamCarla from './team-carla.jpg?w=180;360&as=picture'
import teamColom from './team-colom.jpg?w=180;360&as=picture'
import teamCristina from './team-cristina.jpg?w=180;360&as=picture'
import teamDan from './team-dan.jpg?w=180;360&as=picture'
import teamDanbi from './team-danbi.jpg?w=180;360&as=picture'
import teamDavid from './team-david.jpg?w=180;360&as=picture'
import teamEric from './team-eric.jpg?w=180;360&as=picture'
import teamEthan from './team-ethan.jpg?w=180;360&as=picture'
import teamFacu from './team-facu.jpg?w=180;360&as=picture'
import teamGemma from './team-gemma.jpg?w=180;360&as=picture'
import teamHugo from './team-hugo.jpg?w=180;360&as=picture'
import teamJoan from './team-joan.jpg?w=180;360&as=picture'
import teamJoanMarti from './team-joan-marti.jpg?w=180;360&as=picture'
import teamJoel from './team-joel.jpg?w=180;360&as=picture'
import teamJoelR from './team-joel-r.jpg?w=180;360&as=picture'
import teamJorge from './team-jorge.jpg?w=180;360&as=picture'
import teamJosepf from './team-josepf.jpg?w=180;360&as=picture'
import teamMaja from './team-maja.jpg?w=180;360&as=picture'
import teamMarc from './team-marc.jpg?w=180;360&as=picture'
import teamMarina from './team-marina.jpg?w=180;360&as=picture'
import teamMark from './team-mark.jpg?w=180;360&as=picture'
import teamMatthew from './team-matthew.jpg?w=180;360&as=picture'
import teamMauricio from './team-mauricio.jpg?w=180;360&as=picture'
import teamMauro from './team-mauro.jpg?w=180;360&as=picture'
import teamMichael from './team-michael.jpg?w=180;360&as=picture'
import teamMiguel from './team-miguel.jpg?w=180;360&as=picture'
import teamMiguelNavarro from './team-miguel-navarro.jpg?w=180;360&as=picture'
import teamNathan from './team-nathan.jpg?w=180;360&as=picture'
import teamNicola from './team-nicola.jpg?w=180;360&as=picture'
import teamOna from './team-ona.jpg?w=180;360&as=picture'
import teamOriol from './team-oriol.jpg?w=180;360&as=picture'
import teamOriol2 from './team-oriol-2.jpg?w=180;360&as=picture'
import teamOsvaldo from './team-osvaldo.jpg?w=180;360&as=picture'
import teamOttavio from './team-ottavio.jpg?w=180;360&as=picture'
import teamPabloO from './team-pablo-o.jpg?w=180;360&as=picture'
import teamPau from './team-pau.jpg?w=180;360&as=picture'
import teamPiero from './team-piero.jpg?w=180;360&as=picture'
import teamQuim from './team-quim.jpg?w=180;360&as=picture'
import teamRoc from './team-roc.jpg?w=180;360&as=picture'
import teamSanti from './team-santi.jpg?w=180;360&as=picture'
import teamStephano02 from './team-stephano02.jpg?w=180;360&as=picture'
import teamVictor from './team-victor.jpg?w=180;360&as=picture'
import you from './you.webp?w=180;360&as=picture'

export default function CareersPage() {
  return (
    <>
      <PageHeader
        title="Work with us!"
        lead="Be part of the **My Sheet Music Transcriptions** team in Terrassa/Barcelona or join us remotely!"
        cta={{ label: 'Job openings', href: '#job-openings' }}
      />

      <Section title="Join our band">
        <Text>
          We are the go-to production company for new sheet music editions and transcriptions.
        </Text>
        <Text>
          Be part of a global, growing, collaborative team that makes the music community play the
          right notes.
        </Text>
        <Text>
          Develop your music and leadership skills, grow professionally, and rest assured{' '}
          <strong>this is going to be a fun gig.</strong>
        </Text>
        <Text>Our music sounds as good as ever: come and play your part!</Text>
      </Section>

      <PictureGrid
        shape="photo"
        columns={6}
        label="The My Sheet Music Transcriptions team"
        items={[
          { image: teamOriol, alt: 'Oriol, Founder & CEO' },
          { image: teamRoc, alt: 'Roc, My Sheet Music Transcriptions team' },
          { image: teamArnau, alt: 'Arnau, My Sheet Music Transcriptions team' },
          { image: teamMaja, alt: 'Maja, Team Coordinator & Music Specialist' },
          { image: teamBrett, alt: 'Brett, My Sheet Music Transcriptions team' },
          { image: teamMauricio, alt: 'Mauricio, Customer Service Manager & Music Specialist' },
          { image: teamColom, alt: 'Colomé, Customer Service Manager & Growth Lead' },
          { image: teamQuim, alt: 'Quim, My Sheet Music Transcriptions team' },
          { image: teamCristina, alt: 'Cristina, My Sheet Music Transcriptions team' },
          { image: teamAnandi, alt: 'Anandi, My Sheet Music Transcriptions team' },
          { image: teamMiguelNavarro, alt: 'Miguel Navarro, Music Specialist & Customer Service' },
          { image: teamStephano02, alt: 'Stephano, My Sheet Music Transcriptions team' },
          { image: teamOsvaldo, alt: 'Osvaldo, My Sheet Music Transcriptions team' },
          { image: teamFacu, alt: 'Facu, My Sheet Music Transcriptions team' },
          { image: teamSanti, alt: 'Santi, My Sheet Music Transcriptions team' },
          { image: teamOna, alt: 'Ona, Music Editor & Customer Support' },
          { image: teamMarina, alt: 'Marina, My Sheet Music Transcriptions team' },
          { image: teamOttavio, alt: 'Ottavio, My Sheet Music Transcriptions team' },
          { image: teamCarla, alt: 'Carla, My Sheet Music Transcriptions team' },
          { image: teamPiero, alt: 'Piero, My Sheet Music Transcriptions team' },
          { image: teamJosepf, alt: 'Josep F., My Sheet Music Transcriptions team' },
          { image: teamDavid, alt: 'David, Piano Transcriber & Copyist' },
          { image: teamMarc, alt: 'Marc, Piano specialist' },
          { image: teamEric, alt: 'Eric, Piano specialist' },
          { image: teamMichael, alt: 'Michael, Piano Transcriber' },
          { image: teamGemma, alt: 'Gemma, Piano specialist' },
          { image: teamPabloO, alt: 'Pablo O., Piano Transcriber' },
          { image: teamJoel, alt: 'Joel, Piano Transcriber' },
          { image: teamBruno, alt: 'Bruno, Piano Transcriber' },
          { image: teamMatthew, alt: 'Matthew, My Sheet Music Transcriptions team' },
          { image: teamNicola, alt: 'Nicola, My Sheet Music Transcriptions team' },
          { image: teamDan, alt: 'Dan, My Sheet Music Transcriptions team' },
          { image: teamAviana, alt: 'Aviana, My Sheet Music Transcriptions team' },
          { image: teamMark, alt: 'Mark, My Sheet Music Transcriptions team' },
          { image: teamEthan, alt: 'Ethan, My Sheet Music Transcriptions team' },
          { image: teamBryn, alt: 'Bryn, My Sheet Music Transcriptions team' },
          { image: teamVictor, alt: 'Victor, Guitar specialist' },
          { image: teamMiguel, alt: 'Miguel, My Sheet Music Transcriptions team' },
          { image: teamMauro, alt: 'Mauro, Guitar Transcriber' },
          { image: teamJoelR, alt: 'Joel R., Fingerstyle Guitar specialist' },
          { image: teamPau, alt: 'Pau, Guitar specialist' },
          { image: teamHugo, alt: 'Hugo, My Sheet Music Transcriptions team' },
          { image: teamJorge, alt: 'Jorge, My Sheet Music Transcriptions team' },
          { image: teamNathan, alt: 'Nathan, Piano & Guitar Transcriber' },
          { image: teamJoan, alt: 'Joan, Violin specialist' },
          { image: teamDanbi, alt: 'Danbi, My Sheet Music Transcriptions team' },
          { image: teamBernardo, alt: 'Bernardo, My Sheet Music Transcriptions team' },
          { image: teamBenjamin, alt: 'Benjamin, My Sheet Music Transcriptions team' },
          { image: teamOriol2, alt: 'Oriol, Horns and Jazzist' },
          { image: teamJoanMarti, alt: 'Joan Marti, My Sheet Music Transcriptions team' },
          { image: you, alt: 'You? Join the team' },
        ]}
      />

      <Table
        id="job-openings"
        title="Job openings"
        caption="General openings"
        columns={['Publication date', 'Position', 'Location', 'Type', '']}
        rows={[
          [
            '08/10/2026',
            'Senior Music ML Engineer',
            'Hybrid remote: Terrassa (Barcelona)',
            'Full-time, one-year contract (R+D)',
            { label: 'See more & apply', href: '/job/senior-music-ml-engineer' },
          ],
          [
            '10/07/2026',
            'Digital Marketing Lead',
            'Remote',
            'Part-time work contract or Freelance',
            { label: 'See more & apply', href: '/job/digital-marketing-lead' },
          ],
          [
            '02/03/2026',
            'Music Editor',
            'Hybrid: Terrassa/Barcelona + Remote',
            'Full-time work contract',
            { label: 'See more & apply', href: '/job/music-editor' },
          ],
          [
            '18/02/2026',
            'Project Assistant & Admin Support',
            'Hybrid: Terrassa/Barcelona + Remote',
            'Full-time work contract',
            { label: 'See more & apply', href: '/job/project-assistant-admin-support' },
          ],
          [
            '01/01/2026',
            'Catalog Specialist',
            'Hybrid: Terrassa/Barcelona + Remote',
            'Full-time work contract',
            { label: 'See more & apply', href: '/job/catalog-specialist' },
          ],
          [
            '06/10/2025',
            'Music Specialist + Customer Service',
            'Hybrid: Terrassa/Barcelona + Remote',
            'Full-time work contract',
            { label: 'See more & apply', href: '/job/music-specialist' },
          ],
          [
            '06/10/2025',
            'Music Specialist + Customer Service (Remote)',
            'Argentina / Chile / Remote',
            'Freelancer',
            { label: 'See more & apply', href: '/job/music-specialist-remote' },
          ],
        ]}
      >
        <Text>
          <strong>
            There is always room for one more talented musician at My Sheet Music Transcriptions.
          </strong>
        </Text>
        <Text>See below the available job positions we’re expecting to fill soon:</Text>
      </Table>

      <Table
        caption="Transcription openings"
        columns={['Publication date', 'Position', 'Location', 'Type', '']}
        rows={[
          [
            '09/04/2026',
            'Choir & Vocal Ensemble transcriber',
            'Remote',
            'Freelancer',
            { label: 'See more & apply', href: '/job/choir-vocal-ensemble-transcriber' },
          ],
          [
            '10/03/2026',
            'Digitizer / Engraver / Copyist',
            'Remote',
            'Freelance',
            { label: 'See more & apply', href: '/job/digitizer-engraver' },
          ],
          [
            '10/03/2026',
            'Drums Transcriber',
            'Remote',
            'Freelance',
            { label: 'See more & apply', href: '/job/drums-transcriber' },
          ],
          [
            '10/03/2026',
            'Guitar & Bass Transcriber',
            'Remote',
            'Freelancer',
            { label: 'See more & apply', href: '/job/guitar-transcriber' },
          ],
          [
            '14/01/2026',
            'Full Pop / Rock Band transcriber',
            'Remote',
            'Freelancer',
            { label: 'See more & apply', href: '/job/full-pop-rock-band-transcriber' },
          ],
          [
            '30/09/2025',
            'Orchestral & Big Ensemble transcriber',
            'Remote',
            'Freelancer',
            { label: 'See more & apply', href: '/job/orchestral-transcriber' },
          ],
          [
            '01/09/2025',
            'Jazz & Blues piano transcriber',
            'Remote',
            'Freelancer',
            { label: 'See more & apply', href: '/job/jazz-piano-transcriber' },
          ],
          [
            '01/09/2025',
            'Piano & Vocal transcriber',
            'Remote',
            'Freelancer',
            { label: 'See more & apply', href: '/job/piano-vocal-transcriber' },
          ],
        ]}
      />

      <MediaText
        labels={mediaLabels}
        title="About the hiring process"
        align="center"
        imageSide="left"
        tone="cream"
        images={[
          { image: office8, alt: 'My Sheet Music Transcriptions Office - Transcriber working' },
          { image: office14, alt: 'My Sheet Music Transcriptions Office - Customer Service' },
          { image: office12, alt: 'My Sheet Music Transcriptions Office - Customer Service' },
          {
            image: officeTranscriber,
            alt: 'My Sheet Music Transcriptions Office - Transcriber working',
          },
          { image: office11, alt: 'My Sheet Music Transcriptions Office - Customer Service' },
          { image: office10, alt: 'My Sheet Music Transcriptions Office - Customer Service' },
          { image: office9, alt: 'My Sheet Music Transcriptions Office - Customer Service' },
        ]}
        cta={{ label: 'Read more about us', href: '/about-us' }}
      >
        <Text>
          We are a team of 40+ professional music transcribers, arrangers, music editors,
          musicologists, developers, and engineers based in{' '}
          <strong>Terrassa, Barcelona, Spain.</strong>
        </Text>
        <Text>
          Most of our team is local but that doesn’t mean that we’re not looking for talent
          remotely.
        </Text>
        <Text>
          Given the volume of applications we receive, please be aware that we might not reply
          immediately to your messages, or we might not reply at all if your application is
          incomplete or not sent to the correct email address.
        </Text>
        <Text>
          Make sure you include all the requested information for a position and use the correct
          email address for each job opening.
        </Text>
      </MediaText>

      <Section
        align="center"
        rule={false}
        width="narrow"
        tone="peach"
        title="No job openings for you?"
        cta={{ label: 'Apply now', href: 'mailto:job@mysheetmusictranscriptions.com' }}
      >
        <Text>
          <strong>Don’t worry.</strong> We still review unsolicited applications and, if you wish,
          keep your information in case there’s a suitable vacancy in the future.
        </Text>
        <Text>
          Please use this email address to contact us if you don’t see a suitable position for you
          right now:{' '}
          <TextLink href="mailto:job@mysheetmusictranscriptions.com">
            job@mysheetmusictranscriptions.com
          </TextLink>
        </Text>
      </Section>
    </>
  )
}
