'use client';
import './style.css';
import { WalletContext } from '@/wallet';
import { useContext } from 'react';

const Header: React.FC = () => {
  const { headerTitle } = useContext(WalletContext);


  return (
    <header className="w-full border-b-[1px] border-surface-medium">
      <div className="h-14 flex justify-between items-center w-full pl-7 pr-4">
        <h1 className="text-sm text-[#D2D3E0] font-semibold">{headerTitle}</h1>
      </div>
    </header>
  );
};

export default Header;
