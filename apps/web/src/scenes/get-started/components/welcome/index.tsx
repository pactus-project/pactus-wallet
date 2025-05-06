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

  const { isMobile, isTablet } = useSizeDetector();
  return (
    <section className="flex flex-col w-full max-w-[1000px] mx-auto gap-xl">
      <div className="w-full">
        <h1 className="text-heading tablet:!text-4xl !font-normal text-text-primary leading-tight !text-3xl">
          <div>{t('welcomeTo')}</div>
          <span className="text-gradient !font-semibold [text-wrap:nowrap] text-[40px] tablet:text-[51px]">
            {t('pactusWallet')}
          </span>
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

      <Checkbox
        id="terms-checkbox"
        label={t('iHaveReadAndAgreed')}
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        checkBoxClassName="w-[16px] h-[16px] cursor-pointer [accent-color:theme('colors.primary')]"
        labelClassName="text-text-secondary text-xs font-regular leading-normal cursor-pointer select-none"
        description={
          <span className="bg-gradient-primary bg-clip-text text-transparent font-medium ml-1 cursor-pointer whitespace-nowrap">
            {t('termsAndConditions')}
            {'.'}
          </span>
        }
        size="small"
      />
      <div className="w-full max-w-full flex">
        <Button
          onClick={() => push(PATHS.ADD_WALLET)}
          disabled={!isChecked}
          className="btn btn-primary mt-xs h-button-desktop w-full max-w-full tablet:!min-w-[300px] tablet:!flex-grow-0"
        >
          {t('letsStart')}
        </Button>
        <div className="h-button-desktop w-[400px] hidden tablet:!block"></div>
      </div>
    </section>
  );
};

export default Welcome;
