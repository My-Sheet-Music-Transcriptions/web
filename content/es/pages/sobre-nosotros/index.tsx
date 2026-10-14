import { quoteForm } from '@content/es/data/forms'
import { mediaLabels } from '@content/es/data/labels'
import videoPoster from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import {
  CardGrid,
  ContactSection,
  MediaText,
  PageHeader,
  PictureGrid,
  Section,
} from '~/components/blocks'
import { Text } from '~/components/typography'
import band from './band.jpg?w=600;1200&as=picture'
import office12 from './office-12.jpg?w=560;1000&as=picture'
import office14 from './office-14.jpg?w=560;1000&as=picture'
import officeTranscriber from './office-transcriber.jpg?w=560;1000&as=picture'
import stripPiano3 from './strip-piano-3.jpg?w=250;500&as=picture'
import stripPiano4 from './strip-piano-4.jpg?w=250;500&as=picture'
import stripPiano5 from './strip-piano-5.jpg?w=250;500&as=picture'
import stripPiano8 from './strip-piano-8.jpg?w=250;500&as=picture'
import stripPiano10 from './strip-piano-10.jpg?w=250;500&as=picture'
import stripPiano11 from './strip-piano-11.jpg?w=250;500&as=picture'
import stripPiano12 from './strip-piano-12.jpg?w=250;500&as=picture'
import stripPiano13 from './strip-piano-13.jpg?w=250;500&as=picture'
import stripPiano14 from './strip-piano-14.jpg?w=250;500&as=picture'
import stripPiano15 from './strip-piano-15.jpg?w=250;500&as=picture'
import teamAnandi from './team-anandi.jpg?w=180;360&as=picture'
import teamArnau from './team-arnau.png?w=180;360&as=picture'
import teamBenjamin from './team-benjamin.jpg?w=180;360&as=picture'
import teamBrett from './team-brett.jpg?w=180;360&as=picture'
import teamBruno from './team-bruno.jpg?w=180;360&as=picture'
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
import teamJosepJaume from './team-josep-jaume.jpg?w=180;360&as=picture'
import teamJosepf from './team-josepf.jpg?w=180;360&as=picture'
import teamMaja from './team-maja.jpg?w=180;360&as=picture'
import teamMarc from './team-marc.jpg?w=180;360&as=picture'
import teamMarina from './team-marina.jpg?w=180;360&as=picture'
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

