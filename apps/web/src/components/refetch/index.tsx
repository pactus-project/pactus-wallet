import { RefetchBalanceIcon } from '@/assets';
import Image from 'next/image';
import React from 'react';
import './style.css';

interface RefetchBalanceProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

const RefetchBalance: React.FC<RefetchBalanceProps> = ({ onRefresh, isLoading = false }) => {
  return (
    <button
      className={`w-[24px] h-[24px] refetch-balance-button ${isLoading ? 'animate-spin' : ''}`}
      onClick={onRefresh}
      disabled={isLoading}
      aria-label="Refresh balance"
    >
      <Image src={RefetchBalanceIcon} alt="refetch-balance-icon" />
    </button>
  );
};

export default RefetchBalance;
