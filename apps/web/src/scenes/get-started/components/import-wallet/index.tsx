'use client';
import { importWalletLottie } from '@/assets';
import { useWallet } from '@/wallet';
import React, { useState } from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import * as bip39 from 'bip39';
import { useI18n } from '@/utils/i18n';
import BorderBeam from '@/components/border-beam';
import Lottie from '@/components/lottie-player';
import FormSelectInput from '../../../../components/common/FormSelectInput';
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
      <Lottie
        animationData={importWalletLottie}
        loop={true}
        play
        className="import-wallet__animation"
      />
      <h1 className="import-wallet__title">{t('importExistingWallet')}</h1>
      <p className="import-wallet__description">{t('importWalletDescription')}</p>

      <div className="import-wallet__controls">
        <FormSelectInput
          id="word-count-select"
          className="w-full min-w-[125px] text-[12px]"
          value={wordCount.toString()}
          onChange={e => setWordCount(parseInt(e.target.value))}
          options={[
            { label: t('twelveWords'), value: '12' },
            { label: t('twentyFourWords'), value: '24' },
          ]}
        />
      </div>

      <div id="recovery-phrase-parent" className="w-full p-4 rounded-md bg-[#101010]">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 ml-4 mr-4 mt-3 mb-3">
          {/* <fieldset className="import-wallet__seed-fieldset">
            <legend className="visually-hidden">{t('enterSeedPhrase')}</legend> */}

          {Array.from({ length: wordCount }).map((_, index) => (
            <div key={index} className="flex items-center p-2 bg-[#242424] rounded-md">
              <label className="text-sm mr-1 text-white">{index + 1}.</label>
              <input
                id={`word-${index}`}
                type="text"
                className="import-wallet__word-input"
                value={words[index]}
                data-index={index}
                onPaste={handlePaste}
                onChange={e => {
                  const newWords = [...words];
                  newWords[index] = e.target.value;
                  setWords(newWords);
                  setError(''); // Clear error when user is typing
                }}
                aria-invalid={error ? 'true' : 'false'}
                autoComplete="off"
              />
            </div>
          ))}
          {/* </fieldset> */}
        </div>
        <BorderBeam duration={4} size={300} parentId="recovery-phrase-parent" showOnHover={true} />
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
  );
};

export default ImportWallet;
