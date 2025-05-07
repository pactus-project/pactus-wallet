import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from '../components/common/Typography';

const meta: Meta<typeof Typography> = {
  title: 'Design System/Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'body1', 'body2', 'caption1', 'caption2', 'caption3'],
      description: 'Typography style variant',
    },
    children: {
      control: 'text',
      description: 'Content to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    as: {
      control: 'select',
      options: ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML element to render',
    },
    color: {
      control: 'color',
      description: 'Custom text color (ignored if gradient is set)',
    },
    gradient: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'custom'],
      description: 'Gradient style to apply to the text',
    },
    customGradient: {
      control: 'text',
      description:
        'Custom gradient classes when gradient is set to "custom" (e.g., "from-red-500 to-blue-500")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: 'Heading 1 (48px)',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: 'Heading 2 (20px)',
  },
};

export const Body1: Story = {
  args: {
    variant: 'body1',
    children: 'Body 1 (16px) ',
  },
};

export const Body2: Story = {
  args: {
    variant: 'body2',
    children: 'Body 2 (15px)',
  },
};

export const Caption1: Story = {
  args: {
    variant: 'caption1',
    children: 'Caption 1 (14px)',
  },
};

export const Caption2: Story = {
  args: {
    variant: 'caption2',
    children: 'Caption 2 (12px)',
  },
};

export const Caption3: Story = {
  args: {
    variant: 'caption3',
    children: 'Caption 3 (12px) - Simple caption text',
  },
};

export const CustomStyling: Story = {
  args: {
    variant: 'h1',
    children: 'Custom styled heading',
    className: 'italic underline',
    color: '#FF5733',
  },
};

export const CustomElement: Story = {
  args: {
    variant: 'body1',
    children: 'This is a paragraph element with custom alignment and border',
    as: 'p',
    className: 'text-left border border-white p-2',
  },
};

export const GradientText: Story = {
  render: () => (
    <div className="space-y-8 p-4 bg-background-primary rounded-lg">
      <div>
        <Typography variant="h2" className="mb-4">
          Gradient Text Options
        </Typography>

        <div className="space-y-6">
          <div>
            <Typography variant="caption2" className="text-gray-400 mb-2">
              Primary Gradient (Blue to Purple)
            </Typography>
            <Typography variant="h1" gradient="primary">
              Primary Gradient
            </Typography>
            <Typography variant="body1" gradient="primary">
              This text uses the primary gradient
            </Typography>
          </div>

          <div>
            <Typography variant="caption2" className="text-gray-400 mb-2">
              Success Gradient (Green to Teal)
            </Typography>
            <Typography variant="h1" gradient="success">
              Success Gradient
            </Typography>
            <Typography variant="body1" gradient="success">
              This text uses the success gradient
            </Typography>
          </div>

          <div>
            <Typography variant="caption2" className="text-gray-400 mb-2">
              Warning Gradient (Yellow to Orange)
            </Typography>
            <Typography variant="h1" gradient="warning">
              Warning Gradient
            </Typography>
            <Typography variant="body1" gradient="warning">
              This text uses the warning gradient
            </Typography>
          </div>

          <div>
            <Typography variant="caption2" className="text-gray-400 mb-2">
              Danger Gradient (Red to Pink)
            </Typography>
            <Typography variant="h1" gradient="danger">
              Danger Gradient
            </Typography>
            <Typography variant="body1" gradient="danger">
              This text uses the danger gradient
            </Typography>
          </div>

          <div>
            <Typography variant="caption2" className="text-gray-400 mb-2">
              Custom Gradient
            </Typography>
            <Typography
              variant="h1"
              gradient="custom"
              customGradient="from-purple-400 via-pink-500 to-red-500"
            >
              Custom Gradient
            </Typography>
            <Typography
              variant="body1"
              gradient="custom"
              customGradient="from-green-300 via-blue-500 to-purple-600"
            >
              This text uses a custom gradient
            </Typography>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 p-4 bg-background-primary rounded-lg max-w-2xl">
      <Typography variant="body2" className="text-gray-400 mb-4">
        All variants with responsive sizing (mobile → desktop)
      </Typography>

      <div className="space-y-4">
        <div className="border-b border-gray-700 pb-2">
          <Typography variant="caption2" className="text-gray-400">
            32px → 48px
          </Typography>
          <Typography variant="h1">Heading 1</Typography>
        </div>

        <div className="border-b border-gray-700 pb-2">
          <Typography variant="caption2" className="text-gray-400">
            18px → 20px
          </Typography>
          <Typography variant="h2">Heading 2</Typography>
        </div>

        <div className="border-b border-gray-700 pb-2">
          <Typography variant="caption2" className="text-gray-400">
            14px → 16px
          </Typography>
          <Typography variant="body1">Body 1</Typography>
        </div>

        <div className="border-b border-gray-700 pb-2">
          <Typography variant="caption2" className="text-gray-400">
            14px → 15px
          </Typography>
          <Typography variant="body2">Body 2</Typography>
        </div>

        <div className="border-b border-gray-700 pb-2">
          <Typography variant="caption2" className="text-gray-400">
            12px → 14px
          </Typography>
          <Typography variant="caption1">Caption 1</Typography>
        </div>

        <div className="border-b border-gray-700 pb-2">
          <Typography variant="caption2" className="text-gray-400">
            11px → 12px
          </Typography>
          <Typography variant="caption2">Caption 2</Typography>
        </div>

        <div>
          <Typography variant="caption2" className="text-gray-400">
            10px → 12px
          </Typography>
          <Typography variant="caption3">Caption 3</Typography>
        </div>
      </div>
    </div>
  ),
};

