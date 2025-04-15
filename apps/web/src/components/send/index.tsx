import { sendIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'

const SendPac: React.FC = () => {
  return (
    <button 
      className="btn btn-send btn-sm send-button"
      type="button"
      aria-label="Send PAC tokens"
    >
      <span className="send-button__icon">
        <Image 
          src={sendIcon} 
          alt="" 
          width={20} 
          height={20}
          aria-hidden="true"
        />
      </span>
      <span className="send-button__text">Send</span>
    </button>
  )
}

export default SendPac