import type { Meta, StoryObj } from '@storybook/react-vite'
import { account, languages, logo, menuLabels, nav, requestCta } from '~/stories/data'
import { withSamples } from '~/stories/samples'
import { Header, type HeaderProps } from './Header'
import { LangSwitcher } from './LangSwitcher'

const meta = {
  title: 'Layout/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: withSamples<HeaderProps>({
    logo,
    nav,
    cta: requestCta,
    labels: menuLabels,
    account,
  }),
  render: (args) => (
    <Header {...args} languages={<LangSwitcher {...languages} className="text-[13px]" />} />
  ),
} satisfies Meta<typeof Header>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
