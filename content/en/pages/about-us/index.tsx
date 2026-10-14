import { mediaLabels } from '@content/en/data/labels'
import { CardGrid, MediaText, PageHeader, PictureGrid, Section } from '~/components/blocks'
import { Text } from '~/components/typography'
import band from './band.jpg?w=600;1200&as=picture'
import office8 from './office-8.jpg?w=560;1000&as=picture'
import office9 from './office-9.jpg?w=560;1000&as=picture'
import office10 from './office-10.jpg?w=560;1000&as=picture'
import office11 from './office-11.jpg?w=560;1000&as=picture'
import office12 from './office-12.jpg?w=560;1000&as=picture'
import office14 from './office-14.jpg?w=560;1000&as=picture'
import officeTranscriber from './office-transcriber.jpg?w=560;1000&as=picture'
import postGuitar from './post-guitar.jpg?w=400;768&as=picture'
import postGuitarPro from './post-guitar-pro.jpg?w=400;768&as=picture'
import postJazz from './post-jazz.jpg?w=400;768&as=picture'
import teamAnandi from './team-anandi.jpg?w=180;360&as=picture'
import teamArnau from './team-arnau.png?w=180;360&as=picture'
import teamAviana from './team-aviana.jpg?w=180;360&as=picture'
import teamBenjamin from './team-benjamin.jpg?w=180;360&as=picture'
import teamBernardo from './team-bernardo.jpg?w=180;360&as=picture'
import teamBrett from './team-brett.jpg?w=180;360&as=picture'
import teamBruno from './team-bruno.jpg?w=180;360&as=picture'
import teamBryn from './team-bryn.jpg?w=180;360&as=picture'
import teamCarla from './team-carla.jpg?w=180;360&as=picture'
import teamCarlaDigitizer from './team-carla-digitizer.jpg?w=180;360&as=picture'
import teamColom from './team-colom.jpg?w=180;360&as=picture'
import teamCristina from './team-cristina.jpg?w=180;360&as=picture'
import teamDan from './team-dan.jpg?w=180;360&as=picture'
import teamDanbi from './team-danbi.jpg?w=180;360&as=picture'
import teamDavid from './team-david.jpg?w=180;360&as=picture'
import teamEmma from './team-emma.jpg?w=180;360&as=picture'
import teamEric from './team-eric.jpg?w=180;360&as=picture'
import teamEthan from './team-ethan.jpg?w=180;360&as=picture'
import teamFacu from './team-facu.jpg?w=180;360&as=picture'
import teamGemma from './team-gemma.jpg?w=180;360&as=picture'
import teamGuillem from './team-guillem.jpg?w=180;360&as=picture'
import teamHugo from './team-hugo.jpg?w=180;360&as=picture'
import teamJoan from './team-joan.jpg?w=180;360&as=picture'
import teamJoanMarti from './team-joan-marti.jpg?w=180;360&as=picture'
import teamJoel from './team-joel.jpg?w=180;360&as=picture'
import teamJoelR from './team-joel-r.jpg?w=180;360&as=picture'
import teamJorge from './team-jorge.jpg?w=180;360&as=picture'
import teamJosepJaume from './team-josep-jaume.jpg?w=180;360&as=picture'
import teamJosepf from './team-josepf.jpg?w=180;360&as=picture'
import teamMaja from './team-maja.jpg?w=180;360&as=picture'
import teamManuel from './team-manuel.jpg?w=180;360&as=picture'
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
import teamOscar from './team-oscar.jpg?w=180;360&as=picture'
import teamOsvaldo from './team-osvaldo.jpg?w=180;360&as=picture'
import teamOttavio from './team-ottavio.jpg?w=180;360&as=picture'
import teamPabloO from './team-pablo-o.jpg?w=180;360&as=picture'
import teamPau from './team-pau.jpg?w=180;360&as=picture'
import teamPiero from './team-piero.jpg?w=180;360&as=picture'
import teamQueralt from './team-queralt.jpg?w=180;360&as=picture'
import teamQuim from './team-quim.jpg?w=180;360&as=picture'
import teamRoc from './team-roc.jpg?w=180;360&as=picture'
import teamSanti from './team-santi.jpg?w=180;360&as=picture'
import teamStephano02 from './team-stephano02.jpg?w=180;360&as=picture'
import teamVictor from './team-victor.jpg?w=180;360&as=picture'
import teamVirginia from './team-virginia.jpg?w=180;360&as=picture'

