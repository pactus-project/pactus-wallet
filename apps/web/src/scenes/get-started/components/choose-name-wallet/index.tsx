'use client';
import { emojis, walletNameLottie } from '@/assets';
import React from 'react';
import './style.css';
import dynamic from 'next/dynamic';
import { useAddress, useRestoreWallet, useWallet } from '@/wallet';
import { useRouter } from 'next/navigation';
import Loading from '@/components/loading';
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
const ChooseNameWallet = () => {
    const { setWalletName, walletName } = useWallet();
    const { restoreWallet, isRestoring } = useRestoreWallet();
    const { createAddress } = useAddress();
    const router = useRouter();
    const handelCreateWallet = async () => {

        await restoreWallet();
        await createAddress('Account 1');
        router.replace('/');


    }
    if (isRestoring) {
        return <Loading />
    }
    return (
        <div className="container-ChooseNameWallet">
            <LottiePlayer
                animationData={walletNameLottie}
                loop={false}
                play
                style={{ height: '200px' }}
            />
            <h1>Name your Wallet</h1>
            <p>
                Name your wallet to easily identify it using the Pactus wallet. these names are
                stored locally, and can only be seen by you.
            </p>
            <div className="input-ChooseNameWallet">
                <input
                    type="text"
                    placeholder="Wallet name"
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
                onClick={async () => { handelCreateWallet() }}
            >
                Finish
            </button>
        </div>
    );
};

export default ChooseNameWallet;
