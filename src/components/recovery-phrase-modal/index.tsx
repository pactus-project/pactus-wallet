'use client';
import React, { useState } from 'react';
import Modal from '../modal';
import { useAccount } from '@/wallet';
import { Typography } from '../common/Typography';
import Button from '../Button';
import FormPasswordInput from '../common/FormPasswordInput';
import { useI18n } from '../../utils/i18n';
import { Form, useForm, useWatch } from '../common/Form';
import SeedWord from '../SeedWord';

interface ShowRecoveryPhraseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShowRecoveryPhraseModal: React.FC<ShowRecoveryPhraseModalProps> = ({ isOpen, onClose }) => {
  const [form] = useForm();
  const password = useWatch('password', form) || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seedWords, setSeedWords] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { getMnemonic } = useAccount();
  const { t } = useI18n();

  // Reset the form and wipe the revealed phrase whenever the modal closes
  React.useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setPasswordTouched(false);
      setError('');
      setIsSubmitting(false);
      setSeedWords([]);
    }
  }, [isOpen, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      const mnemonic = await getMnemonic(password);
      setSeedWords(mnemonic.split(' '));
    } catch (err) {
      setError(`${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !password.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('recoveryPhrase')}>
      {seedWords.length === 0 ? (
        <>
          <Form
            className="modal-input-container pl-1 pr-1"
            form={form}
            initialValues={{ password: '' }}
            onFinish={handleSubmit}
          >
            <Typography variant="caption1" className="p-1 mb-2">
              {t('toShowRecoveryPhrase')}
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

          <div className="flex justify-between gap-3 mt-6 pl-1 pr-1">
            {error && (
              <p id="recovery-phrase-error" className="modal-error-text" role="alert">
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
        </>
      ) : (
        <div className="pl-1 pr-1">
          <Typography variant="caption1" className="p-1 mb-2 text-orange-400">
            {t('recoveryPhraseNeverShare')}
          </Typography>
          <div className="w-full p-4 rounded-md bg-[#101010]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {seedWords.map((word, index) => (
                <SeedWord key={index} index={index + 1} word={word} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ShowRecoveryPhraseModal;
