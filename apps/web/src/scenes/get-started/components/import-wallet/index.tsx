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

    // Check if the recovery phrase has any empty words
    const hasEmptyWords = () => words.some(word => word.trim() === '');

    const handleWordCountChange = (count: number) => {
        setWordCount(count);
        setWords(Array(count).fill(''));
    };

    const handleContinue = () => {
        if (hasEmptyWords()) {
            return;
        }
        setMnemonic(words.join(' '));
        navigate('/get-started?step=master-password');
    };

    // Handle paste event for seed phrase
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const pastedWords = pastedText.trim().split(/\s+/);

        // Case 1: Standard valid seed phrases (12 or 24 words exactly)
        if (pastedWords.length === 12 || pastedWords.length === 24) {
            // Automatically adjust the word count to match
            setWordCount(pastedWords.length);
            // Fill all inputs with the pasted words
            setWords(pastedWords);
            return;
        }

        // Case 2: More words than needed - take only what we need
        if (pastedWords.length > wordCount) {
            // Take only the first N words where N is the current wordCount
            setWords(pastedWords.slice(0, wordCount));
            return;
        }

        // Case 3: Fewer words than needed - fill what we can
        if (pastedWords.length > 1 && pastedWords.length < wordCount) {
            // Create a new array starting with our current words
            const newWords = [...words];
            // Replace the beginning portion with our pasted words
            for (let i = 0; i < pastedWords.length; i++) {
                newWords[i] = pastedWords[i];
            }
            setWords(newWords);
            return;
        }

        // Case 4: Single word or invalid input - just put it in the current field
        const inputIndex = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
        const newWords = [...words];
        newWords[inputIndex] = pastedText;
        setWords(newWords);
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
                            data-index={index}
                            onPaste={handlePaste}
                            onChange={(e) => {
                                const newWords = [...words];
                                newWords[index] = e.target.value;
                                setWords(newWords);
                            }}
                        />
                    </span>
                ))}
            </div>
            <button
                disabled={hasEmptyWords()}
                className='cta-ImportWallet' onClick={() => handleContinue()}>
                Continue
            </button>
        </div>
    )
}

export default ImportWallet