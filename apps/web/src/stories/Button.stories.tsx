import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';
import React from 'react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outlined', 'text'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    size: 'medium',
    children: 'Outlined Button',
  },
};

export const Text: Story = {
  args: {
    variant: 'text',
    size: 'medium',
    children: 'Text Button',
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Loading Button',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Disabled Button',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const WithStartIcon: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'With Start Icon',
    startIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'With End Icon',
    endIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export const GradientPrimary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Gradient Button',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The primary button uses a gradient background defined in the Tailwind config as `bg-gradient-primary`.',
      },
    },
  },
};

export const ButtonGroup: Story = {
  render: () => (
    <div className="flex space-x-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const ButtonOnDarkBackground: Story = {
  render: () => (
    <div className="p-8 rounded-lg bg-background">
      <div className="flex flex-col space-y-4">
        <div className="flex space-x-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="primary" disabled>
            Primary
          </Button>
          <Button variant="secondary" disabled>
            Secondary
          </Button>
          <Button variant="outlined" disabled>
            Outlined
          </Button>
          <Button variant="text" disabled>
            Text
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'How buttons look against the app dark background.',
      },
    },
  },
};
