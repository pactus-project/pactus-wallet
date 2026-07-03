// src/components/transaction/TransactionButton.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/Button';
import TransactionModal, { TransactionType } from './TransactionModal';
import { useI18n } from '@/utils/i18n';

export interface TransactionButtonProps {
  address: string;
  type: TransactionType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void; // For custom actions like external URLs
}

const TransactionButton: React.FC<TransactionButtonProps> = ({
  address,
  type,
  icon,
  label,
  variant = 'primary',
  className = 'w-[119px] h-[38px]',
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useI18n();

  const buttonLabel = label || t(type);

  const handleClick = () => {
    if (onClick) {
      // Custom action (like opening external URL for bridge)
      onClick();
    } else {
      // Open modal for transaction
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size="small"
        onClick={handleClick}
        aria-label={buttonLabel}
        startIcon={<Image src={icon} alt="" width={20} height={20} aria-hidden="true" />}
        className={className}
        fullWidth
      >
        {buttonLabel}
      </Button>

      {!onClick && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          address={address}
          type={type}
        />
      )}
    </>
  );
};

export default TransactionButton;
