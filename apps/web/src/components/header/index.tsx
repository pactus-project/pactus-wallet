'use client';
import './style.css';
import Image from 'next/image';
import { logoutIcon } from '@/assets';
import { useWallet, WalletContext } from '@/wallet';
import { useContext } from 'react';

const Header: React.FC = () => {
  const { setWallet } = useWallet();
  const { headerTitle } = useContext(WalletContext);

  const handleLogout = () => {
    localStorage.clear();
    setWallet(null);
    window.location.href = '/get-started';
  };

  return (
    <header className="w-full border-b-[1px] border-surface-medium">
      <div className="h-14 flex justify-between items-center w-full pl-7 pr-4">
        <h1 className="text-sm text-[#D2D3E0] font-semibold">{headerTitle}</h1>
        <button
          type="button"
          className="btn btn-icon header__logout-button"
          onClick={handleLogout}
          aria-label="Log out of wallet"
        >
          <Image src={logoutIcon} width={20} height={20} alt="" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Header;
