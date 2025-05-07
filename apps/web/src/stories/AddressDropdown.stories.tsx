import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AddressDropdown from '../components/common/AddressDropdown';

const meta: Meta<typeof AddressDropdown> = {
  title: 'Design System/Components/AddressDropdown',
  component: AddressDropdown,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#121212' }],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    onBlur: { action: 'blurred' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    showAddressFormat: {
      control: 'radio',
      options: ['full', 'truncated'],
    },
  },
  decorators: [story => <div className="w-96 p-4 bg-[#121212]">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof AddressDropdown>;

// Sample addresses
const sampleAddresses = [
  {
    address: 'pc1zgjfq4kuvmmspdwnw9ay7juyc0sxped6vxa4f3c',
    name: 'Account 1',
  },
  {
    address: 'pc1rgj7dkjgv87jw28a21dkygkmvyknpahgzwsk02w',
    name: 'Account 2',
  },
  {
    address: 'pc1g5j7sv6yqrlk3712a5j7a8jd07zcqwmmrfpksc3',
    name: 'Account 3',
  },
  {
    address: 'pc1qrx0mphrdlk5y8ur6ag9hvm5k6l07wtpw2d8znm',
  },
];

// Basic example
export const Default: Story = {
  args: {
    value: '',
    options: sampleAddresses,
    label: 'Wallet Address',
    showAddressFormat: 'truncated',
  },
};

// With selected value
export const WithSelectedValue: Story = {
  args: {
    value: 'pc1zgjfq4kuvmmspdwnw9ay7juyc0sxped6vxa4f3c',
    options: sampleAddresses,
    label: 'Wallet Address',
    showAddressFormat: 'truncated',
  },
};

// With full address format
export const FullAddressFormat: Story = {
  args: {
    value: '',
    options: sampleAddresses,
    label: 'Wallet Address',
    showAddressFormat: 'full',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    value: 'pc1zgjfq4kuvmmspdwnw9ay7juyc0sxped6vxa4f3c',
    options: sampleAddresses,
    label: 'Wallet Address',
    disabled: true,
  },
};

// Interactive component with state
const InteractiveAddressDropdown = () => {
  const [value, setValue] = useState('');
  return (
    <AddressDropdown
      value={value}
      onChange={e => setValue(e.target.value)}
      options={sampleAddresses}
      label="Interactive Address Dropdown"
      placeholder="Select a wallet address"
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveAddressDropdown />,
};
