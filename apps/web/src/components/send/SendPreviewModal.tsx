import React from 'react';
import Modal from '@/components/modal';
import Button from '@/components/Button';

export interface SendPreviewModalProps {
  isOpen: boolean;
  fromAccount: string;
  receiver: string;
  amount: string;
  fee: string;
  memo?: string;
  signature?: string;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  isSending?: boolean;
  countdown?: number;
}

const SendPreviewModal: React.FC<SendPreviewModalProps> = ({
  isOpen,
  fromAccount,
  receiver,
  amount,
  fee,
  memo,
  signature,
  onConfirm,
  onClose,
  title = 'Send Preview',
  isSending = false,
  countdown = 0,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} showCloseButton={!isSending}>
      <div className="flex flex-col gap-4 p-2">
        <div>
          <span className="font-semibold">From:</span> {fromAccount}
        </div>
        <div>
          <span className="font-semibold">Receiver:</span> {receiver}
        </div>
        <div>
          <span className="font-semibold">Amount:</span> {amount}
        </div>
        <div>
          <span className="font-semibold">Network fee:</span> {fee}
        </div>
        {memo && (
          <div>
            <span className="font-semibold">Memo:</span> {memo}
          </div>
        )}
        {signature && (
          <div>
            <span className="font-semibold">Signature:</span>
            <div className="break-all text-xs bg-background-secondary p-2 rounded mt-1">
              {signature}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          {isSending ? (
            <div className="flex items-center gap-2 text-primary">
              <span>Sending{countdown > 0 ? ` in ${countdown}s...` : '...'}</span>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={onConfirm}>
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SendPreviewModal;
