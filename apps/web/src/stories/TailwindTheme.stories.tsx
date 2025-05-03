import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import '../assets/styles/globals.css';

const meta: Meta = {
  title: 'Design System/Theme Tokens',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Helper components
const ColorBox = ({ color }: { color: string }) => (
  <div className="flex">
    <div className={`rounded-md mb-sm p-sm bg-${color}`}>
      <div className="text-xs">{color}</div>
    </div>
  </div>
);

const SpacingBox = ({ spacing }: { spacing: string }) => (
  <div className="flex flex-col items-center mb-4">
    <div className="bg-primary-light rounded" style={{ width: spacing, height: spacing }} />
    <div className="text-xs mt-2">{spacing}</div>
  </div>
);

const TypographySample = ({ fontSize }: { fontSize: string }) => (
  <div className={`text-${fontSize} mb-2`}>{fontSize} text size</div>
);

const ShadowBox = ({ shadow }: { shadow: string }) => (
  <div
    className={`w-40 h-20 mb-4 rounded-md bg-surface-light shadow-${shadow} flex items-center justify-center text-xs`}
  >
    {shadow}
  </div>
);

//
// Stories
//

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {[
        'primary',
        'primary-dark',
        'primary-light',
        'background',
        'surface',
        'surface-light',
        'surface-medium',
        'text-primary',
        'text-secondary',
        'text-tertiary',
        'text-disabled',
        'error',
        'error-light',
        'success',
        'success-light',
        'warning',
        'info',
        'border',
        'border-light',
        'divider',
      ].map(color => (
        <ColorBox key={color} color={color} />
      ))}
    </div>
  ),
};

export const Spacings: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map(spacing => (
        <SpacingBox key={spacing} spacing={spacing} />
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map(size => (
        <TypographySample key={size} fontSize={size} />
      ))}
    </div>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {['sm', 'md', 'lg', 'button', 'inset'].map(shadow => (
        <ShadowBox key={shadow} shadow={shadow} />
      ))}
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {['sm', 'md', 'lg', 'xl', 'pill', 'circle'].map(radius => (
        <div
          key={radius}
          className={`bg-primary w-20 h-20 rounded-${radius} flex items-center justify-center text-xs`}
        >
          {radius}
        </div>
      ))}
    </div>
  ),
};
