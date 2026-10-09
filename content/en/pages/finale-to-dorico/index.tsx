import { quoteForm } from '@content/en/data/forms'
import { CardGrid, ContactSection, MediaText, PageHeader, Section } from '~/components/blocks'
import { Text, TextLink } from '~/components/typography'
import doricoImport from './dorico-import-musicxml.webp?w=480;960&as=picture'
import finaleExport from './finale-export-musicxml.webp?w=480;960&as=picture'
import finaleToDorico from './finale-to-dorico.webp?w=640;1280&as=picture'
import musicxmlFile from './musicxml-file.webp?w=150;300&as=picture'
import musicxmlPreferences from './musicxml-preferences.webp?w=150;300&as=picture'

/**
 * The template of the three "Convert from Finale to …" guides (/finale-to-musescore, /finale-to-sibelius): the
 * header, why Finale stops, the export steps, the import steps into the other program, then the help we offer.
 */
export default function FinaleToDoricoPage() {
  return (
    <>
      <PageHeader
        variant="split"
        title="Convert from Finale to Dorico"
        lead="Transition seamlessly. **Future-proof your sheet music from obsolescence.**"
        image={finaleToDorico}
        alt="Finale on one laptop and the same score in Dorico on another"
        cta={{ label: 'Learn how to do it', href: '#down' }}
      />

      <Section width="narrow">
        <Text>
          <strong>Finale</strong>, sheet music notation software, is{' '}
          <strong>no longer being developed</strong>, but users can still access previously
          purchased versions. MakeMusic has partnered with Steinberg to offer Dorico as an
          alternative. Finale v27 will be available to Dorico Pro cross-grade customers and
          onboarding resources to support the transition.
        </Text>
        <Text>
          <strong>
            For further information, you can read our{' '}
            <TextLink href="/makemusic-stop-developing-finale">blog post</TextLink>.
          </strong>
        </Text>
      </Section>

      <MediaText
        id="down"
        align="center"
        title="Export MusicXML from Finale"
        lead="To ensure you can access your work in other music notation applications, export your Finale project files (.musx or .mus) into the MusicXML file format (.mxl, .musicxml, or .xml). To export a Finale project file as a MusicXML file, follow these steps:"
        image={finaleExport}
        alt="Finale's File menu open at Export, MusicXML"
      >
        <Text>
          <strong>1.</strong> Go to <strong>File</strong> {'>'} <strong>Export</strong> {'>'}{' '}
          <strong>MusicXML</strong>.
        </Text>
        <Text>A Finder window (on Mac) or File Explorer window (on Windows) will open.</Text>
        <Text>
          <strong>2.</strong> Choose a name and select a destination for your MusicXML file, then
          click <strong>Save.</strong>
        </Text>
      </MediaText>

      <MediaText
        align="center"
        title="Import MusicXML to Dorico"
        lead="To ensure you can access your Finale catalog in Dorico, you can just import your MusicXML file format. You can do so by following these steps:"
        image={doricoImport}
        alt="Dorico's File menu open at Import, MusicXML"
      >
        <Text>
          <strong>3.</strong> Open Import Menu: <strong>Go to File</strong> {'>'}{' '}
          <strong>Import</strong> {'>'} <strong>MusicXML.</strong>
        </Text>
        <Text>
          <strong>4.</strong> <strong>Select Files:</strong> Choose the MusicXML files you want to
          import from the File Explorer or Finder.
        </Text>
        <Text>Alternatively, right-click on the XML file and Open with {'>'} Dorico.</Text>
      </MediaText>

      <CardGrid
        title="Important TIPS"
        columns={2}
        items={[
          {
            icon: musicxmlFile,
            body: 'You can also open MusicXML files **directly** if you want them to be separate projects rather than new flows in existing projects.',
          },
          {
            icon: musicxmlPreferences,
            body: 'You can change your default preferences for the handling of imported MusicXML files on the **MusicXML Import** page in **Preferences**.',
          },
        ]}
      />

      <Section width="narrow">
        <Text>
          Like any file, MusicXML files are prone to corruption over time. Plus, importing XML files
          into sheet music software can turn your <strong>beautiful score</strong> into a{' '}
          <strong>hot mess</strong> – think <strong>jumbled notes</strong>,{' '}
          <strong>missing dynamics</strong>, and a <strong>layout</strong> that’s{' '}
          <strong>all over the place</strong>.
        </Text>
        <Text>
          But don’t worry, we’ve got the magic touch to <strong>clean up those imports</strong>,{' '}
          <strong>fix the layout chaos</strong>, and{' '}
          <strong>ensure every detail of your music shines through</strong>. By now refining and
          securing your files, you’re taking a crucial step toward{' '}
          <strong>safeguarding your music</strong> catalog against future changes and technology
          shifts.
        </Text>
        <Text>
          Let’s ensure your music <strong>stands the test of time and obsolescence.</strong>
        </Text>
      </Section>

      <ContactSection
        form={quoteForm}
        title="What if this doesn't work?"
        lead="Protect and future-proof your musical legacy from obsolescence."
        returnTo="/finale-to-dorico"
      />
    </>
  )
}
