import type { Meta, StoryObj } from '@storybook/react';
import PasswordInput from '../components/common/Form/PasswordInput';
import { useState } from 'react';

const meta: Meta<typeof PasswordInput> = {
  title: 'Design System/Components/PasswordInput',
  component: PasswordInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'changed' },
  },
  decorators: [story => <div className="w-80">{story()}</div>],
};

export default meta;
type Story = StoryObj<typeof PasswordInput>;

const ControlledPasswordInput = (args: React.ComponentProps<typeof PasswordInput>) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <PasswordInput
      {...args}
      value={value}
      onChange={e => {
        setValue(e.target.value);
        args.onChange?.(e);
      }}
    />
  );
};

export const Default: Story = {
  render: args => <ControlledPasswordInput {...args} />,
  args: {
    placeholder: 'Enter your password',
  },
};

export const WithValue: Story = {
  render: args => <ControlledPasswordInput {...args} />,
  args: {
    placeholder: 'Enter your password',
    value: 'password123',
  },
};

export const WithError: Story = {
  render: args => <ControlledPasswordInput {...args} />,
  args: {
    placeholder: 'Enter your password',
    error: 'Password is incorrect',
  },
};

export const Disabled: Story = {
  render: args => <ControlledPasswordInput {...args} />,
  args: {
    placeholder: 'Enter your password',
    disabled: true,
    value: 'password123',
  },
};

export const Required: Story = {
  render: args => <ControlledPasswordInput {...args} />,
  args: {
    placeholder: 'Enter your password',
  },
};