export const ResponsiveTypography: Story = {
  render: () => (
    <div className="space-y-8 p-4 bg-background-primary rounded-lg">
      <div>
        <Typography variant="body2" className="text-gray-400 mb-2">
          Resize the window to see responsive behavior
        </Typography>

        <div className="border border-gray-700 rounded-lg p-4 space-y-4">
          <div>
            <Typography variant="caption2" className="text-gray-400 mb-1">
              h1 variant
            </Typography>
            <Typography variant="h1">Heading (32px mobile / 48px desktop)</Typography>
          </div>

          <div>
            <Typography variant="caption2" className="text-gray-400 mb-1">
              h2 variant
            </Typography>
            <Typography variant="h2">Subheading (18px mobile / 20px desktop)</Typography>
          </div>

          <div>
            <Typography variant="caption2" className="text-gray-400 mb-1">
              body1 variant
            </Typography>
            <Typography variant="body1">Body text (14px mobile / 16px desktop)</Typography>
          </div>

          <div>
            <Typography variant="caption2" className="text-gray-400 mb-1">
              caption1 variant
            </Typography>
            <Typography variant="caption1">Caption (12px mobile / 14px desktop)</Typography>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2 border border-gray-700 rounded-lg p-4">
          <Typography variant="h2" className="mb-2">
            Mobile View
          </Typography>
          <div className="bg-gray-800 p-4 rounded">
            <Typography variant="body2" className="text-gray-400 mb-2">
              This simulates mobile viewport
            </Typography>
            <Typography variant="h1">32px Heading</Typography>
            <Typography variant="h2">18px Subheading</Typography>
            <Typography variant="body1">14px Body text</Typography>
            <Typography variant="caption1">12px Caption</Typography>
          </div>
        </div>

        <div className="w-full md:w-1/2 border border-gray-700 rounded-lg p-4">
          <Typography variant="h2" className="mb-2">
            Desktop View
          </Typography>
          <div className="bg-gray-800 p-4 rounded">
            <Typography variant="body2" className="text-gray-400 mb-2">
              This simulates desktop viewport
            </Typography>
            <Typography variant="h1" className="!text-[48px]">
              48px Heading
            </Typography>
            <Typography variant="h2" className="!text-[20px]">
              20px Subheading
            </Typography>
            <Typography variant="body1" className="!text-[16px]">
              16px Body text
            </Typography>
            <Typography variant="caption1" className="!text-[14px]">
              14px Caption
            </Typography>
          </div>
        </div>
      </div>
    </div>
  ),
};
