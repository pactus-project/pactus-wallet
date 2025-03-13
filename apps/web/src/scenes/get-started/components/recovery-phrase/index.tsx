import { ceedRecoveryPhrase, copyIcon, recoveryPhrase } from '@/assets'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import './style.css'
import { useRouter } from 'next/navigation'
import * as bip39 from 'bip39';

const RecoveryPhrase = () => {
    const [step, setStep] = useState(1);
    const [wordCount, setWordCount] = useState(24);
    const [walletCeeds, setWalletCeeds] = useState<string[]>([]);
    const [validationIndexes, setValidationIndexes] = useState<number[]>([]);
    const [userInputs, setUserInputs] = useState({});
    const [inputErrors, setInputErrors] = useState({});

    const navigate = useRouter().push;

    // Generate recovery phrase when the component loads or word count changes
    useEffect(() => {
        generateRecoveryPhrase(wordCount);
    }, [wordCount]);

    // Function to generate a recovery phrase using BIP39
    const generateRecoveryPhrase = async (count) => {
        const mnemonic = bip39.generateMnemonic((count === 12 ? 128 : 256));
        const words = mnemonic.split(' ');
        setWalletCeeds(words);

        // Select 4 random indexes for validation
        const indexes: number[] = [];
        const numValidationWords = count === 12 ? 4 : 8;
        while (indexes.length < numValidationWords) {
            let randomIndex = Math.floor(Math.random() * count);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        setValidationIndexes(indexes);
        setUserInputs({});
        setInputErrors({});
    };

    // Handle user input changes
    const handleInputChange = (index, value) => {
        setUserInputs({ ...userInputs, [index]: value });

        // Validate input and apply color styles
        let errors = { ...inputErrors };
        if (value.trim() !== walletCeeds[index]) {
            errors[index] = 'error';  // Incorrect input
        } else {
            errors[index] = 'success';  // Correct input
        }

        setInputErrors(errors);
    };

    // Validate user inputs before proceeding
    const validateInputs = () => {
        let errors = {};
        let allInputsValid = true;
        validationIndexes.forEach((index) => {
            if (userInputs[index]?.trim() !== walletCeeds[index]) {
                errors[index] = 'error'; // Incorrect input
                allInputsValid = false;
            }
        });

        // If errors exist, display them and prevent navigation
        if (allInputsValid) {
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
        <div className='container-RecoveryPhrase'>
            {step === 1 &&
                <div className='hint-RecoveryPhrase'>
                    <Image src={recoveryPhrase} alt='recovery-phrase' />
                    <h1>Write Down Your Recovery Phrase</h1>
                    <p>Your recovery phrase is the only way to restore access to your wallet if you lose your device.
                        We strongly recommend writing it down on paper and keeping it in a safe place.</p>

                    <button className='cta-RecoveryPhrase' onClick={() => setStep(2)}>Continue</button>
                </div>}

            {step === 2 &&
                <div className='hint-RecoveryPhrase' style={{ gap: '10px' }}>
                    <Image src={ceedRecoveryPhrase} alt='recovery-phrase' />
                    <h1>Recovery Phrase</h1>
                    <p>Write down the following {wordCount} words in the correct order and keep them in a safe place.</p>
                    <select defaultValue={24} onChange={(e) => setWordCount(parseInt(e.target.value))}>
                        <option value={12}>12 Words</option>
                        <option value={24}>24 Words</option>
                    </select>
                    <div className='ceed-RecoveryPhrase'>
                        {walletCeeds.map((word, index) => (
                            <span key={index}><label> {index + 1}.</label> {word}</span>
                        ))}
                    </div>
                    <button className='copyCeed-RecoveryPhrase' onClick={() => navigator.clipboard.writeText(walletCeeds.join(' '))}>
                        <Image src={copyIcon} alt='' /> Copy to clipboard
                    </button>
                    <button className='cta-RecoveryPhrase' onClick={() => setStep(3)}>Continue</button>
                </div>
            }

            {step === 3 &&
                <div className='hint-RecoveryPhrase' style={{ gap: '10px' }}>
                    <Image src={ceedRecoveryPhrase} alt='recovery-phrase' />
                    <h1>Confirm Recovery Phrase</h1>
                    <p>Enter the missing words in the correct order to verify your backup.</p>
                    <div className='ceed-RecoveryPhrase'>
                        {walletCeeds.map((word, index) => (
                            validationIndexes.includes(index) ? (
                                <span
                                    className={inputErrors[index] === 'error' ? 'error-ceed-RecoveryPhrase'
                                        : inputErrors[index] === 'success' ? 'success-ceed-RecoveryPhrase' : ''}
                                    style={{ padding: '0' }}
                                    key={index}>
                                    <label> {index + 1}.</label>
                                    <input
                                        key={index}
                                        type="text"
                                        value={userInputs[index] || ''}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                    />
                                </span>
                            ) : (
                                <span key={index}><label> {index + 1}.</label> {word}</span>
                            )
                        ))}
                    </div>
                    <button className='cta-RecoveryPhrase' onClick={validateInputs} disabled={isConfirmButtonDisabled()}>Confirm</button>
                </div>
            }
        </div>
    );
};

export default RecoveryPhrase;
