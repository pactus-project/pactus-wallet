"use client";
import React, { Suspense } from 'react'
import './style.css'
import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import Image from 'next/image';
import TransactionsHistory from '@/components/transactions-history';
import { searchIcon, transactions } from '@/assets';
const Activity = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className='container-activity' >
        <Sidebar />
        <div className='content-activity'>
          <Header title='Activity' />
          <div className='transactionsContainer-activity'>
            <div className='headerTransaction-activity' >
              <div className='searchTransactions-activity' >
                <Image src={searchIcon} alt='search-icon' /><input placeholder='Search by tx hash or address' />
              </div>
              <div className='filterTransactions-activity'><button>1D</button><button>7D</button><button style={{ color: '#FFF' }} >All</button></div></div>
            <hr />
            <div className='transactions-activity' >
              <TransactionsHistory transactions={transactions} height={'90%'} />
            </div>

          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Activity