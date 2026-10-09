import type { Meta, StoryObj } from '@storybook/react-vite'
import { languages } from '~/stories/data'
import { LangSwitcher } from './LangSwitcher'

const meta = {
  title: 'Layout/LangSwitcher',
  component: LangSwitcher,
  parameters: { layout: 'centered' },
  args: languages,
} satisfies Meta<typeof LangSwitcher>
export default meta
type Story = StoryObj<typeof meta>

/** The app passes one link per sister site; the current language is highlighted. */
export const Default: Story = {}
export const OnDark: Story = {
  args: { tone: 'light' },
  parameters: { backgrounds: { default: 'footer' } },
}
