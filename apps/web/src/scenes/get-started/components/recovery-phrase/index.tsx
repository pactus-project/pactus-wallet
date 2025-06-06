'use client';
import { generateRecoverySeedLottie, writePaperLottie } from '@/assets';
import React, { useState, useEffect } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import * as bip39 from 'bip39';
import BorderBeam from '@/components/border-beam';
import { useWallet } from '@/wallet';
import { useI18n } from '@/utils/i18n';
import { LottieWithText } from '../../../../components/LottieWithText';
import Button from '../../../../components/Button';
import FormSelectInput from '../../../../components/common/FormSelectInput';
import { Form, useForm } from '@/components/common/Form';
import SeedWord, { SeedWordGrid } from '../../../../components/SeedWord';

const RecoveryPhrase: React.FC = () => {
  const [form] = useForm();
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
    const mnemonic = bip39.generateMnemonic(count === 12 ? 128 : 256);
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
      errors[index] = 'error'; // Incorrect input
    } else {
      errors[index] = 'success'; // Correct input
    }

    setInputErrors(errors);
  };

  // Validate user inputs before proceeding
  const validateInputs = () => {
    const errors: { [key: number]: string } = {};
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
    <section className="recovery-phrase">
      {step === 1 && (
        <div className="recovery-phrase__step">
          <LottieWithText
            animationData={writePaperLottie}
            title={t('writeDownRecoveryPhrase')}
            description={t('recoveryPhraseDescription')}
          />

          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            onClick={() => setStep(2)}
            type="button"
          >
            {t('continue')}
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="recovery-phrase__step">
          <LottieWithText
            animationData={generateRecoverySeedLottie}
            title={t('recoveryPhrase')}
            description={t('writeDownWords', wordCount.toString())}
          />
          <Form
            className="recovery-phrase__select-container"
            form={form}
            initialValues={{ wordCountSelect: '24' }}
          >
            <FormSelectInput
              id="word-count-select"
              name="wordCountSelect"
              className="w-full min-w-[125px] h-[45px] text-[12px] text-white"
              onChange={e => setWordCount(parseInt(e.target.value))}
              options={[
                { label: t('twelveWords'), value: '12' },
                { label: t('twentyFourWords'), value: '24' },
              ]}
            />
          </Form>

          <div id="recoveryPhraseStep2-parent" className="w-full p-4 rounded-md bg-[#101010]">
            <SeedWordGrid>
              {walletSeeds.map((word, index) => (
                <SeedWord key={index} index={index + 1} word={word} />
              ))}
              <BorderBeam duration={10} size={400} parentId="recoveryPhraseStep2-parent" />
            </SeedWordGrid>
          </div>
          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            onClick={() => setStep(3)}
            type="button"
          >
            {t('continue')}
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="recovery-phrase__step">
          <LottieWithText
            animationData={generateRecoverySeedLottie}
            title={t('confirmRecoveryPhrase')}
            description={t('enterMissingWords')}
          />
          <div
            id="recoveryPhraseStep3-parent"
            className="w-full p-4 rounded-md bg-[#101010]"
            role="group"
            aria-label={t('confirmRecoveryPhrase')}
          >
            <SeedWordGrid>
              {walletSeeds.map((word, index) =>
                validationIndexes.includes(index) ? (
                  <SeedWord
                    key={index}
                    index={index + 1}
                    editable={true}
                    value={userInputs[index] || ''}
                    onChange={(idx, value) => handleInputChange(idx, value)}
                    hasError={inputErrors[index] === 'error'}
                    isSuccess={inputErrors[index] === 'success'}
                  />
                ) : (
                  <SeedWord key={index} index={index + 1} word={word} />
                )
              )}
            </SeedWordGrid>
            <BorderBeam duration={10} size={400} parentId="recoveryPhraseStep3-parent" />
          </div>

          <Button
            variant="primary"
            fullWidth
            className="mt-4"
            disabled={isConfirmButtonDisabled()}
            onClick={validateInputs}
            isLoading={false}
            type="button"
          >
            {t('confirm')}
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecoveryPhrase;
