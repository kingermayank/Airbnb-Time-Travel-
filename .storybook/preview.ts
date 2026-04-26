import type { Preview } from '@storybook/react';
import React from 'react';
import { Agentation } from 'agentation';

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
  decorators: [
    (Story) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Story, null),
        import.meta.env.MODE === 'development'
          ? React.createElement(Agentation, { endpoint: 'http://localhost:4747' })
          : null,
      ),
  ],
};

export default preview;
