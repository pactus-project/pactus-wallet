import { receiveIcon} from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'
const ReceivePac = () => {
  return (
    <button className='cta-ReceivePac' >
      <Image src={receiveIcon} alt='receive-icon' />
      Receive
      </button>
  )
}

export default ReceivePac