export default function SobreNosotrosPage() {
  return (
    <>
      <PageHeader
        title="Sobre Mis Transcripciones Musicales"
        subtitle="¡Conoce a los músicos detrás de tus transcripciones!"
      />

      <MediaText image={band} alt="El equipo de Mis Transcripciones Musicales" imageSide="left">
        <Text>
          Somos un equipo de <strong>más de 100 músicos</strong> profesionales con un conocimiento
          musical excepcional y una amplia competencia tecnológica. Un grupo entusiasta, preparado
          para abordar todo lo relacionado con la notación musical y ayudarte a dar vida a tu
          música.
        </Text>
        <Text>
          Oriol, el fundador y CEO de Mis Transcripciones Musicales, comenzó el proyecto de forma
          individual. El crecimiento constante no ha comprometido nunca la calidad en favor de la
          rapidez, y ha favorecido el aprendizaje continuo a lo largo del camino. En la actualidad,
          atendemos en inglés, castellano, catalán, fracés, alemán y japonés.
        </Text>
        <Text>
          Con nuestra sede central en Cataluña (Terrassa, Barcelona, España), los miembros de
          nuestro equipo están repartidos por todo el mundo. Contamos con especialistas musicales
          altamente cualificados, preparados para ayudarte desde distintas ubicaciones{' '}
          <strong>en 4 continentes (Europa, Asia, América del Norte y América del Sur)</strong>.
        </Text>
        <Text>
          Trabajarán contigo codo con codo para perfeccionar los detalles de tu proyecto y,
          posteriormente, coordinarlo y comunicarlo a nuestro equipo de transcriptores, arreglistas
          y compositores. Antes de que la música te sea entregada, nuestros editores musicales
          habrán tomado el relevo para garantizar que cada archivo cumpla con los{' '}
          <strong>más altos estándares de calidad</strong>.
        </Text>
      </MediaText>

      <MediaText
        labels={mediaLabels}
        imageSide="right"
        tone="cream"
        images={[
          {
            image: office14,
            alt: 'Oficina de Mis Transcripciones Musicales - Atención al cliente',
          },
          {
            image: office12,
            alt: 'Oficina de Mis Transcripciones Musicales - Atención al cliente',
          },
          {
            image: officeTranscriber,
            alt: 'Oficina de Mis Transcripciones Musicales - Transcriptor trabajando',
          },
        ]}
      >
        <Text>
          Todos ellos, junto con los equipos de{' '}
          <strong>dirección, desarrollo, investigación, tecnología y marketing</strong>, conforman
          un grupo de más de 30 profesionales que se aseguran de que podamos ofrecer nuestros
          servicios de notación musical al mayor número posible de músicos, ¡en todo el mundo!
        </Text>
        <Text>
          En la base de nuestros servicios se encuentra nuestro equipo de transcripción. Formado por
          más de 80 músicos que transcriben meticulosamente a oído, nota por nota, los cientos de
          archivos que entregamos cada semana. Gracias a un grupo de transcriptores diverso y
          altamente especializado, siempre contamos con la persona adecuada para cada proyecto.
        </Text>
        <Text>
          Con esta combinación de talento, tecnología y experiencia, estamos preparados para
          afrontar prácticamente cualquier proyecto, independientemente de su nivel o envergadura.{' '}
          <strong>
            Estamos aquí para dar respuesta a todas tus necesidades de notación musical.
          </strong>
        </Text>
      </MediaText>

      <Section
        title="Sigue nuestras noticias en LinkedIn"
        align="center"
        rule={false}
        width="narrow"
        tone="peach"
        cta={{
          label: 'Saber más',
          href: 'https://www.linkedin.com/company/my-sheet-music-transcriptions/',
        }}
      />

      <PictureGrid
        title="Nuestro equipo"
        shape="portrait"
        columns={6}
        items={[
          {
            image: teamOriol,
            name: 'Oriol',
            caption: 'Fundador y CEO',
            href: 'https://www.linkedin.com/in/oriollopezcalle/',
          },
          {
            image: teamRoc,
            name: 'Roc',
            caption: 'Editor Musical Principal y Responsable de Operaciones',
          },
          { image: teamArnau, name: 'Arnau', caption: 'Director Técnico' },
          {
            image: teamMaja,
            name: 'Maja',
            caption: 'Especialista Musical y Responsable de Equipo',
          },
          {
            image: teamBrett,
            name: 'Brett',
            caption: 'Responsable de Atención al Cliente y Especialista Musical',
          },
          {
            image: teamMauricio,
            name: 'Mauricio',
            caption: 'Responsable de Productos Especiales y Especialista Musical',
          },
          {
            image: teamColom,
            name: 'Colome',
            caption: 'Responsable de Crecimiento e Investigación',
          },
          {
            image: teamQuim,
            name: 'Quim',
            caption: 'Responsable de Crecimiento y Desarrollo Empresarial',
          },
          {
            image: teamCristina,
            name: 'Cristina',
            caption: 'Asistente de Crecimiento y Desarrollo Empresarial y RRPP',
          },
          {
            image: teamAnandi,
            name: 'Anandi',
            caption: 'Especialista Musical y Atención al Cliente',
          },
          {
            image: teamMiguelNavarro,
            name: 'Mike',
            caption: 'Especialista Musical y Atención al Cliente',
          },
          {
            image: teamStephano02,
            name: 'Stephano',
            caption: 'Especialista Musical y Atención al Cliente',
          },
          {
            image: teamOsvaldo,
            name: 'Osvaldo',
            caption: 'Especialista Musical y Atención al Cliente',
          },
          { image: teamFacu, name: 'Facu', caption: 'Especialista Musical y Atención al Cliente' },
          {
            image: teamSanti,
            name: 'Santi',
            caption: 'Especialista Musical y Atención al Cliente',
          },
          {
            image: teamOna,
            name: 'Ona',
            caption: 'Asistente al Editor Musical Principal y Soporte al Cliente',
          },
          { image: teamMarina, name: 'Marina', caption: 'Especialista en Música y Contenido' },
          { image: teamOttavio, name: 'Ottavio', caption: 'Musicólogo e Investigador' },
          { image: teamCarla, name: 'Carla', caption: 'Especialista en Catalogación' },
          { image: teamPiero, name: 'Piero', caption: 'Transcriptor y Editor Musical' },
          {
            image: teamJosepf,
            name: 'Josep Forcada',
            caption: 'Asistente de Administración y Coordinación de Proyectos',
          },
          { image: teamDavid, name: 'David', caption: 'Asistente del Editor Musical Principal' },
          {
            image: teamMarc,
            name: 'Marc',
            caption: 'Transcriptor Principal de Piano Jazz y Blues',
          },
          {
            image: teamEric,
            name: 'Eric',
            caption: 'Transcriptor Principal de Piano y Conjuntos Instrumentales',
          },
          { image: teamMichael, name: 'Michael', caption: 'Transcriptor de Voz y Piano' },
          { image: teamGemma, name: 'Gemma', caption: 'Transcriptora de Piano y Revisora' },
          { image: teamPabloO, name: 'Pablo', caption: 'Transcriptor de Piano' },
          {
            image: teamJoel,
            name: 'Joel',
            caption: 'Transcriptor de Piano y Conjuntos Instrumentales',
          },
          { image: teamBruno, name: 'Bruno', caption: 'Transcriptor de Piano' },
          { image: teamMatthew, name: 'Matthew', caption: 'Transcriptor de Piano' },
          { image: teamNicola, name: 'Nicola', caption: 'Transcriptor de Piano y Teclados' },
          { image: teamDan, name: 'Dan', caption: 'Transcriptor de Voz y Piano' },
          { image: teamEthan, name: 'Ethan', caption: 'Transcriptor de Piano y Jazz' },
          { image: teamVictor, name: 'Victor', caption: 'Transcriptor Principal de Guitarra' },
          { image: teamMiguel, name: 'Miguel', caption: 'Transcriptor de Guitarra y Editor' },
          { image: teamMauro, name: 'Mauro', caption: 'Transcriptor y Arreglista de Guitarra' },
          { image: teamJoelR, name: 'Joel', caption: 'Transcriptor de Guitarra Jazz' },
          { image: teamPau, name: 'Pau', caption: 'Transcriptor de Guitarra' },
          { image: teamNathan, name: 'Nathan', caption: 'Transcriptor de Guitarra y Piano' },
          { image: teamHugo, name: 'Hugo', caption: 'Transcriptor de Guitarra' },
          {
            image: teamJoan,
            name: 'Joan',
            caption: 'Transcriptor de Violín e Instrumentos de Cuerda',
          },
          { image: teamDanbi, name: 'Danbi', caption: 'Transcriptora y Arreglista Orquestal' },
          { image: teamBenjamin, name: 'Benjamin', caption: 'Transcriptor y Arreglista Coral' },
          {
            image: teamOriol2,
            name: 'Oriol',
            caption: 'Transcriptor de Instrumentos de Viento y Big Band',
          },
          { image: teamJoanMarti, name: 'Joan', caption: 'Transcriptor de Jazz' },
          { image: teamGuillem, name: 'Guillem', caption: 'Transcriptor de Bajo' },
          { image: teamOscar, name: 'Òscar', caption: 'Transcriptor de Batería' },
          { image: teamCarlaDigitizer, name: 'Carla', caption: 'Transcriptora y Digitalizadora' },
          { image: teamVirginia, name: 'Virginia', caption: 'Digitalizadora y Maquetadora' },
          { image: teamQueralt, name: 'Queralt', caption: 'Asistente de Producción y Finanzas' },
          { image: teamJosepJaume, name: 'Josep Jaume', caption: 'Consultor Técnico' },
          { image: teamEmma, name: 'Emma', caption: 'Ingeniera de Software' },
        ]}
      />

      <CardGrid
        title="Conócenos un poco más"
        variant="plain"
        columns={2}
        labels={mediaLabels}
        videoPoster={videoPoster}
        items={[
          {
            body: '',
            video: { youtube: 'pdKHzdCOrvE', title: 'My Sheet Music Transcriptions - About us' },
          },
          {
            body: '',
            video: {
              youtube: 'T-RvKOhjQtI',
              title:
                'My Sheet Music Transcriptions now in Spanish!!! - Mis Transcripciones Musicales',
            },
          },
        ]}
      />

      <PictureGrid
        variant="marquee"
        shape="photo"
        label="Nuestras partituras"
        items={[
          { image: stripPiano8, alt: 'Partitura de piano sobre un piano digital' },
          { image: stripPiano10, alt: 'Partitura para voz y piano sobre un piano digital' },
          { image: stripPiano14, alt: 'Piano digital y guitarra junto a un sofá' },
          { image: stripPiano15, alt: 'Partitura de guitarra «Lonely Eyes» junto a un portátil' },
          {
            image: stripPiano11,
            alt: 'Libro de partituras de piano abierto sobre una mesa de madera',
          },
          { image: stripPiano12, alt: 'Dos libros de partituras abiertos sobre una mesa' },
          {
            image: stripPiano3,
            alt: 'Cancionero de piano abierto en un atril sobre un teclado digital',
          },
          { image: stripPiano4, alt: 'Partitura de piano apoyada en las teclas de un piano' },
          { image: stripPiano5, alt: 'Partitura de piano abierta sobre un teclado' },
          {
            image: stripPiano13,
            alt: 'Libro de piano «Kintsugi» de Laura Andrés junto a un cactus',
          },
        ]}
      />

      <ContactSection form={quoteForm} returnTo="/sobre-nosotros" />
    </>
  )
}
