'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { AddressInfo } from '@/wallet/hooks/use-account';
import { copyIcon, successIcon } from '@/assets'; // Add this import
import Image from 'next/image';
import { useI18n } from '../../utils/i18n';
import Typography from '../common/Typography';
interface AddressInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressInfo: AddressInfo; // Expect full address info object
  privateKeyHex: string;
}

const AddressInfoModal: React.FC<AddressInfoModalProps> = ({
  isOpen,
  onClose,
  addressInfo,
  privateKeyHex,
}) => {
  const { t } = useI18n();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'address') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else if (type === 'publicKey') {
      setCopiedPublicKey(true);
      setTimeout(() => setCopiedPublicKey(false), 2000);
    } else if (type === 'privateKey') {
      setCopiedPrivateKey(true);
      setTimeout(() => setCopiedPrivateKey(false), 2000);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('showPrivateKey')}>
      <div className="info-field pl-1 pr-1">
        <Typography variant="body2" color="text-quaternary" className="pb-2 font-bold">
          {t('address')}
        </Typography>
        <div className="flex items-center">
          <Typography variant="caption2" color="text-quaternary" className="pb-2">
            {addressInfo.address}
          </Typography>
          <button
            className="wallet_info-copy-button"
            onClick={() => handleCopy(addressInfo.address, 'address')}
            aria-label="Copy address to clipboard"
            title="Copy address to clipboard"
          >
            <Image
              src={copiedAddress ? successIcon : copyIcon}
              alt={copiedAddress ? 'Copied successfully' : 'Copy to clipboard'}
              width={25}
              height={25}
            />
          </button>
        </div>
      </div>

      <div className="info-field pl-1 pr-1">
        <Typography variant="body2" color="text-quaternary" className="pb-2 font-bold">
          {t('publicKey')}
        </Typography>
        <div className="flex items-center">
          <Typography variant="caption2" color="text-quaternary" className="pb-2">
            {addressInfo.publicKey}
          </Typography>
          <button
            className="wallet_info-copy-button"
            onClick={() => handleCopy(addressInfo.publicKey, 'publicKey')}
            aria-label="Copy public key to clipboard"
            title="Copy public key to clipboard"
          >
            <Image
              src={copiedPublicKey ? successIcon : copyIcon}
              alt={copiedPublicKey ? 'Copied successfully' : 'Copy to clipboard'}
              width={25}
              height={25}
            />
          </button>
        </div>
      </div>

      <div className="info-field pl-1 pr-1">
        <Typography variant="body2" color="text-quaternary" className="pb-2 font-bold">
          {t('privateKey')}
        </Typography>
        <div className="flex items-center">
          <Typography variant="caption2" color="text-quaternary" className="pb-2">
            {privateKeyHex}
          </Typography>
          <button
            className="wallet_info-copy-button"
            onClick={() => handleCopy(privateKeyHex, 'privateKey')}
            aria-label="Copy private key to clipboard"
            title="Copy private key to clipboard"
          >
            <Image
              src={copiedPrivateKey ? successIcon : copyIcon}
              alt={copiedPrivateKey ? 'Copied successfully' : 'Copy to clipboard'}
              width={25}
              height={25}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddressInfoModal;
