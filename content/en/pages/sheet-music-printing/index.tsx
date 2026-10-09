import { generalFaq } from '@content/en/data/faqs'
import { quoteForm } from '@content/en/data/forms'
import { mediaLabels } from '@content/en/data/labels'
import { counter, platforms } from '@content/en/data/ratings'
import pianoBand from '~/assets/images/bands/stats-bg.jpg?w=900;1282&as=picture'
import videoPoster from '~/assets/images/brand/video-poster.jpg?w=560;1000&as=picture'
import {
  CardGrid,
  ContactSection,
  FaqList,
  MediaText,
  PageHeader,
  PictureGrid,
  RatingBanner,
  Section,
  Steps,
} from '~/components/blocks'
import { Heading, Text } from '~/components/typography'
import book1 from './book-1.jpg?w=400;800&as=picture'
import book2 from './book-2.jpg?w=400;800&as=picture'
import book3 from './book-3.jpg?w=400;590&as=picture'
import bookPreparation from './book-preparation.jpg?w=400;800&as=picture'
import coverArt from './cover-art.jpg?w=400;800&as=picture'
import formatting from './formatting.jpg?w=400;800&as=picture'
import printing from './printing.jpg?w=400;800&as=picture'
import step0 from './step-0-optional.png?w=140;280&as=picture'
import step1 from './step-1-contact.png?w=140;280&as=picture'
import step2 from './step-2-quote.png?w=140;280&as=picture'
import step3 from './step-3-proof-editing.png?w=140;280&as=picture'
import step4 from './step-4-design.png?w=143&as=picture'
import step5 from './step-5-pdf.png?w=143&as=picture'
import step6 from './step-6-printing.png?w=140;280&as=picture'
import whyChoose from './why-choose.jpg?w=480;960&as=picture'

