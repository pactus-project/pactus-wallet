import { sendIcon } from '@/assets';
import Image from 'next/image';
import React, { useState, useRef } from 'react';
import { useI18n } from '@/utils/i18n';
import Button from '@/components/Button';
import Modal from '@/components/modal';
import SendForm, { SendFormValues } from './SendForm';
import SendPreviewModal from './SendPreviewModal';
import { useSendTransaction } from '@/wallet/hooks/use-send-transaction';

const SendPac: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { t } = useI18n();
  const { error, broadcastTransaction } = useSendTransaction();
  const [formValues, setFormValues] = useState<SendFormValues>({});
  const [signedTxHex, setSignedTxHex] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (values: SendFormValues, signedRawTxHex: string) => {
    // Store form values and signed transaction hex
    setFormValues(values);
    setSignedTxHex(signedRawTxHex);

    // Close the form modal and open the preview modal
    setIsModalOpen(false);
    setIsPreviewModalOpen(true);
  };

  const handleConfirmTransaction = async () => {
    setIsSending(true);
    setCountdown(10);

    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Broadcast the transaction immediately
    try {
      const txHash = await broadcastTransaction(signedTxHex);
      console.log('Transaction broadcast successful, hash:', txHash);

      // Stop the countdown on success
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }

      setSuccessMessage(t('transactionSent'));

      // Close the preview modal after successful broadcast
      setTimeout(() => {
        setIsPreviewModalOpen(false);
        setIsSending(false);
        // Reopen the main modal to show success message
        setIsModalOpen(true);
      }, 1000);
    } catch (error) {
      console.error('Error broadcasting transaction:', error);

      // Let the countdown continue in case of error
      // When countdown finishes, it will close the modal
    }
  };

  const handleClosePreviewModal = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setIsPreviewModalOpen(false);
    setIsSending(false);
    setCountdown(0);
  };

  return (
    <>
      <Button
        variant="primary"
        size="small"
        onClick={handleOpenModal}
        aria-label={t('send')}
        startIcon={<Image src={sendIcon} alt="" width={20} height={20} aria-hidden="true" />}
        className="w-[119px] h-[38px]"
        fullWidth
      >
        {t('send')}
      </Button>

      {/* Send Form Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={t('send')}>
        {successMessage && (
          <div className="bg-success bg-opacity-10 text-success p-3 mb-4 rounded">
            {successMessage}
          </div>
        )}

        {error && <div className="bg-error bg-opacity-10 text-error p-3 mb-4 rounded">{error}</div>}

        <SendForm
          initialValues={formValues}
          onPreviewTransaction={handleFormSubmit}
          submitButtonText={t('next')}
        />
      </Modal>

      {/* Preview Modal */}
      <SendPreviewModal
        isOpen={isPreviewModalOpen}
        fromAccount={formValues.fromAccount || ''}
        receiver={formValues.receiver || ''}
        amount={formValues.amount || ''}
        fee={formValues.fee || ''}
        memo={formValues.memo || ''}
        signature={signedTxHex}
        onConfirm={handleConfirmTransaction}
        onClose={handleClosePreviewModal}
        title={t('previewTransaction') || 'Preview Transaction'}
        isSending={isSending}
        countdown={countdown}
      />
    </>
  );
};

export default SendPac;
