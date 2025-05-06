'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import ThreeDMotion from '../3d-motion';
import { openSourceIcon, secureIcon, simpleIcon } from '@/assets';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/utils/i18n';
import useSizeDetector from '@/utils/size-detector';
import Checkbox from '@/components/Checkbox';
import Button from '@/components/Button';
import { PATHS } from '@/constants/paths';
import Title from '@/components/common/title';
import Description from '@/components/common/description';

const Welcome = () => {
  const { push } = useRouter();
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
            className="bg-gradient-primary bg-clip-text text-transparent transition-opacity duration-fast [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 focus-visible:opacity-80 [@media(prefers-reduced-motion:reduce)]:transition-none"
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
      description: t('simpleDescription'),
    },
    {
      title: t('secure'),
      icon: secureIcon,
      description: t('secureDescription'),
    },
  ];

  const handleCheckboxToggle = () => setIsChecked(!isChecked);
  const { isMobile, isTablet } = useSizeDetector();
  return (
    <section className="flex flex-col w-full max-w-[1000px] mx-auto gap-xl">
      <div className="w-full">
        <h1 className="text-heading tablet:!text-4xl !font-normal text-text-primary leading-tight !text-3xl">
          <div>{t('welcomeTo')}</div>
          <span className="text-gradient !font-semibold [text-wrap:nowrap] text-[40px] tablet:text-[51px]">{t('pactusWallet')}</span>
        </h1>
      </div>

      <div className="flex justify-between items-center w-full gap-xl">
        <div className="flex flex-col max-w-[600px] gap-md">
          {features.map((feature, index) => (
            <div className="flex items-start gap-md" key={`feature-${index}`}>
              <Image
                src={feature.icon}
                alt=""
                className="w-[32px] h-[32px] shrink-0"
                aria-hidden="true"
                width={32}
                height={32}
              />
              <div className="flex flex-col gap-xs">
                <Title content={feature.title} />
                <Description content={feature.description} />
              </div>
            </div>
          ))}
        </div>
        {!isMobile && !isTablet ? (
          <div className="shrink-0">
            <ThreeDMotion />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col w-full gap-md mt-lg">
        <div className="flex items-center gap-sm">
          <Checkbox onChange={handleCheckboxToggle} checked={isChecked} id='terms-checkbox' checkBoxClassName="w-[16px] h-[16px] cursor-pointer [accent-color:theme('colors.primary')]" />
          <label id="terms-text" htmlFor="terms-checkbox" className="text-text-secondary text-xs font-regular leading-normal cursor-pointer select-none">
            {t('iHaveReadAndAgreed')}{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] [text-wrap:nowrap]">{t('termsAndConditions')}</span>.
          </label>
        </div>
        <div className='w-full max-w-full flex'>
          <Button onClick={() => push(PATHS.ADD_WALLET)} disabled={!isChecked} className="btn btn-primary tablet:w-auto tablet:max-w-[600px] mt-xs h-button-desktop w-full max-w-full tablet:!flex-1">
            {t('letsStart')}
          </Button>
          <div className='h-button-desktop w-[400px] hidden tablet:!block'></div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
