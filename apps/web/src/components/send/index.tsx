import { sendIcon } from '@/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import SendModal from './SendModal';
import { useI18n } from '@/utils/i18n';
import Button from '@/components/Button';

const SendPac: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant="primary"
        size="small"
        onClick={handleOpenModal}
        aria-label={t('send')}
        startIcon={<Image src={sendIcon} alt="" width={20} height={20} aria-hidden="true" />}
        className="w-[119px] h-[38px]"
        fullWidth
      >
        {t('send')}
      </Button>

      <SendModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default SendPac;
