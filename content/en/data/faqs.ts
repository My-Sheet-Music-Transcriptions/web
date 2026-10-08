import type { FaqGroup } from '~/content/types'

/**
 * FAQ groups shared by several pages (the service pages, landing pages and the FAQ page). Answers are light
 * markdown: paragraphs, **bold**, [links](/path) and "- " lists. A page's own questions stay in the page.
 */
export const generalFaq: FaqGroup = {
  title: 'Music services',
  id: 'music-services',
  items: [
    {
      question: 'Which songs can be transcribed?',
      answer:
        '**We can transcribe all songs and music genres!** Send us your songs and we’ll transcribe them – whether it’s piano covers, guitar TABs, jazz solos, vocals, orchestral themes, or original compositions. We’ve got you covered!',
    },
    {
      question: 'Which music styles do you transcribe?',
      answer:
        '**All music styles, all genres**: pop, jazz, Broadway, rock, classical, R&B, blues, reggae, country, hip-hop, EDM, folk, African music, Indian music… you name it!',
    },
    {
      question: 'Which instruments do you transcribe?',
      answer:
        '**All instruments!** We’ve got an expert for every instrument on our team, guaranteeing your specific request is in the hands of the right specialist. We also have **professional arrangers, copyists, and a quality control team that will make sure everything is spot on.**',
    },
    {
      question: 'If I only want a portion of the song, do I have to pay the full price?',
      answer:
        '**No.** If you only want a portion of the song, let us know what **timestamps** you want and we will **adjust the price quote for you** – we won’t charge the cost of transcribing the full song.',
    },
    {
      question: "I don't know how to read sheet music very well. Can you help me?",
      answer:
        '**Yes, we’re here to help!** Here are some of the things we can do:\n\n- Create a **[Synthesia](/synthesia-piano-tutorials)** (piano only) or [**Soundslice**](/soundslice-tutorials) (any instrument) **tutorial** for you.\n- **Simplify the piece** to suit your level.\n- **Add fingering suggestions** in the most complex passages of the score to help you learn the piece.\n- **Add educational large noteheads with note names.**',
    },
    {
      question: 'Overall, how does it work?',
      answer:
        '**1. You request a quote –** Send us the music you want us to transcribe (an audio file or a Youtube link!) and give us all relevant information: instruments, timestamps, difficulty, and arrangement details.\n\n**2. We assess and adapt –** We are all music transcribers: we will listen to your music and get back to you with a price quote that suits your needs. An in-house specialist is always ready to take care of your project.\n\n**3. You place the order –** When all details and the price quote have been agreed on, you will place your order securely to get us started.\n\n**4. We transcribe –** Our professional transcribers will craft your transcription as agreed. We will ensure the process is smooth and keep you updated if we have news or questions.\n\n**5. You enjoy the music – 100% satisfaction –** We will send you the completed transcription in all the formats you need to print or use it.\n\nWe will make sure everything looks good to you. Adjusting any small details that might have been missed is our job too.',
    },
    {
      question: 'How do I get a price quote?',
      answer:
        'Go to our **[contact us](/contact)** page where you can **fill out our contact form** or find our **email** and **phone numbers**. Send us the music you want us to transcribe (an audio file or YouTube link!) and let us know all the relevant information: instruments, arrangement details, preferred deadline, etc. **We will get back to you with a price quote within the next 1-4 hours!**',
    },
    {
      question: 'How long does it take?',
      answer:
        'Our standard delivery time is **1-2 days** and we also have a **rush order service!**\n\nLarger or highly complex projects may take a little longer. Let us know your preferences – **we will strive to meet your deadlines.**',
    },
    {
      question: 'I need a transcription done urgently. Can you help me?',
      answer:
        '**Yes,** we have a **rush order service** for **urgent requests**. Get in touch with your requirements and we’ll take it from there.',
    },
    {
      question:
        'I am a songwriter and I want you to transcribe my music. Who will own the sheet music?',
      answer:
        'If we transcribe your original music, **we will not withhold any rights on the transcriptions.** The scores provided will belong to you – you can distribute, share, and sell them as you wish.',
    },
    {
      question: 'How do you transcribe music? Do you use AI or similar technology?',
      answer:
        'We transcribe and arrange music **by ear, manually** typing it into our music notation software note-by-note. This is a detailed and thorough process. **We do not use any AI/automatic music transcription software because it delivers poor results** and at My Sheet Music Transcriptions, we strive to provide a **world-class transcription service.**\n\nAll of our transcribers are **professional musicians who take pride in their craft.**',
    },
    {
      question: 'Who are you?',
      answer:
        'We are a team of **40+ professional musicians, transcribers, arrangers, and composers.** Our headquarters are in **Barcelona**, where we started our journey, but we now work with musicians from **all around the world** – mainly across the US, Canada, Australia, and Europe – with a strong presence in **New York and London!** Our mission is to spread music globally through customized transcriptions and arrangements.\n\nWe have been growing since 2011, and have completed **more than 32,000 transcriptions so far.** We believe a **friendly customer service and a talented group of music transcribers** is the best way to provide you with the sheet music you have always wanted.',
    },
    {
      question: 'Who do you usually work for?',
      answer:
        'We have an **extensive and diverse clientele**: from **original composers and songwriters** who want their music transcribed to **music lovers** who want to play their favorite songs but cannot find the sheet music online, and **gigging musicians** who don’t have the time to create their sheet music themselves.\n\nOur work ranges from **big projects** with orchestras, bands, musicals, and schools to **individual projects,** with both **professional and amateur musicians.**\n\nWhat we all have in common is that **music is our passion** 🙂',
    },
  ],
}
