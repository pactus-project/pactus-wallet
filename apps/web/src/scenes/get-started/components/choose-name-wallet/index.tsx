'use client';
import { emojis, walletNameLottie } from '@/assets';
import React, { useState } from 'react';
import './style.css';
import { useAccount, useRestoreWallet, useWallet } from '@/wallet';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import { useI18n } from '@/utils/i18n';
import Lottie from '@/components/lottie-player';
const ChooseNameWallet = () => {
    const { setWalletName, walletName, password } = useWallet();
    const { restoreWallet, restorationError } = useRestoreWallet();
    const [isLoading, setIsLoading] = useState(false);
    const { createAddress } = useAccount();
    const router = useRouter();
    const { t } = useI18n();

    const handleCreateWallet = async () => {
        try {
            setIsLoading(true);
            const wallet = await restoreWallet();
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (wallet) {
                await createAddress(t('account1'), password, wallet);
                router.replace('/');
            } else {
                setIsLoading(false);
            }
        } catch {
            setIsLoading(false);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setWalletName(current => current + emoji);
    };

    return (
        <section className="wallet-naming">
            {isLoading && <Loading />}

            <h1 className="wallet-naming__title">{t('nameYourWallet')}</h1>
            <Lottie
                className='wallet-naming__animation'
                animationData={walletNameLottie} />
            <p className="wallet-naming__description">
                {t('walletNameDescription')}
            </p>

            <div className="wallet-naming__input-container">
                <label htmlFor="wallet-name" className="visually-hidden">
                    {t('walletNamePlaceholder')}
                </label>
                <input
                    id="wallet-name"
                    type="text"
                    className="wallet-naming__input"
                    placeholder={t('walletNamePlaceholder')}
                    onChange={e => setWalletName(e.target.value)}
                    value={walletName}
                    autoComplete="off"
                />
            </div>

            <div className="emoji-picker" role="group" aria-label={t('selectEmoji')}>
                {emojis.map((emoji, index) => (
                    <button
                        key={`${index}-emoji`}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="emoji-picker__button"
                        aria-label={`${t('addEmoji')} ${emoji}`}
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            <button
                className="btn btn-primary wallet-naming__submit"
                disabled={walletName.length === 0}
                onClick={handleCreateWallet}
                type="button"
                aria-busy={isLoading}
            >
                {t('finish')}
            </button>

            {restorationError && (
                <p className="wallet-naming__error" role="alert">
                    {restorationError}
                </p>
            )}
        </section>
    );
};

export default ChooseNameWallet;
