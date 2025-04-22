'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { useAccount } from '@/wallet';
import { hidePasswordIcon, showPasswordIcon, emojis } from '@/assets';
import Image from 'next/image';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAddress, error, clearError } = useAccount();

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    clearError();
  };

  const handleAccountNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(e.target.value);
    clearError();
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setAccountName(prevName => prevName + emoji);
    clearError();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createAddress(accountName, password);

      // Success - reset form and close modal
      setAccountName('');
      setPassword('');
      setShowPassword(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Account">
      <form className="add-account-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="modal-input-container">
          <label className="modal-label" htmlFor="accountName">
            Label
          </label>
          <input
            id="accountName"
            className="modal-input"
            type="text"
            placeholder="Enter account name"
            value={accountName}
            onChange={handleAccountNameChange}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "account-error" : undefined}
          />
        </div>
        
        <div className="emoji-ChooseNameWallet" role="group" aria-label="Emoji selector">
          {emojis.map((emoji, index) => (
            <button 
              key={`${index}-emoji`}
              type="button"
              onClick={() => handleEmojiSelect(emoji)}
              aria-label={`Insert emoji ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
        
        <div className="modal-input-container">
          <label className="modal-label" htmlFor="password">
            Password
          </label>

          <div className="input-MasterPassword">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              style={{ border: error ? '1px var(--color-error) solid' : 'none' }}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "password-error" : undefined}
            />
            <button 
              type="button" 
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
          {error && <p id="password-error" className="modal-error-text" role="alert">{error}</p>}
          <button
            type="submit"
            className="modal-button btn btn-primary"
            style={{ marginLeft: 'auto' }}
            disabled={isSubmitting || !accountName.trim() || !password.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
