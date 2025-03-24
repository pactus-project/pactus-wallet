'use client';
import { walletNameLottie } from '@/assets';
import React from 'react';
import './style.css';
import dynamic from 'next/dynamic';
import { useRestoreWallet, useWallet } from '@/wallet';
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
const ChooseNameWallet = () => {
    const { setWalletName, walletName } = useWallet();
    const { restoreWallet } = useRestoreWallet();
    const emojis = [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '🥲',
        '🥹',
        '☺️',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '🥰',
        '😘',
        '😗',
        '😙',
        '😚',
        '😋',
        '😛',
        '😝',
        '😜',
        '🤪',
        '🤨',
        '🧐',
        '🤓',
        '😎',
        '🥸',
        '🤩',
        '🥳',
        '🙂‍↕️',
        '😏',
        '😒',
        '🙂‍↔️',
        '😞',
        '😔',
        '😟',
        '😕',
        '🙁',
        '☹️',
        '😣',
        '😖',
        '😫',
        '😩',
        '🥺',
        '😢',
        '😭',
        '😮‍💨',
        '😤',
        '😠',
        '😡',
        '🤬',
        '🤯',
        '😳',
        '🥵',
        '🥶',
        '😱',
        '😨',
        '😰',
        '😥',
        '😓',
        '🫣',
        '🤗',
        '🫡',
        '🤔',
        '🫢',
        '🤭',
        '🤫',
        '🤥',
        '😶',
        '😶‍🌫️',
        '😐',
        '😑',
        '😬',
        '🫨',
        '🫠',
        '🙄',
        '😯',
        '😦',
        '😧',
        '😮',
        '😲',
        '🥱',
        '😴',
        '🤤',
        '😪',
        '😵',
        '😵‍💫',
        '🫥',
        '🤐',
        '🥴',
        '🤢',
        '🤮',
        '🤧',
        '😷',
        '🤒',
        '🤕',
        '🤑',
        '🤠',
        '😈',
        '👿',
        '👹',
        '👺',
        '🤡',
        '💩',
        '👻',
        '💀',
        '☠️',
        '👽',
        '👾',
        '🤖',
        '🎃',
        '😺',
        '😸',
        '😹',
        '😻',
        '😼',
        '😽',
        '🙀',
        '😿',
        '😾'
    ];
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
                onClick={() => restoreWallet()}
            >
                Finish
            </button>
        </div>
    );
};

export default ChooseNameWallet;
