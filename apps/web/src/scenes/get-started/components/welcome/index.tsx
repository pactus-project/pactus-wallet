'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import ThreeDMotion from '../3d-motion';
import { openSourceIcon, secureIcon, simpleIcon } from '@/assets';
import './style.css';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/utils/i18n';
import useSizeDetector from '@/utils/size-detector';

const Welcome = () => {
  const navigate = useRouter().push;
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useI18n();

  const features = [
    {
      title: t('openSource'),
      icon: openSourceIcon,
      description: (
        <>
          {t('openSourceDescription')}{' '}
          <a
            className="welcome__link"
            href="https://github.com/pactus-project/pactus-wallet"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('openSource')} GitHub repository`}
          >
            {t('here')}
          </a>
          .
        </>
      ),
    },
    {
      title: t('simple'),
      icon: simpleIcon,
      description: t('simpleDescription')
    },
    {
      title: t('secure'),
      icon: secureIcon,
      description: t('secureDescription')
    },
  ];

  const handleCheckboxToggle = () => setIsChecked(!isChecked);
  const { isMobile, isTablet } = useSizeDetector();
  return (
    <section className="welcome">
      <div className="welcome__header">
        <h1 className="text-heading">
          {t('hello')}
          <br />
          <span className="text-xl text-secondary font-medium">{t('welcomeTo')}</span>{' '}
          <span className="text-gradient font-semibold">{t('pactusWallet')}</span>
        </h1>
      </div>

      <div className="welcome__content">
        <div className="welcome__features">
          {features.map((feature, index) => (
            <div className="welcome__feature" key={`feature-${index}`}>
              <Image
                src={feature.icon}
                alt=""
                className="welcome__feature-icon"
                aria-hidden="true"
                width={32}
                height={32}
              />
              <div className="welcome__feature-content">
                <h3 className="welcome__feature-title">{feature.title}</h3>
                <p className="welcome__feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        {!isMobile && !isTablet ? <div className="welcome__visualization">
          <ThreeDMotion />
        </div> : null}
      </div>

      <div className="welcome__footer">
        <div className="welcome__terms">
          <input
            type="checkbox"
            id="terms-checkbox"
            className="welcome__checkbox"
            checked={isChecked}
            onChange={handleCheckboxToggle}
            aria-labelledby="terms-text"
          />
          <label
            id="terms-text"
            htmlFor="terms-checkbox"
            className="welcome__terms-text"
          >
            {t('iHaveReadAndAgreed')}{' '}
            <span className="welcome__terms-highlight">{t('termsAndConditions')}</span>.
          </label>
        </div>
        <button
          className="btn btn-primary welcome__cta-button"
          onClick={() => navigate('/get-started?step=add-wallet')}
          disabled={!isChecked}
          aria-disabled={!isChecked}
        >
          {t('letsStart')}
        </button>
      </div>
    </section>
  );
};

export default Welcome;
