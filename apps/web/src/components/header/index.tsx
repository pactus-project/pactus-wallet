import React from 'react'
import './style.css'
import Image from 'next/image';
import { exportWalletIcon, logoutIcon } from '@/assets';
const Header = ({ title }: { title: string; }) => {
  return (
    <header className='headerContainer' >
      <h1>{title}</h1>
      <button className='exportWallet-header' >
        <Image src={exportWalletIcon} alt='export-wallet-icon' />Export Wallet
      </button>
      <button><Image src={logoutIcon} width={32} height={32} alt='logout-icon' /></button>
    </header>
  )
}

export default Header