import { sendIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'
const SendPac = () => {

  return (
    <button className='cta-sendPac' ><Image src={sendIcon} alt='send-icon' />Send</button>
  )
}

export default SendPac