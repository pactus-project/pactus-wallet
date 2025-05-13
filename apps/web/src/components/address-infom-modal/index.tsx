'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { AddressInfo } from '@/wallet/hooks/use-account';
import { copyIcon, successIcon } from '@/assets'; // Add this import
import Image from 'next/image';
import Typography from '../common/Typography';
interface AddressInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  addressInfo?: AddressInfo; // Expect full address info object
  privateKeyHex: string;
  title: string;
  label: string;
  copyTitle: string;
  extraInfo?: string;
  extraInfoTitle?: string;
  extraInfoCopyTitle?: string;
}

const AddressInfoModal: React.FC<AddressInfoModalProps> = ({
  isOpen,
  onClose,
  privateKeyHex,
  title,
  label,
  copyTitle,
  extraInfo,
  extraInfoTitle,
  extraInfoCopyTitle,
}) => {
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);
  const [copiedHDPath, setCopiedHDPath] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrivateKey(true);
    setTimeout(() => setCopiedPrivateKey(false), 2000);
  };
  const handleCopyHDPath = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHDPath(true);
    setTimeout(() => setCopiedHDPath(false), 2000);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="info-field pl-1 pr-1">
        <Typography variant="body2" color="text-quaternary" className="pb-2 font-bold">
          {label}
        </Typography>
        <div className="flex items-center">
          <Typography variant="caption2" color="text-quaternary" className="pb-2">
            {privateKeyHex}
          </Typography>
          <button
            className="wallet_info-copy-button"
            onClick={() => handleCopy(privateKeyHex)}
            aria-label={copyTitle}
            title={copyTitle}
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
      {extraInfo && (
        <div className="info-field pl-1 pr-1">
          <Typography variant="body2" color="text-quaternary" className="pb-2 font-bold">
            {extraInfoTitle}
          </Typography>
          <div className="flex items-center">
            <Typography variant="caption2" color="text-quaternary" className="pb-2">
              {extraInfo}
            </Typography>
            <button
              className="wallet_info-copy-button"
              onClick={() => handleCopyHDPath(extraInfo)}
              aria-label={extraInfoCopyTitle}
              title={extraInfoCopyTitle}
            >
              <Image
                src={copiedHDPath ? successIcon : copyIcon}
                alt={copiedHDPath ? 'Copied successfully' : 'Copy to clipboard'}
                width={25}
                height={25}
              />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddressInfoModal;
