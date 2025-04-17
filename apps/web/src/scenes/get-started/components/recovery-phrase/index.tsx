'use client';
import { generateRecoverySeedLottie, writePaperLottie } from '@/assets'
import React, { useState, useEffect } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
import * as bip39 from 'bip39';
import dynamic from 'next/dynamic'
import BorderBeam from '@/components/border-beam'
import { useWallet } from '@/wallet'
import { useI18n } from '@/utils/i18n'
import Lottie from '@/components/lottie-player';

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });

const RecoveryPhrase: React.FC = () => {
    const [step, setStep] = useState<number>(1);
    const [wordCount, setWordCount] = useState<number>(24);
    const [walletSeeds, setWalletSeeds] = useState<string[]>([]);
    const [validationIndexes, setValidationIndexes] = useState<number[]>([]);
    const [userInputs, setUserInputs] = useState<{ [key: number]: string }>({});
    const [inputErrors, setInputErrors] = useState<{ [key: number]: string }>({});
    const navigate = useRouter().push;
    const { setMnemonic } = useWallet();
    const { t } = useI18n();

    // Generate recovery phrase when the component loads or word count changes
    useEffect(() => {
        generateRecoveryPhrase(wordCount);
    }, [wordCount]);

    // Function to generate a recovery phrase using BIP39
    const generateRecoveryPhrase = async (count: number) => {
        const mnemonic = bip39.generateMnemonic((count === 12 ? 128 : 256));
        const words = mnemonic.split(' ');
        setWalletSeeds(words);

        // Select random indexes for validation
        const indexes: number[] = [];
        const numValidationWords = count === 12 ? 4 : 8;
        while (indexes.length < numValidationWords) {
            const randomIndex = Math.floor(Math.random() * count);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        setValidationIndexes(indexes);
        setUserInputs({});
        setInputErrors({});
    };

    // Handle user input changes
    const handleInputChange = (index: number, value: string) => {
        setUserInputs({ ...userInputs, [index]: value });

        // Validate input and apply color styles
        const errors = { ...inputErrors };
        if (value.trim() !== walletSeeds[index]) {
            errors[index] = 'error';  // Incorrect input
        } else {
            errors[index] = 'success';  // Correct input
        }

        setInputErrors(errors);
    };

    // Validate user inputs before proceeding
    const validateInputs = () => {
        const errors: { [key: number]: string } = {};
        let allInputsValid = true;
        validationIndexes.forEach((index) => {
            if (userInputs[index]?.trim() !== walletSeeds[index]) {
                errors[index] = 'error'; // Incorrect input
                allInputsValid = false;
            }
        });

        // If errors exist, display them and prevent navigation
        if (allInputsValid) {
            setMnemonic(walletSeeds.join(' '))
            navigate('/get-started?step=master-password'); // Proceed if all inputs are correct
        } else {
            setInputErrors(errors); // Display error feedback
        }
    };

    // Check if the "Confirm" button should be enabled
    const isConfirmButtonDisabled = () => {
        // Disable button if there are any errors or any input is empty
        let hasError = false;
        let hasEmptyInput = false;

        validationIndexes.forEach((index) => {
            if (!userInputs[index]?.trim()) {
                hasEmptyInput = true;
            }
            if (inputErrors[index] === 'error') {
                hasError = true;
            }
        });

        return hasError || hasEmptyInput;
    };

    return (
        <section className="recovery-phrase">
            {step === 1 && (
                <div className="recovery-phrase__step">
                    <Lottie
                        animationData={writePaperLottie}
                        loop={true}
                        play
                        className="recovery-phrase__animation"
                        aria-hidden="true"
                    />
                    <h1 className="text-heading text-center">{t('writeDownRecoveryPhrase')}</h1>
                    <p className="text-body text-center my-md">{t('recoveryPhraseDescription')}</p>

                    <button
                        className="btn btn-primary recovery-phrase__button"
                        onClick={() => setStep(2)}
                        type="button"
                    >
                        {t('continue')}
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="recovery-phrase__step">
                    <Lottie
                        animationData={generateRecoverySeedLottie}
                        loop={true}
                        play
                        className="recovery-phrase__animation"
                        aria-hidden="true"
                    />
                    <h1 className="recovery-phrase__title">{t('recoveryPhrase')}</h1>
                    <p className="recovery-phrase__description">
                        {t('writeDownWords', wordCount.toString())}
                    </p>

                    <div className="recovery-phrase__select-container">
                        <select
                            id="word-count-select"
                            className="recovery-phrase__select"
                            value={wordCount}
                            onChange={(e) => setWordCount(parseInt(e.target.value))}
                        >
                            <option value={12}>{t('twelveWords')}</option>
                            <option value={24}>{t('twentyFourWords')}</option>
                        </select>
                    </div>

                    <div id="recoveryPhraseStep2-parent" className="recovery-phrase__seed-container">
                        {walletSeeds.map((word, index) => (
                            <span
                                key={index}
                                className="recovery-phrase__word"
                            >
                                <label className="recovery-phrase__word-label">
                                    {index + 1}.
                                </label>
                                <span className="recovery-phrase__word-text">
                                    {word}
                                </span>
                            </span>
                        ))}
                        <BorderBeam
                            duration={10}
                            size={400}
                            parentId="recoveryPhraseStep2-parent"
                        />
                    </div>

                    <button
                        className="btn btn-primary recovery-phrase__button"
                        onClick={() => setStep(3)}
                        type="button"
                    >
                        {t('continue')}
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="recovery-phrase__step">
                    <Lottie
                        animationData={generateRecoverySeedLottie}
                        loop={false}
                        play
                        className="recovery-phrase__animation"
                        aria-hidden="true"
                    />
                    <h1 className="recovery-phrase__title">{t('confirmRecoveryPhrase')}</h1>
                    <p className="recovery-phrase__description">{t('enterMissingWords')}</p>

                    <div
                        id="recoveryPhraseStep3-parent"
                        className="recovery-phrase__seed-container"
                        role="group"
                        aria-label={t('confirmRecoveryPhrase')}
                    >
                        {walletSeeds.map((word, index) => (
                            validationIndexes.includes(index) ? (
                                <span
                                    key={index}
                                    className={`recovery-phrase__word recovery-phrase__word--input ${inputErrors[index] === 'error'
                                        ? 'recovery-phrase__word--error'
                                        : inputErrors[index] === 'success'
                                            ? 'recovery-phrase__word--success'
                                            : ''
                                        }`}
                                >
                                    <label
                                        htmlFor={`word-input-${index}`}
                                        className="recovery-phrase__word-label"
                                    >
                                        {index + 1}.
                                    </label>
                                    <input
                                        id={`word-input-${index}`}
                                        type="text"
                                        className="recovery-phrase__word-input"
                                        value={userInputs[index] || ''}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        aria-invalid={inputErrors[index] === 'error'}
                                        autoComplete="off"
                                    />
                                </span>
                            ) : (
                                <span key={index} className="recovery-phrase__word">
                                    <label className="recovery-phrase__word-label">
                                        {index + 1}.
                                    </label>
                                    <span className="recovery-phrase__word-text">
                                        {word}
                                    </span>
                                </span>
                            )
                        ))}
                        <BorderBeam
                            duration={10}
                            size={400}
                            parentId="recoveryPhraseStep3-parent"
                        />
                    </div>

                    <button
                        className="btn btn-primary recovery-phrase__button"
                        onClick={validateInputs}
                        disabled={isConfirmButtonDisabled()}
                        type="button"
                        aria-disabled={isConfirmButtonDisabled()}
                    >
                        {t('confirm')}
                    </button>
                </div>
            )}
        </section>
    );
};

export default RecoveryPhrase;
