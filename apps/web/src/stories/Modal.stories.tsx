// Modal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import Modal, { ModalProps } from '@/components/modal';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Design System/Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

// A helper component to manage open/close inside Storybook
const ModalStoryWrapper = (args: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {args.children || 'This is a sample modal content.'}
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: args => <ModalStoryWrapper {...args} />,
  args: {
    title: 'Default Modal',
    showCloseButton: true,
  },
};

export const WithoutCloseButton: Story = {
  render: args => <ModalStoryWrapper {...args} />,
  args: {
    title: 'No Close Button Modal',
    showCloseButton: false,
  },
};
