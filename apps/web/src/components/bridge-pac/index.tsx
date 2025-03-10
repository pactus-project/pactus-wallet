import { bridgeIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'
const BridgePac = () => {

  return (
    <button className='cta-BridgePac'><Image src={bridgeIcon} alt='send-icon' />Bridge</button>
  )
}

export default BridgePac