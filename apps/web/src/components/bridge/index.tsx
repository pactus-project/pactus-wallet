import Image from 'next/image';
import React from 'react';
import Button from '../Button';
import { bridgeIcon } from '../../assets';
import { useI18n } from '@/utils/i18n';

const BridgePac: React.FC = () => {
  const { t } = useI18n();
  const urlWrapTo = 'https://wrapto.app/';
  return (
    <>
      <Button
        variant="secondary"
        size="small"
        onClick={() => {
          window.open(urlWrapTo, '_blank');
        }}
        aria-label={t('bridge')}
        startIcon={<Image src={bridgeIcon} alt="" width={20} height={20} aria-hidden="true" />}
        className="w-[119px] h-[38px] border-[1px] border-solid border-surface-light tablet:border-none"
        fullWidth
      >
        {t('bridge')}
      </Button>
    </>
  );
};

export default BridgePac;
