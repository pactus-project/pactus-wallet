'use client'
import { addWalletLottie, existingWalletIcon, newWalletIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import BorderBeam from '@/components/border-beam'
import { useI18n } from '@/utils/i18n'
import Lottie from '@/components/lottie-player'

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

const AddWallet = () => {
    const navigate = useRouter().push;
    const { t } = useI18n();

    return (
        <section className="add-wallet">
            <Lottie
                animationData={addWalletLottie}
                loop={true}
                play
                className="add-wallet__animation"
                aria-hidden="true"
            />
            <h1 className="add-wallet__title">{t('addWallet')}</h1>
            <p className="add-wallet__description">{t('addWalletDescription')}</p>

            <div className="add-wallet__options">
                <button
                    id="newWalletButton"
                    className="add-wallet__option-button"
                    onClick={() => navigate('/get-started?step=recovery-phrase')}
                    type="button"
                >
                    <Image
                        src={newWalletIcon}
                        alt=""
                        className="add-wallet__option-icon"
                        aria-hidden="true"
                    />
                    <div className="add-wallet__option-content">
                        <h3 className="add-wallet__option-title">{t('newWallet')}</h3>
                        <p className="add-wallet__option-description">{t('newWalletDescription')}</p>
                    </div>
                    <BorderBeam
                        duration={4}
                        size={300}
                        parentId="newWalletButton"
                        showOnHover={true}
                    />
                </button>

                <button
                    id="ExistingWalletButton"
                    className="add-wallet__option-button"
                    onClick={() => navigate('/get-started?step=import-wallet')}
                    type="button"
                >
                    <Image
                        src={existingWalletIcon}
                        alt=""
                        className="add-wallet__option-icon"
                        aria-hidden="true"
                    />
                    <div className="add-wallet__option-content">
                        <h3 className="add-wallet__option-title">{t('existingWallet')}</h3>
                        <p className="add-wallet__option-description">{t('existingWalletDescription')}</p>
                    </div>
                    <BorderBeam
                        duration={4}
                        size={300}
                        parentId="ExistingWalletButton"
                        showOnHover={true}
                    />
                </button>
            </div>
        </section>
    )
}

export default AddWallet