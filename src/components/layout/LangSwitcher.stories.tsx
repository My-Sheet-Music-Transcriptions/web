import type { Meta, StoryObj } from '@storybook/react-vite'
import { LangSwitcher } from './LangSwitcher'

const meta = {
  title: 'Layout/LangSwitcher',
  component: LangSwitcher,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LangSwitcher>
export default meta
type Story = StoryObj<typeof meta>

/** Links to the sister domains' homepages unless the page has translations. */
export const Default: Story = {}
export const WithTranslations: Story = {
  args: {
    alternates: {
      es: 'https://www.mistranscripcionesmusicales.com/precios',
      fr: 'https://mapartitionsurmesure.com/tarifs',
    },
  },
}
