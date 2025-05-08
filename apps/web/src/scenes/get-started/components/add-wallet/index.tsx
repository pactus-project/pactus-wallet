'use client';
import { addWalletLottie, existingWalletIcon, newWalletIcon } from '@/assets';
import Image from 'next/image';
import React from 'react';
import './style.css';
import { useRouter } from 'next/navigation';
import BorderBeam from '@/components/border-beam';
import { useI18n } from '@/utils/i18n';
import Title from '@/components/common/title';
import Description from '@/components/common/description';
import { LottieWithText } from '@/components/LottieWithText';
const AddWallet = () => {
  const navigate = useRouter().push;
  const { t } = useI18n();
  return (
    <section className="flex flex-col mx-auto gap-5">
      <LottieWithText
        animationData={addWalletLottie}
        title={t('addWallet')}
        description={t('addWalletDescription')}
      />

      <div className="add-wallet__options">
        <button
          id="newWalletButton"
          className="add-wallet__option-button"
          onClick={() => navigate('/get-started?step=recovery-phrase')}
          type="button"
        >
          <Image
            src={newWalletIcon}
            alt=""
            className="add-wallet__option-icon"
            aria-hidden="true"
          />
          <div className="add-wallet__option-content">
            <Title content={t('newWallet')} />
            <Description content={t('newWalletDescription')} />
          </div>
          <BorderBeam duration={4} size={300} parentId="newWalletButton" showOnHover={true} />
        </button>

        <button
          id="ExistingWalletButton"
          className="add-wallet__option-button"
          onClick={() => navigate('/get-started?step=import-wallet')}
          type="button"
        >
          <Image
            src={existingWalletIcon}
            alt=""
            className="add-wallet__option-icon"
            aria-hidden="true"
          />
          <div className="add-wallet__option-content">
            <Title content={t('existingWallet')} />
            <Description content={t('existingWalletDescription')} />
          </div>
          <BorderBeam duration={4} size={300} parentId="ExistingWalletButton" showOnHover={true} />
        </button>
      </div>
    </section>
  );
};

export default AddWallet;
