import React, { useState } from 'react';
import Modal from '@/components/modal';
import SendForm, { SendFormValues } from './SendForm';
import { useI18n } from '@/utils/i18n';
import { useSendTransaction } from '@/wallet/hooks/use-send-transaction';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: SendFormValues;
}

const SendModal: React.FC<SendModalProps> = ({ isOpen, onClose, initialValues = {} }) => {
  const { t } = useI18n();
  const { sendTransaction, isLoading, error, txHash } = useSendTransaction();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (values: SendFormValues) => {
    if (
      !values.fromAccount ||
      !values.receiver ||
      !values.amount ||
      !values.fee ||
      !values.password
    ) {
      return;
    }

    setSuccessMessage(null);

    try {
      await sendTransaction({
        fromAddress: values.fromAccount,
        toAddress: values.receiver,
        amount: values.amount,
        fee: values.fee,
        memo: values.memo,
        password: values.password,
      });

      setSuccessMessage(t('transactionSent'));

      // Close modal after successful transaction
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      // Error is already handled by the hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('send')}>
      {successMessage && (
        <div className="bg-success bg-opacity-10 text-success p-3 mb-4 rounded">
          {successMessage}
        </div>
      )}

      {error && <div className="bg-error bg-opacity-10 text-error p-3 mb-4 rounded">{error}</div>}

      <SendForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitButtonText={isLoading ? t('loading') : t('next')}
      />

      {txHash && (
        <div className="mt-4 text-sm">
          <div className="font-medium">{t('transactionHash')}:</div>
          <div className="text-text-secondary break-all">{txHash}</div>
        </div>
      )}
    </Modal>
  );
};

export default SendModal;
