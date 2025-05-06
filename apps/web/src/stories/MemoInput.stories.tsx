import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import MemoInput from '../components/common/MemoInput';

const meta: Meta<typeof MemoInput> = {
  title: 'Design System/Form/MemoInput',
  component: MemoInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    onChange: { action: 'changed' },
    maxLength: { control: { type: 'number', min: 1, max: 500 } },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  decorators: [story => <div className="w-[400px] p-4 bg-background">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof MemoInput>;

// Basic example with direct props
export const Default: Story = {
  args: {
    value: '',
    onChange: e => console.log('Value changed:', e.target.value),
    placeholder: 'Enter memo (optional)',
  },
};

// Example with long text
export const WithLongText: Story = {
  args: {
    value:
      'This is a very long memo text that shows how the character count updates as you type more characters',
    onChange: e => console.log('Value changed:', e.target.value),
  },
};

// Example with custom max length
export const CustomMaxLength: Story = {
  args: {
    value: 'Short memo',
    onChange: e => console.log('Value changed:', e.target.value),
    maxLength: 100,
  },
};

// Example in disabled state
export const Disabled: Story = {
  args: {
    value: 'This memo cannot be edited',
    onChange: e => console.log('Value changed:', e.target.value),
    disabled: true,
  },
};

// Interactive component with state
const InteractiveMemoInput = () => {
  const [value, setValue] = useState('');
  return (
    <MemoInput
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="Type something here..."
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveMemoInput />,
};
