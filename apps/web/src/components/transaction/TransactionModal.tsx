// src/components/transaction/TransactionModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/utils/i18n';
import Modal from '@/components/modal';
import SendForm, { SendFormValues } from '../send/SendForm';
import SendPreviewModal from '../send/SendPreviewModal';
import SuccessTransferModal from '../send/SuccessTransferModal';
import { useSendTransaction } from '@/wallet/hooks/use-send-transaction';
import { useBalance } from '@/wallet/hooks/use-balance';
import { toast } from 'sonner';

export type TransactionType = 'send' | 'bridge';

export interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  type: TransactionType;
  title?: string;
  icon?: React.ReactNode;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  address,
  type,
  title,
}) => {
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
  const [successMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState('');
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [createdDate, setCreatedDate] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  const isBridgeMode = type === 'bridge';
  const modalTitle = title || (isBridgeMode ? t('bridge') : t('send'));
  const bridgeWalletAddress = process.env.NEXT_PUBLIC_WRAPTO_WALLET_ADDRESS || '';
  const wrapToDeposit = bridgeWalletAddress.slice(0, 6) + '...' + bridgeWalletAddress.slice(-6);

  const handleCloseModal = () => {
    onClose();
    setIsSuccessModalOpen(false);
    fetchBalance(null, address);
    setFormValues({});
  };

  const handleFormSubmit = (values: SendFormValues,
    signedRawTxHex: string, account: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    setFormValues(values);
    setSignedTxHex(signedRawTxHex);
    setSelectedAccount(account);
    setIsPreviewModalOpen(true);
  };

  const handleConfirmTransaction = async () => {
    setIsSending(true);
    setCountdown(10);

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
    if (isOpen) {
      setForceReset(prev => prev + 1);
    }
  }, [isOpen]);

  return (
    <>
      {/* Main Form Modal */}
      <Modal
        isOpen={isOpen && !isPreviewModalOpen && !isSuccessModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
      >
        {successMessage && (
          <div className="bg-success bg-opacity-10 text-success p-3 mb-4 rounded">
            {successMessage}
          </div>
        )}

        <SendForm
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          initialValues={{
            ...formValues,
            fromAccount: formValues.fromAccount || address,
          }}
          onPreviewTransaction={handleFormSubmit}
          submitButtonText={isLoading ? t('loading') : t('next')}
          isOpen={isOpen}
          forceReset={forceReset}
          isBridgeMode={isBridgeMode}
        />
      </Modal>

      {/* Preview Modal */}
      <SendPreviewModal
        isOpen={isPreviewModalOpen}
        fromAccount={formValues.fromAccount || ''}
        receiver={isBridgeMode ? `${wrapToDeposit} (Wrapto Deposit)` : formValues.receiver || ''}
        amount={formValues.amount || ''}
        fee={formValues.fee || ''}
        memo={formValues.memo || ''}
        signature={signedTxHex}
        onConfirm={handleConfirmTransaction}
        onClose={handleClosePreviewModal}
        title={isBridgeMode ? t('bridgePreview') : t('previewTransaction')}
        isSending={isSending}
        countdown={countdown}
        fromAccountName={selectedAccount?.name}
        fromAccountEmoji={selectedAccount?.emoji}
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

export default TransactionModal;
