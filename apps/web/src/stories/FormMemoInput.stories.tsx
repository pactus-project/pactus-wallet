import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormMemoInput from '../components/common/FormMemoInput';
import { Form, useForm } from '@/components/common/Form';

const meta: Meta<typeof FormMemoInput> = {
  title: 'Design System/Form/FormMemoInput',
  component: FormMemoInput,
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
    error: { control: 'text' },
    touched: { control: 'boolean' },
    onBlur: { action: 'blurred' },
  },
  decorators: [story => <div className="w-[400px] p-4 bg-background">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof FormMemoInput>;

// Basic example
export const Default: Story = {
  args: {
    value: '',
    onChange: e => console.log('Value changed:', e.target.value),
    placeholder: 'Enter memo (optional)',
    touched: false,
    error: '',
  },
};

// With validation error
export const WithError: Story = {
  args: {
    value: 'Test memo',
    onChange: e => console.log('Value changed:', e.target.value),
    touched: true,
    error: 'Memo cannot contain special characters',
  },
};

// Interactive component with validation
const InteractiveFormMemoInput = () => {
  const [form] = useForm();
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const validateMemo = (memo: string) => {
    if (memo.length > 0 && memo.length < 5) {
      return 'Memo must be at least 5 characters';
    }
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(memo)) {
      return 'Memo cannot contain special characters';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setError(validateMemo(newValue));
  };

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <Form form={form}>
        <FormMemoInput
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched}
          error={error}
          placeholder="Type something (try special characters)"
        />
    </Form>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveFormMemoInput />,
};
