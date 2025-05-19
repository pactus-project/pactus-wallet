'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import './style.css';
import { useAccount } from '@/wallet';
import { emojis } from '@/assets';
import { useI18n } from '../../utils/i18n';
import Button from '../Button';
import FormPasswordInput from '../common/FormPasswordInput';
import FormTextInput from '../common/FormTextInput';
import { Form, useForm, useWatch } from '../common/Form';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddAccountPayload {
  accountName: string;
  password: string;
}

const AddAccountModal: React.FC<AddAccountModalProps> = ({ isOpen, onClose }) => {
  const [ form ] = useForm();
  const accountName = useWatch("accountName", form) || "";
  const password = useWatch("password", form) || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAddress, error, clearError } = useAccount();
  const { t } = useI18n();

  const handleEmojiSelect = (emoji: string) => {
    form.setFieldValue("accountName", form.getFieldValue("accountName") + emoji);
    clearError();
  };

  const handleSubmit = async (values: AddAccountPayload) => {
    try {
      setIsSubmitting(true);
      await createAddress(values.accountName, values.password);
      form.setFieldValue("accountName", "");
      form.setFieldValue("password", "");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('addAccount')}>
      <Form
        className="add-account-form"
        onFinish={handleSubmit}
        form={form}
        initialValues={{
          accountName: "",
          password: "",
        }}
      >
        <div className="modal-input-container pl-1 pr-1">
          <FormTextInput
            id="receiver"
            name="accountName"
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
          <FormPasswordInput
            id="password"
            placeholder={t('enterYourPassword')}
            label={t('password')}
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
            type="submit"
            className="w-[86px] h-[38px] ml-auto"
            labelClassName="text-sm"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddAccountModal;
