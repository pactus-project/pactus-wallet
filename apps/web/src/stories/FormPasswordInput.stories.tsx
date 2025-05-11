import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FormPasswordInput from '../components/common/FormPasswordInput';
import { Form, useForm } from '@/components/common/Form';

const meta: Meta<typeof FormPasswordInput> = {
  title: 'Design System/Form/FormPasswordInput',
  component: FormPasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    touched: { control: 'boolean' },
    error: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    onKeyDown: { action: 'key down' },
  },
  decorators: [story => <div className="w-96 p-4 bg-background">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof FormPasswordInput>;

// Basic example without error
export const Default: Story = {
  args: {
    id: 'password',
    value: '',
    label: 'Password',
    placeholder: 'Enter your password',
    touched: false,
    error: '',
  },
};

// With validation error
export const WithError: Story = {
  args: {
    id: 'password-error',
    value: '123',
    label: 'Password',
    placeholder: 'Enter your password',
    touched: true,
    error: 'Password must be at least 8 characters',
  },
};

// Different sizes
export const Small: Story = {
  args: {
    id: 'password-sm',
    value: 'Password123',
    label: 'Small Password Field',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    id: 'password-md',
    value: 'Password123',
    label: 'Medium Password Field',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    id: 'password-lg',
    value: 'Password123',
    label: 'Large Password Field',
    size: 'lg',
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    id: 'password-disabled',
    value: 'Password123',
    label: 'Disabled Password Field',
    disabled: true,
  },
};

// Interactive component with validation
const InteractiveFormPasswordInput = () => {
  const [ form ] = useForm();
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    if (password.length === 0) {
      return '';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setError(validatePassword(newValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setTouched(true);
    }
  };

  return (
    <Form form={form}>
        <FormPasswordInput
          id="interactive-password"
          value={value}
          onChange={handleChange}
          label="Interactive Password with Validation"
          placeholder="Enter a strong password"
          touched={touched}
          error={error}
          onKeyDown={handleKeyDown}
        />
    </Form>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveFormPasswordInput />,
};
