import { sendIcon } from '@/assets';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/utils/i18n';
import Button from '@/components/Button';
import Modal from '@/components/modal';
import SendForm, { SendFormValues } from './SendForm';
import SendPreviewModal from './SendPreviewModal';
import SuccessTransferModal from './SuccessTransferModal';
import { useSendTransaction } from '@/wallet/hooks/use-send-transaction';
import { useBalance } from '@/wallet/hooks/use-balance';
import { toast } from 'sonner';

const SendPac: React.FC<{ address: string }> = ({ address }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forceReset, setForceReset] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { t } = useI18n();
  const { broadcastTransaction } = useSendTransaction();
  const { fetchBalance } = useBalance();
  const [formValues, setFormValues] = useState<SendFormValues>({});
  const [signedTxHex, setSignedTxHex] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState('');
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdDate, setCreatedDate] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSuccessModalOpen(false);
    fetchBalance(null, address);
  };

  const handleFormSubmit = (values: SendFormValues, signedRawTxHex: string) => {
    setFormValues(values);
    setSignedTxHex(signedRawTxHex);
    setIsModalOpen(false);
    setIsPreviewModalOpen(true);
  };

  const handleConfirmTransaction = async () => {
    setIsSending(true);
    setCountdown(10);
    // Clear the sending countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    try {
      const broadcastedTxHash = await broadcastTransaction(signedTxHex);
      setTxHash(broadcastedTxHash);

      countdownIntervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            setCreatedDate(new Date().toLocaleString());
            setIsPreviewModalOpen(false);
            setIsSending(false);
            setIsSuccessModalOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(error.message);
      setIsSending(false);
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

  useEffect(() => {
    setForceReset(forceReset + 1);
  }, [isModalOpen]);

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

        <SendForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          initialValues={formValues}
          onPreviewTransaction={handleFormSubmit}
          submitButtonText={isLoading ? t('loading') : t('next')}
          isOpen={isModalOpen}
          forceReset={forceReset}
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
        title={t('previewTransaction')}
        isSending={isSending}
        countdown={countdown}
      />

      {/* Success Transfer Modal */}
      <SuccessTransferModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        txHash={txHash}
        amount={formValues.amount || ''}
        recipient={formValues.receiver || ''}
        date={createdDate}
      />
    </>
  );
};

export default SendPac;
