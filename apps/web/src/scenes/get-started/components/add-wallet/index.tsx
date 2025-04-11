'use client'
import { addWalletLottie, existingWalletIcon, newWalletIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import BorderBeam from '@/components/border-beam'
import { useI18n } from '@/utils/i18n'
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
const AddWallet = () => {
    const navigate = useRouter().push;
    const { t } = useI18n();
    return (
        <div className='container-addwallet' >
            <div className='lottie-addwallet' >
                <LottiePlayer
                    animationData={addWalletLottie}
                    loop={true}
                    className='lottie-addwallet'
                    play
                />
            </div>
            <h1>{t('addWallet')}</h1>
            <p>{t('addWalletDescription')}</p>
            <div className='ctas-addwallet' >
                <button id='newWalletButton' onClick={() => navigate('/get-started?step=recovery-phrase')}  >
                    <Image src={newWalletIcon} alt='newWalletIcon' />
                    <div><h3>{t('newWallet')}</h3><p>{t('newWalletDescription')}</p></div>
                    <BorderBeam
                        duration={4}
                        size={300}
                        colorFrom='#064560'
                        colorTo='#0FEF9E'
                        boxShadow={{
                            color: '#0FEF9E',
                            blur: 95,
                            spread: -60
                        }}
                        parentId="newWalletButton"
                        showOnHover={true}
                    />
                </button>
                <button id='ExistingWalletButton' onClick={() => navigate('/get-started?step=import-wallet')} >
                    <Image src={existingWalletIcon} alt='newWalletIcon' />
                    <div><h3>{t('existingWallet')}</h3>
                        <p>{t('existingWalletDescription')}
                        </p>
                    </div>
                    <BorderBeam
                        duration={4}
                        size={300}
                        colorFrom='#064560'
                        colorTo='#0FEF9E'
                        boxShadow={{
                            color: '#0FEF9E',
                            blur: 95,
                            spread: -60
                        }}
                        parentId="ExistingWalletButton"
                        showOnHover={true}
                    />
                </button>
            </div>
        </div>
    )
}

export default AddWallet