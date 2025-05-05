import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormAddressDropdown from '../components/common/FormAddressDropdown';

const meta: Meta<typeof FormAddressDropdown> = {
  title: 'Design System/Form/FormAddressDropdown',
  component: FormAddressDropdown,
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
    touched: { control: 'boolean' },
    error: { control: 'text' },
    showAddressFormat: {
      control: 'radio',
      options: ['full', 'truncated'],
    },
  },
  decorators: [story => <div className="w-96 p-4 bg-[#121212]">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof FormAddressDropdown>;

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

// Basic example without error
export const Default: Story = {
  args: {
    value: '',
    options: sampleAddresses,
    label: 'Wallet Address',
    touched: false,
    error: '',
  },
};

// With validation error
export const WithError: Story = {
  args: {
    value: '',
    options: sampleAddresses,
    label: 'Wallet Address',
    touched: true,
    error: 'Please select a wallet address',
  },
};

// With selected value and error
export const WithSelectedValueAndError: Story = {
  args: {
    value: 'pc1rgj7dkjgv87jw28a21dkygkmvyknpahgzwsk02w',
    options: sampleAddresses,
    label: 'Wallet Address',
    touched: true,
    error: 'This wallet has insufficient funds',
  },
};

// Interactive component with validation
const InteractiveFormAddressDropdown = () => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const validateSelection = (selectedValue: string) => {
    if (!selectedValue) {
      return 'Please select a wallet address';
    }

    // Example validation: certain addresses are restricted
    const restrictedAddresses = ['pc1rgj7dkjgv87jw28a21dkygkmvyknpahgzwsk02w'];
    if (restrictedAddresses.includes(selectedValue)) {
      return 'This account is currently restricted';
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setError(validateSelection(newValue));
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <FormAddressDropdown
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      options={sampleAddresses}
      label="Interactive Address Dropdown with Validation"
      placeholder="Select a wallet address"
      touched={touched}
      error={error}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveFormAddressDropdown />,
};
