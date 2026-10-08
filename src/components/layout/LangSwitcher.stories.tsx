import type { Meta, StoryObj } from '@storybook/react-vite'
import { LangSwitcher } from './LangSwitcher'

const meta = {
  title: 'Layout/LangSwitcher',
  component: LangSwitcher,
  // Padded, not centered: a centered button sits under the test browser's resting pointer and opens on hover.
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LangSwitcher>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Open, as a visitor sees it: each language by its own name with its site's address. The play step opens
 * it and waits for the animation, so the accessibility check sees the settled list, not a half-faded one.
 */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: /language/i })
    if (button.getAttribute('aria-expanded') !== 'true') await userEvent.click(button)
    await new Promise((r) => setTimeout(r, 500))
  },
}
export const WithTranslations: Story = {
  args: {
    alternates: {
      es: 'https://www.mistranscripcionesmusicales.com/precios',
      fr: 'https://mapartitionsurmesure.com/tarifs',
    },
  },
}
