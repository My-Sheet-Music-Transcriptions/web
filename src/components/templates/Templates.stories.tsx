import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section } from '~/components/blocks'
import { Text } from '~/components/typography'
import type { Entry } from '~/content'
import { LandingTemplate } from './LandingTemplate'
import { PageTemplate } from './PageTemplate'
import { ServiceTemplate } from './ServiceTemplate'

/** What wraps a page's blocks, chosen by meta.ts (`template`, or the collection's type). */
const entry = (meta: Record<string, unknown>) =>
  ({ locale: 'en', collection: 'pages', slug: 'x', path: '/x', meta }) as unknown as Entry

const body = (
  <Section title="The page's own blocks">
    <Text>Everything after the header comes from the page component (index.tsx).</Text>
  </Section>
)

const meta = {
  title: 'Templates/Templates',
  component: PageTemplate,
  parameters: { layout: 'fullscreen' },
  args: {
    entry: entry({ type: 'page', title: 'Gift card', hero: { title: 'Gift a transcription!' } }),
    children: body,
  },
} satisfies Meta<typeof PageTemplate>
export default meta
type Story = StoryObj<typeof meta>

/** `page`: the PageHeader band from meta.ts `hero` (or the title). */
export const Page: Story = {}

/** `service` (services collection): the band with the service icon and the Google rating card. */
export const Service: Story = {
  render: (args) => <ServiceTemplate {...args} />,
  args: {
    entry: entry({
      type: 'service',
      title: 'Piano Transcription Service',
      icon: 'piano',
      hero: {
        subtitle: 'Get your piano songs transcribed accurately into sheet music by professionals',
      },
    }),
  },
}

/** `landing`: nothing from meta; the page opens with its own split PageHeader. */
export const Landing: Story = {
  render: (args) => <LandingTemplate {...args} />,
}
