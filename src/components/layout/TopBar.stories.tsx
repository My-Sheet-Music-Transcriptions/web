import type { Meta, StoryObj } from '@storybook/react-vite'
import { account, languages } from '~/stories/data'
import { LangSwitcher } from './LangSwitcher'
import { TopBar } from './TopBar'

const meta = {
  title: 'Layout/TopBar',
  component: TopBar,
  parameters: { layout: 'fullscreen' },
  args: { ...account, children: <LangSwitcher {...languages} className="ml-6 w-[166px]" /> },
} satisfies Meta<typeof TopBar>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
