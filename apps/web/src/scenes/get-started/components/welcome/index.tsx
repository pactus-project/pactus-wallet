'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import ThreeDMotion from '../3d-motion';
import { openSourceIcon, secureIcon, simpleIcon } from '@/assets';
import './style.css';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/utils/i18n';

const Welcome = () => {
  const navigate = useRouter().push;
  const [isChecked, setIsChecked] = useState(false);
  const { t } = useI18n();

  const data = [
    {
      title: t('openSource'),
      icon: openSourceIcon,
      description: (
        <>
          {t('openSourceDescription')}{' '}
          <a
            className="gradient-GetStarted"
            href="https://github.com/pactus-project/pactus-wallet"
            target="_blank"
          >
            here
          </a>
          .
        </>
      ),
    },
    { title: t('simple'), icon: simpleIcon, description: t('simpleDescription') },
    { title: t('secure'), icon: secureIcon, description: t('secureDescription') },
  ];

  return (
    <>
      <div className="titer-GetStarted">
        <h1>
          {t('hello')}
          <br />
          <span>{t('welcomeTo')}</span>
          <span style={{ marginLeft: '5px' }} className="gradient-GetStarted">
            {t('pactusWallet')}
          </span>
        </h1>
      </div>

      <div className="section1-GetStarted">
        <div className="slogans-GetStarted">
          {data.map((item, i) => (
            <div key={`${i}-slogan`}>
              <Image src={item.icon} alt="" />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <ThreeDMotion />
        </div>
      </div>

      <div className="letsCta-GetStarted">
        <div>
          <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          <p onClick={() => setIsChecked(!isChecked)}>
            {t('iHaveReadAndAgreed')}{' '}
            <span className="gradient-GetStarted"> {t('termsAndConditions')}</span>.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/get-started?step=add-wallet')}
          disabled={!isChecked}
        >
          {t('letsStart')}
        </button>
      </div>
    </>
  );
};

export default Welcome;
