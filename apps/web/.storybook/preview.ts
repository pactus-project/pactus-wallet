import type { Preview } from '@storybook/react';
import '../src/app/globals.css'; // Import Tailwind CSS

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#15191c',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
