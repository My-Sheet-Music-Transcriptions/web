import { quoteForm } from '@content/en/data/forms'
import { ContactSection, MediaText, PageHeader, Section } from '~/components/blocks'
import { Text, TextLink } from '~/components/typography'
import finaleExport from './finale-export-musicxml.webp?w=480;960&as=picture'
import finaleToMusescore from './finale-to-musescore.webp?w=640;1280&as=picture'
import musescoreImport from './musescore-import-musicxml.webp?w=482&as=picture'

export default function FinaleToMusescorePage() {
  return (
    <>
      <PageHeader
        variant="split"
        title="Convert from Finale to MuseScore"
        lead="Transition seamlessly. **Future-proof your sheet music from obsolescence.**"
        image={finaleToMusescore}
        alt="Finale on one laptop and the same score in MuseScore on another"
        cta={{ label: 'Learn how to do it', href: '#down' }}
      />

      <Section width="narrow">
        <Text>
          <strong>Finale</strong>, sheet music notation software, is{' '}
          <strong>no longer being developed</strong>, but users can still access previously
          purchased versions.
        </Text>
        <Text>
          <strong>
            If you would like more information, you can read our{' '}
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
        title="Import MusicXML to MuseScore"
        lead="To ensure you can access your Finale catalog in MuseScore, you can just import your MusicXML file format. You can do so by following these steps:"
        image={musescoreImport}
        alt="MuseScore's import window for a MusicXML file"
      >
        <Text>
          <strong>3.</strong> Open Import Menu: Go to File {'>'} Open… {'>'}{' '}
          <strong>Select Files:</strong> Choose the MusicXML files you want to import and set up the
          layout, formatting, and instrument settings.
        </Text>
        <Text>Alternatively, right-click on the XML file and Open with {'>'} MuseScore.</Text>
      </MediaText>

      <Section width="narrow">
        <Text>
          Like any file, MusicXML files are prone to corruption over time. Plus, importing XML files
          into sheet music software can turn your <strong>beautiful score</strong> into a{' '}
          <strong>hot mess</strong> – think <strong>jumbled notes</strong>,{' '}
          <strong>missing dynamics</strong>, and a <strong>layout</strong> that’s{' '}
          <strong>all over the place</strong>.
        </Text>
        <Text>
          But don’t worry, we’ve got the magic touch to{' '}
          <strong>clean up those imports, fix the layout chaos</strong>, and{' '}
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
        title="But what if this doesn't work?"
        lead="Protect and future-proof your musical legacy from obsolescence."
        returnTo="/finale-to-musescore"
      />
    </>
  )
}
