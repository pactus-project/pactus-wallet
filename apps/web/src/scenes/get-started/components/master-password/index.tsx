'use client';
import { masterPasswordLottie } from '@/assets';
import React, { useState } from 'react';
import './style.css';
import { validatePassword } from '@/utils/password-validator';
import { useAccount, useRestoreWallet, useWallet } from '@/wallet';
import { useI18n } from '@/utils/i18n';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import { LottieWithText } from '../../../../components/LottieWithText';
import FormPasswordInput from '../../../../components/common/FormPasswordInput';
import LoadingDialog from '../../../../components/common/LoadingDialog';

const MasterPassword = () => {
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const { setWalletName, setPassword: setWalletPassword } = useWallet();
  const { restoreWallet, restorationError } = useRestoreWallet();
  const [isLoading, setIsLoading] = useState(false);
  const { createAddress } = useAccount();
  const router = useRouter();
  const defaultWalletName = 'My Wallet';

  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  // const togglePasswordVisibility = (input: string) => {
  //   setShowPassword(prevState => ({
  //     ...prevState,
  //     [input]: !prevState[input],
  //   }));
  // };

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

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setConfirmPassword(newPassword);
    setConfirmPasswordTouched(true);

    if (newPassword && !validatePassword(newPassword)) {
      setConfirmPasswordError(t('passwordsDoNotMatch'));
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleCreateWallet = async () => {
    try {
      setIsLoading(true);

      setWalletPassword(password);

      const wallet = await restoreWallet(undefined, password);

      if (wallet) {
        await createAddress(t('account1'), password, wallet);
        router.replace('/');
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    await setWalletName(defaultWalletName);
    handleCreateWallet();
  };

  const isFormValid =
    !passwordError &&
    !confirmPasswordError &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    isChecked;

  return (
    <section className="master-password">
      <LottieWithText
        animationData={masterPasswordLottie}
        title={t('createMasterPassword')}
        description={t('masterPasswordDescription')}
      />

      <form className="master-password__form mt-4" onSubmit={e => e.preventDefault()}>
        <div className="master-password__input-group">
          <label htmlFor="password" className="visually-hidden">
            {t('enterYourPassword')}
          </label>
          <div className="master-password__input-container">
            <FormPasswordInput
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder={t('enterYourPassword')}
              label={t('password')}
              touched={passwordTouched}
              error={passwordError}
              hideLabel={true}
              className={`h-[60px] bg-surface-medium  ${passwordError ? '!border-error' : 'border-surface-medium'}`}
            />
          </div>
        </div>

        <div className="master-password__input-group">
          <label htmlFor="confirm-password" className="visually-hidden">
            {t('confirmYourPassword')}
          </label>
          <div className="master-password__input-container">
            <FormPasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder={t('confirmYourPassword')}
              label={t('confirmPassword')}
              touched={confirmPasswordTouched}
              error={confirmPasswordError}
              hideLabel={true}
              className={`h-[60px] bg-surface-medium ${confirmPasswordError ? '!border-error' : 'border-surface-medium'}`}
            />
          </div>
        </div>

        <div className="master-password__terms">
          <Checkbox
            id="terms-checkbox"
            label={t('cannotRecoverPassword')}
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            labelClassName="text-text-secondary text-xs font-regular leading-normal cursor-pointer select-none"
            checkBoxClassName="w-[16px] h-[16px] cursor-pointer [accent-color:theme('colors.primary')]"
            description={
              <span className="bg-gradient-primary bg-clip-text text-transparent font-medium ml-1 cursor-pointer whitespace-nowrap">
                {t('learnMore')}
              </span>
            }
            size="small"
          />
        </div>
        {restorationError && (
          <p className="master-password__error" role="alert">
            {restorationError}
          </p>
        )}

        <Button
          variant="primary"
          fullWidth
          className="mt-4"
          disabled={!isFormValid}
          onClick={handleSubmit}
          type="button"
        >
          {t('continue')}
        </Button>
      </form>
      {isLoading && <LoadingDialog />}
    </section>
  );
};

export default MasterPassword;
