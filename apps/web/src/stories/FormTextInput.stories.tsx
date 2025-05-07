import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormTextInput from '../components/common/FormTextInput';
import TextButton from '../components/common/TextButton';

const meta: Meta<typeof FormTextInput> = {
  title: 'Design System/Form/FormTextInput',
  component: FormTextInput,
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
    touched: { control: 'boolean' },
    error: { control: 'text' },
  },
  decorators: [story => <div className="w-96 p-4 bg-background">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof FormTextInput>;

// Basic example without error
export const Default: Story = {
  args: {
    id: 'default-input',
    name: 'default-input',
    value: '',
    label: 'Default Input',
    placeholder: 'Enter some text',
    touched: false,
    error: '',
  },
};

// With validation error
export const WithError: Story = {
  args: {
    id: 'error-input',
    name: 'error-input',
    value: 'abc',
    label: 'Username',
    placeholder: 'Enter username',
    touched: true,
    error: 'Username must be at least 5 characters',
  },
};

// With right element and error
export const WithRightElementAndError: Story = {
  args: {
    id: 'amount-input',
    name: 'amount-input',
    value: '5000',
    label: 'Amount (℗)',
    placeholder: '0.00',
    touched: true,
    error: 'Amount exceeds your available balance',
    rightElement: <TextButton onClick={() => console.log('Max clicked')}>Max</TextButton>,
  },
};

// Interactive component with validation
const InteractiveFormTextInput = () => {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const validateInput = (val: string) => {
    if (val.length === 0) {
      return '';
    }
    if (val.length < 5) {
      return 'Input must be at least 5 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(val)) {
      return 'Only letters, numbers, and underscores are allowed';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setError(validateInput(newValue));
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <FormTextInput
      id="interactive-input"
      name="interactive-input"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      label="Interactive Input with Validation"
      placeholder="Type at least 5 characters (letters, numbers, _)"
      touched={touched}
      error={error}
    />
  );
};

export const Interactive: Story = {
  render: () => <InteractiveFormTextInput />,
};
