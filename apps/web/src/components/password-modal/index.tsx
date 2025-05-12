'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { useAccount, AddressInfo } from '@/wallet';
import PrivateKeyDisplayModal from '@/components/address-infom-modal';
import { Typography } from '../common/Typography';
import Button from '../Button';
import FormPasswordInput from '../common/FormPasswordInput';
import { useI18n } from '../../utils/i18n';
import { validatePassword } from '../../utils/password-validator';
import PasswordStrengthIndicator from '@/components/common/PasswordStrengthIndicator';
import { Form, useForm, useWatch } from '../common/Form';

interface ShowPrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const ShowPrivateKeyModal: React.FC<ShowPrivateKeyModalProps> = ({ isOpen, onClose, address }) => {
  const [form] = useForm();
  const password = useWatch('password', form) || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [addressInfo, setAddressInfo] = useState<(AddressInfo & { privateKeyHex: string }) | null>(
    null
  );
  const [error, setError] = useState('');
  const { getAddressInfo } = useAccount();
  const { t } = useI18n();
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // Reset form and state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setPasswordTouched(false);
      setIsPasswordFocused(false);
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, form]);

  const handlePasswordFocus = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsPasswordFocused(false);
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
      onClose();
    } catch (err) {
      setError(`Error verifying password: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordChange = () => {
    setPasswordTouched(true);
  };

  const isDisabled = isSubmitting || !password.trim() || !validatePassword(password);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Password">
        <Form
          className="modal-input-container pl-1 pr-1"
          form={form}
          initialValues={{ password: '' }}
          onFinish={handleSubmit}
        >
          <Typography variant="caption1" className="p-1 mb-2">
            {t('toShowPrivateKey')}
          </Typography>
          <FormPasswordInput
            id="password"
            onChange={handlePasswordChange}
            placeholder={t('enterYourPassword')}
            label={t('password')}
            hideLabel={true}
            touched={passwordTouched}
            error={''}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
          />
          <PasswordStrengthIndicator
            password={password}
            className="mt-2"
            isFocused={isPasswordFocused}
          />
        </Form>

        <div className="add-account-actions pl-1 pr-1">
          {error && (
            <p id="password-error" className="modal-error-text" role="alert">
              {error}
            </p>
          )}
          <Button
            variant="primary"
            disabled={isDisabled}
            onClick={() => handleSubmit()}
            type="button"
            className="w-[86px] h-[38px] ml-auto"
            labelClassName="text-sm"
          >
            {isSubmitting ? 'Verifying...' : 'Show'}
          </Button>
        </div>
      </Modal>
      {addressInfo && (
        <PrivateKeyDisplayModal
          isOpen={showPrivateKeyModal}
          onClose={() => setShowPrivateKeyModal(false)}
          addressInfo={addressInfo}
          privateKeyHex={addressInfo.privateKeyHex ?? ''}
          title={t('showPrivateKey')}
          label={t('privateKey')}
          copyTitle={t("copyPrivateKey")}
        />
      )}
    </>
  );
};

export default ShowPrivateKeyModal;
