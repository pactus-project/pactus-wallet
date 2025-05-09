import { receiveIcon } from '@/assets';
import Image from 'next/image';
import React from 'react';
import './style.css';
import Button from '../Button';
import { useI18n } from '@/utils/i18n';

const ReceivePac: React.FC = () => {
  const { t } = useI18n();
  return (
    <Button
      variant="secondary"
      size="small"
      onClick={() => {
        // TODO: Implement bridge
      }}
      aria-label={t('bridge')}
      startIcon={<Image src={receiveIcon} alt="" width={20} height={20} aria-hidden="true" />}
      className="w-[119px] h-[38px]"
      fullWidth
    >
      {t('receive')}
    </Button>
  );
};

export default ReceivePac;
