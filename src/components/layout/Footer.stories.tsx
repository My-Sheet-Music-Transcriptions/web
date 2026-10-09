import type { Meta, StoryObj } from '@storybook/react-vite'
import { contact, footer, footerHeadings, footerLanguages, social } from '~/stories/data'
import { withSamples } from '~/stories/samples'
import { Footer, type FooterProps } from './Footer'

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  args: withSamples<FooterProps>({
    headings: footerHeadings,
    data: footer,
    languages: footerLanguages,
    ...contact,
    social,
  }),
} satisfies Meta<typeof Footer>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