export default function AboutUsPage() {
  return (
    <>
      <PageHeader
        title="Meet the band"
        subtitle="Get to know the musicians behind your sheet music"
      />

      <MediaText image={band} alt="The My Sheet Music Transcriptions team" imageSide="left">
        <Text>
          We are a team of 100+ professional musicians with unmatched musical knowledge and
          extensive tech proficiency. An enthusiastic bunch ready to tackle all-things-notation and
          help you bring your music to life.
        </Text>
        <Text>
          My Sheet Music Transcriptions’ (MSMT) founder and CEO, Oriol, started as a solo act.
          Building steadily, never compromising quality for the sake of speed, and learning along
          the way, lead to opening the French and Spanish-speaking markets. Quickly followed by the
          Japanese and German sites, reaching an even larger community of fellow musicians.
        </Text>
        <Text>
          With our home base in Catalonia (Terrassa, Barcelona, Spain), our band members are located
          all around the world. We have skilled Music Specialists ready to help you from various
          locations on 4 continents (Europe, Asia, and North and South America).
        </Text>
        <Text>
          They will work by your side to fine tune the details of your project, and then, coordinate
          and communicate it to our team of transcribers, arrangers and composers. Before music is
          sent back to you, our music editors will take up the baton and ensure that each file meets
          the highest quality standards.
        </Text>
      </MediaText>

      <MediaText
        labels={mediaLabels}
        imageSide="right"
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
      >
        <Text>
          All of them, alongside management, business, research, tech, and marketing teams, make up
          for the 20+ professionals that make sure we offer our unparalleled music notation services
          to as many musicians as possible. All over the world!
        </Text>
        <Text>
          At the backbone of our services is our Transcription Team. Comprised of 60+ musicians who
          meticulously transcribe the hundreds of files we deliver each week by ear, note-for-note.
          With an adept and varied group of transcribers, each having their own specialty, we always
          have the right person for the job.
        </Text>
        <Text>
          With this blend of talent, technology, and experience, we’re poised to take on nearly any
          project, no matter the level or scale. We’re here to facilitate your notation needs.
        </Text>
      </MediaText>

      <Section
        title="Follow the latest updates on Linkedin"
        align="center"
        rule={false}
        width="narrow"
        tone="peach"
        cta={{
          label: 'Read more',
          href: 'https://www.linkedin.com/company/my-sheet-music-transcriptions/',
        }}
      />

      <PictureGrid
        title="Our Team"
        shape="portrait"
        columns={6}
        items={[
          {
            image: teamOriol,
            name: 'Oriol',
            caption: 'Founder & CEO',
            href: 'https://www.linkedin.com/in/oriollopezcalle/',
          },
          { image: teamRoc, name: 'Roc', caption: 'Lead Music Editor & Operations Manager' },
          { image: teamArnau, name: 'Arnau', caption: 'CTO' },
          { image: teamMaja, name: 'Maja', caption: 'Team Manager & Music Specialist' },
          {
            image: teamBrett,
            name: 'Brett',
            caption: 'Customer Service Manager & Music Specialist',
          },
          {
            image: teamMauricio,
            name: 'Mauricio',
            caption: 'Special Products Owner & Business Development',
          },
          { image: teamColom, name: 'Colome', caption: 'Growth & Research Lead' },
          { image: teamQuim, name: 'Quim', caption: 'Business Development Lead' },
          { image: teamCristina, name: 'Cristina', caption: 'Business Development & PR Assistant' },
          { image: teamAnandi, name: 'Anandi', caption: 'Music Specialist & Customer Service' },
          {
            image: teamMiguelNavarro,
            name: 'Mike',
            caption: 'Music Specialist & Customer Service',
          },
          {
            image: teamStephano02,
            name: 'Stephano',
            caption: 'Music Specialist & Customer Service',
          },
          { image: teamOsvaldo, name: 'Osvaldo', caption: 'Music Specialist & Customer Service' },
          { image: teamFacu, name: 'Facu', caption: 'Music Specialist & Customer Service' },
          { image: teamSanti, name: 'Santi', caption: 'Music Specialist & Customer Service' },
          {
            image: teamOna,
            name: 'Ona',
            caption: 'Lead Music Editor Assistant & Customer Support',
          },
          { image: teamMarina, name: 'Marina', caption: 'Content & Music Specialist' },
          { image: teamOttavio, name: 'Ottavio', caption: 'Musicologist & Researcher' },
          { image: teamCarla, name: 'Carla', caption: 'Catalog Specialist' },
          { image: teamPiero, name: 'Piero', caption: 'Music Editor & Transcriber' },
          {
            image: teamJosepf,
            name: 'Josep Forcada',
            caption: 'Project Assistant & Admin Support',
          },
          { image: teamDavid, name: 'David', caption: 'Transcriber & Assistant Music Editor' },
          {
            image: teamMarc,
            name: 'Marc',
            caption: 'Head Piano Jazz & Ensembles Transcriber & Proof-Editor',
          },
          {
            image: teamEric,
            name: 'Eric',
            caption: 'Head Piano & Vocal Transcriber & Proof-Editor',
          },
          {
            image: teamMichael,
            name: 'Michael',
            caption: 'Piano & Vocal Transcriber & Proof-Editor',
          },
          { image: teamGemma, name: 'Gemma', caption: 'Piano Arranger & Proof-Editor' },
          { image: teamPabloO, name: 'Pablo', caption: 'Piano Transcriber' },
          { image: teamJoel, name: 'Joel', caption: 'Piano Transcriber' },
          { image: teamBruno, name: 'Bruno', caption: 'Piano Transcriber' },
          { image: teamMatthew, name: 'Matthew', caption: 'Piano Transcriber' },
          { image: teamNicola, name: 'Nicola', caption: 'Piano & Keyboards Transcriber' },
          { image: teamDan, name: 'Dan', caption: 'Piano & Vocal Transcriber' },
          { image: teamAviana, name: 'Aviana', caption: 'Piano & Vocal Transcriber' },
          { image: teamMark, name: 'Mark', caption: 'Piano & Vocal Transcriber' },
          { image: teamEthan, name: 'Ethan', caption: 'Piano & Jazz Transcriber' },
          { image: teamBryn, name: 'Bryn', caption: 'Piano & Horns Transcriber' },
          { image: teamVictor, name: 'Victor', caption: 'Head Guitar Transcriber, Proof-Editor' },
          { image: teamMiguel, name: 'Miguel', caption: 'Guitar Transcriber & Proof-Editor' },
          { image: teamMauro, name: 'Mauro', caption: 'Guitar Transcriber & Arranger' },
          { image: teamJoelR, name: 'Joel', caption: 'Fingerstyle/Jazz Guitar Transcriber' },
          { image: teamPau, name: 'Pau', caption: 'Guitar Transcriber' },
          { image: teamHugo, name: 'Hugo', caption: 'Guitar Transcriber' },
          { image: teamJorge, name: 'Jorge', caption: 'Guitar Transcriber' },
          { image: teamNathan, name: 'Nathan', caption: 'Piano & Guitar Transcriber' },
          { image: teamJoan, name: 'Joan', caption: 'Violin & Strings Transcriber' },
          { image: teamDanbi, name: 'Danbi', caption: 'Orchestral Transcriber & Arranger' },
          { image: teamBernardo, name: 'Bernardo', caption: 'Orchestral Transcriber & Arranger' },
          { image: teamBenjamin, name: 'Benjamin', caption: 'Choral Transcriber' },
          {
            image: teamOriol2,
            name: 'Oriol',
            caption: 'Horns & Jazz Transcriber, Big Band Arranger',
          },
          { image: teamJoanMarti, name: 'Joan', caption: 'Horns & Jazz Transcriber' },
          { image: teamGuillem, name: 'Guillem', caption: 'Bass Transcriber' },
          { image: teamOscar, name: 'Oscar', caption: 'Drums Transcriber' },
          { image: teamManuel, name: 'Manuel', caption: 'Percussion Transcriber' },
          { image: teamCarlaDigitizer, name: 'Carla', caption: 'Transcriber & Digitizer' },
          { image: teamVirginia, name: 'Virginia', caption: 'Digitizer & Engraver' },
          { image: teamQueralt, name: 'Queralt', caption: 'Finance & Executive Assistant' },
          { image: teamJosepJaume, name: 'Josep Jaume', caption: 'Tech Advisor' },
          { image: teamEmma, name: 'Emma', caption: 'Full-Stack Software Engineer' },
        ]}
      />

      <Section title="How do we operate?" tone="cream">
        <Text>
          Some of us take care of responding your emails and incoming calls. Some others transcribe
          the music for you. Some others coordinate the whole process.
        </Text>
        <Text>
          There is always an expert transcriber ready to work on your sheet music requests. We make
          sure that only a proficient jazz pianist works on your jazz piano transcriptions. We make
          sure that only a proficient fingerstyle guitar player works on your guitar tabs. And that
          applies to every instrument. We don’t use music transcription software – that doesn’t work
          at all. We transcribe every note by ear: one after the other. We believe that this is the
          only way to achieve an accurate, professional result.
        </Text>
        <Text>
          We strive to provide the best quality sheet music transcriptions and customer service; we
          hope that you love what we are building as much as we do.
        </Text>
      </Section>

      <CardGrid
        title="Stay tuned to the latest news on sheet music notation!"
        columns={3}
        cta={{ label: 'See the full Blog', href: '/music-blog' }}
        items={[
          {
            image: postJazz,
            title: 'Which Jazz Sheet Music Should I Choose?',
            body: 'Choose the Jazz Sheet Music Transcription that Best Adapts to the Needs of Your Project',
            href: '/jazz-sheet-music-choose',
          },
          {
            image: postGuitar,
            title: 'Guitar Sheet Music | Choose the Best Option for You',
            body: 'At My Sheet Music Transcriptions, We Have the Best Guitar Sheet Music Option for You',
            href: '/guitar-sheet-music-choose-the-best-option',
          },
          {
            image: postGuitarPro,
            title: 'Our Pros & Cons of Guitar Pro',
            body: 'Pros and Cons of Guitar Pro | 5 Features We Love and 5 Features We Are Still Missing',
            href: '/features-guitar-pro',
          },
        ]}
      />

      <CardGrid
        title="Our socials"
        columns={3}
        variant="tile"
        items={[
          { title: 'Blog', body: 'Posts every week!', href: '/music-blog' },
          { title: 'Reviews', body: 'Read our customer reviews', href: '/customer-reviews' },
          {
            title: 'Instagram',
            body: 'See our world',
            href: 'https://www.instagram.com/mysheetmusictranscriptions/',
          },
          {
            title: 'Facebook',
            body: 'See what we’re up to',
            href: 'https://www.facebook.com/mysheetmusictranscriptions/',
          },
          {
            title: 'Youtube',
            body: 'See our piano tutorials channel',
            href: 'https://www.youtube.com/mysheetmusictranscriptions',
          },
          {
            title: 'Discord',
            body: 'Join our online sheet music community!',
            href: 'https://discord.gg/9tPYzbybFb',
          },
        ]}
      />
    </>
  )
}
