'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { AddressInfo } from '@/wallet/hooks/use-account';
import { copyIcon } from '@/assets'; // Add this import
import Image from 'next/image';
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
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Show Private Key">
      <div className="address-info-display">
        <div className="info-field">
          <label>Address</label>
          <div className="info-value">
            {addressInfo.address}
            <button
              className="wallet_info-copy-button"
              onClick={() => handleCopy(addressInfo.address)}
              aria-label="Copy address to clipboard"
              title="Copy address to clipboard"
            >
              <Image
                src={copyIcon}
                alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                width={25}
                height={25}
              />
            </button>
          </div>
        </div>

        <div className="info-field">
          <label>Public Key</label>
          <div className="info-value">
            {addressInfo.publicKey}
            <button
              className="wallet_info-copy-button"
              onClick={() => handleCopy(addressInfo.publicKey)}
              aria-label="Copy public key to clipboard"
              title="Copy public key to clipboard"
            >
              <Image
                src={copyIcon}
                alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                width={25}
                height={25}
              />
            </button>
          </div>
        </div>

        <div className="info-field">
          <label>Private Key</label>
          <div className="info-value">
            {privateKeyHex}
            <button
              className="wallet_info-copy-button"
              onClick={() => handleCopy(privateKeyHex)}
              aria-label="Copy private key to clipboard"
              title="Copy private key to clipboard"
            >
              <Image
                src={copyIcon}
                alt={copied ? 'Copied successfully' : 'Copy to clipboard'}
                width={25}
                height={25}
              />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddressInfoModal;
