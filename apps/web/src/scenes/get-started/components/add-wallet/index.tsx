'use client'
import { addWalletLottie, existingWalletIcon, newWalletIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });


const AddWallet = () => {
  const navigate = useRouter().push;

    return (
        <div className='container-addwallet' >
            <LottiePlayer
                segments={[0, 30]}
                animationData={addWalletLottie}
                loop={false}
                play
            />
            <h1>Add Wallet</h1>
            <p>Easily create a new wallet or import an existing one to manage your digital assets securely.</p>
            <div className='ctas-addwallet' >
                <button onClick={() =>navigate('/get-started?step=recovery-phrase')}  >
                    <Image src={newWalletIcon} alt='newWalletIcon' />
                    <div><h3>New Wallet</h3><p>Create a brand-new wallet and start your journey with Pactus securely.</p></div>
                </button>
                <button disabled >
                    <Image src={existingWalletIcon} alt='newWalletIcon' />
                    <div><h3>Existing Wallet</h3><p>Restore access to your wallet by securely entering your recovery phrase or by importing a wallet file.</p></div>
                </button>
            </div>
        </div>
    )
}

export default AddWallet