'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import { useAccount, useWallet } from '@/wallet';
import { Typography } from '../common/Typography';
import Button from '../Button';
import FormPasswordInput from '../common/FormPasswordInput';
import { useI18n } from '../../utils/i18n';
import { Form, useForm, useWatch } from '../common/Form';

interface RemoveWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RemoveWalletModal: React.FC<RemoveWalletModalProps> = ({ isOpen, onClose }) => {
  const [form] = useForm();
  const password = useWatch('password', form) || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { getMnemonic } = useAccount();
  const { removeWallet } = useWallet();
  const { t } = useI18n();

  // Reset the form whenever the modal closes
  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setPasswordTouched(false);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      // Verify the password before deleting: getMnemonic throws on a wrong one.
      await getMnemonic(password);
      removeWallet();
      onClose();
    } catch (err) {
      setError(`${err}`);
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !password.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('removeWalletTitle')}>
      <Form
        className="modal-input-container pl-1 pr-1"
        form={form}
        initialValues={{ password: '' }}
        onFinish={handleSubmit}
      >
        <Typography variant="caption1" className="p-1 mb-2 text-orange-400">
          {t('removeWalletConfirm')}
        </Typography>
        <FormPasswordInput
          id="password"
          onChange={() => setPasswordTouched(true)}
          placeholder={t('enterYourPassword')}
          label={t('password')}
          hideLabel={true}
          touched={passwordTouched}
          error={''}
        />
      </Form>

      <div className="flex items-center justify-between gap-3 mt-6 pl-1 pr-1">
        {error && (
          <p id="remove-wallet-error" className="modal-error-text" role="alert">
            {error}
          </p>
        )}
        <div className="flex gap-3 ml-auto">
          <Button
            variant="outlined"
            onClick={onClose}
            type="button"
            className="h-[38px]"
            labelClassName="text-sm"
          >
            {t('cancel')}
          </Button>
          <Button
            variant="secondary"
            disabled={isDisabled}
            onClick={() => handleSubmit()}
            type="button"
            className="h-[38px] bg-red-600 hover:bg-red-700 disabled:opacity-50"
            labelClassName="text-sm text-white"
          >
            {isSubmitting ? 'Removing...' : t('removeWallet')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RemoveWalletModal;
