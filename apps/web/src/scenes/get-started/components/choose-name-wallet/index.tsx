'use client';
import { emojis, walletNameLottie } from '@/assets';
import React, { useState } from 'react';
import './style.css';
import dynamic from 'next/dynamic';
import { useAccount, useRestoreWallet, useWallet } from '@/wallet';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
import { useI18n } from '@/utils/i18n';
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
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
                await createAddress(t('account1'), password, wallet,);
                router.replace('/');
            } else {
                setIsLoading(false);
            }

        } catch {
            setIsLoading(false);
        }
    }

    return (
        <div className="container-ChooseNameWallet">
            {isLoading && <Loading />}

            <div className='lottie-ChooseNameWallet' >
                <LottiePlayer
                    animationData={walletNameLottie}
                    loop={false}
                    play
                    className='lottie-ChooseNameWallet'
                />
            </div>

         <h1>{t('nameYourWallet')}</h1>

            <p>
                {t('walletNameDescription')}
            </p>
            <div className="input-ChooseNameWallet">
                <input
                    type="text"
                    placeholder={t('walletNamePlaceholder')}
                    onChange={e => setWalletName(e.target.value)}
                />
            </div>
            <div className="emoji-ChooseNameWallet">
                {emojis.map((emoji, index) => (
                    <button key={`${index}-emoji`}>{emoji}</button>
                ))}
            </div>
            <button
                className="cta-ChooseNameWallet"
                disabled={walletName.length == 0}
                onClick={() => { handleCreateWallet() }}
            >
                {t('finish')}
            </button>
            {restorationError && <p style={{ color: '#FF6B6B' }}>{restorationError}</p>}
        </div>
    );
};

export default ChooseNameWallet;
