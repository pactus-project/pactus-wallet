'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { hidePasswordIcon, showPasswordIcon } from '@/assets';
import Image from 'next/image';
import { useAccount, AddressInfo } from '@/wallet';
import PrivateKeyDisplayModal from '@/components/address-infom-modal';

interface ShowPrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const ShowPrivateKeyModal: React.FC<ShowPrivateKeyModalProps> = ({ isOpen, onClose, address }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [addressInfo, setAddressInfo] = useState<(AddressInfo & { privateKeyHex: string }) | null>(
    null
  );
  const [error, setError] = useState('');
  const { getAddressInfo } = useAccount();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
  };

  const handlePasswordVerified = (result: {
    privateKeyHex: string;
    address?: string;
    publicKey?: string;
    label?: string;
    path?: string;
  }) => {
    const addressInfo = {
      ...result,
      address: result.address ?? '',
      publicKey: result.publicKey ?? '',
      path: result.path ?? '',
      label: result.label ?? '',
    } as AddressInfo & { privateKeyHex: string };
    setAddressInfo(addressInfo);
    setShowPrivateKeyModal(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const addressInfo = await getAddressInfo(password, address);
      if (!addressInfo) {
        throw new Error('Failed to get address info');
      }
      handlePasswordVerified(addressInfo);
      setPassword('');
      setShowPassword(false);
      onClose();
    } catch (err) {
      console.error('Error verifying password:', err);
      setError('Incorrect password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Password">
        <form
          className="add-account-form"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="modal-input-container">
            <label
              className="modal-label"
              htmlFor="password"
              style={{ padding: '10px', display: 'block' }}
            >
              To show the private key, please enter your master password to decrypt your account.
            </label>

            <div className="input-MasterPassword">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                style={{ border: error ? '1px var(--color-error) solid' : 'none' }}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Image
                  src={showPassword ? hidePasswordIcon : showPasswordIcon}
                  alt=""
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          <div className="add-account-actions">
            {error && (
              <p id="password-error" className="modal-error-text" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="modal-button btn btn-primary"
              style={{ marginLeft: 'auto' }}
              disabled={isSubmitting || !password.trim()}
            >
              {isSubmitting ? 'Verifying...' : 'Show'}
            </button>
          </div>
        </form>
      </Modal>
      {addressInfo && (
        <PrivateKeyDisplayModal
          isOpen={showPrivateKeyModal}
          onClose={() => setShowPrivateKeyModal(false)}
          addressInfo={addressInfo}
          privateKeyHex={addressInfo.privateKeyHex ?? ''}
        />
      )}
    </>
  );
};

export default ShowPrivateKeyModal;