export default function SheetMusicPrintingPage() {
  return (
    <>
      <PageHeader
        title="Sheet Music Printing Services"
        lead="You know us for our transcriptions, discover our printing services. We offer top-notch services to get your sheet music professionally printed, **including cover art designs, book preparations, and book printing** services."
        cta={{ label: 'Request this service', href: '#contact' }}
      />

      <Section>
        <Text>
          Our <strong>Graphic Design and Proof-editing departments</strong> combine for an
          all-around music printing preparation service. Art creation, sheet music engraving, book
          format design. Everything covered to offer only the best results.
        </Text>
        <Text>
          We offer tailor-made products by listening to your instructions and examples to create a{' '}
          <strong>fully customized sheet music book.</strong> Our shipping of the printed copies is
          available to all states of the United States and to every country in the European Union.
        </Text>
      </Section>

      <Steps
        title="How does it work?"
        variant="columns"
        tone="cream"
        items={[
          {
            body: "**OPTIONAL** In case you haven't got the sheet music to be added in the book, **we can transcribe it for you!**",
            image: step0,
            imageWidth: 140,
          },
          {
            body: "You **contact us** with your personalized request and send us all the **necessary material** to craft the book (the sheet music, any images you'd like to add, further instructions and ideas...)",
            image: step1,
            imageWidth: 140,
          },
          {
            body: 'We give you a **fully customized price quote** tailored to all your needs',
            image: step2,
            imageWidth: 140,
          },
          {
            body: 'Our **Proof-editing Department** takes care of proof-editing and engraving your work, if needed',
            image: step3,
            imageWidth: 140,
          },
          {
            body: 'Simultaneously, our **Graphic Design Department** starts crafting the general book layout, as well as the front/back covers, table of contents, and such',
            image: step4,
            imageWidth: 140,
          },
          {
            body: "Once you're fully satisfied with the final look, we proceed to merge everything into a high-quality and **professional-looking PDF file**",
            image: step5,
            imageWidth: 140,
          },
          {
            body: 'If you want, we can also take care of **printing** your book with top-notch editorial standards and **shipping** it anywhere in the EU or US',
            image: step6,
            imageWidth: 140,
          },
        ]}
      />

      <PictureGrid
        shape="photo"
        columns={3}
        label="Sheet music books we prepared and printed"
        items={[
          { image: book1, alt: 'A printed sheet music book' },
          { image: book2, alt: 'A printed sheet music book, open' },
          { image: book3, alt: 'A sheet music book cover' },
        ]}
      />

      <CardGrid
        title="Services & Pricing"
        columns={2}
        tabs={[
          {
            label: '$',
            items: [
              {
                title: 'Musical Formatting',
                image: formatting,
                body: 'Set up your desired sheet music layout to create a **uniform, consistent, and professional look** throughout that follows **standard music notation guidelines**.\n\n**You choose** the page size, the fonts, and send us any further instructions you might have for us.\n\nIf unsure, we’re **here to lend a hand** and help you in this process!\n\n**Cost:** ~$110-160 USD depending on the resources and instructions provided',
              },
              {
                title: 'Cover Art Design',
                image: coverArt,
                body: '**Art creation** for the **front and back cover** of your book as per your **instructions and references**.\n\nOur **in-house design department** will take good care of this and will proactively create a **beautiful design** for you.\n\nOne **free subjective revision** of the design is included.\n\n**Cost:** ~$80-130 USD depending on the level of customization needed',
              },
              {
                title: 'Book Preparation',
                image: bookPreparation,
                body: 'Pages (sheet music and text) **merging and layout preparation** for the final edition of the book.\n\nWe include the addition of a **table of contents** and we always offer **standardized editorial formatting** as consensually agreed by major publishers, which also includes general pagination of the songs and a **general proof-editing** of the work.\n\n**Cost:** ~$170-220 USD depending on the material provided',
              },
              {
                title: 'Printing + Shipping',
                image: printing,
                body: 'We have a **printing service based in the US**, so shipping costs are cheap and the **quality is great**. It is very affordable and we provide high-quality sheet music books!\n\nThis also includes general pagination of the songs and a **general proof-editing** of the work.\n\nYou can get **more info** about our printing partners on [**this site**](https://www.engraversmarkmusic.com/print-shop.html)\n\n**Cost** -25 editions: ~22 USD each\n\n**Cost** +25 editions: ~18 USD each\n\n**Shipping costs:** ask us',
              },
            ],
          },
          {
            label: '€',
            items: [
              {
                title: 'Musical Formatting',
                image: formatting,
                body: 'Set up your desired sheet music layout to create a **uniform, consistent, and professional look** throughout that follows **standard music notation guidelines**.\n\n**You choose** the page size, the fonts, and send us any further instructions you might have for us.\n\nIf unsure, we’re **here to lend a hand** and help you in this process!\n\n**Cost:** usually ~100-150 EUR VAT inc. depending on the resources and instructions you send us',
              },
              {
                title: 'Cover Art Design',
                image: coverArt,
                body: '**Art creation** for the **front and back cover** of your book as per your **instructions and references**.\n\nOur **in-house design department** will take good care of this and will proactively create a **beautiful design** for you.\n\nOne **free subjective revision** of the design is included.\n\n**Cost:** usually ~80-130 EUR VAT inc. depending on the level of customization needed',
              },
              {
                title: 'Book Preparation',
                image: bookPreparation,
                body: 'Pages (sheet music and text) **merging and layout preparation** for the final edition of the book.\n\nWe include the addition of a **table of contents** and we always offer **standardized editorial formatting** as consensually agreed by major publishers, which also includes general pagination of the songs and a **general proof-editing** of the work.\n\n**Cost:** usually ~150-200 EUR VAT inc. depending on the material provided',
              },
              {
                title: 'Printing + Shipping',
                image: printing,
                body: 'Our printing plant is **based in Barcelona, Spain,** thus granting affordable shipping costs and unbeatable quality across **all Europe**.\n\nDo you want to provide high-quality sheet music books that everyone will love? Put it in our expert hands!\n\n**Cost – 25 editions:** ~22 EUR each\n\n**Cost + 25 editions:** ~17 EUR each\n\n**Shipping costs:** ask us',
              },
            ],
          },
        ]}
      />

      <MediaText
        title="Why choose our sheet music printing service?"
        image={whyChoose}
        alt=""
        imageSide="left"
        tone="cream"
      >
        <Heading level={3}>In-house Graphic Design</Heading>
        <Text>Exceptional customization of your sheet music book by our in-house design team.</Text>
        <Heading level={3}>Various Available Finishes</Heading>
        <Text>
          We offer a wide variety of options to give a unique finish to your sheet music book.
        </Text>
        <Heading level={3}>Quick and Convenient Delivery</Heading>
        <Text>
          We ship your sheet music book to your door in an easy, fast, and convenient way.
        </Text>
      </MediaText>

      <MediaText
        videoPoster={videoPoster}
        labels={mediaLabels}
        title="Materials and Finishes"
        video={{ youtube: '2m9LBweAHXU', title: 'Materials and finishes of our sheet music books' }}
        cta={{ label: 'See pricing guide', href: '/pricing' }}
      >
        <Text>
          We offer a wide range of materials and finishes to customize your sheet music book. Among
          the most common materials are heavy-weight paper, hardcover, and softcover.
        </Text>
        <Text>
          We can also offer foil finishes, varnishes, and laminations to give a final touch to the
          presentation of your sheet music book.
        </Text>
        <Text>
          If you have any special requests for materials or finishes, do not hesitate to contact us
          to discuss your needs so we can provide you with the best solution for your project.
        </Text>
      </MediaText>

      <RatingBanner
        image={pianoBand}
        title="The highest-rated online sheet music transcribers"
        counter={counter}
        sources={platforms}
      />

      <FaqList
        title="Frequently asked questions"
        groups={[
          {
            title: 'Sheet Music Printing related questions',
            items: [
              {
                question: "I don't have the sheet music for the book. Can you craft it for me?",
                answer:
                  '**Yes we can!** We have a team of **professional music transcribers** that will listen to your audio and craft the sheet music by ear, note-by-note. Our transcriptions are **very accurate and professional-looking** – you can learn more about this [**here.**](/music-transcription-service)',
              },
              {
                question: 'I need a specific look and design for the whole book. Can you do that?',
                answer:
                  '**Yes**, we can do that! If you have any **specific instructions** on the fonts that should be used and other design-related ideas, **feel free to share them with us** and we’ll be more than happy to apply them to the book.',
              },
              {
                question: 'Can you just take care of creating a digital book PDF file?',
                answer:
                  '**Of course!** We can craft a **digital sheet music PDF book** for you instead of crafting the physical one. The necessary steps to do so are exactly the same but the overall layout can change.',
              },
              {
                question:
                  "I'd like you to proof-edit and/or change the layout of the sheet music I have. Can you do that for me?",
                answer:
                  '**Yes we can!** In order for us to thoroughly review, proof-edit, and engrave your sheet music to editorial standards, **we would need the digital music notation files** necessary to edit the sheet music on our end (such as .sib, .musx, .mscz, .gp, .gpx, .xml, .musicxml, .mxl, .mid, midi…)',
              },
              {
                question:
                  'Do I just send you the PDF files of the sheet music I need for the book?',
                answer:
                  '**In case you are 100% satisfied** with the sheet music you provide us, **you can definitely send us the PDF files** so that we can add them to your book.\n\n**In case you’d like us to thoroughly review, proof-edit, and engrave your sheet music** to editorial standards, **we would need the digital music notation files** necessary to edit the sheet music on our end (such as .sib, .musx, .mscz, .gp, .gpx, .xml, .musicxml, .mxl, .mid, midi…).',
              },
            ],
          },
          generalFaq,
        ]}
        cta={{ label: 'Read all our FAQs', href: '/frequent-asked-questions' }}
      />

      <ContactSection form={quoteForm} returnTo="/sheet-music-printing" />
    </>
  )
}
