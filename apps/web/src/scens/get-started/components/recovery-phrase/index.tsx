import { ceedRecoveryPhrase, copyIcon, recoveryPhrase } from '@/assets';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/providers/wallet/WalletProvider';

const RecoveryPhrase = () => {
    const [step, setStep] = useState(1);
    const [wordCount, setWordCount] = useState(24);
    const [generatedMnemonic, setGeneratedMnemonic] = useState<string>('');
    const [mnemonicWords, setMnemonicWords] = useState<string[]>([]);
    const [inputWords, setInputWords] = useState<string[]>([]);
    const navigate = useRouter().push;

    // Use the wallet hook to access wallet functionality
    const { createWallet, validateMnemonic } = useWallet();

    const generateNewWallet = useCallback(async () => {
        try {
            // This is a placeholder as we don't actually have the direct API to generate just a mnemonic
            // In a real implementation, you would use the proper method from the wallet SDK
            const tempPassword = 'TempPassword123!'; // Temporary password for generation
            let mnemonic = '';

            try {
                const newWallet = await createWallet(tempPassword);
                if (newWallet) {
                    // Assuming the wallet has a method to get the mnemonic
                    mnemonic = newWallet.getMnemonic ? newWallet.getMnemonic() : '';
                }
            } catch (walletError) {
                console.error('Error with wallet implementation:', walletError);
                // Fallback to mock mnemonic for development/testing
                const mockWords = [
                    'abandon',
                    'ability',
                    'able',
                    'about',
                    'above',
                    'absent',
                    'absorb',
                    'abstract',
                    'absurd',
                    'abuse',
                    'access',
                    'accident',
                    'account',
                    'accuse',
                    'achieve',
                    'acid',
                    'acoustic',
                    'acquire',
                    'across',
                    'act',
                    'action',
                    'actor',
                    'actress',
                    'actual'
                ];
                // Use slice to get the correct number of words based on wordCount
                mnemonic = mockWords.slice(0, wordCount).join(' ');
            }

            setGeneratedMnemonic(mnemonic);

            // Split the mnemonic into words
            const words = mnemonic.split(' ');
            setMnemonicWords(words.slice(0, wordCount));
        } catch (error) {
            console.error('Error generating wallet:', error);
        }
    }, [createWallet, wordCount]);

    // Generate a new wallet when the component mounts or wordCount changes
    useEffect(() => {
        generateNewWallet();
    }, [generateNewWallet]);

    const handleCopyToClipboard = () => {
        if (generatedMnemonic) {
            navigator.clipboard
                .writeText(generatedMnemonic)
                .then(() => {
                    alert('Recovery phrase copied to clipboard');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                });
        }
    };

    const handleConfirmPhrase = () => {
        // Validate that the user has correctly entered the recovery phrase
        const enteredMnemonic = inputWords.join(' ');
        const validation = validateMnemonic(enteredMnemonic);

        if (validation.isValid && enteredMnemonic === generatedMnemonic) {
            navigate('/get-started?step=master-password');
        } else {
            alert('The recovery phrase you entered is incorrect. Please try again.');
        }
    };

    const handleWordInputChange = (index: number, value: string) => {
        const newInputWords = [...inputWords];
        newInputWords[index] = value;
        setInputWords(newInputWords);
    };

    // If we don't have a real mnemonic yet, show example words for UI demonstration
    const displayWords =
        mnemonicWords.length > 0
            ? mnemonicWords
            : [
                  'mango',
                  'nectarine',
                  'orange',
                  'papaya',
                  'quince',
                  'raspberry',
                  'strawberry',
                  'tangerine',
                  'ugli',
                  'vanilla',
                  'watermelon',
                  'xigua',
                  'yam',
                  'zucchini',
                  'avocado',
                  'blueberry',
                  'cantaloupe',
                  'dragonfruit',
                  'elderberry',
                  'gooseberry',
                  'huckleberry',
                  'mulberry',
                  'olive',
                  'pomegranate'
              ].slice(0, wordCount);

    return (
        <div className="container-RecoveryPhrase">
            {step === 1 && (
                <div className="hint-RecoveryPhrase">
                    <Image src={recoveryPhrase} alt="recovery-phrase" />
                    <h1>Write Down Your Recovery Phrase</h1>
                    <p>
                        Your recovery phrase is the only way to restore access to your wallet if you
                        lose your device. We strongly recommend writing it down on paper and keeping
                        it in a safe place. Do not store it digitally, take a screenshot, or send it
                        via email—keeping it offline ensures maximum security.
                    </p>

                    <button className="cta-RecoveryPhrase" onClick={() => setStep(2)}>
                        Continue
                    </button>
                </div>
            )}
            {step === 2 && (
                <div className="hint-RecoveryPhrase" style={{ gap: '10px' }}>
                    <Image src={ceedRecoveryPhrase} alt="recovery-phrase" />
                    <h1>Recovery Phrase</h1>
                    <p>
                        Write down the following {wordCount} words in the correct order and keep
                        them in a safe place.
                    </p>
                    <select
                        defaultValue={24}
                        onChange={e => setWordCount(parseInt(e.target.value))}
                    >
                        <option value={12}>12 Words</option>
                        <option value={24}>24 Words</option>
                    </select>
                    <div className="ceeds-RecoveryPhrase">
                        {displayWords.map((word, index) => (
                            <span key={index}>
                                {index + 1}. {word}
                            </span>
                        ))}
                    </div>
                    <button className="copyCeeds-RecoveryPhrase" onClick={handleCopyToClipboard}>
                        <Image src={copyIcon} alt="" />
                        Copy to clipboard
                    </button>
                    <button className="cta-RecoveryPhrase" onClick={() => setStep(3)}>
                        Continue
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="hint-RecoveryPhrase" style={{ gap: '10px' }}>
                    <Image src={ceedRecoveryPhrase} alt="recovery-phrase" />
                    <h1>Confirm Recovery Phrase</h1>
                    <p>
                        Enter the words in the correct order to verify your backup and ensure
                        you&apos;ve written it down correctly.
                    </p>

                    <div className="ceeds-RecoveryPhrase confirmation">
                        {Array.from({ length: wordCount }).map((_, index) => (
                            <div key={index} className="word-input-container">
                                <span>{index + 1}. </span>
                                <input
                                    type="text"
                                    value={inputWords[index] || ''}
                                    onChange={e => handleWordInputChange(index, e.target.value)}
                                    placeholder="Enter word"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        className="cta-RecoveryPhrase"
                        onClick={handleConfirmPhrase}
                        disabled={inputWords.filter(Boolean).length !== wordCount}
                    >
                        Verify & Continue
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecoveryPhrase;
