import { quoteForm } from '@content/en/data/forms'
import { ContactSection, MediaText, PageHeader, Section } from '~/components/blocks'
import { List, ListItem, Text, TextLink } from '~/components/typography'
import finaleExport from './finale-export-musicxml.webp?w=480;960&as=picture'
import finaleToSibelius from './finale-to-sibelius.webp?w=640;1280&as=picture'
import sibeliusImport from './sibelius-import-musicxml.webp?w=444&as=picture'
import sibeliusOpen from './sibelius-open-menu.webp?w=480;807&as=picture'

export default function FinaleToSibeliusPage() {
  return (
    <>
      <PageHeader
        variant="split"
        title="Convert from Finale to Sibelius"
        lead="Transition seamlessly. **Future-proof your sheet music from obsolescence.**"
        image={finaleToSibelius}
        alt="Finale on one laptop and the same score in Sibelius on another"
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

      <Section
        width="narrow"
        title="Sibelius Ultimate Crossgrade"
        lead="Get the latest version of Sibelius Ultimate."
        cta={{ label: 'Crossgrade here', href: 'https://avid.8v4lqg.net/nLDv5R' }}
      >
        <Text>
          <strong>Eligibility:</strong> If cross-grading from another product like Finale, you must
          enter the product’s serial number to confirm eligibility for special cross-grade pricing.
          You cannot download or use the software until eligibility is verified.
        </Text>
        <Text>
          <strong>What’s included?</strong>
        </Text>
        <List>
          <ListItem>Sibelius Ultimate software (download required)</ListItem>
          <ListItem>36 GB Sibelius Sounds library</ListItem>
          <ListItem>AudioScore Lite (audio transcription software)</ListItem>
          <ListItem>
            PhotoScore and NotateMe Lite (music scanning and handwriting recognition software)
          </ListItem>
          <ListItem>Support for MusicXML and file import</ListItem>
          <ListItem>Familiar note entry and keypad workflow</ListItem>
        </List>
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
        title="Import MusicXML to Sibelius"
        lead="To ensure you can access your Finale catalog in Sibelius, you can just import your MusicXML file format. You can do so by following these steps:"
        image={sibeliusOpen}
        alt="Sibelius's File menu open at Open…"
      >
        <Text>
          <strong>3.</strong> Open Import Menu: <strong>Go to File</strong> {'>'}{' '}
          <strong>Open…</strong>
        </Text>
      </MediaText>

      <MediaText image={sibeliusImport} alt="Sibelius's Open MusicXML File window">
        <Text>
          <strong>4.</strong> <strong>Select Files:</strong> Choose the MusicXML files you want to
          import and set up the layout, formatting, and instrument settings.
        </Text>
        <Text>
          Alternatively, right-click on the XML file and <strong>Open with</strong> {'>'}{' '}
          <strong>Sibelius.</strong>
        </Text>
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
        title="But... what if this doesn't work?"
        lead="Protect and future-proof your musical legacy from obsolescence."
        returnTo="/finale-to-sibelius"
      />
    </>
  )
}
