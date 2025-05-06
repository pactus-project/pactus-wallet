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
    <header className="header">
      <div className="header__content">
        <h1 className="header__title">{headerTitle}</h1>
        <button
          type="button"
          className="btn btn-icon header__logout-button"
          onClick={handleLogout}
          aria-label="Log out of wallet"
        >
          <Image src={logoutIcon} width={32} height={32} alt="" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Header;
