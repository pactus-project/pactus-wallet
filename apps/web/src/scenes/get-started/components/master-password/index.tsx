'use client';
import { showPasswordIcon, hidePasswordIcon, masterPasswordLottie } from '@/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { validatePassword } from '@/utils/password-validator'
import { useWallet } from '@/wallet'
import { useI18n } from '@/utils/i18n'
import Lottie from '@/components/lottie-player';

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

const MasterPassword = () => {
    const navigate = useRouter().push;
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({
        password: false,
        confirm: false
    });
    const { t } = useI18n();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({
        password: '',
        confirm: ''
    });
    const [isChecked, setIsChecked] = useState(false);
    const { setPassword: setMasterPassword } = useWallet();

    const togglePasswordVisibility = (input: string) => {
        setShowPassword(prevState => ({
            ...prevState,
            [input]: !prevState[input]
        }));
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (value && !validatePassword(value)) {
            setErrors(prevState => ({
                ...prevState,
                password: t('passwordRequirements')
            }));
        } else {
            setErrors(prevState => ({
                ...prevState,
                password: ''
            }));
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        if (value && value !== password) {
            setErrors(prevState => ({
                ...prevState,
                confirm: t('passwordsDoNotMatch')
            }));
        } else {
            setErrors(prevState => ({
                ...prevState,
                confirm: ''
            }));
        }
    }

    const handleSubmit = () => {
        setMasterPassword(password);
        navigate('/get-started?step=choose-name-wallet');
    }

    const isFormValid = !errors.password &&
        !errors.confirm &&
        password.length > 0 &&
        confirmPassword.length > 0 &&
        isChecked;

    return (
        <section className="master-password">
            <Lottie
                animationData={masterPasswordLottie}
                className="master-password__animation"
                loop={false}
                play
                aria-hidden="true"
            />
            <h1 className="master-password__title">{t('createMasterPassword')}</h1>
            <p className="master-password__description">{t('masterPasswordDescription')}</p>

            <form className="master-password__form" onSubmit={(e) => e.preventDefault()}>
                <div className="master-password__input-group">
                    <label htmlFor="password" className="visually-hidden">
                        {t('enterYourPassword')}
                    </label>
                    <div className="master-password__input-container">
                        <input
                            id="password"
                            type={showPassword.password ? 'text' : 'password'}
                            className={`master-password__input ${errors.password ? 'master-password__input--error' : ''}`}
                            placeholder={t('enterYourPassword')}
                            value={password}
                            onChange={handlePasswordChange}
                            aria-invalid={errors.password ? 'true' : 'false'}
                            aria-describedby={errors.password ? 'password-error' : undefined}
                        />
                        <button
                            type="button"
                            className="master-password__toggle-button"
                            onClick={() => togglePasswordVisibility('password')}
                            aria-label={showPassword.password ? t('hidePassword') : t('showPassword')}
                        >
                            <Image
                                src={showPassword.password ? hidePasswordIcon : showPasswordIcon}
                                alt=""
                                aria-hidden="true"
                                width={24}
                                height={24}
                            />
                        </button>
                    </div>
                    {errors.password && (
                        <p id="password-error" className="master-password__error" role="alert">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="master-password__input-group">
                    <label htmlFor="confirm-password" className="visually-hidden">
                        {t('confirmYourPassword')}
                    </label>
                    <div className="master-password__input-container">
                        <input
                            id="confirm-password"
                            type={showPassword.confirm ? 'text' : 'password'}
                            className={`master-password__input ${errors.confirm ? 'master-password__input--error' : ''}`}
                            placeholder={t('confirmYourPassword')}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            aria-invalid={errors.confirm ? 'true' : 'false'}
                            aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                        />
                        <button
                            type="button"
                            className="master-password__toggle-button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            aria-label={showPassword.confirm ? t('hidePassword') : t('showPassword')}
                        >
                            <Image
                                src={showPassword.confirm ? hidePasswordIcon : showPasswordIcon}
                                alt=""
                                aria-hidden="true"
                                width={24}
                                height={24}
                            />
                        </button>
                    </div>
                    {errors.confirm && (
                        <p id="confirm-error" className="master-password__error" role="alert">
                            {errors.confirm}
                        </p>
                    )}
                </div>

                <div className="master-password__terms">
                    <div className="master-password__checkbox-container">
                        <input
                            type="checkbox"
                            id="terms-checkbox"
                            className="master-password__checkbox"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                        <label htmlFor="terms-checkbox" className="master-password__terms-text">
                            {t('cannotRecoverPassword')}
                            <span className="master-password__learn-more">{t('learnMore')}</span>
                        </label>
                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-primary master-password__submit"
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                    aria-disabled={!isFormValid}
                >
                    {t('continue')}
                </button>
            </form>
        </section>
    )
}

export default MasterPassword