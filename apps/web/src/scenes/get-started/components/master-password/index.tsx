import { showPasswordIcon, hidePasswordIcon, masterPasswordLottie } from '@/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { validatePassword } from '@/utils/password-validator'
import { useWallet } from '@/wallet'
import { useI18n } from '@/utils/i18n'

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
    const { setPassword: setMasterPassword } = useWallet();

    return (
        <div className='container-MasterPassword'>
            <LottiePlayer
                animationData={masterPasswordLottie}
                loop={false}
                play
                style={{ height: '250px' }}
            />
            <h1>{t('createMasterPassword')}</h1>
            <p>{t('masterPasswordDescription')}</p>

            <div className='input-MasterPassword'>
                <input
                    type={showPassword.password ? 'text' : 'password'}
                    placeholder={t('enterYourPassword')}
                    value={password}
                    onChange={handlePasswordChange}
                    style={{ border: errors.password ? '1px red solid' : 'none' }}
                />
                <button onClick={() => togglePasswordVisibility('password')}>
                    <Image
                        src={showPassword.password ? hidePasswordIcon : showPasswordIcon}
                        alt={showPassword.password ? 'Hide password' : 'Show password'}
                    />
                </button>
                {errors.password && <p className='error'>{errors.password}</p>}
            </div>

            <div className='input-MasterPassword'>
                <input
                    type={showPassword.confirm ? 'text' : 'password'}
                    placeholder={t('confirmYourPassword')}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    style={{ border: errors.confirm ? '1px red solid' : 'none' }}
                />
                <button onClick={() => togglePasswordVisibility('confirm')}>
                    <Image
                        src={showPassword.confirm ? hidePasswordIcon : showPasswordIcon}
                        alt={showPassword.confirm ? 'Hide password' : 'Show password'}
                    />
                </button>
                {errors.confirm && <p className='error'>{errors.confirm}</p>}
            </div>

            <div className='terms-MasterPassword'>
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                <p onClick={() => setIsChecked(!isChecked)}>
                    {t('cannotRecoverPassword')}
                    <span className='gradient-MasterPassword'>{t('learnMore')}</span>
                </p>
            </div>

            <button
                className='cta-MasterPassword'
                disabled={errors.password.length > 1
                    || errors.confirm.length > 1
                    || !password
                    || !confirmPassword
                    || !isChecked}
                onClick={() => { navigate('/get-started?step=choose-name-wallet'); setMasterPassword(password); }}
            >{t('continue')}
            </button>
        </div>
    )
}

export default MasterPassword