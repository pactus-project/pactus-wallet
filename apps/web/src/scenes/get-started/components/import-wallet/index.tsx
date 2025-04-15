'use client';
import { importWalletLottie } from '@/assets';
import { useWallet } from '@/wallet';
import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
import * as bip39 from 'bip39';
import { useI18n } from '@/utils/i18n';
import BorderBeam from '@/components/border-beam';

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

const ImportWallet = () => {
    const [wordCount, setWordCount] = useState(24);
    const [words, setWords] = useState<string[]>(Array(wordCount).fill(''));
    const [error, setError] = useState<string>('');
    const { setMnemonic } = useWallet();
    const navigate = useRouter().push;
    const { t } = useI18n();

    // Check if the recovery phrase has any empty words
    const hasEmptyWords = () => words.some(word => word.trim() === '');

    const handleWordCountChange = (count: number) => {
        setWordCount(count);
        setWords(Array(count).fill(''));
        setError('');
    };

    // Validate the recovery phrase using BIP39
    const validateMnemonic = () => {
        const mnemonic = words.join(' ');
        return bip39.validateMnemonic(mnemonic);
    };

    const handleContinue = () => {
        if (hasEmptyWords()) {
            return;
        }
        
        // Validate the mnemonic using BIP39
        if (!validateMnemonic()) {
            setError(t('invalidSeedPhrase'));
            return;
        }
        
        // Clear any previous errors
        setError('');
        
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
            setError('');
            return;
        }

        // Case 2: More words than needed - take only what we need
        if (pastedWords.length > wordCount) {
            // Take only the first N words where N is the current wordCount
            setWords(pastedWords.slice(0, wordCount));
            setError('');
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
            setError('');
            return;
        }

        // Case 4: Single word or invalid input - just put it in the current field
        const inputIndex = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
        const newWords = [...words];
        newWords[inputIndex] = pastedText;
        setWords(newWords);
    };

    return (
        <section className="import-wallet">
            <div className="import-wallet__animation">
                <LottiePlayer
                    animationData={importWalletLottie}
                    loop={true}
                    play
                    className="import-wallet__animation"
                    aria-hidden="true"
                />
            </div>

            <h1 className="import-wallet__title">{t('importExistingWallet')}</h1>
            <p className="import-wallet__description">{t('importWalletDescription')}</p>
            
            <div className="import-wallet__controls">
                <select 
                    id="word-count"
                    className="import-wallet__select"
                    value={wordCount} 
                    onChange={(e) => handleWordCountChange(parseInt(e.target.value))}
                    aria-label={t('selectWordCount')}
                >
                    <option value={12}>{t('twelveWords')}</option>
                    <option value={24}>{t('twentyFourWords')}</option>
                </select>
            </div>
            
            <div id="recovery-phrase-parent" className="import-wallet__seed-container">
                <fieldset className="import-wallet__seed-fieldset">
                    <legend className="visually-hidden">{t('enterSeedPhrase')}</legend>
                    
                    {Array.from({ length: wordCount }).map((_, index) => (
                        <div key={index} className="import-wallet__word-container">
                            <label className="import-wallet__word-label" htmlFor={`word-${index}`}>
                                {index + 1}.
                            </label>
                            <input
                                id={`word-${index}`}
                                type="text" 
                                className="import-wallet__word-input"
                                value={words[index]}
                                data-index={index}
                                onPaste={handlePaste}
                                onChange={(e) => {
                                    const newWords = [...words];
                                    newWords[index] = e.target.value;
                                    setWords(newWords);
                                    setError(''); // Clear error when user is typing
                                }}
                                aria-invalid={error ? "true" : "false"}
                                autoComplete="off"
                            />
                        </div>
                    ))}
                </fieldset>
                
                <BorderBeam
                    duration={4}
                    size={300}
                    parentId="recovery-phrase-parent"
                    showOnHover={true}
                />
            </div>
            
            {error && (
                <p className="import-wallet__error" role="alert">
                    {error}
                </p>
            )}
            
            <button
                type="button"
                disabled={hasEmptyWords() || error.length > 0}
                className="btn btn-primary import-wallet__submit"
                onClick={handleContinue}
                aria-disabled={hasEmptyWords() || error.length > 0}
            >
                {t('continue')}
            </button>
        </section>
    )
}

export default ImportWallet