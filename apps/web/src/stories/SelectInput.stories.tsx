import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SelectInput from '../components/common/SelectInput';

const meta: Meta<typeof SelectInput> = {
  title: 'Design System/Components/SelectInput',
  component: SelectInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    onBlur: { action: 'blurred' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
  },
  decorators: [story => <div className="w-96 p-4 bg-background">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof SelectInput>;

// Basic select options
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
];

// Basic example
export const Default: Story = {
  args: {
    id: 'country-select',
    name: 'country',
    value: '',
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
  },
};

// With selected value
export const WithSelectedValue: Story = {
  args: {
    id: 'country-select',
    name: 'country',
    value: 'uk',
    label: 'Country',
    options: countryOptions,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    id: 'country-select',
    name: 'country',
    value: 'us',
    label: 'Country',
    options: countryOptions,
    disabled: true,
  },
};

// With ReactNode labels
export const WithReactNodeLabels: Story = {
  args: {
    id: 'account-select',
    name: 'account',
    value: '',
    label: 'Account',
    options: [
      {
        value: 'account1',
        label: (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">
              1
            </span>
            <span>Main Account</span>
          </span>
        ),
      },
      {
        value: 'account2',
        label: (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-white">
              2
            </span>
            <span>Savings Account</span>
          </span>
        ),
      },
      {
        value: 'account3',
        label: (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 bg-error rounded-full flex items-center justify-center text-white">
              3
            </span>
            <span>Investment Account</span>
          </span>
        ),
      },
    ],
    placeholder: 'Select an account',
  },
};

// Interactive component with state
const InteractiveSelectInput = () => {
  const [value, setValue] = useState('');
  return (
    <SelectInput
      id="interactive-select"
      name="interactive-select"
      value={value}
      onChange={e => setValue(e.target.value)}
      options={countryOptions}
      label="Interactive Select"
      placeholder="Select a country"
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveSelectInput />,
};
