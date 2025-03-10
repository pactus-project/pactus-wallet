import { RefetchBalanceIcon } from '@/assets'
import Image from 'next/image'
import React from 'react'

const RefetchBalance = () => {
  return (
    <button><Image src={RefetchBalanceIcon} alt='refetch-balance-icon' /></button>
  )
}

export default RefetchBalance