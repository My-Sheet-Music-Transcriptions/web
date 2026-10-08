import type { Meta, StoryObj } from '@storybook/react-vite'
import { lightMarkdown } from '~/lib/light-markdown'
import { Divider, Heading, List, ListItem, Quote, Text, TextLink } from './index'

/** The prose inside pages and blocks: what a page writes between a block's tags. */
const meta = {
  title: 'Typography/Prose',
  component: Text,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div className="flex max-w-[720px] flex-col gap-4">{Story()}</div>],
} satisfies Meta<typeof Text>
export default meta
type Story = StoryObj<typeof meta>

export const Paragraphs: Story = {
  render: () => (
    <>
      <Text>
        We transcribe <strong>each note by hand and by ear</strong>, one by one. It is a slow
        process but it gives <em>great results</em>.
      </Text>
      <Text>
        Find more pricing information <TextLink href="/pricing">here</TextLink>.
      </Text>
    </>
  ),
}

export const HeadingsListsQuote: Story = {
  render: () => (
    <>
      <Heading>In-house Graphic Design</Heading>
      <Text>Exceptional customization of your sheet music book by our in-house design team.</Text>
      <Heading level={3}>What we can do</Heading>
      <List>
        <ListItem>Simplify the piece to suit your level.</ListItem>
        <ListItem>Add fingering suggestions in the most complex passages.</ListItem>
      </List>
      <List ordered>
        <ListItem>You request a quote</ListItem>
        <ListItem>We transcribe</ListItem>
      </List>
      <Divider />
      <Quote>Such a great service, they did a fantastic job!</Quote>
    </>
  ),
}

/** The same prose kept as data (FAQ answers, card bodies) and in mockups: light markdown. */
export const LightMarkdown: Story = {
  render: () => (
    <>
      {lightMarkdown(
        '**Yes, we’re here to help!** Here are some of the things we can do:\n\n- Create a [Soundslice](/soundslice-tutorials) tutorial for you.\n- **Simplify the piece** to suit your level.\n\nSee our [pricing](/pricing).',
      )}
    </>
  ),
}
