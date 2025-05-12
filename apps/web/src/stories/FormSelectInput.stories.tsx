import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormSelectInput from '../components/common/FormSelectInput';
import { Form, useForm } from '@/components/common/Form';

const meta: Meta<typeof FormSelectInput> = {
  title: 'Design System/Form/FormSelectInput',
  component: FormSelectInput,
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
    touched: { control: 'boolean' },
    error: { control: 'text' },
  },
  decorators: [story => <div className="w-96 p-4 bg-background">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof FormSelectInput>;

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

// Basic example without error
export const Default: Story = {
  args: {
    id: 'country-select',
    name: 'country',
    value: '',
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    touched: false,
    error: '',
  },
};

// With validation error
export const WithError: Story = {
  args: {
    id: 'country-select',
    name: 'country',
    value: '',
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    touched: true,
    error: 'Please select a country',
  },
};

// With selected value and error
export const WithSelectedValueAndError: Story = {
  args: {
    id: 'country-select',
    name: 'country',
    value: 'jp',
    label: 'Country',
    options: countryOptions,
    touched: true,
    error: 'Sorry, we currently do not support shipping to Japan',
  },
};

// Interactive component with validation
const InteractiveFormSelectInput = () => {
  const [form] = useForm();
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const validateSelection = (selectedValue: string) => {
    if (!selectedValue) {
      return 'Please select a country';
    }

    // Example validation: EU countries need additional verification
    const euCountries = ['uk', 'fr', 'de'];
    if (euCountries.includes(selectedValue)) {
      return 'EU countries require additional verification';
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
    <Form form={form}>
        <FormSelectInput
          id="interactive-select"
          name="interactive-select"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          options={countryOptions}
          label="Interactive Select with Validation"
          placeholder="Select a country"
          touched={touched}
          error={error}
        />
    </Form>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveFormSelectInput />,
};
