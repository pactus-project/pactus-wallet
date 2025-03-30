import React from 'react'
import './style.css'
import Image from 'next/image';
import { logoutIcon } from '@/assets';
const Header = ({ title }: { title: string; }) => {
  return (
    <header className='headerContainer' >
      <h1>{title}</h1>
      <button><Image src={logoutIcon} width={32} height={32} alt='logout-icon' /></button>
    </header>
  )
}

export default Header