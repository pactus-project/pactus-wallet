import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import TextInput from '../components/common/TextInput';
import TextButton from '../components/common/TextButton';

const meta: Meta<typeof TextInput> = {
  title: 'Design System/Form/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    onBlur: { action: 'blurred' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  decorators: [story => <div className="w-96 p-4 bg-background">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof TextInput>;

// Basic example
export const Default: Story = {
  args: {
    id: 'default-input',
    name: 'default-input',
    value: '',
    label: 'Default Input',
    placeholder: 'Enter some text',
  },
};

// With pre-filled value
export const WithValue: Story = {
  args: {
    id: 'filled-input',
    name: 'filled-input',
    value: 'This is a pre-filled value',
    label: 'Pre-filled Input',
  },
};

// With right element
export const WithRightElement: Story = {
  args: {
    id: 'right-element-input',
    name: 'right-element-input',
    value: '',
    label: 'Amount (℗)',
    placeholder: '0.00',
    rightElement: <TextButton onClick={() => console.log('Max clicked')}>Max</TextButton>,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    id: 'disabled-input',
    name: 'disabled-input',
    value: 'Disabled input',
    label: 'Disabled Input',
    disabled: true,
  },
};

// Different input types
export const Email: Story = {
  args: {
    id: 'email-input',
    name: 'email-input',
    value: '',
    label: 'Email Address',
    placeholder: 'your.email@example.com',
    type: 'email',
    autoComplete: 'email',
  },
};

// Interactive component with state
const InteractiveTextInput = () => {
  const [value, setValue] = useState('');
  return (
    <TextInput
      id="interactive-input"
      name="interactive-input"
      value={value}
      onChange={e => setValue(e.target.value)}
      label="Interactive Input"
      placeholder="Type something here..."
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveTextInput />,
};
