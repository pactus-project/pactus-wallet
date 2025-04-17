import { bridgeIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'
import './style.css'

const BridgePac: React.FC = () => {
  return (
    <button 
      className="btn btn-bridge btn-sm bridge-button"
      type="button"
      aria-label="Bridge PAC tokens"
    >
      <span className="bridge-button__icon">
        <Image 
          src={bridgeIcon} 
          alt="" 
          width={20} 
          height={20}
          aria-hidden="true"
        />
      </span>
      <span className="bridge-button__text">Bridge</span>
    </button>
  )
}

export default BridgePac