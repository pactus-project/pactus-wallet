import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from '../components/Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Base story
export const Default: Story = {
  args: {
    label: 'Remember me',
  },
};

// Controlled checkbox example
const ControlledExample = () => {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      label="Controlled checkbox"
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
    />
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
};

// Different sizes
export const Small: Story = {
  args: {
    label: 'Small checkbox',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium checkbox',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    label: 'Large checkbox',
    size: 'large',
  },
};

// With description
export const WithDescription: Story = {
  args: {
    label: 'Terms and Conditions',
    description: 'I agree to the terms of service and privacy policy',
  },
};

// With error
export const WithError: Story = {
  args: {
    label: 'Accept terms',
    error: 'You must accept terms to continue',
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    label: 'Disabled checkbox',
    disabled: true,
  },
};

// Checked and disabled
export const CheckedDisabled: Story = {
  args: {
    label: 'Checked and disabled',
    checked: true,
    disabled: true,
  },
};

// Indeterminate
export const Indeterminate: Story = {
  args: {
    label: 'Indeterminate checkbox',
    indeterminate: true,
  },
};

// With styled description (ReactNode)
export const WithStyledDescription: Story = {
  args: {
    label: 'I agree to the',
    description: (
      <span className="text-blue-500 font-medium ml-1 cursor-pointer">Terms and Conditions</span>
    ),
  },
};

// With gradient text (Matches MasterPassword)
export const MasterPasswordStyle: Story = {
  args: {
    label: 'I cannot recover my password',
    description: (
      <span className="bg-gradient-primary bg-clip-text text-transparent font-medium ml-1 cursor-pointer">
        Learn More
      </span>
    ),
    size: 'small',
  },
};

// Group of checkboxes example
const CheckboxGroupExample = () => {
  const [selections, setSelections] = useState({
    option1: false,
    option2: true,
    option3: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelections({
      ...selections,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div className="space-y-2">
      <Checkbox
        name="option1"
        label="Option 1"
        checked={selections.option1}
        onChange={handleChange}
      />
      <Checkbox
        name="option2"
        label="Option 2"
        checked={selections.option2}
        onChange={handleChange}
      />
      <Checkbox
        name="option3"
        label="Option 3"
        checked={selections.option3}
        onChange={handleChange}
      />
    </div>
  );
};

export const CheckboxGroup: Story = {
  render: () => <CheckboxGroupExample />,
};

// With long text to demonstrate wrapping
export const LongText: Story = {
  args: {
    label:
      'I agree to the very long terms and conditions that might wrap to multiple lines on smaller screens',
    size: 'small',
  },
  parameters: {
    docs: {
      description: {
        story:
          'This example shows how the checkbox handles long text that wraps to multiple lines.',
      },
    },
  },
};

// With long text and description
export const LongTextWithDescription: Story = {
  args: {
    label: 'I agree to receive marketing communications which may be tailored to my preferences',
    description: (
      <span className="bg-gradient-primary bg-clip-text text-transparent font-medium ml-1 cursor-pointer">
        Manage preferences
      </span>
    ),
    size: 'small',
  },
};

// Checked state with primary color
export const CheckedState: Story = {
  args: {
    label: 'Checked checkbox with primary color',
    checked: true,
    size: 'medium',
  },
};

// Different states side by side
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex space-x-8">
        <Checkbox label="Unchecked" checked={false} />
        <Checkbox label="Checked" checked={true} />
        <Checkbox label="Indeterminate" indeterminate={true} />
      </div>
      <div className="flex space-x-8">
        <Checkbox label="Disabled" disabled={true} />
        <Checkbox label="Disabled & Checked" disabled={true} checked={true} />
        <Checkbox label="With Error" error="This field is required" />
      </div>
    </div>
  ),
};
