import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type IconName } from './Icon'

const names: IconName[] = [
  'arrow-right',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'menu',
  'close',
  'user',
  'user-plus',
  'check',
  'send',
  'mail',
  'phone',
  'globe',
  'google',
  'facebook',
  'linkedin',
  'youtube',
  'twitter',
  'instagram',
  'discord',
  'trustpilot',
  'play',
  'pause',
  'book',
  'briefcase',
  'music',
  'users',
  'question',
  'star',
  'plus',
  'minus',
  'external',
  'dollar',
  'pen',
  'chat',
  'gift',
]

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Icon>
export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = { args: { name: 'google', size: 32, title: 'Google' } }
export const All: Story = {
  args: { name: 'star' },
  render: () => (
    <ul className="grid grid-cols-4 gap-4 text-ink sm:grid-cols-8">
      {names.map((n) => (
        <li key={n} className="flex flex-col items-center gap-2 text-[11px]">
          <Icon name={n} size={24} />
          {n}
        </li>
      ))}
    </ul>
  ),
}
