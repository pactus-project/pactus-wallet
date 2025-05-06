import React from 'react';
import Modal from '@/components/modal';
import SendForm, { SendFormValues } from './SendForm';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: SendFormValues;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, initialValues = {} }) => {
  const handleSubmit = (values: SendFormValues) => {
    console.log('Sending transaction', values);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send">
      <SendForm initialValues={initialValues} onSubmit={handleSubmit} submitButtonText="Next" />
    </Modal>
  );
};

export default SendModal;
