import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactElement, useEffect, useState } from 'react'
import { render } from 'react-email'
import logo from '~/stories/images/logo-en.svg'
import { NoticeEmail } from './NoticeEmail'
import { type EmailOrderSummary, OrderEmail } from './OrderEmail'

/**
 * The emails as mail clients get them: each one rendered to HTML by React Email, as the server does, and shown in
 * a frame of an inbox's width.
 */
function EmailFrame({ email, title }: { email: ReactElement; title: string }) {
  const [html, setHtml] = useState('')
  useEffect(() => {
    render(email).then(setHtml)
  }, [email])
  return (
    <iframe
      title={title}
      srcDoc={html}
      style={{
        width: '100%',
        maxWidth: 680,
        height: 1400,
        border: 0,
        display: 'block',
        margin: '0 auto',
      }}
    />
  )
}

const emailLogo = {
  src: typeof location === 'undefined' ? logo : new URL(logo, location.href).href,
  alt: 'My Sheet Music Transcriptions',
  width: 183,
  href: 'https://www.mysheetmusictranscriptions.com',
}

const summary: EmailOrderSummary = {
  title: 'Order MSMT-1042',
  lines: [
    { label: '1 × My Music Book: piano', value: '€24.90' },
    { label: '2 × Staff paper notebook', value: '€15.80' },
  ],
  totals: [
    { label: 'Subtotal', value: '€40.70' },
    { label: 'Shipping (Europe)', value: '€9.00' },
    { label: 'Total', value: '€49.70' },
  ],
  addressTitle: 'Shipping address',
  address: ['Anna Puig', 'Carrer de Mallorca 123, 2n 1a', '08036 Barcelona', 'Spain'],
}

const order = {
  href: 'https://www.mysheetmusictranscriptions.com/?order=MSMT-1042.k3y',
  intro: 'Your order, its tracking and the invoice, always here',
  label: 'See your order',
}
const signature =
  'Any question? Just reply to this email.\n\nThe My Sheet Music Transcriptions team\nhttps://www.mysheetmusictranscriptions.com'

const meta = {
  title: 'Emails/Emails',
  component: EmailFrame,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof EmailFrame>
export default meta
type Story = StoryObj<typeof meta>

/** What a customer gets once they have paid. */
export const OrderPaid: Story = {
  args: {
    title: 'Order paid',
    email: (
      <OrderEmail
        lang="en"
        logo={emailLogo}
        title="We have your order MSMT-1042"
        paragraphs={[
          'Hi Anna,',
          'Thank you for your purchase! We have order MSMT-1042 and will prepare it soon. We will write when it leaves for your home.',
          'Stripe sends the receipt and the invoice in a separate email; you will also find them at the link below.',
        ]}
        order={order}
        summary={summary}
        signature={signature}
      />
    ),
  },
}

/** Shipped: the tracking button and a note from us. */
export const OrderShipped: Story = {
  args: {
    title: 'Order shipped',
    email: (
      <OrderEmail
        lang="en"
        logo={emailLogo}
        title="Order MSMT-1042 is on its way"
        paragraphs={[
          'Hi Anna,',
          'Your order MSMT-1042 has left. It usually arrives in 2-4 working days.',
        ]}
        note="A note from us: we added a few bookmarks as a gift."
        tracking={{ href: 'https://www.correos.es/', label: 'Follow the parcel' }}
        order={order}
        summary={summary}
        signature={signature}
      />
    ),
  },
}

/** Ours, for each paid order. */
export const TeamOrder: Story = {
  args: {
    title: 'New order',
    email: (
      <NoticeEmail
        lang="en"
        logo={emailLogo}
        title="New order MSMT-1042: €49.70 from Anna Puig"
        intro="Anna Puig <anna@example.com>, +34 600 000 000 paid order MSMT-1042 on the ca site."
        summary={{ ...summary, addressTitle: 'Ship to' }}
        actions={[
          {
            href: 'https://www.mysheetmusictranscriptions.com/admin/orders/',
            label: 'Open the orders panel',
          },
          { href: 'https://dashboard.stripe.com/payments/pi_123', label: 'Payment in Stripe' },
        ]}
      />
    ),
  },
}

/** Ours, for each request from a form. */
export const Request: Story = {
  args: {
    title: 'Transcription request',
    email: (
      <NoticeEmail
        lang="en"
        title="New transcription request from Anna Puig"
        rows={[
          { label: 'Name', value: 'Anna Puig' },
          { label: 'Email', value: 'anna@example.com' },
          { label: 'Phone', value: '+34 600 000 000' },
          { label: 'Where to listen', value: 'https://youtu.be/example' },
          { label: 'Instruments', value: 'Piano and voice' },
          { label: 'Purpose', value: 'Recital' },
        ]}
        message="Hello! Could you transcribe this song for piano and voice? I need it for a recital in June."
        note="Attachment: song.mp3 (audio/mpeg, 2048 KB)"
      />
    ),
  },
}
