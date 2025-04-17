import { generateRecoverySeedLottie, writePaperLottie } from '@/assets';
import React, { useState, useEffect } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import * as bip39 from 'bip39';
import dynamic from 'next/dynamic';
import BorderBeam from '@/components/border-beam';
import { useWallet } from '@/wallet';
import { useI18n } from '@/utils/i18n';

const LottiePlayer = dynamic(() => import('react-lottie-player'), { ssr: false });
const RecoveryPhrase = () => {
  const [step, setStep] = useState(1);
  const [wordCount, setWordCount] = useState(24);
  const [walletSeeds, setWalletSeeds] = useState<string[]>([]);
  const [validationIndexes, setValidationIndexes] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useRouter().push;
  const { setMnemonic } = useWallet();
  const { t } = useI18n();

  // Generate recovery phrase when the component loads or word count changes
  useEffect(() => {
    generateRecoveryPhrase(wordCount);
  }, [wordCount]);

  // Function to generate a recovery phrase using BIP39
  const generateRecoveryPhrase = async count => {
    const mnemonic = bip39.generateMnemonic(count === 12 ? 128 : 256);
    const words = mnemonic.split(' ');
    setWalletSeeds(words);

    // Select 4 random indexes for validation
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
  const handleInputChange = (index, value) => {
    setUserInputs({ ...userInputs, [index]: value });

    // Validate input and apply color styles
    const errors = { ...inputErrors };
    if (value.trim() !== walletSeeds[index]) {
      errors[index] = 'error'; // Incorrect input
    } else {
      errors[index] = 'success'; // Correct input
    }

    setInputErrors(errors);
  };

  // Validate user inputs before proceeding
  const validateInputs = () => {
    const errors = {};
    let allInputsValid = true;
    validationIndexes.forEach(index => {
      if (userInputs[index]?.trim() !== walletSeeds[index]) {
        errors[index] = 'error'; // Incorrect input
        allInputsValid = false;
      }
    });

    // If errors exist, display them and prevent navigation
    if (allInputsValid) {
      setMnemonic(walletSeeds.join(' '));
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

    validationIndexes.forEach(index => {
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
    <div className="container-RecoveryPhrase">
      {step === 1 && (
        <div className="hint-RecoveryPhrase">
          <LottiePlayer
            animationData={writePaperLottie}
            loop={true}
            play
            style={{ height: '300px' }}
          />
          <h1>{t('writeDownRecoveryPhrase')}</h1>
          <p>{t('recoveryPhraseDescription')}</p>

          <button className="cta-RecoveryPhrase" onClick={() => setStep(2)}>
            {t('continue')}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="hint-RecoveryPhrase" style={{ gap: '10px' }}>
          <LottiePlayer
            animationData={generateRecoverySeedLottie}
            loop={false}
            play
            style={{ height: '200px' }}
          />
          <h1>{t('recoveryPhrase')}</h1>
          <p>{t('writeDownWords', wordCount.toString())}</p>
          <select defaultValue={24} onChange={e => setWordCount(parseInt(e.target.value))}>
            <option value={12}>{t('twelveWords')}</option>
            <option value={24}>{t('twentyFourWords')}</option>
          </select>
          <div id="recoveryPhraseStep2-parent" className="seed-RecoveryPhrase">
            {walletSeeds.map((word, index) => (
              <span key={index}>
                <label> {index + 1}.</label> {word}
              </span>
            ))}
            <BorderBeam
              duration={10}
              size={400}
              colorFrom="#064560"
              colorTo="#0FEF9E"
              boxShadow={{
                color: '#0FEF9E',
                blur: 95,
                spread: -60,
              }}
              parentId="recoveryPhraseStep2-parent"
            />
          </div>
          <button className="cta-RecoveryPhrase" onClick={() => setStep(3)}>
            {t('continue')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="hint-RecoveryPhrase" style={{ gap: '10px' }}>
          <LottiePlayer
            animationData={generateRecoverySeedLottie}
            loop={false}
            play
            style={{ height: '200px' }}
          />
          <h1>{t('confirmRecoveryPhrase')}</h1>
          <p>{t('enterMissingWords')}</p>
          <div id="recoveryPhraseStep3-parent" className="seed-RecoveryPhrase">
            {walletSeeds.map((word, index) =>
              validationIndexes.includes(index) ? (
                <span
                  className={
                    inputErrors[index] === 'error'
                      ? 'error-seed-RecoveryPhrase'
                      : inputErrors[index] === 'success'
                        ? 'success-seed-RecoveryPhrase'
                        : ''
                  }
                  style={{ padding: '0' }}
                  key={index}
                >
                  <label> {index + 1}.</label>
                  <input
                    key={index}
                    type="text"
                    value={userInputs[index] || ''}
                    onChange={e => handleInputChange(index, e.target.value)}
                  />
                </span>
              ) : (
                <span key={index}>
                  <label> {index + 1}.</label> {word}
                </span>
              )
            )}
            <BorderBeam
              duration={10}
              size={400}
              colorFrom="#064560"
              colorTo="#0FEF9E"
              boxShadow={{
                color: '#0FEF9E',
                blur: 95,
                spread: -60,
              }}
              parentId="recoveryPhraseStep3-parent"
            />
          </div>
          <button
            className="cta-RecoveryPhrase"
            onClick={validateInputs}
            disabled={isConfirmButtonDisabled()}
          >
            {t('confirm')}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecoveryPhrase;
