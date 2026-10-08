import type { Preview } from '@storybook/react-vite'
import { MotionProvider } from '../src/components/motion/MotionProvider'
import { RouterDecorator } from './router-decorator'
import '../src/styles/app.css'

const preview: Preview = {
  decorators: [
    RouterDecorator,
    (Story) => (
      <MotionProvider>
        <Story />
      </MotionProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      options: {
        white: { name: 'White', value: '#ffffff' },
        peach: { name: 'Peach', value: '#fdebdc' },
        surface: { name: 'Surface', value: '#f4f7f8' },
        footer: { name: 'Footer', value: '#0b1f2c' },
      },
    },
    a11y: {
      // Every story is checked with axe; any violation (colour contrast included) fails `pnpm test:storybook`.
      test: 'error',
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
      },
    },
    options: {
      storySort: { order: ['Foundations', 'Primitives', 'Blocks', 'Layout', 'Templates'] },
    },
  },
  tags: ['autodocs'],
}

export default preview
