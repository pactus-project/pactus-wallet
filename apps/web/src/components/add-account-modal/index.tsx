'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { useAccount } from '@/wallet';
import { emojis } from '@/assets';
import { useI18n } from '../../utils/i18n';
import Button from '../Button';
import FormPasswordInput from '../common/FormPasswordInput';
import { validatePassword } from '../../utils/password-validator';
import FormTextInput from '../common/FormTextInput';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const [accountName, setAccountName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAddress, error, clearError } = useAccount();
  const { t } = useI18n();
  const [passwordError, setPasswordError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordTouched(true);

    if (newPassword && !validatePassword(newPassword)) {
      setPasswordError(t('passwordRequirements'));
    } else {
      setPasswordError('');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setAccountName(prevName => prevName + emoji);
    clearError();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createAddress(accountName, password);
      setAccountName('');
      setPassword('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('addAccount')}>
      <form
        className="add-account-form"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="modal-input-container pl-1 pr-1">
          <FormTextInput
            id="receiver"
            name="accountName"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
            placeholder={t('enterAccountName')}
            label={t('label')}
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

        <div className="modal-input-container pl-1 pr-1">
          {/* <label className="modal-label" htmlFor="password">
            Password
          </label> */}

          {/* <div className="input-MasterPassword"> */}
          {/* <input
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
              {}
              <Image
                src={showPassword ? hidePasswordIcon : showPasswordIcon}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div> */}

          <FormPasswordInput
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder={t('enterYourPassword')}
            label={t('password')}
            touched={passwordTouched}
            error={passwordError}
          />
        </div>

        <div className="add-account-actions">
          {error && (
            <p id="password-error" className="modal-error-text" role="alert">
              {error}
            </p>
          )}
          <Button
            variant="primary"
            disabled={isSubmitting || !accountName.trim() || !password.trim()}
            onClick={handleSubmit}
            type="button"
            className="w-[86px] h-[38px] ml-auto"
            labelClassName="text-sm"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
