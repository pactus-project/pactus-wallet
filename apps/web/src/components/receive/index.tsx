import { receiveIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'

const ReceivePac: React.FC = () => {
  return (
    <button 
      className="btn btn-receive btn-sm receive-button"
      type="button"
      aria-label="Receive PAC tokens"
    >
      <span className="receive-button__icon">
        <Image 
          src={receiveIcon} 
          alt="" 
          width={20} 
          height={20}
          aria-hidden="true"
        />
      </span>
      <span className="receive-button__text">Receive</span>
    </button>
  )
}

export default ReceivePac