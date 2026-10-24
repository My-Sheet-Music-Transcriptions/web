import type { Preview } from '@storybook/react-vite'
import { MotionProvider } from '../src/components/primitives/Motion'
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
        footer: { name: 'Footer', value: '#222222' },
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
      // Blocks are filed by category, in page order (src/components/blocks/catalogue.ts CATEGORIES).
      storySort: {
        order: [
          'Foundations',
          'Typography',
          'Primitives',
          'Blocks',
          ['Headers', 'Text & media', 'Lists & grids', 'Reviews & ratings', 'Calls to action'],
          'Layout',
        ],
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
