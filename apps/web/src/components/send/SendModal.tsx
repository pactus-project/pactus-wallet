import React from 'react';
import Modal from '@/components/modal';
import SendForm, { SendFormValues } from './SendForm';
import { useI18n } from '@/utils/i18n';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: SendFormValues;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, initialValues = {} }) => {
  const { t } = useI18n();

  const handleSubmit = (values: SendFormValues) => {
    console.log('Sending transaction', values);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('send')}>
      <SendForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonText={t('next')}
      />
    </Modal>
  );
};

export default SendModal;
