'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import Button from '../Button';
import FormPasswordInput from '../common/FormPasswordInput';
import { Form, useForm, useWatch } from '../common/Form';
import { useI18n } from '@/utils/i18n';
import { validatePassword } from '@/utils/password-validator';
import { useAccount } from '@/wallet';
import { toast } from 'sonner';

const ChangePasswordModal: React.FC = () => {
  const { t } = useI18n();
  const { changePassword } = useAccount();
  const [form] = useForm();
  const newPassword = useWatch('newPassword', form) || '';
  const [newPasswordError, setNewPasswordError] = useState('');
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleNewPasswordChange = e => {
    setNewPasswordTouched(true);

    const newPassword = e.target.value;
    setNewPasswordTouched(true);

    if (newPassword && !validatePassword(newPassword)) {
      setNewPasswordError(t('passwordRequirements'));
    } else {
      setNewPasswordError('');
    }
  };

  const handleSubmit = async ({ oldPassword, newPassword }) => {
    try {
      setIsSubmitting(true);
      const result = await changePassword(oldPassword, newPassword);

      if (result) {
        toast.success('Update wallet password successfully!');
        setIsOpen(false);
        form.resetFields();
      }
    } catch (err) {
      console.log({ err });
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        size="small"
        onClick={() => setIsOpen(true)}
        className="w-[150px] h-[38px]"
        labelClassName="text-sm"
      >
        Update Password
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('updatePassword')}>
        <Form
          className="flex flex-col gap-5"
          onFinish={handleSubmit}
          form={form}
          validateTrigger="onChange"
          initialValues={{
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
        >
          <FormPasswordInput
            id="oldPassword"
            name="oldPassword"
            placeholder={t('enterYourPassword')}
            label={t('oldPassword')}
          />
          <FormPasswordInput
            id="newPassword"
            name="newPassword"
            onChange={handleNewPasswordChange}
            placeholder={t('enterYourPassword')}
            label={t('newPassword')}
            touched={newPasswordTouched}
            error={newPasswordError}
          />
          <FormPasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder={t('enterYourPassword')}
            label={t('confirmPassword')}
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: t('passwordsDoNotMatch'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t('passwordsDoNotMatch'));
                },
              }),
            ]}
          />
          <Button
            variant="primary"
            disabled={isSubmitting || !newPassword.trim()}
            type="submit"
            className="w-[86px] h-[38px] ml-auto"
            labelClassName="text-sm"
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
