import { importWalletLottie } from '@/assets';
import { useWallet } from '@/wallet';
import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
const ImportWallet = () => {
    const [wordCount, setWordCount] = useState(24);
    const [words, setWords] = useState<string[]>(Array(wordCount).fill(''));
    const { setMnemonic } = useWallet();
    const navigate = useRouter().push;
    const handleWordCountChange = (count: number) => {
        setWordCount(count);
        setWords(Array(count).fill(''));
    };
    const handleContinue = () => {
        if (words.some(word => word.trim() === '')) {
            alert('Please fill in all words of your recovery phrase');
            return;
        }
        setMnemonic(words.join(' '));
        navigate('/get-started?step=master-password');
        console.log('Wallet imported successfully');
    };
    return (
        <div className='container-ImportWallet'>
            <LottiePlayer
                animationData={importWalletLottie}
                loop={true}
                play
                style={{ height: '200px' }}
            />
            <h1>Import Existing Wallet</h1>
            <p>Restore access to your wallet by securely entering your 12 or 24-word recovery phrase.</p>
            <select defaultValue={24} onChange={(e) => handleWordCountChange(parseInt(e.target.value))}>
                <option value={12}>12 Words</option>
                <option value={24}>24 Words</option>
            </select>
            <div id='recoveryPhraseStep2-parent' className='seed-ImportWallet'>
                {Array.from({ length: wordCount }).map((_, index) => (
                    <span key={index}>
                        <label> {index + 1}.</label>
                        <input
                            type="text"
                            value={words[index]}
                            onChange={(e) => {
                                const newWords = [...words];
                                newWords[index] = e.target.value;
                                setWords(newWords);
                            }}
                        />
                    </span>
                ))}
            </div>
            <button disabled={(words.some(word => word.trim() === ''))} className='cta-RecoveryPhrase' onClick={() => handleContinue()}>Continue</button>
        </div>
    )
}

export default ImportWallet