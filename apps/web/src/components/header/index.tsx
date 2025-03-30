import React from 'react'
import './style.css'
import Image from 'next/image';
import { logoutIcon } from '@/assets';
import { useWallet } from '@/wallet';

const Header = ({ title }: { title: string; }) => {
  const { setWallet } = useWallet();

  const handleLogout = () => {
    localStorage.removeItem('walletStatus');
    localStorage.removeItem('pactus_wallet_data');
    setWallet(null);
    window.location.href = '/get-started';
  };

  return (
    <header className='headerContainer' >
      <h1>{title}</h1>
      <button onClick={handleLogout}><Image src={logoutIcon} width={32} height={32} alt='logout-icon' /></button>
    </header>
  )
}

export default Header