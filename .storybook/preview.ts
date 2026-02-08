import type { Preview } from '@storybook/react';

// Loads Figtree font, Tailwind CSS v4, and design tokens (--ds-* custom properties)
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'surface', value: '#fbfbfb' },
        { name: 'dark', value: '#222222' },
      ],
    },
  },
};

export default preview;
